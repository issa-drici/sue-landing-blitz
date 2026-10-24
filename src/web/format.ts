// Formats de dates et d'heures communs à l'espace web (mêmes libellés que l'app)

import { WebSession, WebSlot } from "@/web/types";

const toDate = (isoDate: string) => {
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(year, month - 1, day);
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "18:00" -> "18h", "18:30" -> "18h30" */
export const formatHour = (time: string) => {
    const [h, m] = time.split(":");
    return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
};

/** "Mardi 27 octobre" */
export const formatDay = (isoDate: string) =>
    capitalize(toDate(isoDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }));

/** "Aujourd'hui", "Demain" ou "Mardi 27 oct." */
export const formatRelativeDay = (isoDate: string) => {
    const date = toDate(isoDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((date.getTime() - today.getTime()) / 86_400_000);
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return "Demain";
    return capitalize(date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" }));
};

export const formatSlot = (slot: Pick<WebSlot, "date" | "startTime" | "endTime">) =>
    `${formatDay(slot.date)} · ${formatHour(slot.startTime)} → ${formatHour(slot.endTime)}`;

/** Ligne "quand" d'une session : date et heure, ou créneau à définir */
export const formatWhen = (session: WebSession) => {
    if (session.scheduling === "finding_slot") {
        const count = session.slotProposals.length;
        return count === 0 ? "Aucun créneau à venir" : `Créneau à définir · ${count} proposé${count > 1 ? "s" : ""}`;
    }
    return `${formatRelativeDay(session.date)} · ${formatHour(session.startTime)}`;
};

export const sportLabel = (sport: string) => capitalize(sport.replace(/-/g, " "));

export const firstName = (fullName: string) => fullName.split(" ")[0] || fullName;
