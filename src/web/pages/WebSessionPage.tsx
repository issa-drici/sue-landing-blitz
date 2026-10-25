import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Check, Copy, Loader2, MapPin, Euro, Plus, X } from "lucide-react";
import { apiFetch } from "@/web/api";
import { SportBackdrop } from "@/web/components/SportBackdrop";
import { WebLayout } from "@/web/components/WebLayout";
import { ProposeSlotForm, ProposedSlotInput } from "@/web/components/ProposeSlotForm";
import { firstName, formatDay, formatHour, formatRelativeDay, formatSlot, sportLabel } from "@/web/format";
import { WebParticipant, WebSession, WebSlot, WebUser } from "@/web/types";

// Page d'une session dans l'espace web : mêmes actions que l'app (répondre, donner ses dispos,
// confirmer un créneau pour l'organisateur, partager le lien).

const card = "bg-white rounded-3xl border border-[#EFEFEF] p-5";
const primaryButton = "w-full h-13 py-3.5 rounded-2xl bg-[#D4FC79] text-black font-black text-[15px] flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]";
const secondaryButton = "w-full py-3.5 rounded-2xl bg-white border border-[#EFEFEF] font-bold text-[15px] disabled:opacity-50";

/** Un invité peut proposer au plus 2 créneaux (même limite côté backend) */
const MAX_PROPOSALS_PER_USER = 2;

/** "Proposé par Karim" / "Proposé par toi" (rien pour les créneaux de l'organisateur) */
const proposedByLabel = (session: WebSession, slot: WebSlot, userId?: string) => {
    if (!slot.proposedBy) return null;
    if (slot.proposedBy === userId) return "Proposé par toi";
    const participant = session.participants.find((p) => p.id === slot.proposedBy);
    return `Proposé par ${participant ? firstName(participant.fullName) : "un joueur"}`;
};

function useSessionAction(sessionId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ path, method, body }: { path: string; method: string; body?: unknown }) =>
            apiFetch(path, { method, body }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["web-session", sessionId] });
            queryClient.invalidateQueries({ queryKey: ["web-sessions"] });
        },
    });
}

/** Invité d'une session classique : je viens / je ne peux pas (modifiable) */
function ScheduledAnswer({ session, me }: { session: WebSession; me: WebParticipant }) {
    const action = useSessionAction(session.id);
    const respond = (response: "accept" | "decline") =>
        action.mutate({ path: `/sessions/${session.id}/respond`, method: "PATCH", body: { response } });

    return (
        <div className={card}>
            <h2 className="text-lg font-black">
                {me.status === "accepted" ? "✓ Tu participes" : me.status === "declined" ? "Tu as dit que tu ne pouvais pas venir" : "Tu participes ?"}
            </h2>
            <div className="flex flex-col gap-2 mt-4">
                {me.status !== "accepted" && (
                    <button className={primaryButton} disabled={action.isPending} onClick={() => respond("accept")}>
                        {action.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Je viens"}
                    </button>
                )}
                {me.status !== "declined" && (
                    <button className={`${secondaryButton} text-[#E64A19]`} disabled={action.isPending} onClick={() => respond("decline")}>
                        {me.status === "accepted" ? "Je ne peux plus venir" : "Je ne peux pas"}
                    </button>
                )}
            </div>
            {action.error && <p className="text-sm font-semibold text-red-600 mt-3">{(action.error as Error).message}</p>}
        </div>
    );
}

/** Invité d'une session à organiser : coche ses créneaux (modifiable jusqu'à la confirmation) */
function SlotAnswer({ session, user, me }: { session: WebSession; user: WebUser; me: WebParticipant }) {
    const action = useSessionAction(session.id);
    const saved = useMemo(
        () => session.slotProposals.filter((s) => s.availableUserIds.includes(user.id)).map((s) => s.id),
        [session.slotProposals, user.id]
    );
    const [selected, setSelected] = useState<string[]>(saved);
    useEffect(() => setSelected(saved), [saved]);

    const isDirty = selected.length !== saved.length || selected.some((id) => !saved.includes(id));
    const hasAnswered = !!me.hasGivenAvailability && !me.hasNewSlots;
    const send = (slotIds: string[]) =>
        action.mutate({ path: `/sessions/${session.id}/availability`, method: "PUT", body: { slotIds } });

    const proposeAction = useSessionAction(session.id);
    const [isProposing, setIsProposing] = useState(false);
    const myProposalsCount = session.slotProposals.filter((s) => s.proposedBy === user.id).length;
    const propose = (slot: ProposedSlotInput) =>
        proposeAction.mutate(
            { path: `/sessions/${session.id}/slots/propose`, method: "POST", body: slot },
            { onSuccess: () => setIsProposing(false) }
        );
    const removeProposal = (slot: WebSlot) => {
        if (!window.confirm(`Retirer le créneau ${formatSlot(slot)} ?`)) return;
        proposeAction.mutate({ path: `/sessions/${session.id}/slots/${slot.id}`, method: "DELETE" });
    };

    return (
        <div className={card}>
            <h2 className="text-lg font-black">Quand peux-tu jouer ?</h2>
            <p className="text-sm text-slate-500 mt-1">Coche tous les créneaux qui te vont. Si l'un d'eux est retenu, tu es inscrit automatiquement.</p>
            {me.hasNewSlots && (
                <div className="mt-3 rounded-xl bg-[#D4FC79] px-3 py-2 text-sm font-bold">Nouveau créneau proposé : coche-le si tu es dispo.</div>
            )}
            <div className="flex flex-col gap-2 mt-4">
                {session.slotProposals.map((slot) => {
                    const isOn = selected.includes(slot.id);
                    const proposedBy = proposedByLabel(session, slot, user.id);
                    return (
                        <div
                            key={slot.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelected((ids) => (isOn ? ids.filter((x) => x !== slot.id) : [...ids, slot.id]))}
                            className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left cursor-pointer ${isOn ? "border-[#8CBF3D] bg-[#F7FBEF]" : "border-[#EFEFEF]"}`}
                        >
                            <span className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isOn ? "bg-[#8CBF3D] border-[#8CBF3D]" : "border-[#C7C7CC]"}`}>
                                {isOn && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                            </span>
                            <span className="flex-1 min-w-0">
                                <span className="block font-bold text-sm">{formatSlot(slot)}</span>
                                {proposedBy && <span className="block text-xs font-semibold text-[#6FA12A]">{proposedBy}</span>}
                            </span>
                            {slot.proposedBy === user.id && (
                                <button
                                    aria-label="Retirer ce créneau"
                                    className="p-1 text-slate-400 hover:text-slate-700"
                                    disabled={proposeAction.isPending}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeProposal(slot);
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Aucun créneau ne va : l'invité en propose un, les autres votent dessus */}
            {isProposing ? (
                <div className="mt-3">
                    <ProposeSlotForm
                        existingSlots={session.slotProposals}
                        isPending={proposeAction.isPending}
                        error={proposeAction.error ? (proposeAction.error as Error).message : null}
                        onSubmit={propose}
                        onCancel={() => setIsProposing(false)}
                    />
                </div>
            ) : myProposalsCount < MAX_PROPOSALS_PER_USER && (
                <button
                    className="mt-3 w-full py-3 rounded-2xl border-[1.5px] border-dashed border-[#8CBF3D] bg-[#F6FBEE] text-[#6FA12A] font-bold text-sm flex items-center justify-center gap-1.5"
                    onClick={() => {
                        proposeAction.reset();
                        setIsProposing(true);
                    }}
                >
                    <Plus className="w-4 h-4" /> Proposer un autre créneau
                </button>
            )}
            {/* Ligne toujours présente : les boutons ne bougent pas quand on coche une case */}
            {hasAnswered && (
                <p className="text-sm text-slate-500 mt-3">
                    {isDirty
                        ? "Modifications pas encore envoyées."
                        : saved.length === 0 ? "Tu as indiqué qu'aucun créneau ne te va." : "Réponse envoyée. Modifiable jusqu'à la confirmation."}
                </p>
            )}
            <button
                className={`${primaryButton} mt-4`}
                disabled={action.isPending || selected.length === 0 || (hasAnswered && !isDirty)}
                onClick={() => send(selected)}
            >
                {action.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : hasAnswered ? "Mettre à jour mes dispos" : "Envoyer mes dispos"}
            </button>
            {!(hasAnswered && saved.length === 0) && (
                <button className="w-full text-sm font-semibold text-slate-500 pt-3" disabled={action.isPending} onClick={() => send([])}>
                    Aucun créneau ne me va
                </button>
            )}
            {action.error && <p className="text-sm font-semibold text-red-600 mt-3">{(action.error as Error).message}</p>}
        </div>
    );
}

/** Organisateur d'une session à organiser : créneaux classés par dispos, confirmation */
function SlotConfirm({ session }: { session: WebSession }) {
    const action = useSessionAction(session.id);
    const invitees = session.participants.filter((p) => p.id !== session.organizer.id && p.status !== "declined");
    const responded = invitees.filter((p) => p.hasGivenAvailability && !p.hasNewSlots);
    const waiting = invitees.filter((p) => !p.hasGivenAvailability || p.hasNewSlots);
    const ranked = [...session.slotProposals].sort((a, b) =>
        b.availabilityCount - a.availabilityCount || `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
    const [chosenId, setChosenId] = useState<string | null>(null);
    const chosen = ranked.find((s) => s.id === chosenId) ?? ranked[0];
    const nameOf = (id: string) => firstName(session.participants.find((p) => p.id === id)?.fullName ?? "?");

    const confirmSlot = (slot: WebSlot) => {
        if (!window.confirm(`Confirmer ${formatSlot(slot)} ?\nLes joueurs disponibles sont inscrits automatiquement, les autres sont prévenus.`)) return;
        action.mutate({ path: `/sessions/${session.id}/confirm-slot`, method: "POST", body: { slotId: slot.id } });
    };

    return (
        <div className={card}>
            <h2 className="text-lg font-black">Choisis le créneau</h2>
            <p className="text-sm text-slate-500 mt-1">
                {ranked.length === 0
                    ? "Aucun créneau à venir : ajoute-en depuis l'app."
                    : `${responded.length}/${invitees.length} ${responded.length > 1 ? "ont" : "a"} répondu`}
            </p>
            <div className="flex flex-col gap-2 mt-4">
                {ranked.map((slot) => {
                    const isChosen = chosen?.id === slot.id;
                    return (
                        <button
                            key={slot.id}
                            onClick={() => setChosenId(slot.id)}
                            className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left ${isChosen ? "border-[#8CBF3D] bg-[#F7FBEF]" : "border-[#EFEFEF]"}`}
                        >
                            <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${isChosen ? "border-[#8CBF3D] bg-[#8CBF3D] shadow-[inset_0_0_0_3px_white]" : "border-[#C7C7CC]"}`} />
                            <span className="flex-1 min-w-0">
                                <span className="block font-bold text-sm">{formatSlot(slot)}</span>
                                {slot.proposedBy && <span className="block text-xs font-semibold text-[#6FA12A]">{proposedByLabel(session, slot)}</span>}
                                {slot.availableUserIds.length > 0 && (
                                    <span className="block text-xs text-slate-500 truncate">{slot.availableUserIds.map(nameOf).join(", ")}</span>
                                )}
                            </span>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${slot.availabilityCount > 0 ? "bg-[#D4FC79]" : "bg-zinc-100"}`}>
                                {slot.availabilityCount === 0 ? "Personne" : `${slot.availabilityCount} dispo${slot.availabilityCount > 1 ? "s" : ""}`}
                            </span>
                        </button>
                    );
                })}
            </div>
            {waiting.length > 0 && (
                <p className="text-sm text-slate-500 mt-3">Pas encore répondu : {waiting.map((p) => firstName(p.fullName)).join(", ")}</p>
            )}
            {chosen && (
                <button className={`${primaryButton} mt-4`} disabled={action.isPending} onClick={() => confirmSlot(chosen)}>
                    {action.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : `Confirmer ${formatDay(chosen.date).toLowerCase()} à ${formatHour(chosen.startTime)}`}
                </button>
            )}
            {action.error && <p className="text-sm font-semibold text-red-600 mt-3">{(action.error as Error).message}</p>}
        </div>
    );
}

function ShareLink({ session }: { session: WebSession }) {
    const [copied, setCopied] = useState(false);
    if (!session.shareToken) return null;
    const url = `${window.location.origin}/join/${session.shareToken}`;
    const copy = async () => {
        try {
            if (navigator.share) {
                await navigator.share({ url, text: `${sportLabel(session.sport)} : tu viens ?` });
                return;
            }
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // partage annulé
        }
    };
    return (
        <button className={`${secondaryButton} flex items-center justify-center gap-2`} onClick={copy}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Lien copié" : "Partager le lien de la session"}
        </button>
    );
}

const initials = (fullName: string) =>
    fullName.split(" ").map((part) => part.charAt(0)).join("").slice(0, 2).toUpperCase();

function Players({ session }: { session: WebSession }) {
    // Pendant la recherche de créneau, personne n'est encore "confirmé" : une seule liste d'invités
    const groups: { title: string; statuses: WebParticipant["status"][] }[] = session.scheduling === "finding_slot"
        ? [{ title: "Invités", statuses: ["accepted", "pending"] }, { title: "Ne viennent pas", statuses: ["declined"] }]
        : [
            { title: "Confirmés", statuses: ["accepted"] },
            { title: "En attente", statuses: ["pending"] },
            { title: "Ne viennent pas", statuses: ["declined"] },
        ];
    return (
        <div className={card}>
            <h2 className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">Joueurs</h2>
            {groups.map(({ title, statuses }) => {
                const players = session.participants.filter((p) => statuses.includes(p.status));
                if (players.length === 0) return null;
                return (
                    <div key={title} className="mt-4">
                        <div className="text-sm font-bold text-slate-600 mb-2">{title} ({players.length})</div>
                        <div className="flex flex-wrap gap-4">
                            {players.map((p) => (
                                <div key={p.id} className="flex flex-col items-center w-16">
                                    {p.avatarUrl ? (
                                        <img src={p.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover bg-zinc-100" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-[#F2F9EB] text-[#70A831] font-extrabold text-sm flex items-center justify-center">
                                            {initials(p.fullName)}
                                        </div>
                                    )}
                                    <span className="text-xs font-semibold mt-1 truncate w-full text-center">{firstName(p.fullName)}</span>
                                    {p.id === session.organizer.id && <span className="text-[9px] font-extrabold uppercase text-[#70A831]">Orga</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function SessionContent({ user }: { user: WebUser }) {
    const { id = "" } = useParams();
    const { data, isLoading, error } = useQuery({
        queryKey: ["web-session", id],
        queryFn: () => apiFetch<{ data: WebSession }>(`/sessions/${id}`),
    });

    if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
    if (error || !data) return <p className="text-center text-red-600 font-semibold py-12">{(error as Error)?.message ?? "Session introuvable"}</p>;

    const session = data.data;
    const isOrganizer = session.organizer.id === user.id;
    const me = session.participants.find((p) => p.id === user.id);
    const isFindingSlot = session.scheduling === "finding_slot";
    const isCancelled = session.status === "cancelled";

    return (
        <div className="flex flex-col gap-4">
            <Link to="/app" className="flex items-center gap-1 text-sm font-semibold text-slate-500 w-fit">
                <ArrowLeft className="w-4 h-4" /> Mes sessions
            </Link>

            <SportBackdrop sport={session.sport} size="large">
                <div className="p-5 pr-24 min-h-[170px] flex flex-col justify-end gap-1.5">
                    <h1 className="text-3xl font-black text-white">{sportLabel(session.sport)}</h1>
                    <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        {isFindingSlot
                            ? `Créneau à définir · ${session.slotProposals.length} proposé${session.slotProposals.length > 1 ? "s" : ""}`
                            : `${formatRelativeDay(session.date)} · ${formatHour(session.startTime)} → ${formatHour(session.endTime)}`}
                    </div>
                    <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{session.location}</span>
                    </div>
                    {session.pricePerPerson ? (
                        <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                            <Euro className="w-4 h-4 flex-shrink-0" /> {session.pricePerPerson} € par joueur
                        </div>
                    ) : null}
                </div>
            </SportBackdrop>

            {isCancelled && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-bold text-red-700">Cette session a été annulée.</div>
            )}

            {!isCancelled && !isOrganizer && me && (isFindingSlot
                ? session.slotProposals.length > 0 && <SlotAnswer session={session} user={user} me={me} />
                : <ScheduledAnswer session={session} me={me} />)}

            {!isCancelled && isOrganizer && isFindingSlot && <SlotConfirm session={session} />}

            {!isCancelled && <ShareLink session={session} />}

            <Players session={session} />

            <p className="text-center text-xs text-slate-400 py-2">
                Organisé par {session.organizer.fullName}
            </p>
        </div>
    );
}

export default function WebSessionPage() {
    return <WebLayout>{(user) => <SessionContent user={user} />}</WebLayout>;
}
