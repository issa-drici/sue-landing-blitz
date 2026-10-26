import { SitePage } from "@/components/landing/SiteChrome";

const Conditions = () => {
  return (
    <SitePage>
        
        <div className="space-y-8">
          <h1 className="text-4xl font-bold">Conditions d'utilisation</h1>
          
          <div className="space-y-6 text-foreground/90">
            <p>
              Cette page contiendra les conditions d'utilisation de l'application Sue.
            </p>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Acceptation des conditions</h2>
              <p>Conditions d'acceptation pour l'utilisation de l'application.</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Utilisation du service</h2>
              <p>Règles d'utilisation de l'application Sue.</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Responsabilités</h2>
              <p>Responsabilités des utilisateurs et de l'éditeur.</p>
            </div>
          </div>
        </div>
    </SitePage>
  );
};

export default Conditions;