import { Link } from "react-router-dom";
import { SitePage } from "@/components/landing/SiteChrome";

const NotFound = () => (
  <SitePage>
    <img src="/sports/football.webp" alt="" className="w-28 h-28 object-contain" />
    <h1 className="mt-6 text-[clamp(2.6rem,6vw,4rem)]">Hors-jeu.</h1>
    <p className="mt-4 text-[19px] font-medium text-[#3A3A3C]">Cette page n'existe pas, ou plus.</p>
    <Link
      to="/"
      className="mt-8 inline-flex items-center h-14 px-7 rounded-2xl bg-[#0A0A0A] text-white text-[16px] font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D4FC79]"
    >
      Retour à l'accueil
    </Link>
  </SitePage>
);

export default NotFound;
