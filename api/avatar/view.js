import { get } from '@vercel/blob';
import { Readable } from 'node:stream';

/**
 * Endpoint View / Stream Private Blob dari Vercel Blob
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

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.searchParams.get('pathname');

  if (!pathname) {
    return res.status(400).json({ error: 'Missing pathname query parameter' });
  }

  try {
    const storeId = process.env.db_STORE_ID || process.env.BLOB_STORE_ID;
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.db_READ_WRITE_TOKEN;

    const options = { access: 'private' };
    if (storeId) options.storeId = storeId;
    if (token) options.token = token;

    const result = await get(pathname, options);
    if (!result || result.statusCode !== 200) {
      return res.status(404).send('Blob not found');
    }

    res.setHeader('Content-Type', result.blob?.contentType || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (result.stream) {
      if (typeof result.stream.pipe === 'function') {
        return result.stream.pipe(res);
      } else {
        return Readable.fromWeb(result.stream).pipe(res);
      }
    }

    return res.status(200).send(await result.blob.text());
  } catch (err) {
    console.error('[Vercel Blob View Error]:', err);
    return res.status(500).json({ error: err.message });
  }
}
