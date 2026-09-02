import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const kvId = process.env.CLOUDFLARE_KV_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !kvId || !apiToken) {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  }

  try {
    const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvId}/values/portfolio_content_live`;
    const cfRes = await fetch(cfUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });

    if (cfRes.status === 404) {
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!cfRes.ok) {
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await cfRes.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (expectedPass && token !== expectedPass) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  if (body.__auth_check__) {
    return new Response(JSON.stringify({ valid: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const kvId = process.env.CLOUDFLARE_KV_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !kvId || !apiToken) {
    return new Response(
      JSON.stringify({
        success: true,
        cachedLocally: true,
        message: 'Cloudflare KV environment variables not configured. Content cached in local browser storage.'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvId}/values/portfolio_content_live`;
    const cfRes = await fetch(cfUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!cfRes.ok) {
      const errText = await cfRes.text();
      return new Response(JSON.stringify({ error: `Cloudflare KV error: ${errText}` }), {
        status: cfRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Updated Cloudflare KV successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
