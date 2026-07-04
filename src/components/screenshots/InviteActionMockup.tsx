export const InviteActionMockup = () => {
    return (
        <div className="relative w-[320px] mx-auto">
            {/* Card Container */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl relative">

                {/* Header / Inviter */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
                        T
                    </div>
                    <div>
                        <h3 className="text-black font-bold text-lg leading-tight">Thomas t'invite au match</h3>
                        <p className="text-zinc-500 text-xs font-medium uppercase">Il y a 2 min • City Stadium</p>
                    </div>
                </div>

                {/* Split Actions */}
                <div className="flex gap-4">
                    <button className="flex-1 bg-zinc-100 text-zinc-500 font-bold uppercase py-4 rounded-2xl text-xs hover:bg-zinc-200 transition-colors">
                        Pas dispo
                    </button>
                    <button className="flex-[2] bg-primary text-black font-black italic uppercase py-4 rounded-2xl text-sm shadow-md transform scale-105">
                        JE VIENS ⚡️
                    </button>
                </div>

                {/* Confirmation Badge */}
                <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg rotate-3">
                    1 clic
                </div>

            </div>
        </div>
    );
};
