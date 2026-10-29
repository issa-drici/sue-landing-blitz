// Image d'aperçu d'une invitation (1200x630) : le terrain du sport, son objet 3D, qui invite,
// quand, où, les joueurs déjà là et ce qu'il manque. Dessinée avec satori, rendue en PNG par resvg.

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import jpeg from "jpeg-js";

const ASSETS = join(dirname(fileURLToPath(import.meta.url)), "assets");

const VOLT = "#D4FC79";
const INK = "#0A0A0A";
const TINTS = ["#FFF1DC", "#EFE3F7", "#E3F4E8", "#FDE3E6", "#E1EEFB"];

const fonts = [500, 700, 900].map((weight) => ({
    name: "Outfit",
    weight,
    style: "normal",
    data: readFileSync(join(ASSETS, "fonts", `outfit-${weight}.woff`)),
}));

const dataUriCache = new Map();
function dataUri(relativePath, mime) {
    if (!dataUriCache.has(relativePath)) {
        const file = join(ASSETS, relativePath);
        dataUriCache.set(relativePath, existsSync(file) ? `data:${mime};base64,${readFileSync(file).toString("base64")}` : null);
    }
    return dataUriCache.get(relativePath);
}

/** Photo de profil en data URI (JPEG ou PNG), null si absente, lente ou dans un autre format */
const photoCache = new Map();
async function photoDataUri(url) {
    if (!url || !/^https?:\/\//.test(url)) return null;
    if (photoCache.has(url)) return photoCache.get(url);
    let uri = null;
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
        const type = (response.headers.get("content-type") || "").split(";")[0];
        if (response.ok && (type === "image/jpeg" || type === "image/png")) {
            uri = `data:${type};base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}`;
        }
    } catch {
        // pas de photo : on garde les initiales
    }
    photoCache.set(url, uri);
    if (photoCache.size > 300) photoCache.delete(photoCache.keys().next().value);
    return uri;
}

/** Élément satori : h("div", { ...style }, enfants) */
const h = (type, style, ...children) => {
    const kids = children.flat().filter((c) => c !== null && c !== false && c !== undefined);
    return { type, props: { style: { display: "flex", ...style }, children: kids.length === 1 ? kids[0] : kids } };
};
const img = (src, style) => ({ type: "img", props: { src, style } });

function avatarsRow(players, size = 78) {
    const shown = players.slice(0, 4);
    const extra = players.length - shown.length;
    const bubble = (content, background, i) =>
        h("div", {
            width: size, height: size, borderRadius: size / 2, background, border: "5px solid #FFFFFF", overflow: "hidden",
            marginLeft: i === 0 ? 0 : -18, alignItems: "center", justifyContent: "center",
            fontSize: size * 0.34, fontWeight: 900, color: INK,
        }, content);
    return h("div", { alignItems: "center" },
        shown.map((player, i) =>
            bubble(player.photo ? img(player.photo, { width: size, height: size, objectFit: "cover" }) : player.initials, TINTS[i % TINTS.length], i)),
        extra > 0 ? bubble(`+${extra}`, "#F2F2F4", shown.length) : null,
    );
}

const pinIcon = (color, size = 34) => ({
    type: "svg",
    props: {
        width: size, height: size, viewBox: "0 0 24 24", fill: "none",
        children: [
            { type: "path", props: { d: "M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z", fill: color } },
            { type: "circle", props: { cx: 12, cy: 10, r: 2.6, fill: "#0A0A0A" } },
        ],
    },
});

/** Taille du nom du sport : aussi gros que possible sans déborder sur l'objet 3D */
const sportFontSize = (name) => Math.max(76, Math.min(128, Math.floor(700 / (name.length * 0.56))));

function sessionTree(session) {
    const surface = session.surface ? dataUri(`surfaces/${session.surface}.jpg`, "image/jpeg") : null;
    const sport = dataUri(`sports/${session.sportKey}.png`, "image/png");
    const icon = dataUri("icon.png", "image/png");

    const status = session.isFindingSlot
        ? `Vote parmi ${session.slotCount} créneau${session.slotCount > 1 ? "x" : ""}`
        : session.max
            ? session.missing > 0 ? `Il manque ${session.missing} joueur${session.missing > 1 ? "s" : ""}` : "Complet"
            : `${session.accepted} confirmé${session.accepted > 1 ? "s" : ""}`;
    const cta = session.isFindingSlot ? "Vote →" : session.missing === 0 ? "Voir →" : "Réponds →";

    // Quand : jour et heure, ou "Date à choisir" pour une session à voter
    const when = h("div", { marginTop: 6, fontSize: 64, fontWeight: 900, letterSpacing: -2 },
        session.isFindingSlot ? "Date à choisir" : `${session.whenLine}${session.endTime ? ` → ${session.endTime}` : ""}`);

    return h(
        "div",
        { width: 1200, height: 630, position: "relative", background: "#1B2A12", fontFamily: "Outfit", color: "#FFFFFF" },
        surface ? img(surface, { position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }) : null,
        h("div", { position: "absolute", top: 0, left: 0, width: 1200, height: 630, backgroundImage: "linear-gradient(90deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.7) 55%, rgba(10,10,10,0.15) 100%)" }),
        sport ? img(sport, { position: "absolute", right: 30, top: 110, width: 350, height: 350 }) : null,
        // Marque toujours visible, en haut à droite
        h("div", { position: "absolute", top: 44, right: 56, alignItems: "center" },
            icon ? img(icon, { width: 50, height: 50, borderRadius: 14 }) : null,
            h("div", { marginLeft: 12, fontSize: 40, fontWeight: 900, letterSpacing: -1.4 }, "Sue"),
        ),

        h(
            "div",
            { position: "absolute", top: 0, left: 0, width: 1200, height: 630, padding: "44px 56px 48px", flexDirection: "column" },
            // Marque + qui invite
            h("div", { alignItems: "center" },
                session.organizerPhoto
                    ? img(session.organizerPhoto, { width: 64, height: 64, borderRadius: 32, objectFit: "cover", border: `3px solid ${VOLT}`, marginRight: 16 })
                    : null,
                h("div", { fontSize: 42, fontWeight: 800, color: VOLT }, `${session.organizer} t'invite`),
            ),
            // Sport, quand, où
            h("div", { marginTop: 18, fontSize: sportFontSize(session.sportName), fontWeight: 900, letterSpacing: -4, lineHeight: 0.95 }, session.sportName),
            when,
            h("div", { marginTop: 16, alignItems: "center", width: 780 },
                pinIcon(VOLT, 44),
                h("div", { marginLeft: 10, fontSize: 46, fontWeight: 800, color: "#FFFFFF", display: "block", lineClamp: 1, maxWidth: 720 }, session.location),
            ),
            // Joueurs, état, appel à répondre
            h("div", { marginTop: "auto", alignItems: "center", width: 1088 },
                session.players.length > 0 ? avatarsRow(session.players) : null,
                session.max && !session.isFindingSlot
                    ? h("div", { marginLeft: 20, fontSize: 54, fontWeight: 900 }, `${session.accepted}/${session.max}`)
                    : null,
                h("div", { marginLeft: 20, background: VOLT, color: INK, borderRadius: 22, padding: "16px 24px", fontSize: 34, fontWeight: 900 }, status),
                h("div", { marginLeft: "auto", background: "#FFFFFF", color: INK, borderRadius: 22, padding: "16px 28px", fontSize: 36, fontWeight: 900 }, cta),
            ),
        ),
    );
}

/** JPEG : un aperçu de plus de ~300 Ko est souvent ignoré par WhatsApp (le PNG fait plus de 1 Mo) */
export async function renderInviteImage(session) {
    const [organizerPhoto, ...photos] = await Promise.all([
        photoDataUri(session.organizerAvatarUrl),
        ...session.players.slice(0, 4).map((player) => photoDataUri(player.avatarUrl)),
    ]);
    const withPhotos = {
        ...session,
        organizerPhoto,
        players: session.players.map((player, i) => ({ ...player, photo: photos[i] || null })),
    };
    const svg = await satori(sessionTree(withPhotos), { width: 1200, height: 630, fonts });
    const rendered = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render();
    return jpeg.encode({ data: rendered.pixels, width: rendered.width, height: rendered.height }, 82).data;
}
