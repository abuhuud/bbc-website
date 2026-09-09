import { list } from '@vercel/blob';

/**
 * Endpoint View / Redirect untuk Public Blob
 * Public blob dapat diakses langsung via url: https://...public.blob.vercel-storage.com
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const directUrl = reqUrl.searchParams.get('url');
  if (directUrl) {
    return res.redirect(307, directUrl);
  }

  const pathname = reqUrl.searchParams.get('pathname');
  if (!pathname) {
    return res.status(400).json({ error: 'Missing pathname or url query parameter' });
  }

  try {
    const storeId = process.env.db_STORE_ID || process.env.BLOB_STORE_ID;
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.db_READ_WRITE_TOKEN;

    const listResult = await list({
      prefix: pathname,
      limit: 1,
      token: token || undefined,
      storeId: storeId || undefined
    });

    if (listResult.blobs && listResult.blobs.length > 0) {
      return res.redirect(307, listResult.blobs[0].url);
    }

    return res.status(404).send('Blob not found');
  } catch (err) {
    console.error('[Vercel Blob View Error]:', err);
    return res.status(500).json({ error: err.message });
  }
}
