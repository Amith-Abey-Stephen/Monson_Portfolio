/**
 * Vercel Serverless Function: /api/content
 * Connects Vercel Frontend to Cloudflare KV storage via Cloudflare REST API
 */

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_KV_ID, CLOUDFLARE_API_TOKEN, ADMIN_PASSWORD } = process.env

  // 1. GET: Fetch content from Cloudflare KV
  if (req.method === 'GET') {
    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_KV_ID || !CLOUDFLARE_API_TOKEN) {
      // If Cloudflare env vars are not set yet, return empty object (client falls back to default)
      return res.status(200).json({})
    }

    try {
      const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${CLOUDFLARE_KV_ID}/values/portfolio_content`
      const cfRes = await fetch(cfUrl, {
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`
        }
      })

      if (cfRes.status === 404) {
        return res.status(200).json({})
      }

      if (!cfRes.ok) {
        const errText = await cfRes.text()
        return res.status(cfRes.status).json({ error: `Cloudflare KV error: ${errText}` })
      }

      const data = await cfRes.json()
      return res.status(200).json(data)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  // 2. POST: Save updated content to Cloudflare KV
  if (req.method === 'POST') {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()
    const expectedPass = ADMIN_PASSWORD

    if (token !== expectedPass) {
      return res.status(401).json({ error: 'Unauthorized: Invalid password' })
    }

    const body = req.body
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid JSON payload' })
    }

    // Check if this was an auth check only
    if (body.__auth_check__) {
      return res.status(200).json({ success: true, authorized: true })
    }

    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_KV_ID || !CLOUDFLARE_API_TOKEN) {
      return res.status(200).json({
        success: true,
        cachedLocally: true,
        remoteWarning: 'Cloudflare credentials not configured in Vercel environment variables. Saved locally in browser.'
      })
    }

    try {
      const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${CLOUDFLARE_KV_ID}/values/portfolio_content`
      const cfRes = await fetch(cfUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (!cfRes.ok) {
        const errText = await cfRes.text()
        return res.status(cfRes.status).json({ error: `Cloudflare KV write error: ${errText}` })
      }

      return res.status(200).json({ success: true, timestamp: new Date().toISOString() })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
