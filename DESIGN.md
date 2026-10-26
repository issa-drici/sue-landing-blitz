---
name: Sue
description: Le bazar du groupe de discussion qui se range en une seule session de sport.
colors:
  ground-blanc-casse: "#FAFAFA"
  ink: "#0A0A0A"
  volt: "#D4FC79"
  volt-dark: "#8CBF3D"
  surface-white: "#FFFFFF"
  stage-grey: "#ECECEF"
  band-grey: "#F1F1F3"
  chip-grey: "#F2F2F4"
  text-body: "#3A3A3C"
  text-secondary: "#55555A"
  text-tertiary: "#6B6B70"
  ink-on-volt: "#1F2A0A"
  success-ink: "#3D6B12"
  unread-red: "#FF3B30"
typography:
  display:
    fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(3rem, 7.4vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2.4rem, 5.2vw, 4.25rem)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2rem, 3.6vw, 3.1rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.1rem, 1.6vw, 1.35rem)"
    fontWeight: 500
    lineHeight: 1.625
  body:
    fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.625
  ui-title:
    fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "17px"
    fontWeight: 800
    lineHeight: 1.3
  ui-body:
    fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.375
  label:
    fontFamily: "Outfit, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  icon: "10px"
  button: "16px"
  bubble: "20px"
  notification: "22px"
  card: "28px"
  stage: "40px"
  pill: "9999px"
spacing:
  gutter-mobile: "20px"
  gutter-desktop: "32px"
  card-inner: "20px"
  section-mobile: "112px"
  section-desktop: "144px"
  container: "1240px"
  reading-column: "760px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.button}"
    padding: "0 28px 0 20px"
    height: "64px"
  button-primary-compact:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.button}"
    padding: "0 16px 0 14px"
    height: "44px"
  button-text:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.button}"
    padding: "0 28px"
    height: "56px"
  card-app:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-inner}"
  card-cta-volt:
    backgroundColor: "{colors.volt}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "12px 16px"
  chat-bubble:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.bubble}"
    padding: "10px 14px"
  chat-bubble-mine:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.bubble}"
    padding: "10px 14px"
  pain-bubble:
    backgroundColor: "{colors.stage-grey}"
    textColor: "{colors.text-body}"
    rounded: "24px"
    padding: "14px 20px"
  chip-neutral:
    backgroundColor: "{colors.chip-grey}"
    textColor: "{colors.text-tertiary}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  input-message:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.notification}"
    padding: "16px 20px"
---

# Design System: Sue

## Overview

**Creative North Star: "Le groupe qui se range"**

Le site vitrine de Sue vit dans le même monde clair que l'app : un fond blanc cassé, de l'encre presque noire, et un seul accent, le vert volt, posé en aplats comme un coup de surligneur. Tout le reste est emprunté à deux matières que le visiteur connaît déjà : le fil d'un groupe de discussion (bulles grises et blanches, prénoms colorés, pastille rouge de non-lus) et les cartes de l'app Sue (blanches, très arrondies, avec les icônes 3D de sport). Le récit visuel va de l'un à l'autre : le bazar d'abord, la session nette ensuite.

La densité est généreuse : grands titres Outfit 900 serrés, une colonne de 1240px, de larges respirations entre les sections, et des fragments d'interface réels plutôt que des illustrations. La profondeur est douce : ombres d'encre diffuses, jamais de relief dur. Le mouvement sert le récit (l'aspiration des bulles dans la carte au scroll, le trait de feutre qui barre « WhatsApp », les bandes de sports qui défilent) et s'efface entièrement quand l'utilisateur demande moins d'animation.

Rejets confirmés par le contrat de direction : le hero « slogan + mockup de téléphone + grille de fonctionnalités », l'imitation de la marque WhatsApp, et toute preuve sociale inventée.

**Key Characteristics:**
- Fond clair #FAFAFA, encre #0A0A0A, un seul accent volt en aplats.
- Outfit 900 à interlettrage négatif pour tous les titres, Outfit 500 pour le texte.
- Bulles de discussion génériques et cartes d'app blanches à grands rayons comme seuls décors.
- Icônes 3D de sport maison, jamais de pictogrammes à la place.
- L'action est toujours un bouton noir.
- Ombres d'encre diffuses à étalement négatif ; aucun contour dur.

## Colors

Une palette quasi monochrome, chaude de lumière, où le volt est la seule couleur de marque et le rouge n'existe que pour dire le bazar.

### Primary
- **Vert Volt** (volt): l'accent unique de Sue. Toujours en aplat : surligneur derrière les titres de fonctionnalité, trait de feutre qui barre un mot, bande finale entière, pastille « Il manque 1 joueur » et bouton « Je viens » dans les cartes, couleur de sélection du texte, anneau de focus autour des boutons noirs.
- **Volt Profond** (volt-dark): la version du volt qui se voit sur fond clair. Contours et pastilles d'état « réussi » (créneau retenu, point « Avec Sue »), bordure des champs au focus, et token `--ring` du thème.

### Neutral
- **Blanc Cassé** (ground-blanc-casse): fond de toutes les pages du site vitrine, de l'en-tête translucide (à 80 % avec flou) et `theme-color` du navigateur.
- **Encre** (ink): titres, texte fort, boutons d'action, bulle « moi ». Jamais du noir pur.
- **Blanc Carte** (surface-white): cartes d'app, bulles reçues, notifications, champs. Se détache du blanc cassé par l'ombre, pas par une bordure forte.
- **Gris Bulle** (stage-grey): la scène du bazar (panneau à 40px) et les bulles de « galère » ; c'est le gris des fils de discussion.
- **Gris Bande** (band-grey): bande pleine largeur qui rythme une rangée sur deux dans la section des galères.
- **Gris Pastille** (chip-grey): pastilles neutres, compteurs « +4 », état « En attente ».
- **Gris Texte** (text-body): texte courant et sous-titres sur fond clair.
- **Gris Secondaire** (text-secondary): mentions (« Gratuit · sur iPhone »), liens du pied de page, corps des notifications.
- **Gris Tertiaire** (text-tertiary): métadonnées (lieu, horaire, « 6/6 ont répondu »). Le plus clair des gris autorisés pour du petit texte.
- **Encre Olive** (ink-on-volt): texte courant posé sur la bande volt, plus doux que l'encre pure mais du même monde.
- **Vert Confirmé** (success-ink): texte des états confirmés (« Je viens », « Lien copié »).
- **Rouge Non-lus** (unread-red): uniquement la pastille de non-lus des groupes et le point d'état « bazar ». C'est la couleur du problème, jamais celle de Sue.

Les prénoms des bulles reçoivent des couleurs de discussion saturées (#2E7D32, #6A1B9A, #AD1457, #1565C0, #EF6C00…) et les avatars à initiales des teintes pastel (#FFF1DC, #EFE3F7, #E3F4E8, #FDE3E6, #E1EEFB) : ce sont des couleurs de contenu qui imitent l'app et les fils de discussion, pas des couleurs de marque.

### Named Rules
**The Volt Flat Rule.** Le volt se pose en aplat ou en trait épais, jamais en texte sur fond clair, jamais en dégradé ni en halo. Quand le volt doit se lire comme un contour ou un état sur blanc, on passe au Volt Profond.

**The Red Is Chaos Rule.** Le rouge #FF3B30 n'apparaît que dans le bazar (non-lus, point d'état « avant »). Dès que Sue entre en scène, il disparaît.

**The Readable Grey Rule.** Sur fond clair, le texte de moins de 18px n'utilise que #3A3A3C, #55555A ou #6B6B70. Les gris plus clairs (#8A8A90, #C7C7CC) restent réservés aux dénominateurs en gros chiffres et aux traits.

## Typography

**Display Font:** Outfit (avec -apple-system, BlinkMacSystemFont, sans-serif)
**Body Font:** Outfit (même famille)

**Character:** Une seule famille, poussée aux deux extrêmes : 900 compacte et serrée pour les titres, comme une affiche de club, et 500 posée pour le texte, ronde et facile à lire pour un public peu technophile.

### Hierarchy
- **Display** (900, clamp(3rem, 7.4vw, 6rem), 0.92, -0.04em): le titre du haut de page ; la bande finale reprend la même voix (clamp(3rem, 8vw, 6rem), 0.9). `text-wrap: balance`.
- **Headline** (900, clamp(2.4rem, 5.2vw, 4.25rem), 0.98, -0.035em): titres de section, souvent limités à ~16ch.
- **Title** (900, clamp(2rem, 3.6vw, 3.1rem), 1, -0.03em): titres de fonctionnalité, toujours surlignés au volt.
- **Lead** (500, clamp(1.1rem, 1.6vw, 1.35rem), 1.625): sous-titre du haut de page, ~34rem de large.
- **Body** (500, 18px, 1.625): paragraphes, ~30rem de large au plus.
- **UI title** (800, 17px): titres des fragments d'app (« Joueurs », « Choisis le créneau ») ; les grands compteurs passent en 800 à 22-28px avec chiffres tabulaires.
- **UI body** (700, 14px): libellés de boutons internes et lignes de liste.
- **Label** (600, 13px): métadonnées, mentions, « Fais défiler ».

Le logotype « Sue » est composé en Outfit 900, -0.04em (24px dans l'en-tête, 19px dans le pied).

### Named Rules
**The Tight Display Rule.** Tout titre est en Outfit 900 avec un interlettrage entre -0.03em et -0.04em et un interlignage inférieur ou égal à 1. Pas de titre en graisse moyenne, pas de police système pour les titres.

**The Highlighter Rule.** Un titre de fonctionnalité se marque par une bande volt derrière le bas des lettres (de 58 % à 92 % de la hauteur), avec `box-decoration-break: clone` pour suivre les retours à la ligne. C'est le seul ornement typographique du système.

## Layout

Une colonne centrée de 1240px avec des marges de 20px sur mobile et 32px dès 640px. Les sections respirent : 112px en haut sur mobile, 144px sur grand écran ; la bande finale volt prend 96 à 128px de padding vertical. Le haut de page et les galères sont en deux colonnes sur grand écran (1.05fr / 1fr pour le haut, 1fr / 1fr alternées pour les galères) et s'empilent sur mobile, texte avant démonstration. Les rangées de galères alternent texte à gauche et texte à droite, et une rangée sur deux est posée sur une bande grise pleine largeur.

Le haut de page est une section épinglée de 240vh dont la partie collante fait 100svh ; la scène fait au plus min(640px, 78svh) et ses éléments se positionnent en unités de conteneur (`container-type: size`). Les pages de texte (contact, mentions, 404) utilisent la même coque : en-tête fixe de 72px, colonne de lecture de 760px, padding haut de 128px.

## Elevation & Depth

Hybride : la profondeur vient du contraste blanc sur blanc cassé, porté par des ombres d'encre très diffuses à étalement négatif, qui posent les objets sans les découper. Les surfaces reçoivent un filet d'encre à 4-6 % d'opacité, presque invisible. Aucun relief dur, aucune ombre décalée.

### Shadow Vocabulary
- **Carte héros** (`box-shadow: 0 30px 60px -24px rgba(10,10,10,0.35)`): la carte de session qui naît du bazar.
- **Carte fragment** (`box-shadow: 0 24px 50px -28px rgba(10,10,10,0.3)`): cartes d'app des galères.
- **Notification** (`box-shadow: 0 18px 40px -26px rgba(10,10,10,0.35)`): notifications empilées, sur fond blanc à 90 % avec flou.
- **Tuile de sport** (`box-shadow: 0 14px 30px -22px rgba(10,10,10,0.35)`): tuiles des bandes de sports.
- **Bulle** (`box-shadow: 0 10px 24px -14px rgba(10,10,10,0.45)`) et **en-tête de groupe** (`0 12px 28px -16px rgba(10,10,10,0.4)`): éléments du bazar, un peu plus nets pour flotter sur le gris.
- **Survol bouton** (`box-shadow: 0 14px 30px -12px rgba(10,10,10,0.55)`): apparaît avec une montée de 2px.

### Named Rules
**The Soft Ink Shadow Rule.** Toute ombre est teintée de l'encre #0A0A0A, a un flou au moins deux fois plus grand que son décalage et un étalement négatif. Une ombre qui dessine un bord net n'appartient pas à ce monde.

## Shapes

Des formes d'app iOS : rayons généreux, jamais d'angle vif. Les boutons et les blocs internes sont à 16px, les bulles à 20px (24px pour les bulles de galère), les notifications et les champs à 22px, les cartes et les tuiles de sport à 28px, la scène du bazar à 40px, les icônes d'app à 10-11px, les pastilles et avatars entièrement ronds. Les bulles de discussion ont un seul coin aplati côté émetteur (6-8px, en bas à gauche pour les autres, en bas à droite pour « moi »). Les emplacements libres se dessinent en pointillé de 1.5px. Le trait de feutre est un tracé SVG à bouts ronds, épais et légèrement incliné (-2°).

**The Concentric Radius Rule.** Plus l'objet est grand, plus son rayon l'est : 16 → 22 → 28 → 40. Un bloc posé dans une carte à 28px prend 16px.

## Components

### Buttons
Noirs, épais, sûrs d'eux : l'action ne change jamais de couleur.
- **Shape:** coins doux (16px).
- **Primary (App Store):** fond encre, texte blanc, logo Apple en SVG ; grand format 64px de haut avec « Télécharger sur » (11px, blanc 70 %) au-dessus de « l'App Store » (700, 22px) ; format compact 44px dans l'en-tête avec « Télécharger » (700, 15px).
- **Primary texte:** même fond encre, 56px de haut, 28px de padding, 700 16px (Contact, 404).
- **Hover / Focus:** montée de 2px et ombre « survol bouton » en 300ms ease-out ; retour à plat au clic ; anneau de focus volt de 4px.
- **Lien d'action:** texte 700 souligné (2px, décalé de 4px) avec flèche, dont l'écart s'élargit au survol.

### Chips
- **Style:** pastilles rondes, 700 12px, padding 4px 10px.
- **State:** confirmé (fond #E9F8D2, texte Vert Confirmé), en attente (Gris Pastille, Gris Tertiaire), refus (fond #FDECEC, texte #B42318), meilleur créneau (fond volt).

### Cards / Containers
- **Corner Style:** 28px.
- **Background:** Blanc Carte sur Blanc Cassé.
- **Shadow Strategy:** carte fragment ou carte héros (voir Elevation & Depth).
- **Border:** filet d'encre à 4-5 %.
- **Internal Padding:** 20px ; les blocs internes (créneaux, joueurs) à 16px de rayon, et le bloc d'appel volt en bas de carte.
- **Encart sur volt:** sur la bande volt, un encart d'encre à 6 % d'opacité, rayon 28px, padding 24px.

### Inputs / Fields
- **Style:** fond blanc, filet d'encre à 8 %, rayon 22px, padding 16px 20px, 500 16px.
- **Focus:** bordure Volt Profond et anneau volt à 60 % de 4px.
- **Placeholder:** Gris Tertiaire, conformément à la Readable Grey Rule.

### Navigation
En-tête fixe de 72px, blanc cassé à 80 % avec flou, logotype (icône 36px à 10px de rayon + « Sue ») à gauche, bouton App Store compact à droite. Pied de page séparé par un filet d'encre à 6 %, liens 600 14px Gris Secondaire qui passent à l'encre et se soulignent au survol. Aucun menu : le site n'a qu'une action.

### Bulles de discussion (signature)
Bulles génériques, sans marque : reçues en blanc avec le prénom en couleur (700 12px), « moi » en encre avec texte blanc, 14px, au plus 210px de large, inclinées de ±7° dans le bazar. Les bulles de galère sont plus grandes (19px, Gris Bulle), le message barré d'un trait d'encre à 45 %. Les en-têtes de groupe (rayon 18px) portent la pastille rouge de non-lus en chiffres tabulaires.

### Carte de session (signature)
La carte de l'app : bandeau de 150px sur fond de terrain avec voile d'encre de gauche à droite, icône 3D du sport qui déborde en haut à droite, nom de session en 800 26px blanc, puis lieu, avatars à initiales cerclés de blanc (36px, chevauchés), compteur « 9/10 » et bloc d'appel volt « Il manque 1 joueur » ; quand la session est complète, le bloc passe en encre avec texte volt.

### Bandes de sports
Deux rangées de tuiles blanches à 28px (88px, 112px dès 640px) portant les icônes 3D, qui défilent en sens opposés (40s et 46s, linéaire, en boucle), s'arrêtent au survol, se fondent aux bords par un masque et s'immobilisent si l'animation est réduite.

## Do's and Don'ts

### Do:
- **Do** poser le volt #D4FC79 en aplat (surligneur, trait de feutre, bande, bloc d'appel) et passer au Volt Profond #8CBF3D pour tout contour ou état sur fond clair.
- **Do** composer chaque titre en Outfit 900, interlettrage -0.03em à -0.04em, interlignage ≤ 1.
- **Do** montrer de vrais fragments de l'app (cartes à 28px, avatars à initiales, icônes 3D) plutôt que des illustrations ou des pictogrammes.
- **Do** garder l'action principale en bouton encre #0A0A0A à 16px de rayon, avec anneau de focus volt.
- **Do** teinter toutes les ombres à l'encre avec un étalement négatif.
- **Do** prévoir une version sans mouvement pour chaque animation (`prefers-reduced-motion`) : le bazar puis la session, l'un sous l'autre.

### Don't:
- **Don't** reprendre le logo, le vert ou l'interface de WhatsApp : les bulles restent génériques.
- **Don't** construire un hero « slogan + mockup de téléphone + grille de fonctionnalités ».
- **Don't** écrire du texte en volt sur fond clair, ni utiliser le volt en dégradé ou en lueur.
- **Don't** utiliser le rouge #FF3B30 ailleurs que pour le bazar (non-lus, état « avant »).
- **Don't** inventer de preuve sociale (chiffres, avis, logos de presse).
- **Don't** poser de petit texte (moins de 18px) dans un gris plus clair que #6B6B70.

## Surfaces apparentées

La web app (`src/web/*`) et la page d'invitation (`src/pages/Join.tsx`) sont antérieures à ce monde et consomment la même palette de façon plus légère, via les tokens shadcn de `src/index.css` (`--primary` volt, `--secondary` #ECECEF, `--ring` #8CBF3D) et la police `sans` système de Tailwind. Elles ne sont pas redéfinies ici ; une future refonte devrait les rapprocher de ce document.
