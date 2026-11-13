import { apiFetch } from "@/web/api";
import { ChatMessage, ChatMeta, ChatPage } from "@/web/chat/types";
import { realtimeSocketId } from "@/web/chat/realtime";

// Appels du chat d'une session (mêmes routes que l'app mobile)

const base = (sessionId: string) => `/sessions/${sessionId}/chat`;
const data = async <T,>(promise: Promise<{ data: T }>) => (await promise).data;
const socketHeader = (): Record<string, string> => {
    const id = realtimeSocketId();
    return id ? { "X-Socket-ID": id } : {};
};

export const chatApi = {
    getMeta: (sessionId: string) => data(apiFetch<{ data: ChatMeta }>(base(sessionId))),
    getLatest: (sessionId: string) => data(apiFetch<{ data: ChatPage }>(`${base(sessionId)}/messages`)),
    getBefore: (sessionId: string, beforeId: number) =>
        data(apiFetch<{ data: ChatPage }>(`${base(sessionId)}/messages?before=${beforeId}`)),
    getAfter: (sessionId: string, afterId: number) =>
        data(apiFetch<{ data: ChatPage }>(`${base(sessionId)}/messages?after=${afterId}`)),
    send: (sessionId: string, clientId: string, body: string, mentions: string[]) =>
        data(apiFetch<{ data: ChatMessage }>(`${base(sessionId)}/messages`, { method: "POST", body: { clientId, body, mentions }, headers: socketHeader() })),
    markRead: (sessionId: string, messageId: number) =>
        apiFetch(`${base(sessionId)}/read`, { method: "POST", body: { messageId }, headers: socketHeader() }),
    typing: (sessionId: string) => apiFetch(`${base(sessionId)}/typing`, { method: "POST", headers: socketHeader() }),
};

/** Identifiant du message créé avant l'envoi : un renvoi après une coupure n'est pas dupliqué */
export const newClientId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
