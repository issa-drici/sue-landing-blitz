import { useState } from "react";
import { Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { apiFetch, storeToken } from "@/web/api";

// Connexion / inscription par téléphone + code SMS (même compte que l'app).
// Étapes : numéro -> code -> prénom/nom si le numéro est nouveau. Appelle onDone une fois connecté.

type Step = "phone" | "code" | "name";

interface VerifyResponse {
    isRegistered: boolean;
    token?: string;
}

export function PhoneAuthForm({ onDone }: { onDone: () => void }) {
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
        await apiFetch("/auth/phone/send-otp", { method: "POST", body: { phone }, auth: false });
        setCode("");
        setStep("code");
    });

    const verifyCode = (value: string) => run(async () => {
        const data = await apiFetch<VerifyResponse>("/auth/phone/verify", {
            method: "POST", body: { phone, code: value, device_name: "SUE Web" }, auth: false,
        });
        if (data.isRegistered && data.token) {
            storeToken(data.token);
            onDone();
        } else {
            setStep("name");
        }
    });

    const register = () => run(async () => {
        const data = await apiFetch<{ token: string }>("/auth/phone/register", {
            method: "POST", body: { phone, firstname, lastname, device_name: "SUE Web" }, auth: false,
        });
        storeToken(data.token);
        onDone();
    });

    const inputClass = "w-full h-14 rounded-2xl border border-[#E5E5E5] bg-white px-4 text-base font-semibold text-slate-900 outline-none focus:border-[#8CBF3D]";
    const primaryClass = "w-full h-14 rounded-2xl bg-[#D4FC79] text-black font-black text-[15px] flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]";

    return (
        <div>
            {step === "phone" && (
                <div className="flex flex-col gap-4">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">Ton numéro de téléphone</h3>
                        <p className="text-sm text-slate-500 mt-1">On t'envoie un code par SMS pour vérifier que c'est bien toi.</p>
                    </div>
                    <input
                        type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78"
                        value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass}
                        onKeyDown={(e) => { if (e.key === "Enter" && phone.replace(/\D/g, "").length >= 9) sendCode(); }}
                    />
                    <button className={primaryClass} disabled={isLoading || phone.replace(/\D/g, "").length < 9} onClick={sendCode}>
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Recevoir le code"}
                    </button>
                </div>
            )}

            {step === "code" && (
                <div className="flex flex-col gap-4 items-center text-center">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">Entre le code reçu</h3>
                        <p className="text-sm text-slate-500 mt-1">Envoyé au {phone}</p>
                    </div>
                    <InputOTP
                        maxLength={6} value={code} inputMode="numeric" autoComplete="one-time-code" autoFocus
                        onChange={(value) => { setCode(value); if (value.length === 6) verifyCode(value); }}
                    >
                        <InputOTPGroup>
                            {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} className="w-11 h-14 text-lg font-bold bg-white text-slate-900 border-[#E5E5E5]" />)}
                        </InputOTPGroup>
                    </InputOTP>
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin text-slate-400" />}
                    <button className="text-sm font-semibold text-slate-500" onClick={() => setStep("phone")}>Changer de numéro</button>
                </div>
            )}

            {step === "name" && (
                <div className="flex flex-col gap-4">
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

            {error && <p className="text-sm font-semibold text-red-600 text-center mt-3">{error}</p>}
        </div>
    );
}
