import { Plus, UserCheck, MessageCircle } from "lucide-react";

export const SquadFeature = () => {
    const players = [
        { name: "Yassine", role: "Capitaine", status: "online", color: "from-blue-500 to-indigo-600" },
        { name: "Sarah", role: "Joueur", status: "online", color: "from-purple-500 to-pink-600" },
        { name: "Mehdi", role: "Joueur", status: "away", color: "from-emerald-500 to-cyan-600" },
    ];

    return (
        <div className="relative w-full max-w-sm mx-auto">
            <div className="space-y-4">
                {players.map((player, index) => (
                    <div
                        key={index}
                        className="group flex items-center justify-between p-3 bg-zinc-900/50 hover:bg-zinc-800/80 border border-white/5 hover:border-white/10 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:translate-x-2"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${player.color} shadow-lg`} />
                                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-zinc-900 ${player.status === 'online' ? 'bg-primary' : 'bg-zinc-500'
                                    }`} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">{player.name}</h4>
                                <span className="text-zinc-500 text-xs font-medium uppercase tracking-wide">{player.role}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-8 h-8 rounded-full bg-zinc-700/50 flex items-center justify-center hover:bg-zinc-600 transition-colors">
                                <MessageCircle className="w-4 h-4 text-white" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors">
                                <UserCheck className="w-4 h-4 text-primary" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Invite Card */}
                <div className="flex items-center justify-between p-3 border-2 border-dashed border-zinc-800 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-zinc-500 font-bold text-sm group-hover:text-zinc-300">Inviter un joueur</span>
                    </div>
                </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 bg-primary text-black px-4 py-1.5 rounded-full font-black italic uppercase text-xs tracking-wider shadow-[0_0_15px_rgba(212,252,121,0.4)] rotate-3">
                Team Complète
            </div>
        </div>
    );
};
