import { SitePage } from "@/components/landing/SiteChrome";

const MentionsLegales = () => {
  return (
    <SitePage>
        
        <div className="space-y-8">
          <h1 className="text-4xl font-bold">Mentions légales</h1>
          
          <div className="space-y-6 text-foreground/90">
            <p>
              Cette page contiendra les mentions légales de l'application Sue.
            </p>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Éditeur</h2>
              <p>Informations sur l'éditeur de l'application Sue.</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Hébergement</h2>
              <p>Informations sur l'hébergement de l'application.</p>
            </div>
          </div>
        </div>
    </SitePage>
  );
};

export default MentionsLegales;