import { CreationFlowMockup } from "@/components/screenshots/CreationFlowMockup";
import { InviteActionMockup } from "@/components/screenshots/InviteActionMockup";
import { LiveSquadMockup } from "@/components/screenshots/LiveSquadMockup";
import { Zap } from "lucide-react";

export const Screenshots = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-10 flex flex-wrap gap-10 justify-center items-center font-sans">

            {/* FRAME 1: INTRO / BRAND */}
            <div className="w-[414px] h-[896px] bg-white border border-gray-200 flex flex-col relative overflow-hidden shrink-0 shadow-2xl">
                <div className="p-8 pt-24 space-y-6 z-10">
                    <h2 className="text-6xl font-black italic uppercase text-black leading-[0.9] tracking-tighter">
                        L'APP<br /> LA PLUS <br /><span className="text-[#D4FC79]">SIMPLE</span>
                    </h2>
                    <p className="text-xl text-zinc-500 font-bold uppercase leading-tight">
                        Pour organiser tes sessions de sport entre amis.
                    </p>
                </div>

                <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                    {/* Background blobs */}
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full mt-20" />

                    {/* Photo Illustration */}
                    <div className="relative z-10 w-full h-full flex items-end justify-center pb-8">
                        <img
                            src="/happy-group.png"
                            alt="Groupe d'amis sportifs"
                            className="w-[95%] max-w-none mix-blend-multiply filter contrast-125"
                        />
                    </div>
                </div>

                <div className="p-8 pb-16 text-center z-10">
                    <div className="inline-block px-6 py-2 border-2 border-black rounded-full">
                        <span className="text-black font-black italic uppercase tracking-widest text-sm">Disponible sur iOS & Android</span>
                    </div>
                </div>
            </div>

            {/* FRAME 2: CREATE */}
            <div className="w-[414px] h-[896px] bg-white border border-gray-200 flex flex-col relative overflow-hidden shrink-0 shadow-2xl">
                <div className="p-8 pt-24 space-y-4 z-10 text-center">
                    <h2 className="text-5xl font-black italic uppercase text-black leading-none tracking-tighter">
                        CRÉE TA SESSION <br /> EN <span className="bg-primary px-2 text-black transform -skew-x-12 inline-block">2 CLICS</span>
                    </h2>
                </div>

                <div className="flex-1 flex items-center justify-center relative px-4">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500/10 blur-[80px] w-64 h-64 rounded-full" />
                    <div className="transform scale-110">
                        <CreationFlowMockup />
                    </div>
                </div>
            </div>

            {/* FRAME 3: SQUAD */}
            <div className="w-[414px] h-[896px] bg-white border border-gray-200 flex flex-col relative overflow-hidden shrink-0 shadow-2xl">
                <div className="p-8 pt-24 space-y-4 z-10 text-center">
                    <h2 className="text-5xl font-black italic uppercase text-black leading-none tracking-tighter">
                        INVITE TES AMIS <br /> EN <span className="bg-primary px-2 text-black transform -skew-x-12 inline-block">1 CLIC</span>
                    </h2>
                </div>

                <div className="flex-1 flex items-center justify-center relative px-4">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-500/10 blur-[80px] w-64 h-64 rounded-full" />
                    <div className="transform scale-110">
                        <InviteActionMockup />
                    </div>
                </div>
            </div>

            {/* FRAME 4: STATS/LIVE */}
            <div className="w-[414px] h-[896px] bg-white border border-gray-200 flex flex-col relative overflow-hidden shrink-0 shadow-2xl">
                <div className="p-8 pt-24 space-y-4 z-10 text-center">
                    <h2 className="text-5xl font-black italic uppercase text-black leading-none tracking-tighter">
                        VOIS QUI VIENT <br /> EN <span className="bg-primary px-2 text-black transform -skew-x-12 inline-block">TEMPS RÉEL</span>
                    </h2>
                </div>

                <div className="flex-1 flex items-center justify-center relative px-4">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500/10 blur-[80px] w-64 h-64 rounded-full" />
                    <div className="transform scale-110">
                        <LiveSquadMockup />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Screenshots;
