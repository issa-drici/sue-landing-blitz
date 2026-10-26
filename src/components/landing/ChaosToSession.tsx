import { useEffect, useRef, useState } from "react";
import { ChevronDown, Users } from "lucide-react";
import { AppStoreButton } from "@/components/landing/AppStoreButton";
import { SessionCard } from "@/components/landing/SueUi";

// Haut de page : un fil de groupe en plein bazar qui, au scroll, s'aspire dans une seule
// session Sue (section épinglée). Les messages sont des exemples.

interface Bubble {
    from?: string;
    text: string;
    x: number; // position dans la scène, en % (centre de la bulle)
    y: number;
    rotate: number;
    mine?: boolean;
}

const BUBBLES: Bubble[] = [
    { from: "Thomas", text: "Qui vient mardi ?? ⚽", x: 26, y: 24, rotate: -4 },
    { from: "Lucas", text: "1. Thomas\n2. Lucas\n3.\n4.", x: 70, y: 22, rotate: 5 },
    { from: "Karim", text: "jsp encore je vous dis", x: 14, y: 37, rotate: 3 },
    { from: "Léo", text: "moi peut-être", x: 52, y: 33, rotate: -7 },
    { text: "Vous êtes combien au final ?", x: 82, y: 39, rotate: -3, mine: true },
    { from: "Camille", text: "1. Thomas\n2. Lucas\n3. Camille\n4.", x: 36, y: 50, rotate: -6 },
    { from: "Yanis", text: "C'est quel jour déjà ?", x: 74, y: 52, rotate: 4 },
    { from: "Chloé", text: "1. Thomas\n2. Lucas\n3. Camille\n4. Chloé", x: 6, y: 58, rotate: 6 },
    { from: "Hugo", text: "@Nathan t'as vu mon message ?", x: 30, y: 67, rotate: 5 },
    { from: "Sarah", text: "Désolée je peux plus 😕", x: 70, y: 66, rotate: -5 },
    { from: "Julien", text: "on joue où ?", x: 94, y: 74, rotate: 7 },
    { from: "Inès", text: "On est 3 ??", x: 46, y: 80, rotate: 2 },
    { from: "Lucas", text: "Je relance en privé…", x: 80, y: 86, rotate: -2 },
    { from: "Karim", text: "ah c'était mardi ?", x: 16, y: 90, rotate: -4 },
];

const GROUPS = [
    { name: "Foot du mardi ⚽", members: "14 membres", unread: 128, x: 30, y: 8, rotate: -5 },
    { name: "Padel jeudi 🎾", members: "6 membres", unread: 37, x: 72, y: 7, rotate: 6 },
];

const SENDER_COLORS: Record<string, string> = {
    Thomas: "#2E7D32", Lucas: "#6A1B9A", Karim: "#C62828", Camille: "#AD1457",
    Yanis: "#1565C0", Hugo: "#EF6C00", Sarah: "#00838F", Inès: "#4527A0",
    Léo: "#5D4037", Chloé: "#00695C", Julien: "#283593",
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function useReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(query.matches);
        const onChange = () => setReduced(query.matches);
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);
    return reduced;
}

/** Avancement du scroll dans la section épinglée (0 en haut, 1 quand elle se termine) */
function useScrollProgress(ref: React.RefObject<HTMLElement>, enabled: boolean) {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        if (!enabled) return;
        let frame = 0;
        const update = () => {
            frame = 0;
            const el = ref.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const distance = el.offsetHeight - window.innerHeight;
            setProgress(distance > 0 ? clamp(-rect.top / distance) : 0);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [ref, enabled]);
    return progress;
}

function ChatBubble({ bubble }: { bubble: Bubble }) {
    return (
        <div
            className={`max-w-[210px] rounded-[20px] px-3.5 py-2.5 text-[14px] leading-snug shadow-[0_10px_24px_-14px_rgba(10,10,10,0.45)] whitespace-pre-line ${bubble.mine ? "bg-[#0A0A0A] text-white rounded-br-[6px]" : "bg-white text-[#1C1C1E] rounded-bl-[6px]"}`}
        >
            {bubble.from && (
                <span className="block text-[12px] font-bold mb-0.5" style={{ color: SENDER_COLORS[bubble.from] }}>
                    {bubble.from}
                </span>
            )}
            {bubble.text}
        </div>
    );
}

function GroupHeader({ group, unread }: { group: (typeof GROUPS)[number]; unread: number }) {
    return (
        <div className="flex items-center gap-2.5 rounded-[18px] bg-white/95 pl-2 pr-3 py-2 shadow-[0_12px_28px_-16px_rgba(10,10,10,0.4)]">
            <span className="w-9 h-9 rounded-full bg-[#E4E4E8] flex items-center justify-center text-[#6B6B70]"><Users className="w-[18px] h-[18px]" /></span>
            <span className="leading-tight">
                <span className="block text-[13px] font-bold text-[#1C1C1E]">{group.name}</span>
                <span className="block text-[11px] text-[#6B6B70]">{group.members}</span>
            </span>
            {unread > 0 && (
                <span className="ml-1 min-w-[26px] h-[22px] rounded-full bg-[#FF3B30] px-1.5 text-[11px] font-bold text-white flex items-center justify-center tabular-nums">
                    {unread}
                </span>
            )}
        </div>
    );
}

/** La scène : bulles en bazar (t = 0) aspirées vers la carte de session (t = 1) */
function Stage({ progress }: { progress: number }) {
    // Les bulles sont dessinées pour une scène de 560 px : on les réduit sur les scènes plus étroites
    const stageRef = useRef<HTMLDivElement>(null);
    const [fit, setFit] = useState(1);
    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => setFit(Math.min(1, Math.max(0.6, entry.contentRect.width / 560))));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const collapse = easeInOut(clamp((progress - 0.12) / 0.42));
    const cardIn = easeOut(clamp((progress - 0.42) / 0.22));
    const filled = Math.round(3 + 6 * easeOut(clamp((progress - 0.58) / 0.3)));

    return (
        <div ref={stageRef} className="relative w-full h-full">
            {/* Groupes et bulles : ils convergent vers le centre en rapetissant */}
            {[...GROUPS.map((group, i) => ({ kind: "group" as const, group, i })), ...BUBBLES.map((bubble, i) => ({ kind: "bubble" as const, bubble, i }))].map((item) => {
                const x = item.kind === "group" ? item.group.x : item.bubble.x;
                const y = item.kind === "group" ? item.group.y : item.bubble.y;
                const rotate = item.kind === "group" ? item.group.rotate : item.bubble.rotate;
                // Chaque élément part avec un léger décalage : l'aspiration se lit comme un mouvement de foule
                const delay = (item.i % 5) * 0.04;
                const t = clamp((collapse - delay) / (1 - delay));
                const dx = (50 - x) * t;
                const dy = (50 - y) * t;
                return (
                    <div
                        key={`${item.kind}-${item.i}`}
                        className="absolute w-max will-change-transform"
                        style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: `translate(-50%, -50%) translate(${dx}cqw, ${dy}cqh) rotate(${rotate * (1 - t)}deg) scale(${fit * (1 - 0.75 * t)})`,
                            opacity: 1 - clamp((t - 0.55) / 0.45),
                            filter: t > 0.05 ? `blur(${t * 6}px)` : undefined,
                            zIndex: item.kind === "group" ? 2 : 1,
                        }}
                    >
                        {item.kind === "group" ? (
                            <GroupHeader group={item.group} unread={Math.round(item.group.unread * (1 - collapse))} />
                        ) : (
                            <ChatBubble bubble={item.bubble} />
                        )}
                    </div>
                );
            })}

            {/* La session Sue qui naît du bazar */}
            <div
                className="absolute left-1/2 top-1/2 z-10"
                style={{
                    transform: `translate(-50%, -50%) translateY(${(1 - cardIn) * 40}px) scale(${0.82 + 0.18 * cardIn})`,
                    opacity: cardIn,
                    pointerEvents: cardIn > 0.5 ? "auto" : "none",
                }}
            >
                <SessionCard filled={filled} total={10} className="lg:scale-[1.14] origin-center" />
            </div>
        </div>
    );
}

export function ChaosToSession() {
    const sectionRef = useRef<HTMLElement>(null);
    const reducedMotion = useReducedMotion();
    const progress = useScrollProgress(sectionRef, !reducedMotion);
    const isSueSide = progress > 0.45;

    const copy = (
        <div className="relative z-20 flex flex-col items-start">
            <h1 className="font-outfit font-black text-[#0A0A0A] text-[clamp(3rem,7.4vw,6rem)] leading-[0.92] tracking-[-0.04em] [text-wrap:balance]">
                Fini les groupes{" "}
                <span className="relative inline-block">
                    WhatsApp
                    {/* Coup de feutre volt qui barre le mot */}
                    <svg aria-hidden="true" viewBox="0 0 300 30" preserveAspectRatio="none" className="pointer-events-none absolute left-[-4%] top-[40%] w-[108%] h-[0.3em] -translate-y-1/2 -rotate-2">
                        <path d="M5 17 C 80 11, 190 20, 295 13" stroke="#D4FC79" strokeWidth="18" strokeLinecap="round" fill="none" pathLength={1} className="[stroke-dasharray:1_2] [stroke-dashoffset:1] animate-[strike_0.7s_cubic-bezier(0.22,1,0.36,1)_0.35s_forwards] motion-reduce:animate-none motion-reduce:[stroke-dashoffset:0]" />
                    </svg>
                </span>
                .
            </h1>
            <p className="mt-6 max-w-[34rem] font-outfit font-medium text-[clamp(1.1rem,1.6vw,1.35rem)] leading-relaxed text-[#3A3A3C]">
                Crée ta session de sport en 30 secondes, partage le lien et vois enfin qui vient.
                Foot, padel, running, muscu… 48 sports, une seule appli.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <AppStoreButton />
                <span className="font-outfit text-[15px] font-semibold text-[#55555A]">Gratuit · sur iPhone</span>
            </div>
            {/* Ce que la scène montre, dit en une ligne : le bazar, puis Sue */}
            <p aria-live="polite" className="mt-10 hidden lg:flex items-center gap-2.5 font-outfit text-[17px] font-semibold text-[#0A0A0A]">
                <span className={`inline-block w-2.5 h-2.5 rounded-full transition-colors duration-500 ${isSueSide ? "bg-[#8CBF3D]" : "bg-[#FF3B30]"}`} />
                {isSueSide ? "Avec Sue : une session, tout le monde voit qui vient." : "2 groupes, 165 messages… et toujours pas de liste."}
            </p>
        </div>
    );

    // Animations réduites : le bazar puis la session, l'un sous l'autre, sans épinglage
    if (reducedMotion) {
        return (
            <section className="px-5 sm:px-8 pt-8 pb-16">
                <div className="mx-auto max-w-[1240px] grid gap-12 lg:grid-cols-[1.05fr_1fr] items-center">
                    {copy}
                    <div className="relative h-[480px] rounded-[40px] bg-[#ECECEF] overflow-hidden [container-type:size]">
                        <Stage progress={0} />
                    </div>
                </div>
                <div className="mx-auto max-w-[1240px] mt-12 flex flex-col items-center gap-5">
                    <p className="font-outfit text-[19px] font-semibold">Avec Sue : une session, tout le monde voit qui vient.</p>
                    <SessionCard />
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} className="relative h-[240vh]" aria-label="Fini les groupes WhatsApp">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
                <div className="mx-auto max-w-[1240px] h-full px-5 sm:px-8 pt-24 pb-6 lg:pt-20 grid grid-rows-[auto_1fr] lg:grid-rows-1 lg:grid-cols-[1.05fr_1fr] lg:items-center gap-6 lg:gap-10">
                    {copy}
                    <div className="relative h-full min-h-[340px] lg:h-[min(640px,78svh)] [container-type:size]">
                        <div className="absolute inset-0 rounded-[40px] bg-[#ECECEF]" style={{ opacity: 1 - easeOut(clamp((progress - 0.35) / 0.3)) }} />
                        {/* Le bazar déborde du panneau ; la carte finale tient dedans */}
                        <div className="absolute inset-0 rounded-[40px] overflow-hidden" style={{ overflow: progress > 0.5 ? "visible" : undefined }}>
                            <Stage progress={progress} />
                        </div>
                    </div>
                </div>
                <div
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 font-outfit text-[13px] font-semibold text-[#55555A] transition-opacity duration-300"
                    style={{ opacity: progress < 0.05 ? 1 : 0 }}
                >
                    Fais défiler <ChevronDown className="w-4 h-4" />
                </div>
            </div>
        </section>
    );
}
