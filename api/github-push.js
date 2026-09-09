/**
 * BAZNAS BADMINTON CLUB (BBC)
 * api/github-push.js — Serverless Proxy untuk Push File ke GitHub
 *
 * Token GitHub PAT disimpan sebagai Vercel Environment Variable (GITHUB_TOKEN).
 * Browser/CMS TIDAK pernah menyentuh token — semua dilakukan server-side.
 *
 * Environment Variables yang diperlukan (set di Vercel Dashboard):
 *   - GITHUB_TOKEN : GitHub Personal Access Token (scope: contents:write)
 *
 * Endpoint:
 *   POST /api/github-push
 *   Body: { path: string, content: string (base64), commitMessage: string }
 *   Response: { success: boolean, url?: string, sha?: string, error?: string }
 *
 *   GET /api/github-push?action=status
 *   Response: { configured: boolean, owner: string, repo: string, branch: string }
 */

const REPO_OWNER  = 'abuhuud';
const REPO_NAME   = 'bbc-website';
const REPO_BRANCH = 'main';
const GITHUB_API  = 'https://api.github.com';

const VALID_PATHS = [
    'data/players.json',
    'data/events.json',
    'data/gallery.json',
    'data/articles.json',
    'data/officials.json',
    'data/hero.json'
];

export default async function handler(req, res) {
    // CORS — izinkan pemanggilan dari browser CMS (domain Vercel sendiri)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // =====================================================
    // GET ?action=status — Cek apakah token sudah dikonfigurasi
    // =====================================================
    if (req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const action = url.searchParams.get('action');

        if (action === 'status') {
            const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
            return res.status(200).json({
                configured: !!token,
                owner:      REPO_OWNER,
                repo:       REPO_NAME,
                branch:     REPO_BRANCH,
                message:    token
                    ? `GitHub terhubung ke ${REPO_OWNER}/${REPO_NAME} [${REPO_BRANCH}]`
                    : 'GITHUB_TOKEN belum dikonfigurasi di Vercel Environment Variables.'
            });
        }

        return res.status(400).json({ success: false, error: 'Missing ?action=status query param' });
    }

    // =====================================================
    // POST — Push file ke GitHub
    // =====================================================
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Baca token dari server-side environment variable (AMAN — tidak pernah ke browser)
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
    if (!token) {
        return res.status(503).json({
            success: false,
            error:   'GITHUB_TOKEN belum dikonfigurasi. Tambahkan di Vercel Dashboard → Project Settings → Environment Variables.'
        });
    }

    // Parse body
    let body = req.body;
    if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const raw = Buffer.concat(chunks).toString('utf8');
        if (!raw) return res.status(400).json({ success: false, error: 'Empty request body' });
        try {
            body = JSON.parse(raw);
        } catch {
            return res.status(400).json({ success: false, error: 'Malformed JSON body' });
        }
    }

    const { path: filePath, content, commitMessage } = body || {};

    // Validasi path — hanya izinkan path yang sudah diketahui (whitelist)
    if (!filePath || !VALID_PATHS.includes(filePath)) {
        return res.status(400).json({
            success: false,
            error:   `Path tidak diizinkan. Harus salah satu dari: ${VALID_PATHS.join(', ')}`
        });
    }

    if (!content) {
        return res.status(400).json({ success: false, error: 'Field "content" (base64) wajib diisi.' });
    }

    const ghHeaders = {
        'Authorization': `Bearer ${token}`,
        'Accept':        'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type':  'application/json',
        'User-Agent':    'BBC-CMS-Proxy/1.0'
    };

    try {
        // 1. Ambil SHA file yang ada (diperlukan untuk update, bukan create)
        let currentSha = null;
        const getResp = await fetch(
            `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${REPO_BRANCH}`,
            { headers: ghHeaders }
        );

        if (getResp.ok) {
            const meta = await getResp.json();
            currentSha = meta.sha || null;
        } else if (getResp.status !== 404) {
            const errData = await getResp.json().catch(() => ({}));
            throw new Error(errData.message || `GitHub GET error: HTTP ${getResp.status}`);
        }

        // 2. Push file (create atau update)
        const putBody = {
            message: commitMessage || `chore: update ${filePath} via BBC CMS`,
            content: content,      // base64 — sudah di-encode client-side
            branch:  REPO_BRANCH
        };
        if (currentSha) putBody.sha = currentSha;

        const putResp = await fetch(
            `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
            {
                method:  'PUT',
                headers: ghHeaders,
                body:    JSON.stringify(putBody)
            }
        );

        if (!putResp.ok) {
            const errData = await putResp.json().catch(() => ({}));
            throw new Error(errData.message || `GitHub PUT error: HTTP ${putResp.status}`);
        }

        const result = await putResp.json();
        const htmlUrl = result.content ? result.content.html_url : null;

        return res.status(200).json({
            success:       true,
            url:           htmlUrl,
            sha:           result.content ? result.content.sha : null,
            commitSha:     result.commit ? result.commit.sha : null,
            filePath,
            pushedAt:      new Date().toISOString()
        });

    } catch (err) {
        console.error(`[BBC github-push] Error pushing ${filePath}:`, err.message);
        return res.status(500).json({
            success: false,
            error:   err.message || 'Gagal push ke GitHub'
        });
    }
}
