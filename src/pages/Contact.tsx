import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

const Contact = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const subject = encodeURIComponent("Contact depuis le site Sue");
      const body = encodeURIComponent(message);
      const mailtoLink = `mailto:contact@sue-app.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-foreground/90">
              Une question ? Une suggestion ? N'hésitez pas à nous écrire !
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Votre message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez votre question ou suggestion..."
                className="min-h-[120px] resize-none"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full text-lg py-6"
              disabled={!message.trim()}
            >
              Envoyer le message
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link 
              to="/" 
              className="text-foreground/70 hover:text-foreground transition-opacity"
            >
              ← Retour à l'accueil
            </Link>
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

export default Contact;
