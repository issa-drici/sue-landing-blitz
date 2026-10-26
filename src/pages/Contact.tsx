import { useState } from "react";
import { Send } from "lucide-react";
import { SitePage } from "@/components/landing/SiteChrome";

const Contact = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const subject = encodeURIComponent("Contact depuis le site Sue");
      const body = encodeURIComponent(message);
      window.location.href = `mailto:contact@sue-app.com?subject=${subject}&body=${body}`;
    }
  };

  return (
    <SitePage>
      <h1 className="text-[clamp(2.6rem,6vw,4rem)]">Une question ? Écris-nous.</h1>
      <p className="mt-5 text-[19px] font-medium leading-relaxed text-[#3A3A3C]">
        Un bug, une idée, un sport qui manque : on lit tous les messages.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
        <label htmlFor="message" className="text-[15px] font-bold">Ton message</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Raconte-nous…"
          required
          className="min-h-[160px] resize-y rounded-[22px] border border-black/[0.08] bg-white px-5 py-4 text-[16px] font-medium placeholder:text-[#8A8A90] focus:outline-none focus:border-[#8CBF3D] focus:ring-4 focus:ring-[#D4FC79]/60"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="self-start inline-flex items-center gap-2 h-14 px-7 rounded-2xl bg-[#0A0A0A] text-white text-[16px] font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D4FC79]"
        >
          <Send className="w-4 h-4" /> Envoyer le message
        </button>
        <p className="text-[14px] text-[#6B6B70]">Ton application mail s'ouvre avec le message prêt à partir vers contact@sue-app.com.</p>
      </form>
    </SitePage>
  );
};

export default Contact;
