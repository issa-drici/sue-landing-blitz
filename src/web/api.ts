// Espace web Sue (Android et ordinateur) : appels au serveur et session de connexion.
// Même API et même compte que l'app mobile.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.sue.alliance-tech.fr";

const TOKEN_KEY = "sue_web_token";

export const getStoredToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};

export const storeToken = (token: string) => {
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch {
        // navigation privée : il faudra se reconnecter à la prochaine visite
    }
};

export const clearToken = () => {
    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch {
        // rien
    }
};

export class UnauthorizedError extends Error {}

// L'app n'existe que sur iPhone : l'espace web est réservé à Android et ordinateur
export const IS_IOS = typeof navigator !== "undefined"
    && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;

export const APP_STORE_URL = "https://apps.apple.com/fr/app/sue/id6749824461";

export async function apiFetch<T = unknown>(path: string, options: { method?: string; body?: unknown; auth?: boolean } = {}): Promise<T> {
    const { method = "GET", body, auth = true } = options;
    const headers: Record<string, string> = { Accept: "application/json", "Content-Type": "application/json" };
    const token = getStoredToken();
    if (auth && token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = await response.json().catch(() => ({}));

    if (response.status === 401 && auth) {
        clearToken();
        throw new UnauthorizedError("Reconnecte-toi pour continuer.");
    }
    if (!response.ok) {
        throw new Error(data?.error?.message || data?.message || "Une erreur est survenue, réessaie.");
    }
    return data as T;
}
