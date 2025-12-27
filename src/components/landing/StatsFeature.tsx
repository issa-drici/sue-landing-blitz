import { Trophy, TrendingUp, Medal } from "lucide-react";

export const StatsFeature = () => {
    return (
        <div className="relative w-full max-w-sm mx-auto">
            {/* Main Stats Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }} />

                <div className="flex justify-between items-start mb-8 relative">
                    <div>
                        <span className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1 block">Matchs Joués</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-6xl font-black text-white italic tracking-tighter">42</span>
                            <span className="text-primary font-bold text-lg">+3</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                        <Trophy className="w-6 h-6 text-primary" />
                    </div>
                </div>

                {/* Activity Graph */}
                <div className="flex items-end gap-2 h-24 mb-6 pt-4 border-t border-zinc-800">
                    {[30, 45, 25, 60, 75, 50, 90].map((h, i) => (
                        <div key={i} className="flex-1 bg-zinc-800 rounded-t-lg relative group/bar overflow-hidden">
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-primary/20 group-hover/bar:bg-primary transition-all duration-500"
                                style={{ height: `${h}%` }}
                            />
                        </div>
                    ))}
                </div>

                {/* Badges */}
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full">
                        <Medal className="w-3 h-3 text-yellow-500" />
                        <span className="text-yellow-500 text-[10px] font-bold uppercase">MVP x5</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
                        <TrendingUp className="w-3 h-3 text-blue-500" />
                        <span className="text-blue-500 text-[10px] font-bold uppercase">Top Player</span>
                    </div>
                </div>
            </div>

            {/* Floating Achievement Card */}
            <div className="absolute -bottom-6 -right-6 bg-zinc-800 border border-zinc-700 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-green-300 flex items-center justify-center">
                    <span className="text-lg">🔥</span>
                </div>
                <div>
                    <div className="text-white font-bold text-sm">Série de victoires</div>
                    <div className="text-primary text-xs font-bold uppercase">5 Matchs</div>
                </div>
            </div>
        </div>
    );
};
