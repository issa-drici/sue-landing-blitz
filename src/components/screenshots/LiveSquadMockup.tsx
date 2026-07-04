import { CheckCircle2 } from "lucide-react";

export const LiveSquadMockup = () => {
    const participants = [
        { name: "Moi", time: "Organisateur", status: "confirmed", color: "from-zinc-700 to-zinc-900" },
        { name: "Lucas", time: "À l'instant", status: "just_now", color: "from-blue-500 to-indigo-600" },
        { name: "Sophie", time: "Il y a 2 min", status: "confirmed", color: "from-purple-500 to-pink-600" },
        { name: "Arthur", time: "Il y a 5 min", status: "confirmed", color: "from-orange-500 to-red-600" },
    ];

    return (
        <div className="relative w-[300px] mx-auto">
            <div className="space-y-3">
                {participants.map((p, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-2xl border ${p.status === 'just_now'
                        ? 'bg-zinc-50 border-primary shadow-[0_0_15px_rgba(212,252,121,0.2)]'
                        : 'bg-white border-zinc-100'
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${p.color}`} />
                            <div>
                                <div className="text-black font-bold text-sm">{p.name}</div>
                                <div className={`text-[10px] font-medium uppercase ${p.status === 'just_now' ? 'text-green-600 font-bold' : 'text-zinc-500'
                                    }`}>
                                    {p.time}
                                </div>
                            </div>
                        </div>

                        {p.status === 'just_now' ? (
                            <div className="flex flex-col items-center">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                            </div>
                        ) : (
                            <CheckCircle2 className="w-5 h-5 text-zinc-300" />
                        )}
                    </div>
                ))}
            </div>

            {/* Realtime Toast */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 animate-bounce shadow-xl">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Mise à jour en direct
            </div>
        </div>
    );
};
