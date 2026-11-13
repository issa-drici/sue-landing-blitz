import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { IS_ANDROID, canPromptInstall, isInstalled, onInstallAvailabilityChange, promptInstall } from "@/web/pwa";

// Petite bannière en bas de l'espace web : installer Sue sur l'écran d'accueil (Android surtout).
// Avec Chrome, un bouton ouvre directement l'installation ; sinon on explique où toucher.

const DISMISS_KEY = "sue_install_banner_dismissed_at";
const DISMISS_FOR_MS = 14 * 24 * 60 * 60 * 1000;

const dismissedRecently = () => {
    try {
        const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
        return Date.now() - at < DISMISS_FOR_MS;
    } catch {
        return false;
    }
};

export function InstallBanner() {
    const [canPrompt, setCanPrompt] = useState(canPromptInstall());
    const [hidden, setHidden] = useState(() => isInstalled() || dismissedRecently());

    useEffect(() => onInstallAvailabilityChange(() => setCanPrompt(canPromptInstall())), []);

    // Sur ordinateur, seulement quand le navigateur sait installer en un clic
    if (hidden || (!IS_ANDROID && !canPrompt)) return null;

    const dismiss = () => {
        try {
            localStorage.setItem(DISMISS_KEY, String(Date.now()));
        } catch {
            // navigation privée : la bannière reviendra
        }
        setHidden(true);
    };

    const install = async () => {
        if (await promptInstall()) setHidden(true);
    };

    return (
        <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none">
            <div className="max-w-2xl mx-auto pointer-events-auto bg-[#0A0A0A] text-white rounded-3xl p-3.5 pr-3 flex items-center gap-3 shadow-[0_12px_40px_rgba(0,0,0,0.25)] animate-in slide-in-from-bottom-4 fade-in duration-300">
                <img src="/pwa-192.png" alt="" className="w-12 h-12 rounded-[14px] shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="font-black text-[15px] leading-tight">Installe Sue sur ton écran d'accueil</p>
                    <p className="text-[13px] text-white/70 leading-snug mt-0.5">
                        {canPrompt
                            ? "Accès en un tap, comme une vraie app."
                            : <>Touche le menu <span className="font-bold text-white">⋮</span> puis <span className="font-bold text-white">Ajouter à l'écran d'accueil</span>.</>}
                    </p>
                </div>
                {canPrompt && (
                    <button onClick={install} className="h-10 px-4 rounded-full bg-[#D4FC79] text-black font-black text-sm shrink-0">
                        Installer
                    </button>
                )}
                <button onClick={dismiss} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center shrink-0" aria-label="Fermer">
                    <X className="w-4 h-4 text-white/70" />
                </button>
            </div>
        </div>
    );
}
