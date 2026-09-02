import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const SRC = 'assets/images'
const QUALITY = { jpeg: 78, webp: 78, avif: 55 }

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) await walk(p, files)
    else if (/\.(jpe?g|png)$/i.test(e.name)) files.push(p)
  }
  return files
}

async function run() {
  const files = await walk(SRC)
  console.log(`Optimizing ${files.length} images...`)
  for (const f of files) {
    const ext = extname(f).toLowerCase()
    const base = f.replace(/\.(jpe?g|png)$/i, '')
    try {
      const buf = await sharp(f).jpeg({ quality: QUALITY.jpeg, progressive: true, mozjpeg: true }).toBuffer()
      // overwrite original with optimized jpeg
      await sharp(buf).toFile(f + '.tmp')
      const orig = await stat(f)
      const next = await stat(f + '.tmp')
      if (next.size < orig.size) {
        await import('node:fs/promises').then(m => m.rename(f + '.tmp', f))
        console.log(`✓ ${f} ${orig.size}→${next.size} (${Math.round((1-next.size/orig.size)*100)}%)`)
      } else {
        await import('node:fs/promises').then(m => m.unlink(f + '.tmp'))
        console.log(`· ${f} already optimal`)
      }
      // generate webp + avif siblings
      await sharp(f).webp({ quality: QUALITY.webp }).toFile(base + '.webp')
      await sharp(f).avif({ quality: QUALITY.avif }).toFile(base + '.avif')
      console.log(`  + ${base}.webp / .avif`)
    } catch (e) {
      console.warn(`✗ ${f}: ${e.message}`)
    }
  }
}
run()
