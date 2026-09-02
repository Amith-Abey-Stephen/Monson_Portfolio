/**
 * Cloudflare Pages Function: /api/content
 * Handles reading and updating portfolio JSON content via Cloudflare KV
 */

export async function onRequestGet(context) {
  try {
    const kv = context.env.PORTFOLIO_KV
    if (!kv) {
      return new Response(JSON.stringify({ message: 'KV not bound' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const data = await kv.get('portfolio_content', { type: 'json' })
    return new Response(JSON.stringify(data || {}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function onRequestPost(context) {
  try {
    const authHeader = context.request.headers.get('Authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()
    const expectedPass = context.env.ADMIN_PASSWORD

    if (token !== expectedPass) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const body = await context.request.json()
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const kv = context.env.PORTFOLIO_KV
    if (kv) {
      await kv.put('portfolio_content', JSON.stringify(body))
    }

    return new Response(JSON.stringify({ success: true, timestamp: new Date().toISOString() }), {
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
