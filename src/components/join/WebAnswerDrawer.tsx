import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Réponse à une invitation depuis le site, sans l'app (Android et ordinateur uniquement).
// Parcours : téléphone -> code SMS -> prénom/nom (première fois) -> réponse -> confirmation.
// Le compte créé est le même que dans l'app : la personne retrouve tout si elle l'installe.

const TOKEN_KEY = "sue_web_token";

export const getStoredToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};

const storeToken = (token: string) => {
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch {
        // navigation privée : la réponse marche quand même, il faudra juste se reconnecter la prochaine fois
    }
};

export interface AnswerSlot {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
}

type Step = "phone" | "code" | "name" | "answer" | "done";

interface WebAnswerDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    apiBaseUrl: string;
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
    open, onOpenChange, apiBaseUrl, shareToken, from, isFindingSlot, slots,
    initialSlotId, viewerSlotIds, formatSlot, onAnswered,
}: WebAnswerDrawerProps) {
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [doneMessage, setDoneMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // À l'ouverture seulement (pas quand la page se rafraîchit après une réponse) :
    // déjà connecté -> directement la réponse
    const wasOpen = useRef(false);
    useEffect(() => {
        const justOpened = open && !wasOpen.current;
        wasOpen.current = open;
        if (!justOpened) return;
        setError(null);
        setStep(getStoredToken() ? "answer" : "phone");
        const preselected = new Set(viewerSlotIds ?? []);
        if (initialSlotId) preselected.add(initialSlotId);
        setSelectedSlots([...preselected]);
    }, [open, initialSlotId, viewerSlotIds]);

    const call = async (path: string, method: string, body?: unknown, auth = false) => {
        const headers: Record<string, string> = { Accept: "application/json", "Content-Type": "application/json" };
        const token = getStoredToken();
        if (auth && token) headers.Authorization = `Bearer ${token}`;
        const response = await fetch(`${apiBaseUrl}/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
        const data = await response.json().catch(() => ({}));
        if (response.status === 401 && auth) {
            // Session web expirée : on refait la connexion
            try { localStorage.removeItem(TOKEN_KEY); } catch { /* rien */ }
            setStep("phone");
            throw new Error("Reconnecte-toi pour répondre.");
        }
        if (!response.ok) {
            throw new Error(data?.error?.message || data?.message || "Une erreur est survenue, réessaie.");
        }
        return data;
    };

    const run = async (action: () => Promise<void>) => {
        setIsLoading(true);
        setError(null);
        try {
            await action();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Une erreur est survenue, réessaie.");
        } finally {
            setIsLoading(false);
        }
    };

    const sendCode = () => run(async () => {
        await call("/auth/phone/send-otp", "POST", { phone });
        setCode("");
        setStep("code");
    });

    const verifyCode = (value: string) => run(async () => {
        const data = await call("/auth/phone/verify", "POST", { phone, code: value, device_name: "SUE Web" });
        if (data.isRegistered && data.token) {
            storeToken(data.token);
            setStep("answer");
        } else {
            setStep("name");
        }
    });

    const register = () => run(async () => {
        const data = await call("/auth/phone/register", "POST", { phone, firstname, lastname, device_name: "SUE Web" });
        storeToken(data.token);
        setStep("answer");
    });

    const answer = (response: "accept" | "decline") => run(async () => {
        await call(`/join/${shareToken}`, "POST", { response, ...(from ? { from } : {}) }, true);
        setDoneMessage(response === "accept" ? "C'est noté, tu fais partie de la session !" : "C'est noté, l'organisateur est prévenu.");
        setStep("done");
        onAnswered();
    });

    const sendAvailability = (slotIds: string[]) => run(async () => {
        // Rejoindre comme invité, puis enregistrer les créneaux
        const joined = await call(`/join/${shareToken}`, "POST", from ? { from } : {}, true);
        await call(`/sessions/${joined.data.id}/availability`, "PUT", { slotIds }, true);
        setDoneMessage(slotIds.length > 0
            ? "Tes dispos sont envoyées ! L'organisateur choisira le créneau qui arrange le plus de monde."
            : "C'est noté, l'organisateur sait qu'aucun créneau ne te va.");
        setStep("done");
        onAnswered();
    });

    const toggleSlot = (id: string) =>
        setSelectedSlots((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

    const inputClass = "w-full h-14 rounded-2xl border border-[#E5E5E5] bg-white px-4 text-base font-semibold text-slate-900 outline-none focus:border-[#8CBF3D]";
    const primaryClass = "w-full h-14 rounded-2xl bg-[#D4FC79] text-black font-black text-[15px] flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]";

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-[#FAFAFA] px-6 pb-8 pt-2 max-w-md mx-auto">
                <DrawerTitle className="sr-only">Répondre à l'invitation</DrawerTitle>

                {step === "phone" && (
                    <div className="flex flex-col gap-4 pt-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Ton numéro de téléphone</h3>
                            <p className="text-sm text-slate-500 mt-1">On t'envoie un code par SMS pour vérifier que c'est bien toi.</p>
                        </div>
                        <input
                            type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78"
                            value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass}
                        />
                        <button className={primaryClass} disabled={isLoading || phone.replace(/\D/g, "").length < 9} onClick={sendCode}>
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Recevoir le code"}
                        </button>
                    </div>
                )}

                {step === "code" && (
                    <div className="flex flex-col gap-4 pt-4 items-center text-center">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Entre le code reçu</h3>
                            <p className="text-sm text-slate-500 mt-1">Envoyé au {phone}</p>
                        </div>
                        <InputOTP
                            maxLength={6} value={code} inputMode="numeric" autoComplete="one-time-code"
                            onChange={(value) => { setCode(value); if (value.length === 6) verifyCode(value); }}
                        >
                            <InputOTPGroup>
                                {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} className="w-11 h-14 text-lg font-bold bg-white" />)}
                            </InputOTPGroup>
                        </InputOTP>
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-slate-400" />}
                        <button className="text-sm font-semibold text-slate-500" onClick={() => setStep("phone")}>Changer de numéro</button>
                    </div>
                )}

                {step === "name" && (
                    <div className="flex flex-col gap-4 pt-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Comment tu t'appelles ?</h3>
                            <p className="text-sm text-slate-500 mt-1">C'est ce que verront les autres joueurs.</p>
                        </div>
                        <input placeholder="Prénom" autoComplete="given-name" value={firstname} onChange={(e) => setFirstname(e.target.value)} className={inputClass} />
                        <input placeholder="Nom" autoComplete="family-name" value={lastname} onChange={(e) => setLastname(e.target.value)} className={inputClass} />
                        <button className={primaryClass} disabled={isLoading || !firstname.trim() || !lastname.trim()} onClick={register}>
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continuer"}
                        </button>
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
                        <button className={`${primaryClass} mt-1`} disabled={isLoading || selectedSlots.length === 0} onClick={() => sendAvailability(selectedSlots)}>
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer mes dispos"}
                        </button>
                        <button className="text-sm font-semibold text-slate-500 py-1" disabled={isLoading} onClick={() => sendAvailability([])}>
                            Aucun créneau ne me va
                        </button>
                    </div>
                )}

                {step === "done" && (
                    <div className="flex flex-col gap-4 pt-6 items-center text-center">
                        <img src="/brand/invite.webp" alt="" className="w-24 h-24 object-contain" />
                        <h3 className="text-xl font-black text-slate-900">{doneMessage}</h3>
                        <p className="text-sm text-slate-500">Tu peux changer ta réponse à tout moment en revenant sur ce lien.</p>
                        <button className={primaryClass} onClick={() => onOpenChange(false)}>Fermer</button>
                    </div>
                )}

                {error && <p className="text-sm font-semibold text-red-600 text-center mt-3">{error}</p>}
            </DrawerContent>
        </Drawer>
    );
}
