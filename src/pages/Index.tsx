import { CTAButton } from "@/components/ui/cta-button";
import { Link } from "react-router-dom";
import { Trophy, Users, Zap } from "lucide-react";
import { HeroMockup } from "@/components/landing/HeroMockup";
import { SquadFeature } from "@/components/landing/SquadFeature";
import { StatsFeature } from "@/components/landing/StatsFeature";

const Index = () => {
  const handleDownload = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    if (/android/i.test(userAgent)) {
      window.open('https://play.google.com/store/apps/details?id=com.alliancetech.com', '_blank');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      window.open('https://apps.apple.com/fr/app/sue/id6749824461', '_blank');
    } else {
      // Default fallback (e.g., iOS or homepage)
      window.open('https://apps.apple.com/fr/app/sue/id6749824461', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col overflow-x-hidden">
      {/* Navbar simplified */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="text-2xl font-black italic uppercase tracking-tighter text-primary">
          SUE
        </div>
        <div className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-wider">
          {/* <a href="#features" className="hover:text-primary transition-colors">Fonctionnalités</a> */}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative px-6 py-12 lg:py-24 flex flex-col items-center">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10" />

          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Text & CTA */}
            <div className="text-center lg:text-left space-y-8 z-10">
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.9]">
                  DEVENEZ <br />
                  UNE <span className="text-primary">LÉGENDE.</span>
                </h1>
                <p className="text-xl sm:text-2xl text-foreground/80 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium tracking-tight">
                  Plus de bla-bla. Créez votre session de sport en 30 secondes, invitez votre squad et jouez.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <CTAButton
                  onClick={handleDownload}
                  aria-label="Télécharger l'app"
                  className="text-xl italic uppercase tracking-wider font-black h-16 px-10"
                >
                  Télécharger l'app
                </CTAButton>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-zinc-500 font-medium">
                <Zap className="w-4 h-4 text-primary" />
                <span>Déjà <strong>2,000+</strong> matchs organisés ce mois-ci</span>
              </div>
            </div>

            {/* Right Column - Hero Mockup */}
            <div className="flex justify-center lg:justify-end relative group perspective-1000">
              <div className="relative transform transition-transform duration-700 hover:rotate-y-6 hover:rotate-x-6">
                <HeroMockup />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 px-6 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto space-y-24">

            {/* Feature 1: Squad */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 flex justify-center">
                <div className="relative w-full flex justify-center">
                  <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                  <SquadFeature />
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6 text-center lg:text-left">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto lg:mx-0 border border-zinc-800">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter">
                  GÉREZ VOTRE <span className="text-primary">SQUAD</span>
                </h2>
                <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Fini les groupes WhatsApp. Créez votre équipe, gérez les invitations et voyez qui est chaud en un coup d'œil.
                </p>
              </div>
            </div>

            {/* Feature 2: Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto lg:mx-0 border border-zinc-800">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter">
                  SUIVEZ VOTRE <span className="text-primary">LÉGENDE</span>
                </h2>
                <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Chaque match compte. Gardez une trace de vos victoires, vos buts et votre progression. Devenez le MVP.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full flex justify-center">
                  <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                  <StatsFeature />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-10 bg-zinc-900/50 p-12 rounded-3xl border border-white/5">
            <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter">
              PRÊT À ENTRER SUR LE TERRAIN ?
            </h2>
            <div className="flex justify-center">
              <CTAButton
                onClick={handleDownload}
                className="text-lg sm:text-xl italic uppercase tracking-wider font-black h-auto py-6 px-12 bg-white text-black hover:bg-zinc-200 whitespace-normal"
              >
                COMMENCER MAINTENANT
              </CTAButton>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-black italic uppercase tracking-tighter text-zinc-700">
            SUE
          </div>
          <nav className="flex flex-wrap justify-center gap-8 text-sm font-medium uppercase tracking-wide text-zinc-500">
            <Link
              to="/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/mentions-legales"
              className="hover:text-primary transition-colors"
            >
              Mentions
            </Link>
            <Link
              to="/confidentialite"
              className="hover:text-primary transition-colors"
            >
              Confidentialité
            </Link>
            <Link
              to="/conditions"
              className="hover:text-primary transition-colors"
            >
              CGU
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Index;