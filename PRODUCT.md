# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Joueurs du dimanche et groupes de potes en France qui font du sport ensemble (five, foot, padel, basket, running, musculation…). Une personne organise, les autres répondent. Aujourd'hui ils s'organisent dans des groupes WhatsApp ou Snap différents pour chaque sport, avec des membres qui changent d'un groupe à l'autre. Public peu technophile : ils veulent que ce soit simple et rapide.

Visiteurs de ce site : surtout des personnes qui ont reçu un lien d'invitation à une session, ou qui découvrent Sue par le bouche-à-oreille. Sur iPhone, ils doivent installer l'app ; sur Android et ordinateur, ils peuvent répondre et suivre leurs sessions depuis le site (`/join/:token`, `/app`).

## Product Purpose

Sue remplace le bazar des groupes de messagerie pour organiser une session de sport : créer la session en 30 secondes, partager un lien, voir qui vient, rappels automatiques. Succès de la landing : le visiteur télécharge l'app iOS.

## Positioning

Une seule appli pour toutes les sessions, quel que soit le sport et le groupe :
- chacun répond en un tap, tout le monde voit qui vient en temps réel (fini la liste copiée-collée et renvoyée dix fois) ;
- « Trouver un créneau » : pas de date fixée, l'organisateur propose des créneaux, les potes cochent leurs dispos et peuvent en proposer d'autres, l'organisateur confirme ;
- rappels et changements notifiés automatiquement (fini les oublis et les relances en privé) ;
- limite de joueurs : la session se remplit, on voit quand il manque quelqu'un.

## Operating Context

Le site sert de landing marketing (`/`), de page d'invitation (`/join/:token`, réponse sans l'app sur Android et ordinateur, jamais sur iPhone) et de web app minimale (`/app` : mes sessions, page session, dispos, propositions de créneaux). Même compte et même API que l'app mobile (connexion par téléphone + code SMS).

## Capabilities and Constraints

- App iOS uniquement (App Store : https://apps.apple.com/fr/app/sue/id6749824461). Pas d'app Android publiée : sur Android, renvoyer vers la web app plutôt que Google Play.
- Action principale actuelle de la landing : télécharger l'app iOS. Créer une session depuis le web n'existe pas encore (pourra devenir l'action principale plus tard).
- Gratuit.
- 48 sports avec des icônes 3D maison (`public/sports/*.webp`) et des fonds de terrain (`public/surfaces/*.webp`).
- Stack existante : React + Vite + Tailwind + shadcn/ui, routes react-router.
- Vocabulaire : « session » (pas « match », qui ne colle pas à tous les sports), « créneau », « dispo », « vestiaire » (discussion d'une session), « potes ».

## Brand Commitments

- Nom : Sue. Ton : tutoiement, direct, complice, phrases courtes, français courant.
- Identité de l'app : vert volt #D4FC79, noir #0A0A0A, blanc cassé #FAFAFA, police Outfit, objets et icônes 3D (sports, marque).
- Thème clair demandé pour la landing (l'ancien thème sombre ne plaît pas).
- Assets de marque : `public/brand/` (date, find-slot, invite, notifications, hero-3d, avatar par défaut, icône), `public/logo.png`.

## Evidence on Hand

Aucune preuve sociale réelle pour l'instant : pas de chiffres d'usage, pas d'avis, pas de témoignages, pas de presse. Ne rien inventer (l'ancien « 2,000+ matchs organisés ce mois-ci » est faux et doit disparaître). La confiance passe par la clarté, la gratuité et le produit montré.

## Product Principles

1. Le problème avant la solution : le visiteur doit se reconnaître dans le bazar des groupes WhatsApp.
2. Simple d'abord : chaque écran et chaque phrase doivent être compris par quelqu'un de peu technophile.
3. Montrer le vrai produit : les fonctionnalités sont celles de l'app, sans promesse en plus.
4. Une action claire : télécharger l'app.
5. Toutes les pratiques : ne jamais parler comme si Sue n'était que pour le foot.
