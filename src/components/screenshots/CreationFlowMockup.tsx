import { Check } from "lucide-react";

export const CreationFlowMockup = () => {
    return (
        <div className="relative w-[320px] mx-auto">
            {/* Phone UI Container */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl overflow-hidden relative">

                {/* Step 1: Sport Selection */}
                <div className="mb-6">
                    <h3 className="text-black text-sm font-bold uppercase mb-3 text-left">1. Choisis ton sport</h3>
                    <div className="flex gap-3 overflow-hidden">
                        <div className="bg-black text-white px-4 py-3 rounded-xl font-bold text-sm min-w-[100px] text-center shadow-lg">
                            Football
                        </div>
                        <div className="bg-zinc-100 text-zinc-400 px-4 py-3 rounded-xl font-bold text-sm min-w-[100px] text-center border border-zinc-200">
                            Padel
                        </div>
                        <div className="bg-zinc-100 text-zinc-400 px-4 py-3 rounded-xl font-bold text-sm min-w-[100px] text-center border border-zinc-200">
                            Tennis
                        </div>
                    </div>
                </div>

                {/* Step 2: Time Selection */}
                <div className="mb-8">
                    <h3 className="text-black text-sm font-bold uppercase mb-3 text-left">2. Choisis l'heure</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-zinc-100 text-zinc-400 p-2 rounded-lg text-xs font-bold border border-zinc-200">
                            18:00
                        </div>
                        <div className="bg-zinc-100 text-zinc-400 p-2 rounded-lg text-xs font-bold border border-zinc-200">
                            19:00
                        </div>
                        <div className="bg-primary text-black p-2 rounded-lg text-xs font-bold shadow-md transform scale-110 border-2 border-black relative z-10">
                            20:00
                        </div>
                        <div className="bg-zinc-100 text-zinc-400 p-2 rounded-lg text-xs font-bold border border-zinc-200">
                            21:00
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-black text-white font-black italic uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                    <Check className="w-5 h-5 stroke-[3]" />
                    Créer la session
                </button>

                {/* Cursor/Tap Effect */}
                <div className="absolute bottom-8 right-12 w-8 h-8 bg-zinc-900/10 rounded-full animate-ping" />
                <div className="absolute bottom-8 right-12 w-8 h-8 bg-black/10 rounded-full opacity-50" />

            </div>
        </div>
    );
};
