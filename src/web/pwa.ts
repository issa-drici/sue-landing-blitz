// Installation de la version web (PWA). Chrome annonce très tôt qu'on peut installer le site
// (« beforeinstallprompt ») : on garde l'événement pour proposer l'installation au bon moment.

interface InstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredPrompt: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault(); // pas la mini-barre de Chrome : notre bannière l'explique mieux
        deferredPrompt = event as InstallPromptEvent;
        notify();
    });
    window.addEventListener("appinstalled", () => {
        deferredPrompt = null;
        notify();
    });
}

export const canPromptInstall = () => deferredPrompt !== null;

export const onInstallAvailabilityChange = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

/** Ouvre la fenêtre d'installation de Chrome ; vrai si l'utilisateur a accepté */
export async function promptInstall(): Promise<boolean> {
    if (!deferredPrompt) return false;
    const event = deferredPrompt;
    deferredPrompt = null;
    await event.prompt();
    const { outcome } = await event.userChoice;
    notify();
    return outcome === "accepted";
}

/** Déjà ouvert comme une app (depuis l'écran d'accueil) */
export const isInstalled = () =>
    typeof window !== "undefined"
    && (window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true);

export const IS_ANDROID = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
