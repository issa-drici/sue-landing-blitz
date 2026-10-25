import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Plus } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { PhoneAuthForm } from "@/web/components/PhoneAuthForm";
import { ProposeSlotForm, ProposedSlotInput } from "@/web/components/ProposeSlotForm";
import { UnauthorizedError, apiFetch, getStoredToken } from "@/web/api";

// Réponse à une invitation depuis le site, sans l'app (Android et ordinateur uniquement).
// Parcours : connexion par téléphone + code SMS (première fois) -> réponse -> confirmation.
// Le compte créé est le même que dans l'app : la personne retrouve tout si elle l'installe.


export interface AnswerSlot {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
}

type Step = "auth" | "answer" | "done";

interface WebAnswerDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shareToken: string;
    from: string | null;
    isFindingSlot: boolean;
    slots: AnswerSlot[];
    // Créneau sur lequel la personne a cliqué "Je suis dispo" (pré-coché)
    initialSlotId?: string | null;
    // Réponse déjà donnée (si la personne revient sur le lien)
    viewerSlotIds?: string[];
    formatSlot: (slot: AnswerSlot) => string;
    // Appelé après une réponse enregistrée, pour rafraîchir la page
    onAnswered: () => void;
}

export function WebAnswerDrawer({
    open, onOpenChange, shareToken, from, isFindingSlot, slots,
    initialSlotId, viewerSlotIds, formatSlot, onAnswered,
}: WebAnswerDrawerProps) {
    const [step, setStep] = useState<Step>("auth");
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [doneMessage, setDoneMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProposing, setIsProposing] = useState(false);

    // À l'ouverture seulement (pas quand la page se rafraîchit après une réponse) :
    // déjà connecté -> directement la réponse
    const wasOpen = useRef(false);
    useEffect(() => {
        const justOpened = open && !wasOpen.current;
        wasOpen.current = open;
        if (!justOpened) return;
        setError(null);
        setIsProposing(false);
        setStep(getStoredToken() ? "answer" : "auth");
        const preselected = new Set(viewerSlotIds ?? []);
        if (initialSlotId) preselected.add(initialSlotId);
        setSelectedSlots([...preselected]);
    }, [open, initialSlotId, viewerSlotIds]);

    const run = async (action: () => Promise<void>) => {
        setIsLoading(true);
        setError(null);
        try {
            await action();
        } catch (e) {
            if (e instanceof UnauthorizedError) setStep("auth");
            setError(e instanceof Error ? e.message : "Une erreur est survenue, réessaie.");
        } finally {
            setIsLoading(false);
        }
    };

    const answer = (response: "accept" | "decline") => run(async () => {
        await apiFetch(`/join/${shareToken}`, { method: "POST", body: { response, ...(from ? { from } : {}) } });
        setDoneMessage(response === "accept" ? "C'est noté, tu fais partie de la session !" : "C'est noté, l'organisateur est prévenu.");
        setStep("done");
        onAnswered();
    });

    const sendAvailability = (slotIds: string[]) => run(async () => {
        // Rejoindre comme invité, puis enregistrer les créneaux
        const joined = await apiFetch<{ data: { id: string } }>(`/join/${shareToken}`, { method: "POST", body: from ? { from } : {} });
        await apiFetch(`/sessions/${joined.data.id}/availability`, { method: "PUT", body: { slotIds } });
        setDoneMessage(slotIds.length > 0
            ? "Tes dispos sont envoyées ! L'organisateur choisira le créneau qui arrange le plus de monde."
            : "C'est noté, l'organisateur sait qu'aucun créneau ne te va.");
        setStep("done");
        onAnswered();
    });

    // Aucun créneau ne va : rejoindre, garder les créneaux cochés, puis proposer le sien
    const proposeSlot = (slot: ProposedSlotInput) => run(async () => {
        const joined = await apiFetch<{ data: { id: string } }>(`/join/${shareToken}`, { method: "POST", body: from ? { from } : {} });
        if (selectedSlots.length > 0) {
            await apiFetch(`/sessions/${joined.data.id}/availability`, { method: "PUT", body: { slotIds: selectedSlots } });
        }
        await apiFetch(`/sessions/${joined.data.id}/slots/propose`, { method: "POST", body: slot });
        setDoneMessage("Ton créneau est proposé ! Les autres vont pouvoir voter, l'organisateur choisira.");
        setStep("done");
        onAnswered();
    });

    const toggleSlot = (id: string) =>
        setSelectedSlots((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

    const primaryClass = "w-full h-14 rounded-2xl bg-[#D4FC79] text-black font-black text-[15px] flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]";

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-[#FAFAFA] px-6 pb-8 pt-2 max-w-md mx-auto">
                <DrawerTitle className="sr-only">Répondre à l'invitation</DrawerTitle>

                {step === "auth" && (
                    <div className="pt-4">
                        <PhoneAuthForm onDone={() => setStep("answer")} />
                    </div>
                )}

                {step === "answer" && !isFindingSlot && (
                    <div className="flex flex-col gap-3 pt-4">
                        <h3 className="text-xl font-black text-slate-900 mb-1">Tu participes ?</h3>
                        <button className={primaryClass} disabled={isLoading} onClick={() => answer("accept")}>
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Je viens"}
                        </button>
                        <button
                            className="w-full h-14 rounded-2xl bg-white border border-[#EFEFEF] text-[#E64A19] font-bold text-[15px] disabled:opacity-50"
                            disabled={isLoading} onClick={() => answer("decline")}
                        >
                            Je ne peux pas
                        </button>
                    </div>
                )}

                {step === "answer" && isFindingSlot && (
                    <div className="flex flex-col gap-3 pt-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Quand peux-tu jouer ?</h3>
                            <p className="text-sm text-slate-500 mt-1">Coche tous les créneaux qui te vont. Si l'un d'eux est retenu, tu es inscrit automatiquement.</p>
                        </div>
                        {slots.map((slot) => {
                            const isOn = selectedSlots.includes(slot.id);
                            return (
                                <button
                                    key={slot.id}
                                    onClick={() => toggleSlot(slot.id)}
                                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors ${isOn ? "border-[#8CBF3D] bg-[#F7FBEF]" : "border-[#EFEFEF] bg-white"}`}
                                >
                                    <span className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isOn ? "bg-[#8CBF3D] border-[#8CBF3D]" : "border-[#C7C7CC]"}`}>
                                        {isOn && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                                    </span>
                                    <span className="font-bold text-slate-900 text-sm">{formatSlot(slot)}</span>
                                </button>
                            );
                        })}
                        {isProposing ? (
                            <ProposeSlotForm
                                existingSlots={slots}
                                isPending={isLoading}
                                onSubmit={proposeSlot}
                                onCancel={() => setIsProposing(false)}
                            />
                        ) : (
                            <button
                                className="w-full py-3 rounded-2xl border-[1.5px] border-dashed border-[#8CBF3D] bg-[#F6FBEE] text-[#6FA12A] font-bold text-sm flex items-center justify-center gap-1.5"
                                disabled={isLoading}
                                onClick={() => setIsProposing(true)}
                            >
                                <Plus className="w-4 h-4" /> Proposer un autre créneau
                            </button>
                        )}
                        {!isProposing && (
                            <>
                                <button className={`${primaryClass} mt-1`} disabled={isLoading || selectedSlots.length === 0} onClick={() => sendAvailability(selectedSlots)}>
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer mes dispos"}
                                </button>
                                <button className="text-sm font-semibold text-slate-500 py-1" disabled={isLoading} onClick={() => sendAvailability([])}>
                                    Aucun créneau ne me va
                                </button>
                            </>
                        )}
                    </div>
                )}

                {step === "done" && (
                    <div className="flex flex-col gap-4 pt-6 items-center text-center">
                        <img src="/brand/invite.webp" alt="" className="w-24 h-24 object-contain" />
                        <h3 className="text-xl font-black text-slate-900">{doneMessage}</h3>
                        <p className="text-sm text-slate-500">Tu peux changer ta réponse à tout moment en revenant sur ce lien.</p>
                        <a href="/app" className={primaryClass}>Voir mes sessions</a>
                        <button className="text-sm font-semibold text-slate-500" onClick={() => onOpenChange(false)}>Fermer</button>
                    </div>
                )}

                {error && <p className="text-sm font-semibold text-red-600 text-center mt-3">{error}</p>}
            </DrawerContent>
        </Drawer>
    );
}
