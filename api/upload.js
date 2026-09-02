/**
 * Vercel Serverless Function: /api/upload
 * Handles image upload and 10-day retention cleanup on Cloudflare R2 via REST API
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  const expectedPass = process.env.ADMIN_PASSWORD

  if (expectedPass && token !== expectedPass) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_BUCKET, CLOUDFLARE_API_TOKEN, R2_PUBLIC_URL } = process.env

  // 1. POST: Upload image
  if (req.method === 'POST') {
    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_R2_BUCKET || !CLOUDFLARE_API_TOKEN) {
      return res.status(503).json({
        error: 'Cloudflare R2 is not configured in Vercel environment variables. Image will be cached locally in browser.'
      })
    }

    try {
      const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`
      const r2Url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/r2/buckets/${CLOUDFLARE_R2_BUCKET}/objects/${fileName}`

      const cfRes = await fetch(r2Url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': req.headers['content-type'] || 'image/jpeg'
        },
        body: req.body
      })

      if (!cfRes.ok) {
        const errText = await cfRes.text()
        return res.status(cfRes.status).json({ error: `Cloudflare R2 upload error: ${errText}` })
      }

      const publicBase = R2_PUBLIC_URL || ''
      const url = publicBase ? `${publicBase.replace(/\/$/, '')}/${fileName}` : `/api/media/${fileName}`

      return res.status(200).json({ success: true, url, fileName })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // 2. DELETE: Clean up expired image (older than 10 days)
  if (req.method === 'DELETE') {
    const { fileName, url } = req.body || {}
    const targetFile = fileName || (url ? url.split('/').slice(-2).join('/') : '')

    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_R2_BUCKET || !CLOUDFLARE_API_TOKEN || !targetFile) {
      return res.status(200).json({ success: true, message: 'Local/no-op delete' })
    }

    try {
      const r2Url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/r2/buckets/${CLOUDFLARE_R2_BUCKET}/objects/${targetFile}`
      const cfRes = await fetch(r2Url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`
        }
      })

      return res.status(200).json({ success: true, deleted: targetFile })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
