import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CTAButton } from "@/components/ui/cta-button";
import {
    Loader2,
    AlertCircle,
    Calendar,
    Clock,
    MapPin,
    Users,
    User,
} from "lucide-react";

// Configuration API (identique au reste de la landing, cf. PasswordReset.tsx)
const API_BASE_URL = "https://api.sue.alliance-tech.fr";

// Domaine web / Universal Link
const WEB_BASE_URL = "https://sue-app.fr";

// Lien App Store (identique au bouton de téléchargement de la home, cf. Index.tsx)
const APP_STORE_URL = "https://apps.apple.com/fr/app/sue/id6749824461";
const PLAY_STORE_URL =
    "https://play.google.com/store/apps/details?id=com.alliancetech.com";

interface SessionPreview {
    sport: string;
    sportName: string;
    date: string; // Y-m-d
    startTime: string; // H:i
    endTime: string; // H:i
    location: string;
    maxParticipants: number | null;
    participantsCount: number;
    organizer: { fullName: string };
}

// Formate "2026-07-12" en "dimanche 12 juillet 2026"
function formatFrenchDate(isoDate: string): string {
    try {
        const [year, month, day] = isoDate.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch {
        return isoDate;
    }
}

const Join = () => {
    const { token } = useParams<{ token: string }>();

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [session, setSession] = useState<SessionPreview | null>(null);

    const universalLink = `${WEB_BASE_URL}/join/${token}`;

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
                    // Message générique : on ne révèle pas la raison exacte
                    // (token invalide / expiré / inexistant). Le détail est loggé côté serveur.
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (isError || !session) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-6 bg-zinc-950 p-8 rounded-xl border border-zinc-800 shadow-2xl text-center">
                    <div className="flex justify-center">
                        <AlertCircle className="w-14 h-14 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-black italic uppercase text-white tracking-tighter">
                        Lien indisponible
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Ce lien de session n'est plus valide. Il a peut-être expiré ou la
                        session n'existe plus.
                    </p>
                    <CTAButton onClick={handleDownload} className="w-full">
                        Télécharger l'app
                    </CTAButton>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-zinc-950 p-8 rounded-xl border border-zinc-800 shadow-2xl">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-black italic uppercase text-primary tracking-tighter">
                        Sue
                    </h1>
                    <p className="text-sm text-zinc-400 uppercase tracking-wider font-bold">
                        Vous êtes invité·e à une session
                    </p>
                </div>

                {/* Aperçu de la session */}
                <div className="space-y-5">
                    <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter text-center">
                        {session.sportName}
                    </h2>

                    <div className="space-y-3 text-white">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="capitalize">{formatFrenchDate(session.date)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>
                                {session.startTime} – {session.endTime}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>{session.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>Organisé par {session.organizer.fullName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>
                                {session.participantsCount}
                                {session.maxParticipants
                                    ? ` / ${session.maxParticipants}`
                                    : ""}{" "}
                                participant{session.participantsCount > 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <a href={universalLink} className="block">
                        <CTAButton className="w-full">Ouvrir dans l'app</CTAButton>
                    </a>
                    <button
                        onClick={handleDownload}
                        className="w-full text-sm font-bold uppercase tracking-wider text-zinc-400 hover:text-primary transition-colors py-2"
                    >
                        Je n'ai pas encore l'app · Télécharger
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Join;
