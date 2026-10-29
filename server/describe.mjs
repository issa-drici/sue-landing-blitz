import { createHash } from "node:crypto";

// Ce que dit l'aperçu d'une invitation : textes (titre, description) et données de l'image,
// tirés de l'aperçu public de la session (GET /api/join/:token).

const fileName = (sport) => (sport || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// Terrain où se pratique chaque sport (même table que src/lib/sportAssets.ts)
const SPORT_SURFACES = {
    football: "grass", rugby: "rugby-pitch", golf: "golf-green", tennis: "clay", basketball: "parquet-basket",
    handball: "parquet-multisport", volleyball: "parquet-multisport", badminton: "parquet-multisport", squash: "parquet-multisport",
    padel: "padel", "ping-pong": "ping-pong", judo: "tatami", karate: "tatami", aikido: "tatami", "jiu-jitsu-bresilien": "tatami",
    boxe: "ring", course: "athletics-track", athletisme: "athletics-track", triathlon: "athletics-track",
    randonnee: "trail", "marche-nordique": "trail", "marche-sportive": "trail", cyclisme: "road", skateboard: "road",
    musculation: "gym-floor", danse: "studio", yoga: "studio", pilates: "studio", gymnastique: "studio",
    natation: "pool", aquafitness: "pool", "sauvetage-sportif": "pool", aviron: "lake", kayak: "lake", peche: "lake",
    "stand-up-paddle": "lake", surf: "waves", bodyboard: "waves", "planche-a-voile": "waves", ski: "snow", snowboard: "snow",
    hockey: "ice", baseball: "baseball-dirt", petanque: "gravel", escalade: "climbing-wall", equitation: "arena-sand",
    bowling: "bowling-lane", "tir-a-l-arc": "archery-target",
};

const SHORT_DAYS = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
const WEEKDAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** "1er", "2", "3"… */
const dayOfMonth = (date) => (date.getUTCDate() === 1 ? "1er" : String(date.getUTCDate()));

/**
 * "jeudi 6 novembre" : toujours une date absolue. L'aperçu reste figé dans la conversation,
 * un "demain" serait faux dès le lendemain.
 */
export function dayLabel(isoDate) {
    const date = new Date(`${isoDate}T12:00:00Z`);
    return `${WEEKDAYS[date.getUTCDay()]} ${dayOfMonth(date)} ${MONTHS[date.getUTCMonth()]}`;
}

const SHORT_MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/** "Jeu. 6 nov." pour l'image, où la place compte */
function shortDayLabel(isoDate) {
    const date = new Date(`${isoDate}T12:00:00Z`);
    return `${SHORT_DAYS[date.getUTCDay()]} ${dayOfMonth(date)} ${SHORT_MONTHS[date.getUTCMonth()]}`;
}

/** "19:00" -> "19h", "19:30" -> "19h30" */
export const hourLabel = (time) => {
    const [h, m] = (time || "").split(":");
    return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
};



const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const firstName = (fullName) => (fullName || "").trim().split(/\s+/)[0] || "Un pote";
const initials = (fullName) =>
    (fullName || "").trim().split(/\s+/).map((part) => part[0] || "").join("").slice(0, 2).toUpperCase() || "?";

export function describeSession(preview) {
    const sportKey = fileName(preview.sport);
    const sportName = preview.sportName || capitalize(preview.sport || "Sport");
    const organizer = firstName(preview.organizer?.fullName);
    const accepted = Number(preview.participantsCount || 0);
    const max = preview.maxParticipants ? Number(preview.maxParticipants) : null;
    const missing = max ? Math.max(0, max - accepted) : null;
    const isFindingSlot = preview.scheduling === "finding_slot";
    const slotCount = (preview.slotProposals || []).length;
    const players = (preview.participants || [])
        .filter((p) => p.status === "accepted")
        .sort((a, b) => Number(b.isOrganizer) - Number(a.isOrganizer))
        .map((p) => ({ initials: initials(p.fullName), avatarUrl: p.avatarUrl || null }));

    const when = isFindingSlot
        ? `date à choisir, ${slotCount} créneau${slotCount > 1 ? "x" : ""} proposé${slotCount > 1 ? "s" : ""}`
        : `${dayLabel(preview.date)} à ${hourLabel(preview.startTime)}`;

    const playersLine = max
        ? missing > 0
            ? `${accepted}/${max} joueurs, il manque ${missing} joueur${missing > 1 ? "s" : ""}`
            : `${accepted}/${max} joueurs, complet`
        : `${accepted} joueur${accepted > 1 ? "s" : ""} confirmé${accepted > 1 ? "s" : ""}`;

    const title = `${organizer} t'invite : ${sportName.toLowerCase()}${isFindingSlot ? "," : ""} ${when}`;
    const description = isFindingSlot
        ? `${preview.location} · Dis quand tu es dispo en un tap, ${organizer} choisira le créneau.`
        : `${preview.location} · ${capitalize(playersLine)}. Réponds en un tap.`;

    return {
        title,
        description,
        // Change quand ce que montre l'image change : WhatsApp rafraîchit alors l'aperçu
        version: createHash("sha1").update(JSON.stringify([
            preview.sport, preview.scheduling, preview.date, preview.startTime, preview.endTime, preview.location,
            accepted, max, slotCount, preview.organizer?.fullName, preview.organizer?.avatarUrl,
            (preview.participants || []).filter((p) => p.status === "accepted").map((p) => [p.fullName, p.avatarUrl]),
        ])).digest("hex").slice(0, 10),
        sportKey,
        sportName,
        surface: SPORT_SURFACES[sportKey] || null,
        organizer,
        organizerAvatarUrl: preview.organizer?.avatarUrl || null,
        whenLine: isFindingSlot ? "Date à choisir" : `${shortDayLabel(preview.date)} · ${hourLabel(preview.startTime)}`,
        location: preview.location,
        accepted,
        max,
        missing,
        isFindingSlot,
        slotCount,
        endTime: preview.endTime ? hourLabel(preview.endTime) : null,
        players,
    };
}
