import { ReactNode } from "react";
import { getSportIconUrl, getSportSurfaceUrl } from "@/lib/sportAssets";

// Carte "terrain" comme dans l'app : la surface du sport en fond, assombrie côté texte,
// l'icône 3D (avec son halo) dans le coin. Sert aux cartes de la liste et au haut de la page session.

interface SportBackdropProps {
    sport: string;
    size?: "small" | "large";
    className?: string;
    children: ReactNode;
}

export function SportBackdrop({ sport, size = "small", className = "", children }: SportBackdropProps) {
    const surfaceUrl = getSportSurfaceUrl(sport);
    const iconUrl = getSportIconUrl(sport);
    const icon = size === "large" ? 76 : 52;

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-zinc-800 ${className}`}>
            {surfaceUrl && <img src={surfaceUrl} alt="" className="absolute inset-0 w-full h-full object-cover object-right" />}
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 via-70% to-black/55" />
            {iconUrl && (
                <div
                    className={`absolute flex items-center justify-center ${size === "large" ? "top-3 right-3" : "top-1/2 -translate-y-1/2 left-3"}`}
                    style={{ width: icon, height: icon }}
                >
                    <img src="/brand/icon-glow.webp" alt="" className="absolute max-w-none" style={{ width: icon * 1.85, height: icon * 1.85 }} />
                    <img src={iconUrl} alt="" className="relative object-contain" style={{ width: icon, height: icon }} />
                </div>
            )}
            <div className="relative">{children}</div>
        </div>
    );
}
