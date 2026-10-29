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

/** Élément satori : h("div", { ...style }, enfants) */
const h = (type, style, ...children) => ({
    type,
    props: { style: { display: "flex", ...style }, children: children.flat().filter((c) => c !== null && c !== false && c !== undefined) },
});
const img = (src, style) => ({ type: "img", props: { src, style } });

function avatarsRow(players) {
    const shown = players.slice(0, 5);
    const extra = players.length - shown.length;
    return h(
        "div",
        { alignItems: "center" },
        shown.map((label, i) =>
            h(
                "div",
                {
                    width: 62, height: 62, borderRadius: 31, background: TINTS[i % TINTS.length], border: "4px solid rgba(255,255,255,0.95)",
                    marginLeft: i === 0 ? 0 : -14, alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: INK,
                },
                label,
            ),
        ),
        extra > 0
            ? h("div", {
                width: 62, height: 62, borderRadius: 31, background: "#F2F2F4", border: "4px solid rgba(255,255,255,0.95)", marginLeft: -14,
                alignItems: "center", justifyContent: "center", fontSize: 21, fontWeight: 700, color: INK,
            }, `+${extra}`)
            : null,
    );
}

function sessionTree(session) {
    const surface = session.surface ? dataUri(`surfaces/${session.surface}.jpg`, "image/jpeg") : null;
    const sport = dataUri(`sports/${session.sportKey}.png`, "image/png");
    const icon = dataUri("icon.png", "image/png");

    const status = session.isFindingSlot
        ? `${session.slotCount} créneau${session.slotCount > 1 ? "x" : ""} à voter`
        : session.max
            ? session.missing > 0 ? `Il manque ${session.missing} joueur${session.missing > 1 ? "s" : ""}` : "Complet"
            : `${session.accepted} confirmé${session.accepted > 1 ? "s" : ""}`;
    const cta = session.isFindingSlot ? "Donne tes dispos →" : session.missing === 0 ? "Voir la session →" : "Tu viens ? Réponds →";

    return h(
        "div",
        { width: 1200, height: 630, position: "relative", background: "#1B2A12", fontFamily: "Outfit", color: "#FFFFFF" },
        surface ? img(surface, { position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }) : null,
        h("div", { position: "absolute", top: 0, left: 0, width: 1200, height: 630, backgroundImage: "linear-gradient(90deg, rgba(10,10,10,0.86) 0%, rgba(10,10,10,0.62) 52%, rgba(10,10,10,0.12) 100%)" }),
        sport ? img(sport, { position: "absolute", right: 46, top: 70, width: 340, height: 340 }) : null,

        h(
            "div",
            { position: "absolute", top: 0, left: 0, width: 1200, height: 630, padding: "56px 64px", flexDirection: "column" },
            // Marque
            h("div", { alignItems: "center" },
                icon ? img(icon, { width: 52, height: 52, borderRadius: 14 }) : null,
                h("div", { marginLeft: 14, fontSize: 34, fontWeight: 900, letterSpacing: -1.2 }, "Sue"),
            ),
            // Qui, quoi, quand, où
            h("div", { marginTop: 38, fontSize: 34, fontWeight: 700, color: VOLT }, `${session.organizer} t'invite`),
            h("div", { marginTop: 6, fontSize: 96, fontWeight: 900, letterSpacing: -3.5, lineHeight: 1 }, session.sportName),
            h("div", { marginTop: 10, fontSize: 52, fontWeight: 900, letterSpacing: -1.5 }, session.whenLine),
            h("div", { marginTop: 12, fontSize: 30, fontWeight: 500, color: "rgba(255,255,255,0.86)", maxWidth: 680 }, session.location),
            // Joueurs et appel à répondre
            h("div", { marginTop: "auto", alignItems: "center", width: 1072 },
                session.players.length > 0 ? avatarsRow(session.players) : null,
                session.max && !session.isFindingSlot
                    ? h("div", { marginLeft: 22, fontSize: 40, fontWeight: 900 }, `${session.accepted}/${session.max}`)
                    : null,
                h("div", { marginLeft: 22, background: VOLT, color: INK, borderRadius: 20, padding: "14px 22px", fontSize: 27, fontWeight: 700 }, status),
                h("div", { marginLeft: "auto", background: "#FFFFFF", color: INK, borderRadius: 20, padding: "14px 24px", fontSize: 27, fontWeight: 900 }, cta),
            ),
        ),
    );
}

/** Lien sans session valide (expiré, annulé) : invitation générique */
function genericTree() {
    const surface = dataUri("surfaces/grass.jpg", "image/jpeg");
    const sport = dataUri("sports/football.png", "image/png");
    const icon = dataUri("icon.png", "image/png");
    return h(
        "div",
        { width: 1200, height: 630, position: "relative", background: "#1B2A12", fontFamily: "Outfit", color: "#FFFFFF" },
        surface ? img(surface, { position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }) : null,
        h("div", { position: "absolute", top: 0, left: 0, width: 1200, height: 630, backgroundImage: "linear-gradient(90deg, rgba(10,10,10,0.86) 0%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.15) 100%)" }),
        sport ? img(sport, { position: "absolute", right: 60, top: 120, width: 360, height: 360 }) : null,
        h("div", { position: "absolute", top: 0, left: 0, width: 1200, height: 630, padding: "56px 64px", flexDirection: "column" },
            h("div", { alignItems: "center" },
                icon ? img(icon, { width: 52, height: 52, borderRadius: 14 }) : null,
                h("div", { marginLeft: 14, fontSize: 34, fontWeight: 900, letterSpacing: -1.2 }, "Sue"),
            ),
            h("div", { marginTop: 120, fontSize: 88, fontWeight: 900, letterSpacing: -3, lineHeight: 1, maxWidth: 700 }, "Tu es invité à une session"),
            h("div", { marginTop: 24, fontSize: 32, fontWeight: 500, color: "rgba(255,255,255,0.86)" }, "Ouvre le lien pour voir qui vient et répondre."),
        ),
    );
}

/** JPEG : un aperçu de plus de ~300 Ko est souvent ignoré par WhatsApp (le PNG fait plus de 1 Mo) */
export async function renderInviteImage(session) {
    const svg = await satori(session ? sessionTree(session) : genericTree(), { width: 1200, height: 630, fonts });
    const rendered = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render();
    return jpeg.encode({ data: rendered.pixels, width: rendered.width, height: rendered.height }, 82).data;
}
