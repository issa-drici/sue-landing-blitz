import { MapPin, Clock, Calendar, Check } from "lucide-react";

export const HeroMockup = () => {
    return (
        <div className="relative w-full max-w-[320px] mx-auto animate-fade-in-up">
            {/* Glow Effects */}
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary to-white opacity-30 blur-xl rounded-[2rem]" />

            {/* Card Container - Glassmorphism */}
            <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(212,252,121,0.3)]">
                            <span className="text-2xl">⚡️</span>
                        </div>
                        <div>
                            <h3 className="text-white font-black italic uppercase text-lg leading-none mb-1">Session Sport</h3>
                            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-semibold uppercase tracking-wide">
                                <MapPin className="w-3 h-3" />
                                <span>City Stadium, Paris</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-zinc-800/50 border border-white/5 px-2.5 py-1 rounded-full">
                        <span className="text-xs font-bold text-white">Complet</span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-zinc-800/50 p-3 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 mb-1 text-zinc-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Date</span>
                        </div>
                        <span className="text-white font-bold text-sm">Demain</span>
                    </div>
                    <div className="bg-zinc-800/50 p-3 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 mb-1 text-zinc-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Heure</span>
                        </div>
                        <span className="text-white font-bold text-sm">19:30</span>
                    </div>
                </div>

                {/* Squad List */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Squad (4/10)</span>
                    </div>
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center relative">
                                {/* Fake Avatar Gradient */}
                                <div className={`w-full h-full rounded-full opacity-80 bg-gradient-to-br ${i === 1 ? 'from-blue-400 to-indigo-600' :
                                    i === 2 ? 'from-purple-400 to-pink-600' :
                                        i === 3 ? 'from-orange-400 to-red-600' :
                                            'from-emerald-400 to-cyan-600'
                                    }`} />
                                {/* Status Dot */}
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-zinc-900" />
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-bold">
                            +6
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-primary text-black font-black italic uppercase tracking-wider py-4 rounded-xl shadow-[0_0_20px_rgba(212,252,121,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-transform">
                    Rejoindre le match
                </button>

            </div>

            {/* Accessoires flottants décoratifs */}
            <div className="absolute -right-8 top-20 bg-zinc-900/90 border border-white/10 p-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md animate-bounce-slow" style={{ animationDuration: '4s' }}>
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                </div>
                <div>
                    <div className="text-xs font-bold text-white">Thomas a rejoint</div>
                    <div className="text-[10px] text-zinc-500">Il y a 2 min</div>
                </div>
            </div>

        </div>
    );
};
