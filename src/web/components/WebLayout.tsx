import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Loader2, LogOut } from "lucide-react";
import { APP_STORE_URL, IS_IOS, UnauthorizedError, apiFetch, clearToken, getStoredToken } from "@/web/api";
import { WebUser } from "@/web/types";

// Cadre commun de l'espace web : réservé à Android et ordinateur (sur iPhone on renvoie vers l'app),
// connexion obligatoire (sinon page de connexion, puis retour à la page demandée).

interface WebLayoutProps {
    children: (user: WebUser) => ReactNode;
}

export function WebLayout({ children }: WebLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<WebUser | null>(null);

    useEffect(() => {
        if (IS_IOS) return;
        if (!getStoredToken()) {
            navigate(`/app/connexion?next=${encodeURIComponent(location.pathname)}`, { replace: true });
            return;
        }
        apiFetch<WebUser>("/user")
            .then(setUser)
            .catch((e) => {
                if (e instanceof UnauthorizedError) {
                    navigate(`/app/connexion?next=${encodeURIComponent(location.pathname)}`, { replace: true });
                }
            });
    }, [navigate, location.pathname]);

    if (IS_IOS) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center gap-5">
                <img src="/brand/hero-3d.png" alt="" className="w-48 h-48 object-contain" />
                <h1 className="text-2xl font-black text-slate-900">Retrouve tes sessions dans l'app</h1>
                <p className="text-slate-500 max-w-xs">Sur iPhone, Sue s'utilise avec l'application.</p>
                <a href={APP_STORE_URL} className="w-full max-w-xs h-14 rounded-2xl bg-[#D4FC79] text-black font-black flex items-center justify-center">
                    Télécharger l'app
                </a>
            </div>
        );
    }

    const logout = () => {
        // Déconnexion locale : le jeton est oublié par ce navigateur
        clearToken();
        navigate("/app/connexion", { replace: true });
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-slate-900">
            <header className="sticky top-0 z-20 bg-[#FAFAFA]/90 backdrop-blur border-b border-[#EFEFEF]">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/app" className="flex items-center gap-2">
                        <img src="/adaptive-icon.png" alt="Sue" className="w-9 h-9 rounded-xl border border-[#EFEFEF]" />
                        <span className="font-black italic uppercase tracking-tighter text-lg">Sue</span>
                    </Link>
                    {user && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-slate-600 hidden sm:inline">{user.firstname} {user.lastname}</span>
                            <button onClick={logout} className="w-9 h-9 rounded-full hover:bg-zinc-100 flex items-center justify-center" aria-label="Se déconnecter">
                                <LogOut className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>
                    )}
                </div>
            </header>
            <main className="max-w-2xl mx-auto px-4 py-6">
                {user ? children(user) : (
                    <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
                )}
            </main>
        </div>
    );
}
