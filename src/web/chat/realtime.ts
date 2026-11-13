import Pusher, { Channel } from "pusher-js";
import { API_BASE_URL, getStoredToken } from "@/web/api";
import { ChatMessage } from "@/web/chat/types";

// Temps réel du chat (Soketi, mêmes canaux privés que l'app mobile) : nouveaux messages,
// « en train d'écrire » et lectures. Une seule connexion, partagée par les chats ouverts.

const PUSHER_KEY = import.meta.env.VITE_PUSHER_APP_KEY || "alarrache_app_key_2025_14f8f659";
const PUSHER_HOST = import.meta.env.VITE_PUSHER_HOST || "websocket.sue.alliance-tech.fr";
const PUSHER_PORT = Number(import.meta.env.VITE_PUSHER_PORT || 443);

export interface ChatRealtimeHandlers {
    onMessage: (message: ChatMessage) => void;
    onTyping: (userId: string, firstname: string) => void;
    onRead: (userId: string, lastReadMessageId: number) => void;
    /** Abonné (ou réabonné après une coupure) : l'appelant rattrape ce qu'il a pu manquer */
    onReady: () => void;
}

let pusher: Pusher | null = null;

function client(): Pusher {
    if (pusher) return pusher;
    pusher = new Pusher(PUSHER_KEY, {
        cluster: "mt1",
        wsHost: PUSHER_HOST,
        wsPort: PUSHER_PORT,
        wssPort: PUSHER_PORT,
        forceTLS: true,
        enabledTransports: ["ws", "wss"],
        disableStats: true,
        channelAuthorization: {
            endpoint: `${API_BASE_URL}/broadcasting/auth`,
            transport: "ajax",
            customHandler: async ({ socketId, channelName }, callback) => {
                try {
                    const response = await fetch(`${API_BASE_URL}/broadcasting/auth`, {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${getStoredToken() ?? ""}`,
                        },
                        body: JSON.stringify({ socket_id: socketId, channel_name: channelName }),
                    });
                    if (!response.ok) throw new Error(`Autorisation refusée (${response.status})`);
                    callback(null, await response.json());
                } catch (error) {
                    callback(error as Error, null);
                }
            },
        },
    });
    if (import.meta.env.DEV) (window as unknown as { __suePusher?: Pusher }).__suePusher = pusher;
    return pusher;
}

/** Identifiant de la connexion temps réel : le serveur n'y renvoie pas nos propres événements */
export const realtimeSocketId = (): string | undefined => pusher?.connection.socket_id || undefined;

/** Abonnement au chat d'une session ; renvoie de quoi se désabonner */
export function subscribeToChat(sessionId: string, handlers: ChatRealtimeHandlers): () => void {
    const pusherClient = client();
    const name = `private-session-chat.${sessionId}`;
    const channel: Channel = pusherClient.subscribe(name);

    const onReady = () => handlers.onReady();
    const onMessage = (data: { message?: ChatMessage }) => data?.message && handlers.onMessage(data.message);
    const onTyping = (data: { userId?: string; firstname?: string }) => data?.userId && handlers.onTyping(data.userId, data.firstname ?? "");
    const onRead = (data: { userId?: string; lastReadMessageId?: number }) =>
        data?.userId && handlers.onRead(data.userId, data.lastReadMessageId ?? 0);
    // Reconnexion après une coupure : rattrapage des messages manqués
    const onStateChange = ({ previous, current }: { previous: string; current: string }) => {
        if (current === "connected" && previous !== "connected" && previous !== "initialized") handlers.onReady();
    };

    channel.bind("pusher:subscription_succeeded", onReady);
    channel.bind("message.sent", onMessage);
    channel.bind("user.typing", onTyping);
    channel.bind("read.updated", onRead);
    pusherClient.connection.bind("state_change", onStateChange);

    return () => {
        channel.unbind("pusher:subscription_succeeded", onReady);
        channel.unbind("message.sent", onMessage);
        channel.unbind("user.typing", onTyping);
        channel.unbind("read.updated", onRead);
        pusherClient.connection.unbind("state_change", onStateChange);
        pusherClient.unsubscribe(name);
    };
}
