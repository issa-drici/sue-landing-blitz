import { Link } from "react-router-dom";

const Confidentialite = () => {
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
          <h1 className="text-4xl font-bold">Politique de confidentialité</h1>
          
          <div className="space-y-6 text-foreground/90">
            <p>
              Cette page contiendra la politique de confidentialité de l'application Sue.
            </p>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Collecte des données</h2>
              <p>Informations sur la collecte des données personnelles.</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Utilisation des données</h2>
              <p>Comment les données sont utilisées dans l'application.</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Vos droits</h2>
              <p>Les droits des utilisateurs concernant leurs données personnelles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confidentialite;