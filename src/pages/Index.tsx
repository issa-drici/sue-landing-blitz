import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AppStoreButton } from "@/components/landing/AppStoreButton";
import { ChaosToSession } from "@/components/landing/ChaosToSession";
import { PainToFix } from "@/components/landing/PainToFix";
import { SiteFooter, SiteHeader } from "@/components/landing/SiteChrome";

// Icônes 3D des sports (mêmes visuels que l'app), sur deux bandes qui défilent en sens opposés
const SPORTS_A = [
    "football", "padel", "tennis", "basketball", "course", "musculation", "volleyball", "badminton",
    "rugby", "handball", "escalade", "natation",
];
const SPORTS_B = [
    "yoga", "boxe", "cyclisme", "golf", "ski", "surf", "ping-pong", "randonnee",
    "squash", "danse", "judo", "petanque",
];

function SportRow({ sports, reverse = false }: { sports: string[]; reverse?: boolean }) {
    return (
        <div className={`flex w-max gap-4 sm:gap-5 hover:[animation-play-state:paused] motion-reduce:animate-none ${reverse ? "animate-sport-strip-reverse" : "animate-sport-strip"}`}>
            {[...sports, ...sports].map((sport, index) => (
                <div
                    key={`${sport}-${index}`}
                    className="w-[88px] h-[88px] sm:w-[112px] sm:h-[112px] flex-shrink-0 rounded-[28px] bg-white border border-black/[0.05] shadow-[0_14px_30px_-22px_rgba(10,10,10,0.35)] flex items-center justify-center"
                >
                    <img src={`/sports/${sport}.webp`} alt="" loading="lazy" className="w-[62px] h-[62px] sm:w-[78px] sm:h-[78px] object-contain" />
                </div>
            ))}
        </div>
    );
}

const Index = () => (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] font-outfit overflow-x-clip selection:bg-[#D4FC79] selection:text-[#0A0A0A]">
        <SiteHeader />

        <main>
            <ChaosToSession />

            <PainToFix />

            <section className="pt-24 sm:pt-32 pb-28 sm:pb-36" aria-labelledby="sports-title">
                <div className="mx-auto max-w-[1240px] px-5 sm:px-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
                    <h2 id="sports-title" className="font-black text-[clamp(2.4rem,5.2vw,4.25rem)] leading-[0.98] tracking-[-0.035em] [text-wrap:balance]">
                        Tous les sports. Toutes tes bandes.
                    </h2>
                    <p className="text-[18px] font-medium leading-relaxed text-[#3A3A3C] max-w-[24rem]">
                        48 sports, du five au yoga, et tous tes groupes de potes au même endroit, même quand ce ne sont pas les mêmes.
                    </p>
                </div>
                <div className="mt-14 flex flex-col gap-4 sm:gap-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                    <SportRow sports={SPORTS_A} />
                    <SportRow sports={SPORTS_B} reverse />
                </div>
            </section>

            <section className="bg-[#D4FC79]" aria-labelledby="cta-title">
                <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-24 sm:py-32 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
                    <div>
                        <h2 id="cta-title" className="font-black text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.04em] [text-wrap:balance]">
                            Ce <span className="whitespace-nowrap">week-end</span>, tu joues.
                        </h2>
                        <p className="mt-6 max-w-[30rem] text-[19px] font-medium leading-relaxed text-[#1F2A0A]">
                            Sue est gratuite. Crée ta première session, partage le lien dans le groupe, et laisse tout le monde répondre.
                        </p>
                        <div className="mt-9">
                            <AppStoreButton />
                        </div>
                    </div>
                    <div className="lg:justify-self-end max-w-[22rem] rounded-[28px] bg-[#0A0A0A]/[0.06] p-6">
                        <p className="text-[16px] font-bold">Sur Android ou ordinateur ?</p>
                        <p className="mt-1.5 text-[15px] leading-relaxed text-[#1F2A0A]">
                            L'app est sur iPhone pour l'instant. Tu peux quand même répondre aux invitations et suivre tes sessions sur le web.
                        </p>
                        <Link to="/app" className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-bold underline underline-offset-4 decoration-2 hover:gap-2.5 transition-[gap] rounded focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0A0A0A]/20">
                            Ouvrir Sue sur le web <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>

        <SiteFooter />
    </div>
);

export default Index;
