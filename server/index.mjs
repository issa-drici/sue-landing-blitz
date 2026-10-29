// Serveur du site Sue : sert le build Vite (dist/) et rend l'aperçu des liens d'invitation dynamique.
// WhatsApp, iMessage ou Messenger ne lisent que le HTML de départ : pour /join/:token, on y écrit
// le sport, le jour, l'heure et les joueurs de la session, et on pointe og:image vers une image
// générée pour cette session (/og/join/:token.jpg).
//
// Lancement : node server/index.mjs (PORT=3000 par défaut, après `npm run build`)

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { renderInviteImage } from "./ogImage.mjs";
import { describeSession } from "./describe.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PORT = Number(process.env.PORT || 3000);
const API_BASE = (process.env.API_BASE_URL || "https://api.sue.alliance-tech.fr/api").replace(/\/$/, "");
const SITE_URL = (process.env.SITE_URL || "https://sue-app.fr").replace(/\/$/, "");

const MIME = {
    ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
    ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
    ".svg": "image/svg+xml", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8", ".woff2": "font/woff2",
    ".woff": "font/woff", ".mp4": "video/mp4", ".webmanifest": "application/manifest+json",
};

const indexHtml = readFileSync(join(DIST, "index.html"), "utf8");

// --- Session publique (même endpoint que la page d'invitation), gardée une minute ---
const previewCache = new Map();
const PREVIEW_TTL_MS = 60_000;

async function fetchPreview(token) {
    const cached = previewCache.get(token);
    if (cached && Date.now() - cached.at < PREVIEW_TTL_MS) return cached.data;
    let data = null;
    try {
        const response = await fetch(`${API_BASE}/join/${encodeURIComponent(token)}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(2500),
        });
        if (response.ok) data = (await response.json()).data ?? null;
    } catch {
        // API lente ou indisponible : aperçu générique
    }
    previewCache.set(token, { at: Date.now(), data });
    if (previewCache.size > 2000) previewCache.delete(previewCache.keys().next().value);
    return data;
}

// --- Image d'aperçu, gardée cinq minutes par session ---
const imageCache = new Map();
const IMAGE_TTL_MS = 5 * 60_000;

async function inviteImage(token) {
    const cached = imageCache.get(token);
    if (cached && Date.now() - cached.at < IMAGE_TTL_MS) return cached.image;
    const preview = await fetchPreview(token);
    const image = await renderInviteImage(preview ? describeSession(preview) : null);
    imageCache.set(token, { at: Date.now(), image });
    if (imageCache.size > 500) imageCache.delete(imageCache.keys().next().value);
    return image;
}

// --- Balises de l'aperçu ---
const escapeHtml = (value) =>
    String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function withMeta(html, { title, description, image, url }) {
    const set = (attr, name, value) => {
        const pattern = new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`);
        html = pattern.test(html)
            ? html.replace(pattern, `$1${escapeHtml(value)}$2`)
            : html.replace("</head>", `    <meta ${attr}="${name}" content="${escapeHtml(value)}" />\n  </head>`);
    };
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
    set("name", "description", description);
    set("property", "og:title", title);
    set("property", "og:description", description);
    set("property", "og:image", image);
    set("property", "og:url", url);
    set("name", "twitter:title", title);
    set("name", "twitter:description", description);
    set("name", "twitter:image", image);
    return html;
}

async function joinPage(token) {
    const preview = await fetchPreview(token);
    const session = preview ? describeSession(preview) : null;
    // L'URL de l'image change avec le contenu : WhatsApp regarde à nouveau quand la session se remplit
    const version = session ? encodeURIComponent(session.version) : "0";
    return withMeta(indexHtml, {
        title: session ? session.title : "Tu es invité à une session sur Sue",
        description: session ? session.description : "Ouvre le lien pour voir la session et répondre en un tap.",
        image: `${SITE_URL}/og/join/${encodeURIComponent(token)}.jpg?v=${version}`,
        url: `${SITE_URL}/join/${encodeURIComponent(token)}`,
    });
}

// --- Fichiers statiques ---
async function serveStatic(pathname, res) {
    const filePath = normalize(join(DIST, decodeURIComponent(pathname)));
    if (!filePath.startsWith(DIST)) return false;
    try {
        const info = await stat(filePath);
        if (!info.isFile()) return false;
        const isAasa = pathname === "/.well-known/apple-app-site-association" || pathname === "/apple-app-site-association";
        const type = isAasa ? "application/json" : MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
        // Les fichiers de build ont un nom unique : cache long. Le reste : revalidé.
        const cache = pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "public, max-age=3600";
        res.writeHead(200, { "Content-Type": type, "Cache-Control": cache });
        res.end(await readFile(filePath));
        return true;
    } catch {
        return false;
    }
}

const server = createServer(async (req, res) => {
    try {
        const { pathname } = new URL(req.url, "http://localhost");

        const image = pathname.match(/^\/og\/join\/([A-Za-z0-9_-]+)\.jpg$/);
        if (image) {
            const jpg = await inviteImage(image[1]);
            res.writeHead(200, { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=300" });
            return res.end(jpg);
        }

        const join = pathname.match(/^\/join\/([A-Za-z0-9_-]+)\/?$/);
        if (join) {
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
            return res.end(await joinPage(join[1]));
        }

        if (pathname !== "/" && (await serveStatic(pathname, res))) return;

        // Application à une page : toutes les autres routes renvoient index.html
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
        res.end(indexHtml);
    } catch (error) {
        console.error(error);
        if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Erreur serveur");
    }
});

server.listen(PORT, () => console.log(`Sue web sur http://localhost:${PORT} (API ${API_BASE})`));
