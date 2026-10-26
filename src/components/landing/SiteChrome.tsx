import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AppStoreButton } from "@/components/landing/AppStoreButton";

// En-tête et pied de page communs au site vitrine (accueil, pages légales, contact).

export function SiteHeader() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-md">
            <div className="mx-auto max-w-[1240px] h-[72px] px-5 sm:px-8 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8CBF3D]" aria-label="Sue, accueil">
                    <img src="/adaptive-icon.png" alt="" className="w-9 h-9 rounded-[10px]" />
                    <span className="font-outfit font-black text-[24px] tracking-[-0.04em]">Sue</span>
                </Link>
                <AppStoreButton size="md" />
            </div>
        </header>
    );
}

export function SiteFooter() {
    return (
        <footer className="border-t border-black/[0.06] font-outfit">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2.5">
                    <img src="/adaptive-icon.png" alt="" className="w-7 h-7 rounded-[8px]" />
                    <span className="font-black text-[19px] tracking-[-0.04em]">Sue</span>
                    <span className="text-[14px] text-[#6B6B70] ml-2">© {new Date().getFullYear()}</span>
                </div>
                <nav aria-label="Liens légaux" className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-[14px] font-semibold text-[#55555A]">
                    <Link to="/contact" className="hover:text-[#0A0A0A] underline-offset-4 hover:underline">Contact</Link>
                    <Link to="/mentions-legales" className="hover:text-[#0A0A0A] underline-offset-4 hover:underline">Mentions légales</Link>
                    <Link to="/confidentialite" className="hover:text-[#0A0A0A] underline-offset-4 hover:underline">Confidentialité</Link>
                    <Link to="/conditions" className="hover:text-[#0A0A0A] underline-offset-4 hover:underline">CGU</Link>
                </nav>
            </div>
        </footer>
    );
}

/** Page de texte du site (légal, contact) : même en-tête, même pied, colonne de lecture */
export function SitePage({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#0A0A0A] font-outfit selection:bg-[#D4FC79] selection:text-[#0A0A0A]">
            <SiteHeader />
            <main className="flex-1 w-full max-w-[760px] mx-auto px-5 sm:px-8 pt-32 pb-24 [&_h1]:font-black [&_h1]:tracking-[-0.035em] [&_h1]:leading-[1] [&_h2]:font-extrabold [&_h2]:tracking-[-0.02em] [&_a]:underline-offset-4">
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}
