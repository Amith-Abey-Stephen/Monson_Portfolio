/**
 * Cloudflare Pages Function: /api/upload
 * Handles direct image uploads and deletions in Cloudflare R2 bucket
 */

export async function onRequestPost(context) {
  try {
    const authHeader = context.request.headers.get('Authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()
    const expectedPass = context.env.ADMIN_PASSWORD

    if (expectedPass && token !== expectedPass) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const formData = await context.request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'No valid file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`

    const r2 = context.env.PORTFOLIO_R2
    if (r2) {
      await r2.put(fileName, file.stream(), {
        httpMetadata: {
          contentType: file.type || 'image/jpeg'
        }
      })

      const publicBase = context.env.R2_PUBLIC_URL || ''
      const url = publicBase ? `${publicBase.replace(/\/$/, '')}/${fileName}` : `/api/media/${fileName}`

      return new Response(JSON.stringify({ success: true, url, fileName }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Fallback: If R2 is not bound in local testing
    return new Response(
      JSON.stringify({
        error: 'R2 bucket is not bound. Ensure PORTFOLIO_R2 is configured in Cloudflare Pages.'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

/**
 * Handles permanent deletion of expired (10-day-old) replaced images
 */
export async function onRequestDelete(context) {
  try {
    const authHeader = context.request.headers.get('Authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()
    const expectedPass = context.env.ADMIN_PASSWORD

    if (expectedPass && token !== expectedPass) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { fileName, url } = await context.request.json()
    const targetFile = fileName || (url ? url.split('/').slice(-2).join('/') : '')

    const r2 = context.env.PORTFOLIO_R2
    if (r2 && targetFile) {
      await r2.delete(targetFile)
      return new Response(JSON.stringify({ success: true, deleted: targetFile }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true, message: 'Local/no-op deletion' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
