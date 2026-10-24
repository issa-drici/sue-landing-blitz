import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2, MapPin } from "lucide-react";
import { apiFetch } from "@/web/api";
import { SportBackdrop } from "@/web/components/SportBackdrop";
import { WebLayout } from "@/web/components/WebLayout";
import { formatWhen, sportLabel } from "@/web/format";
import { WebSession, WebUser } from "@/web/types";

// Accueil de l'espace web : sessions à organiser puis à venir (mêmes données que l'accueil de l'app).

/** Ce que l'utilisateur doit faire, ou sa réponse, sur une session */
function statusFor(session: WebSession, user: WebUser): { label: string; highlight: boolean } {
    if (session.organizer.id === user.id) {
        if (session.scheduling === "finding_slot") {
            const invitees = session.participants.filter((p) => p.id !== user.id && p.status !== "declined");
            const answered = invitees.filter((p) => p.hasGivenAvailability && !p.hasNewSlots).length;
            return { label: `${answered}/${invitees.length} réponse${answered > 1 ? "s" : ""}`, highlight: false };
        }
        return { label: "Organisateur", highlight: false };
    }
    const me = session.participants.find((p) => p.id === user.id);
    if (session.scheduling === "finding_slot") {
        const needsAnswer = !me?.hasGivenAvailability || me?.hasNewSlots;
        return needsAnswer ? { label: "Répondre", highlight: true } : { label: "Répondu", highlight: false };
    }
    if (me?.status === "pending") return { label: "Répondre", highlight: true };
    return { label: "Tu participes", highlight: false };
}

function SessionCard({ session, user }: { session: WebSession; user: WebUser }) {
    const status = statusFor(session, user);
    return (
        <Link to={`/app/session/${session.id}`} className="block transition-transform active:scale-[0.99]">
            <SportBackdrop sport={session.sport} className={status.highlight ? "ring-2 ring-[#D4FC79]" : ""}>
                <div className="flex items-center gap-3 pl-[76px] pr-4 py-4 min-h-[92px]">
                    <div className="flex-1 min-w-0">
                        <div className="text-white font-black text-lg leading-tight">{sportLabel(session.sport)}</div>
                        <div className="text-white/85 text-sm font-semibold">{formatWhen(session)}</div>
                        <div className="flex items-center gap-1 text-white/75 text-xs font-medium mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{session.location}</span>
                        </div>
                    </div>
                    <span className={`flex-shrink-0 rounded-lg px-2 py-1 text-xs font-bold ${status.highlight ? "bg-[#D4FC79] text-black" : "bg-white text-slate-800"}`}>
                        {status.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-white flex-shrink-0" />
                </div>
            </SportBackdrop>
        </Link>
    );
}

function SessionsContent({ user }: { user: WebUser }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["web-sessions"],
        queryFn: () => apiFetch<{ data: WebSession[] }>("/sessions?limit=50"),
    });

    if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
    if (error) return <p className="text-center text-red-600 font-semibold py-12">{(error as Error).message}</p>;

    const sessions = data?.data ?? [];
    const toOrganize = sessions.filter((s) => s.scheduling === "finding_slot" && (s.slotProposals.length > 0 || s.organizer.id === user.id));
    const upcoming = sessions.filter((s) => s.scheduling !== "finding_slot")
        .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-2xl font-black">Bonjour {user.firstname} 👋</h1>

            {sessions.length === 0 && (
                <div className="flex flex-col items-center text-center gap-3 py-10">
                    <img src="/brand/hero-3d.png" alt="" className="w-40 h-40 object-contain" />
                    <h2 className="text-xl font-black">Aucune session pour l'instant</h2>
                    <p className="text-slate-500 max-w-xs">Quand un ami t'invite, la session apparaît ici.</p>
                </div>
            )}

            {toOrganize.length > 0 && (
                <section className="flex flex-col gap-3">
                    <h2 className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">À organiser</h2>
                    {toOrganize.map((session) => <SessionCard key={session.id} session={session} user={user} />)}
                </section>
            )}

            {upcoming.length > 0 && (
                <section className="flex flex-col gap-3">
                    <h2 className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">À venir</h2>
                    {upcoming.map((session) => <SessionCard key={session.id} session={session} user={user} />)}
                </section>
            )}
        </div>
    );
}

export default function WebSessions() {
    return <WebLayout>{(user) => <SessionsContent user={user} />}</WebLayout>;
}
