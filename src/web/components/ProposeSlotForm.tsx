import { useState } from "react";
import { Loader2 } from "lucide-react";
import { formatHour } from "@/web/format";

// "Trouver un créneau" : un invité propose un créneau en plus de ceux de l'organisateur
// (mêmes règles que l'app : jour et heure à venir, pas deux créneaux qui commencent au même moment).

export interface ProposedSlotInput {
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm (avant le début : se termine le lendemain)
}

const DURATIONS = [30, 60, 90, 120, 150, 180, 210, 240];

const pad = (n: number) => String(n).padStart(2, "0");
const toDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} min`;
    return m === 0 ? `${h}h` : `${h}h${pad(m)}`;
};

const endTimeOf = (startTime: string, durationMinutes: number) => {
    const [h, m] = startTime.split(":").map(Number);
    const total = (h * 60 + m + durationMinutes) % (24 * 60);
    return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
};

interface ProposeSlotFormProps {
    /** Créneaux déjà proposés : sert au pré-remplissage et à repérer les doublons */
    existingSlots: { date: string; startTime: string }[];
    isPending: boolean;
    error?: string | null;
    onSubmit: (slot: ProposedSlotInput) => void;
    onCancel: () => void;
}

export function ProposeSlotForm({ existingSlots, isPending, error, onSubmit, onCancel }: ProposeSlotFormProps) {
    // Pré-rempli avec le lendemain du dernier créneau, à la même heure
    const last = [...existingSlots].sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)).at(-1);
    const [date, setDate] = useState(() => {
        const base = last ? new Date(`${last.date}T00:00:00`) : new Date();
        base.setDate(base.getDate() + 1);
        return toDateKey(base);
    });
    const [startTime, setStartTime] = useState(last?.startTime ?? "18:00");
    const [duration, setDuration] = useState(60);
    const [localError, setLocalError] = useState<string | null>(null);

    const submit = () => {
        if (!date || !startTime) return;
        if (new Date(`${date}T${startTime}:00`).getTime() <= Date.now()) {
            setLocalError("Choisis un jour et une heure à venir.");
            return;
        }
        if (existingSlots.some((s) => s.date === date && s.startTime === startTime)) {
            setLocalError("Un créneau commence déjà à cette heure : coche-le plutôt.");
            return;
        }
        setLocalError(null);
        onSubmit({ date, startTime, endTime: endTimeOf(startTime, duration) });
    };

    const endTime = endTimeOf(startTime, duration);
    const field = "w-full h-12 rounded-xl border border-[#EFEFEF] bg-white px-3 text-[15px] font-semibold text-slate-900";

    return (
        <div className="rounded-2xl border-[1.5px] border-dashed border-[#8CBF3D] bg-[#F6FBEE] p-4 flex flex-col gap-3">
            <p className="font-black text-slate-900">Proposer un créneau</p>
            <label className="flex flex-col gap-1 text-xs font-bold text-slate-500">
                Jour
                <input type="date" className={field} value={date} min={toDateKey(new Date())} onChange={(e) => setDate(e.target.value)} />
            </label>
            <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs font-bold text-slate-500">
                    Début
                    <input type="time" step={900} className={field} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </label>
                <label className="flex flex-col gap-1 text-xs font-bold text-slate-500">
                    Durée
                    <select className={field} value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                        {DURATIONS.map((d) => <option key={d} value={d}>{formatDuration(d)}</option>)}
                    </select>
                </label>
            </div>
            <p className="text-xs text-slate-500">
                Fin à {formatHour(endTime)}{endTime <= startTime ? " (le lendemain)" : ""}
            </p>
            {(localError || error) && <p className="text-sm font-semibold text-red-600">{localError || error}</p>}
            <button
                className="w-full py-3 rounded-xl bg-[#D4FC79] text-black font-black text-[15px] flex items-center justify-center disabled:opacity-50"
                disabled={isPending}
                onClick={submit}
            >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Proposer ce créneau"}
            </button>
            <button className="text-sm font-semibold text-slate-500" disabled={isPending} onClick={onCancel}>
                Annuler
            </button>
        </div>
    );
}
