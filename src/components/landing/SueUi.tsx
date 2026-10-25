import { Bell, Calendar, Check, Clock, Link2, MapPin, Plus } from "lucide-react";

// Fragments d'interface repris de l'app (mêmes couleurs, rayons et libellés), utilisés comme
// démonstrations sur la landing. Les prénoms et les sessions sont des exemples.

const TINTS = ["#FFF1DC", "#EFE3F7", "#E3F4E8", "#FDE3E6", "#E1EEFB"];

export function Avatar({ name, index = 0, size = 36, ring = false }: { name: string; index?: number; size?: number; ring?: boolean }) {
    const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    return (
        <span
            className={`inline-flex items-center justify-center rounded-full font-outfit font-bold text-[#0A0A0A] flex-shrink-0 ${ring ? "ring-[3px] ring-white" : ""}`}
            style={{ width: size, height: size, background: TINTS[index % TINTS.length], fontSize: size * 0.36 }}
        >
            {initials}
        </span>
    );
}

const PLAYERS = ["Thomas B", "Lucas M", "Camille K", "Yanis H", "Karim M", "Inès M", "Hugo B", "Nathan R", "Sarah D"];

/** Carte de session de l'app : sport sur son terrain, horaire, lieu, joueurs */
export function SessionCard({ filled = 9, total = 10, className = "" }: { filled?: number; total?: number; className?: string }) {
    const missing = total - filled;
    return (
        <div className={`w-[340px] max-w-full rounded-[28px] bg-white shadow-[0_30px_60px_-24px_rgba(10,10,10,0.35)] border border-black/[0.04] overflow-hidden ${className}`}>
            <div className="relative h-[150px] overflow-hidden">
                <img src="/surfaces/grass.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
                <img src="/sports/football.webp" alt="" className="absolute -right-3 -top-2 w-[120px] h-[120px] object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.35)]" />
                <div className="absolute left-5 bottom-4 text-white">
                    <p className="font-outfit font-extrabold text-[26px] leading-none">Five du mardi</p>
                    <div className="mt-2 flex items-center gap-3 text-[13px] font-medium text-white/90">
                        <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Mardi</span>
                        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 19h - 20h</span>
                    </div>
                </div>
            </div>
            <div className="p-5">
                <p className="flex items-center gap-1.5 text-[13px] font-medium text-[#6B6B70]">
                    <MapPin className="w-3.5 h-3.5" /> Five du Havre
                </p>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2.5">
                        {PLAYERS.slice(0, Math.min(filled, 6)).map((name, i) => (
                            <Avatar key={name} name={name} index={i} size={34} ring />
                        ))}
                        {filled > 6 && (
                            <span className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[#F2F2F4] ring-[3px] ring-white text-[12px] font-bold">+{filled - 6}</span>
                        )}
                    </div>
                    <p className="font-outfit font-extrabold text-[22px] tabular-nums">
                        {filled}<span className="text-[#A1A1A6]">/{total}</span>
                    </p>
                </div>
                <div className={`mt-4 rounded-2xl px-4 py-3 text-[14px] font-bold flex items-center justify-between ${missing > 0 ? "bg-[#D4FC79]" : "bg-[#0A0A0A] text-[#D4FC79]"}`}>
                    <span>{missing > 0 ? `Il manque ${missing} joueur${missing > 1 ? "s" : ""}` : "Complet"}</span>
                    {missing > 0 && <Link2 className="w-4 h-4" />}
                </div>
            </div>
        </div>
    );
}

/** Liste des joueurs : confirmés / en attente, comme sur la page session */
export function RosterFragment() {
    const rows: { name: string; status: "ok" | "wait" | "no" }[] = [
        { name: "Thomas B", status: "ok" },
        { name: "Lucas M", status: "ok" },
        { name: "Camille K", status: "ok" },
        { name: "Sarah D", status: "wait" },
        { name: "Emma L", status: "no" },
    ];
    const label = { ok: "Je viens", wait: "En attente", no: "Ne peut pas" };
    const style = { ok: "bg-[#E9F8D2] text-[#3D6B12]", wait: "bg-[#F2F2F4] text-[#6B6B70]", no: "bg-[#FDECEC] text-[#B42318]" };
    return (
        <div className="w-full max-w-[380px] rounded-[28px] bg-white border border-black/[0.05] shadow-[0_24px_50px_-28px_rgba(10,10,10,0.3)] p-5">
            <p className="font-outfit font-extrabold text-[17px]">Joueurs <span className="text-[#A1A1A6] font-bold">· 3 confirmés</span></p>
            <ul className="mt-3 divide-y divide-black/[0.05]">
                {rows.map((row, i) => (
                    <li key={row.name} className="flex items-center gap-3 py-2.5">
                        <Avatar name={row.name} index={i} size={36} />
                        <span className="flex-1 font-semibold text-[15px]">{row.name.split(" ")[0]}</span>
                        <span className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${style[row.status]}`}>{label[row.status]}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2">
                <span className="rounded-2xl bg-[#D4FC79] py-3 text-center text-[14px] font-bold">Je viens</span>
                <span className="rounded-2xl border border-black/[0.08] py-3 text-center text-[14px] font-bold text-[#6B6B70]">Je ne peux pas</span>
            </div>
        </div>
    );
}

/** Vote des créneaux : dispos par créneau et créneau proposé par un invité */
export function SlotVoteFragment() {
    const slots = [
        { day: "Mardi 4 nov.", time: "19h → 20h30", count: 5, names: "Thomas, Lucas, Yanis, Hugo, Nathan", best: true },
        { day: "Mercredi 5 nov.", time: "20h → 21h30", count: 2, names: "Thomas, Yanis" },
        { day: "Samedi 8 nov.", time: "18h → 19h30", count: 3, names: "Karim, Lucas, Hugo", proposedBy: "Karim" },
    ];
    return (
        <div className="w-full max-w-[380px] rounded-[28px] bg-white border border-black/[0.05] shadow-[0_24px_50px_-28px_rgba(10,10,10,0.3)] p-5">
            <p className="font-outfit font-extrabold text-[17px]">Choisis le créneau</p>
            <p className="text-[13px] font-medium text-[#8E8E93] mt-0.5">6/6 ont répondu</p>
            <div className="mt-3 flex flex-col gap-2">
                {slots.map((slot) => (
                    <div key={slot.day} className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 ${slot.best ? "border-[#8CBF3D] bg-[#F7FBEF]" : "border-black/[0.06]"}`}>
                        <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${slot.best ? "border-[#8CBF3D] bg-[#8CBF3D] shadow-[inset_0_0_0_3px_white]" : "border-[#C7C7CC]"}`} />
                        <span className="flex-1 min-w-0">
                            <span className="block font-bold text-[14px]">{slot.day} · {slot.time}</span>
                            {slot.proposedBy && <span className="block text-[12px] font-semibold text-[#6FA12A]">Proposé par {slot.proposedBy}</span>}
                            <span className="block text-[12px] text-[#8E8E93] truncate">{slot.names}</span>
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-[12px] font-bold tabular-nums ${slot.best ? "bg-[#D4FC79]" : "bg-[#F2F2F4]"}`}>{slot.count} dispos</span>
                    </div>
                ))}
                <span className="flex items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-dashed border-[#8CBF3D] bg-[#F6FBEE] py-2.5 text-[13px] font-bold text-[#5E8C1F]">
                    <Plus className="w-4 h-4" /> Proposer un autre créneau
                </span>
            </div>
        </div>
    );
}

/** Notifications empilées : rappels et changements */
export function NotificationsFragment() {
    const items = [
        { title: "Rappel : five demain à 19h", body: "Five du Havre · 9 joueurs confirmés", time: "hier" },
        { title: "Changement d'heure", body: "Le padel de jeudi passe à 20h30", time: "2 h" },
        { title: "Rappel : five dans 1 heure", body: "Pense à prendre tes chaussures", time: "18:00" },
    ];
    return (
        <div className="w-full max-w-[380px] flex flex-col gap-2.5">
            {items.map((item, i) => (
                <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-[22px] bg-white/90 backdrop-blur border border-black/[0.05] shadow-[0_18px_40px_-26px_rgba(10,10,10,0.35)] p-3.5"
                    style={{ marginLeft: i * 14, marginRight: (2 - i) * 14 }}
                >
                    <img src="/adaptive-icon.png" alt="" className="w-10 h-10 rounded-[11px] flex-shrink-0" />
                    <span className="flex-1 min-w-0">
                        <span className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[14px] truncate">{item.title}</span>
                            <span className="text-[12px] text-[#8E8E93] flex-shrink-0">{item.time}</span>
                        </span>
                        <span className="block text-[13px] text-[#55555A] truncate">{item.body}</span>
                    </span>
                </div>
            ))}
            <p className="mt-1 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#6B6B70]">
                <Bell className="w-4 h-4" /> Envoyés automatiquement par Sue
            </p>
        </div>
    );
}

/** Session à compléter : compteur et lien à partager */
export function FillFragment() {
    return (
        <div className="w-full max-w-[380px] rounded-[28px] bg-white border border-black/[0.05] shadow-[0_24px_50px_-28px_rgba(10,10,10,0.3)] p-5">
            <div className="flex items-baseline justify-between">
                <p className="font-outfit font-extrabold text-[17px]">Padel jeudi</p>
                <p className="font-outfit font-extrabold text-[28px] tabular-nums">3<span className="text-[#A1A1A6]">/4</span></p>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
                {["Lucas M", "Sarah D", "Thomas B"].map((name, i) => (
                    <span key={name} className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#F7F7F8] py-3">
                        <Avatar name={name} index={i + 1} size={38} />
                        <span className="text-[12px] font-semibold">{name.split(" ")[0]}</span>
                    </span>
                ))}
                <span className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-dashed border-[#C7C7CC] py-3 text-[#8E8E93]">
                    <Plus className="w-5 h-5" />
                    <span className="text-[12px] font-semibold">Libre</span>
                </span>
            </div>
            <span className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#0A0A0A] py-3.5 text-[14px] font-bold text-white">
                <Link2 className="w-4 h-4" /> Partager le lien
            </span>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#3D6B12]">
                <Check className="w-3.5 h-3.5" /> Lien copié : envoie-le dans n'importe quel groupe
            </p>
        </div>
    );
}
