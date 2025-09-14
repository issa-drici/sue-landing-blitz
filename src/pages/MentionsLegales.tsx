import { Link } from "react-router-dom";

const MentionsLegales = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link 
            to="/" 
            className="text-foreground/70 hover:text-foreground transition-opacity text-sm"
          >
            ← Retour à l'accueil
          </Link>
        </div>
        
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
      </div>
    </div>
  );
};

export default MentionsLegales;