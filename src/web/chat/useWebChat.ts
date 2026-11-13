import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chatApi, newClientId } from "@/web/chat/api";
import { subscribeToChat } from "@/web/chat/realtime";
import { ChatMessage, ChatMeta, DisplayMessage } from "@/web/chat/types";

// Chat d'une session dans l'espace web : mêmes règles que l'app mobile.
// La base est la référence : au chargement et à chaque reconnexion, on rattrape ce qui manque.

const TYPING_VISIBLE_MS = 5000;
const TYPING_SEND_INTERVAL_MS = 3000;

const toDisplay = (message: ChatMessage): DisplayMessage => ({ ...message, status: "sent" });

/** Fusionne des messages du serveur dans la liste (sans doublon, dans l'ordre) */
function merge(list: DisplayMessage[], incoming: ChatMessage[]): DisplayMessage[] {
    if (!incoming.length) return list;
    const byClientId = new Map(list.map((m) => [m.clientId, m]));
    incoming.forEach((m) => byClientId.set(m.clientId, toDisplay(m)));
    return Array.from(byClientId.values()).sort((a, b) => {
        // Les messages en cours d'envoi restent à la fin, dans leur ordre d'écriture
        if (a.id === null && b.id === null) return a.createdAt.localeCompare(b.createdAt);
        if (a.id === null) return 1;
        if (b.id === null) return -1;
        return a.id - b.id;
    });
}

export function useWebChat(sessionId: string, userId: string, firstname: string) {
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [meta, setMeta] = useState<ChatMeta | null>(null);
    const [hasOlder, setHasOlder] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [typing, setTyping] = useState<Record<string, { firstname: string; until: number }>>({});
    const [, setTick] = useState(0);

    const lastIdRef = useRef(0);
    const lastReadSentRef = useRef(0);
    const lastTypingSentRef = useRef(0);

    useEffect(() => {
        const last = [...messages].reverse().find((m) => m.id !== null);
        lastIdRef.current = last?.id ?? lastIdRef.current;
    }, [messages]);

    const catchUp = useCallback(async () => {
        try {
            let after = lastIdRef.current;
            // Rattrapage par pages tant que le serveur en a d'autres
            for (let i = 0; i < 10; i++) {
                const page = after ? await chatApi.getAfter(sessionId, after) : await chatApi.getLatest(sessionId);
                setMessages((prev) => merge(prev, page.messages));
                if (!after) setHasOlder(page.hasMore);
                const newest = page.messages[page.messages.length - 1];
                if (!after || !page.hasMore || !newest) break;
                after = newest.id;
            }
            setMeta(await chatApi.getMeta(sessionId));
        } catch {
            // Le prochain rattrapage (reconnexion) reprendra
        }
    }, [sessionId]);

    // Chargement initial + temps réel
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        Promise.all([chatApi.getMeta(sessionId), chatApi.getLatest(sessionId)])
            .then(([m, page]) => {
                if (cancelled) return;
                setMeta(m);
                setMessages(page.messages.map(toDisplay));
                setHasOlder(page.hasMore);
                lastReadSentRef.current = m.lastReadMessageId;
            })
            .catch((e: Error) => !cancelled && setError(e.message))
            .finally(() => !cancelled && setLoading(false));

        const unsubscribe = subscribeToChat(sessionId, {
            onMessage: (message) => {
                setMessages((prev) => merge(prev, [message]));
                setTyping((prev) => {
                    if (!prev[message.senderId]) return prev;
                    const next = { ...prev };
                    delete next[message.senderId];
                    return next;
                });
            },
            onTyping: (typingUserId, typingFirstname) => {
                if (typingUserId === userId) return;
                setTyping((prev) => ({ ...prev, [typingUserId]: { firstname: typingFirstname, until: Date.now() + TYPING_VISIBLE_MS } }));
            },
            onRead: (readerId, lastReadMessageId) => {
                setMeta((prev) => prev && ({ ...prev, reads: { ...prev.reads, [readerId]: Math.max(prev.reads[readerId] ?? 0, lastReadMessageId) } }));
            },
            onReady: () => {
                if (lastIdRef.current) catchUp();
            },
        });

        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, [sessionId, userId, catchUp]);

    // Les « en train d'écrire » disparaissent d'eux-mêmes
    useEffect(() => {
        const timer = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const loadOlder = useCallback(async () => {
        const oldest = messages.find((m) => m.id !== null);
        if (!oldest?.id || loadingOlder || !hasOlder) return;
        setLoadingOlder(true);
        try {
            const page = await chatApi.getBefore(sessionId, oldest.id);
            setMessages((prev) => merge(prev, page.messages));
            setHasOlder(page.hasMore);
        } finally {
            setLoadingOlder(false);
        }
    }, [messages, loadingOlder, hasOlder, sessionId]);

    const deliver = useCallback(async (message: DisplayMessage) => {
        try {
            const saved = await chatApi.send(sessionId, message.clientId, message.body, message.mentions);
            setMessages((prev) => merge(prev, [saved]));
        } catch {
            setMessages((prev) => prev.map((m) => (m.clientId === message.clientId && m.id === null ? { ...m, status: "failed" } : m)));
        }
    }, [sessionId]);

    const send = useCallback((body: string, mentions: string[]) => {
        const text = body.trim();
        if (!text) return;
        const message: DisplayMessage = {
            id: null,
            clientId: newClientId(),
            sessionId,
            senderId: userId,
            senderFirstname: firstname,
            body: text,
            mentions,
            createdAt: new Date().toISOString(),
            status: "sending",
        };
        setMessages((prev) => [...prev, message]);
        deliver(message);
    }, [sessionId, userId, firstname, deliver]);

    const retry = useCallback((clientId: string) => {
        const message = messages.find((m) => m.clientId === clientId && m.id === null);
        if (!message) return;
        setMessages((prev) => prev.map((m) => (m.clientId === clientId ? { ...m, status: "sending" } : m)));
        deliver({ ...message, status: "sending" });
    }, [messages, deliver]);

    /** Marque lu jusqu'au dernier message affiché (onglet visible) */
    const markRead = useCallback(() => {
        const last = lastIdRef.current;
        if (!last || last <= lastReadSentRef.current || document.visibilityState !== "visible") return;
        lastReadSentRef.current = last;
        setMeta((prev) => prev && ({ ...prev, lastReadMessageId: last, unreadCount: 0, reads: { ...prev.reads, [userId]: last } }));
        chatApi.markRead(sessionId, last).catch(() => {
            lastReadSentRef.current = 0;
        });
    }, [sessionId, userId]);

    const notifyTyping = useCallback(() => {
        const now = Date.now();
        if (now - lastTypingSentRef.current < TYPING_SEND_INTERVAL_MS) return;
        lastTypingSentRef.current = now;
        chatApi.typing(sessionId).catch(() => {});
    }, [sessionId]);

    const typingNames = useMemo(
        () => Object.entries(typing).filter(([, t]) => t.until > Date.now()).map(([, t]) => t.firstname),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [typing, Date.now() / 1000 | 0]
    );

    return { messages, meta, hasOlder, loading, loadingOlder, error, typingNames, loadOlder, send, retry, markRead, notifyTyping };
}
