import { ReactNode } from "react";
import { FillFragment, NotificationsFragment, RosterFragment, SlotVoteFragment } from "@/components/landing/SueUi";

// Chaque galère des groupes de discussion, dite comme dans le groupe, puis ce que Sue fait à la place.

interface Row {
    pain: string;
    from: string;
    title: string;
    text: string;
    fragment: ReactNode;
    band?: boolean;
}

const ROWS: Row[] = [
    {
        pain: "Je recopie la liste et je rajoute mon nom",
        from: "Camille",
        title: "Chacun répond en un tap.",
        text: "Je viens, je ne peux pas : la réponse de chacun s'affiche en direct. Plus de liste à recopier, tout le monde voit qui vient.",
        fragment: <RosterFragment />,
    },
    {
        pain: "Mardi ou jeudi ? Quelqu'un ?",
        from: "Thomas",
        title: "Pas de date ? On vote.",
        text: "Propose quelques créneaux : tes potes cochent ceux qui leur vont, et peuvent en proposer d'autres. Tu choisis celui qui arrange le plus de monde.",
        fragment: <SlotVoteFragment />,
        band: true,
    },
    {
        pain: "Tu viens ce soir ? T'as vu mon message ?",
        from: "Hugo",
        title: "Les rappels, c'est Sue.",
        text: "Un rappel la veille, un autre une heure avant, et tout le monde est prévenu si l'heure ou le lieu change. Fini les relances en privé.",
        fragment: <NotificationsFragment />,
    },
    {
        pain: "Deux qui annulent, on est trois…",
        from: "Inès",
        title: "Il manque quelqu'un ? Ça se voit.",
        text: "Fixe un nombre de joueurs, suis les confirmations et partage le lien quand il reste une place pour compléter l'équipe.",
        fragment: <FillFragment />,
    },
];

// Couleur du prénom, comme dans un groupe de discussion
const SENDER_COLORS: Record<string, string> = { Camille: "#AD1457", Thomas: "#1B5E20", Hugo: "#B34700", Inès: "#4527A0" };

function PainBubble({ text, from }: { text: string; from: string }) {
    return (
        <div className="inline-block max-w-[26rem] rounded-[24px] rounded-bl-[8px] bg-[#ECECEF] px-5 py-3.5">
            <span className="block font-outfit text-[13px] font-bold" style={{ color: SENDER_COLORS[from] }}>{from}</span>
            <span className="block font-outfit text-[19px] font-medium text-[#3A3A3C] line-through decoration-[#0A0A0A]/45 decoration-2">
                {text}
            </span>
        </div>
    );
}

export function PainToFix() {
    return (
        <section className="pt-28 sm:pt-36" aria-labelledby="pain-title">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
                <h2 id="pain-title" className="max-w-[16ch] font-outfit font-black text-[clamp(2.4rem,5.2vw,4.25rem)] leading-[0.98] tracking-[-0.035em] text-[#0A0A0A] [text-wrap:balance]">
                    Tout ce qui te saoule dans les groupes, Sue le règle.
                </h2>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col">
                {ROWS.map((row, i) => {
                    const flip = i % 2 === 1;
                    return (
                        <div key={row.title} className={row.band ? "bg-[#F1F1F3] py-20 sm:py-24 my-6 sm:my-10" : "py-14 sm:py-20"}>
                            <div className={`mx-auto max-w-[1240px] px-5 sm:px-8 grid items-center gap-10 lg:gap-20 lg:grid-cols-2`}>
                                <div className={flip ? "lg:order-2" : ""}>
                                    <PainBubble text={row.pain} from={row.from} />
                                    <h3 className="mt-7 font-outfit font-black text-[clamp(2rem,3.6vw,3.1rem)] leading-[1] tracking-[-0.03em] text-[#0A0A0A]">
                                        <span className="bg-[linear-gradient(transparent_58%,#D4FC79_58%,#D4FC79_92%,transparent_92%)] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] px-1 -mx-1">
                                            {row.title}
                                        </span>
                                    </h3>
                                    <p className="mt-5 max-w-[30rem] font-outfit font-medium text-[18px] leading-relaxed text-[#3A3A3C]">{row.text}</p>
                                </div>
                                <div className={`flex justify-center ${flip ? "lg:order-1 lg:justify-start" : "lg:justify-end"}`}>
                                    {row.fragment}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
