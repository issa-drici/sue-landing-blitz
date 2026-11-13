import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./web/pwa";

createRoot(document.getElementById("root")!).render(<App />);

// Version web installable (écran d'accueil Android et ordinateur)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
}
