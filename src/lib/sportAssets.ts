// Visuels du kit Sue (mêmes fichiers que l'app mobile) : icônes 3D des sports et terrains.
// Les identifiants de sport viennent de l'API (avec accents) ; les fichiers n'en ont pas.

const fileName = (sport: string) =>
    sport.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const SPORTS_WITH_ICON = new Set([
    "aikido", "aquafitness", "athletisme", "aviron", "badminton", "baseball", "basketball", "bodyboard",
    "bowling", "boxe", "course", "cyclisme", "danse", "equitation", "escalade", "football", "golf",
    "gymnastique", "handball", "hockey", "jiu-jitsu-bresilien", "judo", "karate", "kayak", "marche-nordique",
    "marche-sportive", "musculation", "natation", "padel", "peche", "petanque", "pilates", "ping-pong",
    "planche-a-voile", "randonnee", "rugby", "sauvetage-sportif", "skateboard", "ski", "snowboard", "squash",
    "stand-up-paddle", "surf", "tennis", "tir-a-l-arc", "triathlon", "volleyball", "yoga",
]);

export const getSportIconUrl = (sport?: string | null): string | null => {
    const name = fileName(sport || "");
    return SPORTS_WITH_ICON.has(name) ? `/sports/${name}.webp` : null;
};

// Terrain où se pratique chaque sport
const SPORT_SURFACES: Record<string, string> = {
    football: "grass", rugby: "grass", golf: "grass",
    tennis: "clay",
    basketball: "parquet-basket",
    handball: "parquet-multisport", volleyball: "parquet-multisport", badminton: "parquet-multisport", squash: "parquet-multisport",
    padel: "padel", "ping-pong": "ping-pong",
    judo: "tatami", karate: "tatami", aikido: "tatami", "jiu-jitsu-bresilien": "tatami",
    boxe: "ring",
    course: "athletics-track", athletisme: "athletics-track", triathlon: "athletics-track",
    randonnee: "trail", "marche-nordique": "trail", "marche-sportive": "trail",
    cyclisme: "road", skateboard: "road",
    musculation: "gym-floor",
    danse: "studio", yoga: "studio", pilates: "studio", gymnastique: "studio",
    natation: "pool", aquafitness: "pool", "sauvetage-sportif": "pool",
    aviron: "lake", kayak: "lake", peche: "lake", "stand-up-paddle": "lake",
    surf: "waves", bodyboard: "waves", "planche-a-voile": "waves",
    ski: "snow", snowboard: "snow",
    hockey: "ice",
    baseball: "baseball-dirt",
    petanque: "gravel",
    escalade: "climbing-wall",
    equitation: "arena-sand",
    bowling: "bowling-lane",
    "tir-a-l-arc": "archery-target",
};

export const getSportSurfaceUrl = (sport?: string | null): string | null => {
    const surface = SPORT_SURFACES[fileName(sport || "")];
    return surface ? `/surfaces/${surface}.webp` : null;
};
