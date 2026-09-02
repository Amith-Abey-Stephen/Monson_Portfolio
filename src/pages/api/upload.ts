import type { APIRoute } from 'astro';

export const prerender = false;

function getEnv(key: string): string {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env as any)[key]) ||
    (typeof process !== 'undefined' && process.env && process.env[key]) ||
    ''
  );
}

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const expectedPass = getEnv('ADMIN_PASSWORD');

  if (expectedPass && token !== expectedPass) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const accountId = getEnv('CLOUDFLARE_ACCOUNT_ID');
  const r2Bucket = getEnv('CLOUDFLARE_R2_BUCKET');
  const apiToken = getEnv('CLOUDFLARE_API_TOKEN');
  const r2PublicUrl = getEnv('R2_PUBLIC_URL');

  if (!accountId || !r2Bucket || !apiToken) {
    return new Response(
      JSON.stringify({
        error: 'Cloudflare R2 is not configured in environment variables. Image will be cached locally in browser.'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'No valid file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const r2Url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${r2Bucket}/objects/${fileName}`;

    const cfRes = await fetch(r2Url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': file.type || 'image/jpeg'
      },
      body: file.stream() as any,
      // @ts-ignore
      duplex: 'half'
    });

    if (!cfRes.ok) {
      const errText = await cfRes.text();
      return new Response(JSON.stringify({ error: `Cloudflare R2 upload error: ${errText}` }), {
        status: cfRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const publicBase = r2PublicUrl || '';
    const url = publicBase ? `${publicBase.replace(/\/$/, '')}/${fileName}` : `/api/media/${fileName}`;

    return new Response(JSON.stringify({ success: true, url, fileName }), {
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

export const DELETE: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const expectedPass = getEnv('ADMIN_PASSWORD');

  if (expectedPass && token !== expectedPass) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const { fileName, url } = body;
  const targetFile = fileName || (url ? url.split('/').slice(-2).join('/') : '');

  const accountId = getEnv('CLOUDFLARE_ACCOUNT_ID');
  const r2Bucket = getEnv('CLOUDFLARE_R2_BUCKET');
  const apiToken = getEnv('CLOUDFLARE_API_TOKEN');

  if (!accountId || !r2Bucket || !apiToken || !targetFile) {
    return new Response(JSON.stringify({ success: true, message: 'Local/no-op delete' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const r2Url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${r2Bucket}/objects/${targetFile}`;
    await fetch(r2Url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });

    return new Response(JSON.stringify({ success: true, deleted: targetFile }), {
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
