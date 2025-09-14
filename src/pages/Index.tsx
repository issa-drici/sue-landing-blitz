import { CTAButton } from "@/components/ui/cta-button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Text & CTA */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Organise tes matchs en 2 clics
                </h1>
                <p className="text-xl sm:text-2xl text-foreground/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  L'app la plus simple pour créer, inviter et jouer entre amis, sans prise de tête.
                </p>
              </div>
              
              <div className="pt-4">
                <CTAButton 
                  onClick={() => window.open('https://apps.apple.com/app/idXXXXXXXXX', '_blank')}
                  aria-label="Télécharger l'app sur l'App Store"
                  className="text-xl"
                >
                  Télécharger l'app
                </CTAButton>
              </div>
            </div>

            {/* Right Column - Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="max-w-sm lg:max-w-md xl:max-w-lg">
                <img
                  src="/mockup.png"
                  alt="Aperçu de l'application Sue"
                  className="w-full h-auto max-h-[70vh] object-contain"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link 
              to="/mentions-legales" 
              className="text-foreground/70 hover:text-foreground transition-opacity"
            >
              Mentions légales
            </Link>
            <Link 
              to="/confidentialite" 
              className="text-foreground/70 hover:text-foreground transition-opacity"
            >
              Politique de confidentialité
            </Link>
            <Link 
              to="/conditions" 
              className="text-foreground/70 hover:text-foreground transition-opacity"
            >
              Conditions d'utilisation
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Index;