import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Loader2,
    AlertCircle,
    Calendar,
    Clock,
    MapPin,
    User,
    Gift,
    Timer,
    ShieldCheck,
    ArrowRight,
    Lock,
    Zap
} from "lucide-react";

// Configuration API (identique au reste de la landing, cf. PasswordReset.tsx)
const API_BASE_URL = "https://api.sue.alliance-tech.fr";

// Lien App Store (identique au bouton de téléchargement de la home, cf. Index.tsx)
const APP_STORE_URL = "https://apps.apple.com/fr/app/sue/id6749824461";
const PLAY_STORE_URL =
    "https://play.google.com/store/apps/details?id=com.alliancetech.com";

interface Participant {
    fullName: string;
    status: string;
    avatarUrl: string | null;
    isOrganizer: boolean;
}

interface SessionPreview {
    sport: string;
    sportName: string;
    date: string; // Y-m-d
    startTime: string; // H:i
    endTime: string; // H:i
    location: string;
    maxParticipants: number | null;
    participantsCount: number;
    organizer: {
        fullName: string;
        avatarUrl: string | null;
    };
    participants?: Participant[];
}

// Mapping des sports vers leurs emojis correspondants (identique à l'app mobile)
const SPORT_EMOJIS: Record<string, string> = {
    tennis: '🎾',
    golf: '⛳',
    musculation: '💪',
    football: '⚽',
    basketball: '🏀',
    volleyball: '🏐',
    badminton: '🏸',
    padel: '🎾',
    squash: '🏓',
    natation: '🏊',
    course: '🏃',
    cyclisme: '🚴',
    escalade: '🧗',
    yoga: '🧘',
    pilates: '🤸',
    boxe: '🥊',
    'jiu-jitsu-brésilien': '🥋',
    danse: '💃',
    handball: '🤾',
    rugby: '🏉',
    hockey: '🏒',
    baseball: '⚾',
    'ping-pong': '🏓',
    bowling: '🎳',
    pétanque: '🥎',
    randonnée: '🥾',
    ski: '⛷️',
    snowboard: '🏂',
    surf: '🏄',
    'planche-à-voile': '🏄‍♂️',
    kayak: '🛶',
    aviron: '🚣',
    équitation: '🐎',
    gymnastique: '🤸',
    athlétisme: '🏃‍♂️',
    triathlon: '🏊‍♂️',
    pêche: '🎣',
    aïkido: '🥋',
    judo: '🥋',
    karaté: '🥋',
    'tir-à-l-arc': '🏹',
    skateboard: '🛹',
    'stand-up-paddle': '🏄‍♂️',
    bodyboard: '🏄',
    'marche-nordique': '🥾',
    'marche-sportive': '🚶‍♂️',
    aquafitness: '🏊‍♀️',
    'sauvetage-sportif': '🛟',
};

function getSportEmoji(sport: string): string {
    const normalized = (sport || '').toLowerCase().trim();
    return SPORT_EMOJIS[normalized] || '🏃';
}

// Formate "2026-07-12" en "Lundi 12 Juillet 2026"
function formatFrenchDate(isoDate: string): string {
    try {
        const [year, month, day] = isoDate.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        const parts = date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        // Capitaliser le jour et le mois (ex: Lundi 6 Juillet 2026)
        return parts.split(' ').map((word, index) => {
            if (index === 0 || index === 2) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
        }).join(' ');
    } catch {
        return isoDate;
    }
}

// Formatage de l'heure en français (ex: "18:00 - 19:00")
function formatSessionTimeRange(start?: string, end?: string) {
    const formatTime = (timeStr?: string) => {
        if (!timeStr) return '00:00';
        return timeStr.slice(0, 5);
    };
    return `${formatTime(start)} – ${formatTime(end)}`;
}

const Join = () => {
    const { token } = useParams<{ token: string }>();

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [session, setSession] = useState<SessionPreview | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function resolveToken() {
            if (!token) {
                setIsError(true);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/join/${token}`, {
                    headers: { Accept: "application/json" },
                });
                const data = await response.json();

                if (cancelled) return;

                if (response.ok && data.success) {
                    setSession(data.data as SessionPreview);
                } else {
                    setIsError(true);
                }
            } catch (error) {
                if (!cancelled) setIsError(true);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        resolveToken();

        return () => {
            cancelled = true;
        };
    }, [token]);

    const handleDownload = () => {
        const userAgent =
            navigator.userAgent || navigator.vendor || (window as any).opera;
        if (/android/i.test(userAgent)) {
            window.open(PLAY_STORE_URL, "_blank");
        } else {
            window.open(APP_STORE_URL, "_blank");
        }
    };

    const handleOpenApp = () => {
        const userAgent =
            navigator.userAgent || navigator.vendor || (window as any).opera;
        const isIOS =
            /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

        if (!isIOS) {
            handleDownload();
            return;
        }

        const start = Date.now();

        const fallback = window.setTimeout(() => {
            if (!document.hidden && Date.now() - start < 2500) {
                window.location.href = APP_STORE_URL;
            }
        }, 1800);

        const onVisibilityChange = () => {
            if (document.hidden) {
                window.clearTimeout(fallback);
                document.removeEventListener("visibilitychange", onVisibilityChange);
            }
        };
        document.addEventListener("visibilitychange", onVisibilityChange);

        window.location.href = `sue://join/${token}`;
    };

    const getInitials = (name: string): string => {
        if (!name) return "";
        const parts = name.split(' ');
        const initials = parts.map(p => p.charAt(0)).join('').toUpperCase();
        return initials.slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (isError || !session) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans">
                <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#EFEFEF] shadow-2xl text-center">
                    <div className="flex justify-center mb-6">
                        <AlertCircle className="w-14 h-14 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter mb-4">
                        Lien indisponible
                    </h1>
                    <p className="text-sm text-slate-500 mb-6">
                        Ce lien de session n'est plus valide. Il a peut-être expiré ou la
                        session n'existe plus.
                    </p>
                    <button
                        onClick={handleDownload}
                        className="w-full bg-[#D4FC79] hover:bg-[#c9f662] text-black font-black italic uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
                    >
                        Télécharger l'app
                    </button>
                </div>
            </div>
        );
    }

    const organizerFirstName = session.organizer.fullName.split(' ')[0] || "L'organisateur";
    
    // Détection du rôle en français
    const isFemale = organizerFirstName.toLowerCase().endsWith('a') || organizerFirstName.toLowerCase().endsWith('e');
    const organizerRole = isFemale ? 'Organisatrice' : 'Organisateur';


    // Extraction des participants confirmés (en excluant l'organisateur)
    const confirmedParticipants = (session.participants || [])
        .filter(p => !p.isOrganizer)
        .filter(p => p.status === 'accepted');

    // On n'affiche que les 2 premiers autres confirmés
    const otherShown = confirmedParticipants.slice(0, 2);

    // Calcul du nombre de participants supplémentaires (si total > organisateur (1) + affichés)
    const extraCount = Math.max(0, session.participantsCount - 1 - otherShown.length);

    // Rendu d'avatar intelligent (photo de profil ou initiales)
    const renderParticipantAvatar = (
        avatarUrl: string | null | undefined, 
        name: string, 
        sizeClass: string = "w-11 h-11 text-xs font-extrabold"
    ) => {
        const initials = getInitials(name);
        
        if (avatarUrl) {
            return (
                <img 
                    src={avatarUrl} 
                    alt={name} 
                    className={`${sizeClass} rounded-full object-cover shadow-sm bg-white`} 
                />
            );
        } else {
            return (
                <div className={`${sizeClass} rounded-full shadow-sm flex items-center justify-center uppercase bg-[#F2F9EB] text-[#70A831]`}>
                    {initials}
                </div>
            );
        }
    };


    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-0 sm:p-6 md:p-8 font-sans relative overflow-x-hidden">
            {/* Effet de lueur verte volt en arrière-plan sur desktop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4FC79]/10 blur-[150px] rounded-full pointer-events-none hidden sm:block" />
            
            {/* Conteneur principal (Pleinement responsive, carte centrée sur desktop, plein écran sur mobile) */}
            <div className="w-full sm:max-w-md bg-[#FAFAFA] sm:rounded-[32px] sm:shadow-2xl border-0 sm:border sm:border-[#EFEFEF] overflow-hidden flex flex-col justify-between p-6 pb-8 min-h-screen sm:min-h-0">
                
                {/* Contenu principal */}
                <div className="flex-1 flex flex-col gap-4">
                    
                    {/* Header Logo (Adaptive Icon) */}
                    <div className="flex justify-center select-none flex-shrink-0 my-1">
                        <img 
                            src="/adaptive-icon.png" 
                            alt="SUE Logo" 
                            className="w-12 h-12 object-contain rounded-2xl shadow-sm border border-[#EFEFEF]" 
                        />
                    </div>

                    {/* Organizer Avatar & Volt Decoration Rays */}
                    <div className="flex flex-col items-center flex-shrink-0">
                        <div className="relative flex items-center justify-center">
                            
                            {/* Rayons Décoratifs Gauche (Garantis sans chevauchement avec calc) */}
                            <div className="absolute right-[calc(100%+16px)] top-1/2 -translate-y-1/2 flex flex-col gap-1.5 items-end pointer-events-none">
                                <div className="w-3 h-0.5 bg-[#D4FC79] rounded-full -rotate-[25deg] transform origin-right"></div>
                                <div className="w-3.5 h-0.5 bg-[#D4FC79] rounded-full"></div>
                                <div className="w-3 h-0.5 bg-[#D4FC79] rounded-full rotate-[25deg] transform origin-right"></div>
                            </div>
                            
                            {/* Avatar Organisateur (Résout le problème de l'avatar bizarre/trop petit) */}
                            <div className="relative w-[76px] h-[76px] rounded-full border-[3px] border-[#D4FC79] p-0.5 overflow-hidden bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                {renderParticipantAvatar(
                                    session.organizer.avatarUrl, 
                                    session.organizer.fullName, 
                                    "w-full h-full text-2xl font-black"
                                )}
                            </div>
                            
                            {/* Rayons Décoratifs Droite (Garantis sans chevauchement avec calc) */}
                            <div className="absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 flex flex-col gap-1.5 items-start pointer-events-none">
                                <div className="w-3.5 h-0.5 bg-[#D4FC79] rounded-full rotate-[25deg] transform origin-left"></div>
                                <div className="w-4 h-0.5 bg-[#D4FC79] rounded-full"></div>
                                <div className="w-3.5 h-0.5 bg-[#D4FC79] rounded-full -rotate-[25deg] transform origin-left"></div>
                            </div>
                        </div>

                        {/* Title text */}
                        <h2 className="text-2xl font-black tracking-tight text-neutral-900 text-center leading-[1.1] mt-3">
                            <span className="text-[#BCEE21]">{organizerFirstName}</span> t'invite
                            <br />
                            à rejoindre cette session
                        </h2>

                        {/* Sport name */}
                        <div className="text-xl font-black italic uppercase text-slate-900 tracking-tight flex items-center justify-center gap-1.5 mt-2 select-none">
                            <span>{getSportEmoji(session.sport)}</span>
                            <span>{session.sportName}</span>
                        </div>
                    </div>

                    {/* Event details list */}
                    <div className="flex flex-col w-full border-t border-[#EFEFEF] mt-1">
                        {/* Date */}
                        <div className="flex items-center gap-3.5 py-2.5 border-b border-[#EFEFEF]">
                            <div className="text-[#8CBF3D] flex-shrink-0">
                                <Calendar className="w-5 h-5" strokeWidth={2.2} />
                            </div>
                            <div className="text-slate-800 font-semibold text-sm">
                                {formatFrenchDate(session.date)}
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-3.5 py-2.5 border-b border-[#EFEFEF]">
                            <div className="text-[#8CBF3D] flex-shrink-0">
                                <Clock className="w-5 h-5" strokeWidth={2.2} />
                            </div>
                            <div className="text-slate-800 font-semibold text-sm">
                                {formatSessionTimeRange(session.startTime, session.endTime)}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-3.5 py-2.5 border-b border-[#EFEFEF]">
                            <div className="text-[#8CBF3D] flex-shrink-0">
                                <MapPin className="w-5 h-5" strokeWidth={2.2} />
                            </div>
                            <div className="text-slate-800 font-semibold text-sm truncate">
                                {session.location}
                            </div>
                        </div>

                        {/* Organizer Name */}
                        <div className="flex items-center gap-3.5 py-2.5 border-b border-[#EFEFEF]">
                            <div className="text-[#8CBF3D] flex-shrink-0">
                                <User className="w-5 h-5" strokeWidth={2.2} />
                            </div>
                            <div className="text-slate-800 font-semibold text-sm">
                                Organisé par {session.organizer.fullName}
                            </div>
                        </div>
                    </div>

                    {/* Participants Card */}
                    <div className="bg-white rounded-3xl p-4 py-3 border border-[#EFEFEF] shadow-[0_4px_24px_rgba(0,0,0,0.015)] w-full my-1">
                        <div className="text-[10px] font-black tracking-wider text-slate-400 uppercase mb-3 text-center sm:text-left">
                            PARTICIPANTS
                        </div>
                        <div className="flex flex-wrap items-start justify-center gap-x-5 gap-y-3">
                            {/* Organizer */}
                            <div className="flex flex-col items-center min-w-[52px]">
                                {renderParticipantAvatar(session.organizer.avatarUrl, session.organizer.fullName, "w-11 h-11 text-xs font-extrabold")}
                                <span className="text-slate-800 font-bold text-[10px] mt-1.5 truncate max-w-[64px] text-center">
                                    {organizerFirstName}
                                </span>
                                <span className="bg-[#F5FCD2] text-[#8CA825] border border-[#E5F2A8] text-[8px] font-extrabold px-1.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wide">
                                    {organizerRole}
                                </span>
                            </div>
                            
                            {/* Confirmed participants shown */}
                            {otherShown.map((p, index) => (
                                <div key={index} className="flex flex-col items-center min-w-[52px]">
                                    {renderParticipantAvatar(p.avatarUrl, p.fullName)}
                                    <span className="text-slate-800 font-bold text-[10px] mt-1.5 truncate max-w-[64px] text-center">
                                        {p.fullName.split(' ')[0]}
                                    </span>
                                    <span className="bg-[#EAFCD6] text-[#76A831] border border-[#DAF2BB] text-[8px] font-extrabold px-1.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wide">
                                        Participe
                                    </span>
                                </div>
                            ))}

                            {/* Guest Slot "et toi ?" */}
                            <div className="flex flex-col items-center min-w-[52px]">
                                <div className="w-11 h-11 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center bg-zinc-50 text-zinc-400 font-black text-sm select-none">
                                    {extraCount > 0 ? `+${extraCount}` : "?"}
                                </div>
                                <span className="text-slate-500 font-bold text-[10px] mt-1.5 truncate max-w-[64px] text-center">
                                    et toi ?
                                </span>
                                <span className="bg-zinc-100 text-zinc-500 border border-zinc-200 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wide">
                                    Invité
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Lightning Info Card Banner */}
                    <div className="bg-[#F8FEDB]/70 border border-[#D4FC79]/30 rounded-2xl p-3 flex items-center gap-3 w-full my-1">
                        <div className="text-[#8CBF3D] flex-shrink-0">
                            <Zap className="w-5 h-5 fill-current" strokeWidth={1} />
                        </div>
                        <p className="text-[12px] text-slate-800 font-bold leading-snug">
                            Confirme ta présence et reste informé des changements de la session.
                        </p>
                    </div>

                    {/* Three-Column Benefits Box */}
                    <div className="grid grid-cols-3 bg-white border border-[#EFEFEF] rounded-2xl py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.01)] w-full divide-x divide-zinc-100">
                        {/* Gratuit */}
                        <div className="flex flex-col items-center justify-center gap-1">
                            <div className="text-[#8CBF3D]">
                                <Gift className="w-[18px] h-[18px]" strokeWidth={2.2} />
                            </div>
                            <span className="text-slate-800 font-extrabold text-[10px]">Gratuit</span>
                        </div>
                        
                        {/* 30 Secondes */}
                        <div className="flex flex-col items-center justify-center gap-1">
                            <div className="text-[#8CBF3D]">
                                <Timer className="w-[18px] h-[18px]" strokeWidth={2.2} />
                            </div>
                            <span className="text-slate-800 font-extrabold text-[10px]">30 secondes</span>
                        </div>

                        {/* Aucun Abonnement */}
                        <div className="flex flex-col items-center justify-center gap-1">
                            <div className="text-[#8CBF3D]">
                                <ShieldCheck className="w-[18px] h-[18px]" strokeWidth={2.2} />
                            </div>
                            <span className="text-slate-800 font-extrabold text-[10px]">Aucun abonnement</span>
                        </div>
                    </div>

                    {/* Join button */}
                    <div className="mt-4 w-full">
                        <button
                            onClick={handleOpenApp}
                            className="w-full bg-[#D4FC79] hover:bg-[#c9f662] text-black font-black italic uppercase tracking-wider py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] text-[14px]"
                        >
                            <span>Je rejoins la session</span>
                            <ArrowRight className="w-4 h-4" strokeWidth={3} />
                        </button>
                    </div>

                    {/* Footer footnote */}
                    <div className="flex items-start justify-center gap-2 text-[10px] text-zinc-400 text-center max-w-[280px] mx-auto pb-1 mt-1">
                        <Lock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-zinc-400" strokeWidth={2.2} />
                        <span className="leading-normal">
                            Si l'application n'est pas installée, vous serez automatiquement redirigé vers l'App Store.
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Join;
