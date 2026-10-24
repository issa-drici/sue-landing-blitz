import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { APP_STORE_URL, IS_IOS, getStoredToken } from "@/web/api";
import { PhoneAuthForm } from "@/web/components/PhoneAuthForm";

// Connexion à l'espace web (Android et ordinateur) : même compte que l'app.

export default function WebLogin() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    // Retour à la page demandée (seulement dans l'espace web)
    const next = params.get("next")?.startsWith("/app") ? params.get("next")! : "/app";

    useEffect(() => {
        if (!IS_IOS && getStoredToken()) navigate(next, { replace: true });
    }, [navigate, next]);

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
            <div className="w-full max-w-sm flex flex-col gap-8">
                <div className="flex flex-col items-center text-center gap-3">
                    <img src="/brand/hero-3d.png" alt="" className="w-40 h-40 object-contain" />
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Tes sessions Sue</h1>
                    <p className="text-slate-500">Retrouve tes sessions, réponds aux invitations et donne tes dispos.</p>
                </div>
                {IS_IOS ? (
                    <a href={APP_STORE_URL} className="h-14 rounded-2xl bg-[#D4FC79] text-black font-black flex items-center justify-center">
                        Télécharger l'app
                    </a>
                ) : (
                    <PhoneAuthForm onDone={() => navigate(next, { replace: true })} />
                )}
            </div>
        </div>
    );
}
