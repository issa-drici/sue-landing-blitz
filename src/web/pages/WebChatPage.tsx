import { KeyboardEvent, ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowDown, ArrowLeft, ArrowUp, Check, CheckCheck, Clock, Loader2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { apiFetch } from "@/web/api";
import { WebLayout } from "@/web/components/WebLayout";
import { mentionLabels, mentionQueryAt, mentionSuggestions, mentionsStillInText, seenBy, splitMentions, ticksFor } from "@/web/chat/logic";
import { ChatMember, DisplayMessage } from "@/web/chat/types";
import { useWebChat } from "@/web/chat/useWebChat";
import { formatRelativeDay, sportLabel } from "@/web/format";
import { WebSession, WebUser } from "@/web/types";

// Chat d'une session dans l'espace web (Android et ordinateur) : mêmes messages, mentions et
// accusés de lecture que l'app mobile.

const SEEN_BLUE = "#0A84FF";
const GROUP_GAP_MS = 3 * 60 * 1000;
const NEAR_BOTTOM_PX = 80;

const dayKey = (iso: string) => new Date(iso).toDateString();
const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const dayLabel = (iso: string) => {
    const date = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === yesterday.toDateString()) return "Hier";
    return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
};
const initials = (m?: ChatMember) => (m ? `${m.firstname.charAt(0)}${m.lastname.charAt(0)}`.toUpperCase() : "?");

function Avatar({ member, size = 28 }: { member?: ChatMember; size?: number }) {
    return member?.avatarUrl ? (
        <img src={member.avatarUrl} alt="" className="rounded-full object-cover bg-[#E9ECEF] shrink-0" style={{ width: size, height: size }} />
    ) : (
        <div className="rounded-full bg-[#E9ECEF] flex items-center justify-center font-bold text-[#0A0A0A] shrink-0" style={{ width: size, height: size, fontSize: size * 0.38 }}>
            {initials(member)}
        </div>
    );
}

function Ticks({ message, others, reads }: { message: DisplayMessage; others: ChatMember[]; reads: Record<string, number> }) {
    if (message.status === "failed") return null;
    const ticks = ticksFor(message.id, others, reads);
    if (ticks === "clock") return <Clock className="w-3 h-3 text-black/45" aria-label="En cours d'envoi" />;
    if (ticks === "seenAll") return <CheckCheck className="w-3.5 h-3.5" style={{ color: SEEN_BLUE }} aria-label="Lu par tous" />;
    return <Check className="w-3.5 h-3.5 text-black/45" aria-label="Envoyé" />;
}

function MessageBody({ message, labels, userId }: { message: DisplayMessage; labels: Map<string, string>; userId: string }) {
    return (
        <span className="whitespace-pre-wrap break-words">
            {splitMentions(message.body, message.mentions, labels).map((part, i) =>
                part.mentionId ? (
                    <span key={i} className={`font-bold ${part.mentionId === userId ? "bg-[#D4FC79]/60 rounded px-0.5" : ""}`}>{part.text}</span>
                ) : (
                    <span key={i}>{part.text}</span>
                )
            )}
        </span>
    );
}

function ChatScreen({ session, user }: { session: WebSession; user: WebUser }) {
    const chat = useWebChat(session.id, user.id, user.firstname);
    const members = useMemo(() => chat.meta?.members ?? [], [chat.meta]);
    const memberById = useMemo(() => new Map(members.map((m) => [m.id, m])), [members]);
    const labels = useMemo(() => mentionLabels(members), [members]);
    const others = useMemo(() => members.filter((m) => m.id !== user.id), [members, user.id]);
    const reads = chat.meta?.reads ?? {};

    // --- Défilement : en bas au départ, suit les nouveaux messages, garde sa place quand l'historique arrive
    const viewportRef = useRef<HTMLDivElement>(null);
    const [atBottom, setAtBottom] = useState(true);
    const [awayNew, setAwayNew] = useState(0);
    const snapshot = useRef({ height: 0, top: 0, first: "", last: "", count: 0 });

    const scrollToBottom = useCallback((smooth = false) => {
        const el = viewportRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    }, []);

    useLayoutEffect(() => {
        const el = viewportRef.current;
        if (!el) return;
        const prev = snapshot.current;
        const first = chat.messages[0]?.clientId ?? "";
        const last = chat.messages[chat.messages.length - 1];
        const lastId = last?.clientId ?? "";

        if (!prev.count && chat.messages.length) {
            scrollToBottom();
        } else if (prev.first && first !== prev.first && lastId === prev.last) {
            // Historique ajouté au-dessus : la même ligne reste sous les yeux
            el.scrollTop = prev.top + (el.scrollHeight - prev.height);
        } else if (lastId !== prev.last) {
            const wasNearBottom = prev.height - prev.top - el.clientHeight < NEAR_BOTTOM_PX;
            if (wasNearBottom || last?.senderId === user.id) scrollToBottom(true);
            else setAwayNew((n) => n + 1);
        }
        snapshot.current = { height: el.scrollHeight, top: el.scrollTop, first, last: lastId, count: chat.messages.length };
    }, [chat.messages, scrollToBottom, user.id]);

    const onScroll = () => {
        const el = viewportRef.current;
        if (!el) return;
        snapshot.current = { ...snapshot.current, height: el.scrollHeight, top: el.scrollTop };
        const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
        setAtBottom(bottom);
        if (bottom) setAwayNew(0);
        if (el.scrollTop < 300 && chat.hasOlder && !chat.loadingOlder) chat.loadOlder();
    };

    // Lu : quand le bas est affiché et l'onglet visible
    const { markRead } = chat;
    useEffect(() => {
        if (atBottom) markRead();
    }, [atBottom, chat.messages, markRead]);
    useEffect(() => {
        const onVisible = () => atBottom && markRead();
        document.addEventListener("visibilitychange", onVisible);
        return () => document.removeEventListener("visibilitychange", onVisible);
    }, [atBottom, markRead]);

    // --- Saisie et mentions
    const [text, setText] = useState("");
    const [cursor, setCursor] = useState(0);
    const mentionedRef = useRef(new Map<string, string>());
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const query = mentionQueryAt(text, cursor);
    const suggestions = query === null ? [] : mentionSuggestions(query, members, labels, user.id);

    useLayoutEffect(() => {
        const el = inputRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
        // Barre de défilement seulement au-delà de 5 lignes
        el.style.overflowY = el.scrollHeight > 132 ? "auto" : "hidden";
    }, [text]);

    const pickMention = (member: ChatMember) => {
        const label = labels.get(member.id) ?? member.firstname;
        const before = text.slice(0, cursor).replace(/@([^\s@]*)$/, `@${label} `);
        const next = before + text.slice(cursor);
        mentionedRef.current.set(member.id, label);
        setText(next);
        setCursor(before.length);
        requestAnimationFrame(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(before.length, before.length);
        });
    };

    const submit = () => {
        if (!text.trim()) return;
        chat.send(text, mentionsStillInText(text, mentionedRef.current));
        setText("");
        setCursor(0);
        mentionedRef.current = new Map();
        inputRef.current?.focus();
    };

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (suggestions.length && (e.key === "Enter" || e.key === "Tab")) {
            e.preventDefault();
            pickMention(suggestions[0]);
            return;
        }
        if (e.key === "Enter" && !e.shiftKey && !("ontouchstart" in window)) {
            e.preventDefault();
            submit();
        }
    };

    // --- « Vu par » d'un de mes messages
    const [seenFor, setSeenFor] = useState<DisplayMessage | null>(null);

    // --- Rendu des messages : jours, groupes, séparateur « Nouveaux messages »
    const rows: ReactNode[] = [];
    const firstUnreadId = useRef<number | null>(null);
    if (firstUnreadId.current === null && chat.meta) {
        const firstUnread = chat.messages.find((m) => m.id !== null && m.id > chat.meta!.lastReadMessageId && m.senderId !== user.id);
        firstUnreadId.current = firstUnread?.id ?? 0;
    }
    chat.messages.forEach((m, i) => {
        const prev = chat.messages[i - 1];
        const next = chat.messages[i + 1];
        const mine = m.senderId === user.id;
        if (!prev || dayKey(prev.createdAt) !== dayKey(m.createdAt)) {
            rows.push(
                <div key={`day-${m.clientId}`} className="flex justify-center my-3">
                    <span className="text-xs font-semibold text-[#6B7079] bg-[#EEF0F2] rounded-[10px] px-2.5 py-1 first-letter:uppercase">{dayLabel(m.createdAt)}</span>
                </div>
            );
        }
        if (firstUnreadId.current && m.id === firstUnreadId.current) {
            rows.push(
                <div key="unread" className="flex items-center gap-2 my-2.5">
                    <div className="flex-1 h-px bg-[#DCE7C2]" />
                    <span className="text-xs font-bold text-[#5C7F1F]">Nouveaux messages</span>
                    <div className="flex-1 h-px bg-[#DCE7C2]" />
                </div>
            );
        }
        const sameAsPrev = prev && prev.senderId === m.senderId && dayKey(prev.createdAt) === dayKey(m.createdAt)
            && new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() < GROUP_GAP_MS;
        const sameAsNext = next && next.senderId === m.senderId && dayKey(next.createdAt) === dayKey(m.createdAt)
            && new Date(next.createdAt).getTime() - new Date(m.createdAt).getTime() < GROUP_GAP_MS;
        const sender = memberById.get(m.senderId);

        rows.push(
            <div key={m.clientId} className={`flex items-end ${mine ? "justify-end pl-12" : "justify-start pr-12"} ${sameAsNext ? "mb-0.5" : "mb-2.5"}`}>
                {!mine && <div className="w-7 mr-1.5 shrink-0">{!sameAsNext && <Avatar member={sender} />}</div>}
                {mine && m.status === "failed" && (
                    <button onClick={() => chat.retry(m.clientId)} className="mr-1.5 mb-2 text-red-600" aria-label="Renvoyer">
                        <AlertCircle className="w-5 h-5" />
                    </button>
                )}
                <button
                    type="button"
                    disabled={!mine || m.id === null}
                    onClick={() => setSeenFor(m)}
                    className={[
                        "text-left max-w-full rounded-[18px] px-3 pt-[7px] pb-1.5 text-[16px] leading-[21px] text-[#0A0A0A]",
                        mine ? "bg-[#D4FC79]" : "bg-white border border-[#E3E6EA]",
                        mine && !sameAsNext ? "rounded-br-md" : "",
                        !mine && !sameAsNext ? "rounded-bl-md" : "",
                        m.status === "sending" ? "opacity-60" : "",
                        m.status === "failed" ? "!bg-[#FDECEC] border border-[#F5C2C4]" : "",
                        mine && m.id !== null ? "cursor-pointer active:scale-[0.98] transition-transform" : "cursor-default",
                    ].join(" ")}
                >
                    {!mine && !sameAsPrev && (
                        <div className="text-[13px] font-bold text-[#4B6B14] mb-0.5">
                            {sender?.firstname ?? m.senderFirstname ?? "?"}
                            {sender?.isOrganizer && <span className="ml-1.5 text-[11px] font-semibold text-[#6B7079]">organisateur</span>}
                        </div>
                    )}
                    <MessageBody message={m} labels={labels} userId={user.id} />
                    <span className="flex items-center justify-end gap-1 mt-0.5 text-[11px] text-black/50">
                        {m.status === "failed" ? "Non envoyé, touche pour réessayer" : timeLabel(m.createdAt)}
                        {mine && <Ticks message={m} others={others} reads={reads} />}
                    </span>
                </button>
            </div>
        );
    });

    const seenList = seenFor?.id ? seenBy(seenFor.id, others, reads) : [];
    const notSeen = others.filter((o) => !seenList.includes(o) && o.status !== "declined");

    return (
        <div className="fixed inset-0 flex flex-col bg-[#FAFAFA]">
            {/* En-tête */}
            <header className="flex items-center gap-3 px-3 h-16 border-b border-[#EFEFEF] bg-white/95 backdrop-blur shrink-0">
                <Link to={`/app/session/${session.id}`} className="w-10 h-10 rounded-full hover:bg-zinc-100 flex items-center justify-center" aria-label="Retour à la session">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <Link to={`/app/session/${session.id}`} className="flex-1 min-w-0 text-center pr-10">
                    <div className="font-black text-[17px] truncate">{sportLabel(session.sport)}</div>
                    <div className="text-xs text-[#6B7079] truncate">
                        {session.scheduling === "finding_slot" ? "Créneau à définir" : `${formatRelativeDay(session.date)} · ${session.startTime}`}
                        {members.length > 0 && ` · ${members.length} membres`}
                    </div>
                </Link>
            </header>

            {/* Messages */}
            <div className="relative flex-1 min-h-0">
                <div ref={viewportRef} onScroll={onScroll} className="h-full overflow-y-auto overscroll-contain px-3 py-3" role="log" aria-label="Messages">
                    <div className="max-w-2xl mx-auto flex flex-col min-h-full">
                        {chat.loadingOlder && <div className="flex justify-center py-3"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>}
                        {chat.loading ? (
                            <div className="flex-1 flex items-center justify-center"><Loader2 className="w-7 h-7 animate-spin text-slate-400" /></div>
                        ) : chat.error ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
                                <p className="font-bold text-lg">Discussion indisponible</p>
                                <p className="text-sm text-[#6B7079] mt-1">{chat.error}</p>
                            </div>
                        ) : chat.messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
                                <div className="text-4xl mb-2.5">💬</div>
                                <p className="font-bold text-lg">Lance la discussion</p>
                                <p className="text-sm text-[#6B7079] mt-1.5 leading-5">Qui ramène le ballon, on se retrouve où… Mentionne quelqu'un avec @.</p>
                            </div>
                        ) : (
                            <div className="mt-auto">{rows}</div>
                        )}
                        {chat.typingNames.length > 0 && (
                            <div className="flex items-center gap-2 mt-1 mb-1.5">
                                <div className="flex items-center gap-1 bg-white border border-[#E3E6EA] rounded-[18px] rounded-bl-md px-3.5 py-3">
                                    {[0, 1, 2].map((d) => (
                                        <span key={d} className="w-[7px] h-[7px] rounded-full bg-[#5B6270] animate-bounce" style={{ animationDelay: `${d * 150}ms` }} />
                                    ))}
                                </div>
                                <span className="text-[11px] text-[#6B7079]">
                                    {chat.typingNames.length === 1 ? `${chat.typingNames[0]} écrit…` : `${chat.typingNames.join(", ")} écrivent…`}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                {!atBottom && (
                    <button
                        onClick={() => scrollToBottom(true)}
                        className={`absolute right-3.5 bottom-3 h-10 min-w-10 rounded-full shadow-md flex items-center justify-center gap-1 ${awayNew ? "bg-[#D4FC79] pl-3.5 pr-2.5" : "bg-white"}`}
                        aria-label="Aller aux derniers messages"
                    >
                        {awayNew > 0 && <span className="text-[13px] font-bold">{awayNew}</span>}
                        <ArrowDown className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Suggestions de mention */}
            {suggestions.length > 0 && (
                <div className="bg-white border-t border-[#E6E8EB] py-1 shrink-0">
                    <div className="max-w-2xl mx-auto">
                        {suggestions.map((m) => (
                            <button key={m.id} onMouseDown={(e) => e.preventDefault()} onClick={() => pickMention(m)} className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-zinc-50 text-left">
                                <Avatar member={m} size={30} />
                                <span className="flex-1 font-semibold text-[15px]">{m.firstname} {m.lastname}</span>
                                {m.status === "declined" && <span className="text-xs text-[#6B7079]">ne vient pas</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Saisie */}
            <div className="bg-white border-t border-[#EFEFEF] px-2.5 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shrink-0">
                <div className="max-w-2xl mx-auto flex items-end gap-2">
                    <textarea
                        ref={inputRef}
                        value={text}
                        rows={1}
                        placeholder="Message"
                        onChange={(e) => {
                            setText(e.target.value);
                            setCursor(e.target.selectionStart ?? e.target.value.length);
                            if (e.target.value.trim()) chat.notifyTyping();
                        }}
                        onSelect={(e) => setCursor(e.currentTarget.selectionStart ?? 0)}
                        onKeyDown={onKeyDown}
                        className="flex-1 resize-none rounded-[20px] border border-[#E3E6EA] bg-[#FAFAFA] px-4 py-2.5 text-[16px] leading-[21px] outline-none focus:border-[#C9D3B0] max-h-[132px]"
                        aria-label="Écrire un message"
                    />
                    <button
                        onClick={submit}
                        disabled={!text.trim()}
                        className="w-[42px] h-[42px] rounded-full bg-[#0A0A0A] text-white flex items-center justify-center disabled:bg-[#EEF0F2] disabled:text-[#9AA0A6] transition-colors shrink-0"
                        aria-label="Envoyer"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Vu par */}
            <Drawer open={!!seenFor} onOpenChange={(open) => !open && setSeenFor(null)}>
                <DrawerContent className="px-5 pb-8">
                    <DrawerTitle className="sr-only">Vu par</DrawerTitle>
                    {seenFor && (
                        <div className="max-w-md mx-auto w-full pt-2">
                            <div className="bg-[#D4FC79] rounded-2xl px-3.5 py-2.5 ml-auto max-w-[85%] w-fit mb-4 text-[15px]">
                                <MessageBody message={seenFor} labels={labels} userId={user.id} />
                            </div>
                            <div className="flex items-center gap-1.5 mb-1.5 font-bold"><CheckCheck className="w-4 h-4" style={{ color: SEEN_BLUE }} /> Vu par</div>
                            {seenList.length === 0 ? <p className="text-sm text-[#6B7079] py-1.5">Personne pour l'instant</p> : seenList.map((m) => (
                                <div key={m.id} className="flex items-center gap-2.5 py-1.5"><Avatar member={m} size={32} /><span className="font-semibold">{m.firstname} {m.lastname}</span></div>
                            ))}
                            {notSeen.length > 0 && (
                                <>
                                    <div className="flex items-center gap-1.5 mt-4 mb-1.5 font-bold"><Check className="w-4 h-4 text-black/45" /> Pas encore vu</div>
                                    {notSeen.map((m) => (
                                        <div key={m.id} className="flex items-center gap-2.5 py-1.5"><Avatar member={m} size={32} /><span className="font-semibold">{m.firstname} {m.lastname}</span></div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}

function ChatLoader({ user }: { user: WebUser }) {
    const { id = "" } = useParams();
    const { data, isLoading, error } = useQuery({
        queryKey: ["web-session", id],
        queryFn: () => apiFetch<{ data: WebSession }>(`/sessions/${id}`),
    });
    if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
    if (error || !data?.data) {
        return <div className="text-center py-24"><p className="font-bold">Session introuvable</p><Link to="/app" className="text-sm underline mt-2 inline-block">Mes sessions</Link></div>;
    }
    return <ChatScreen session={data.data} user={user} />;
}

export default function WebChatPage() {
    return <WebLayout>{(user) => <ChatLoader user={user} />}</WebLayout>;
}
