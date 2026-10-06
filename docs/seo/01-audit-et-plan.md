# Chantier SEO Forty Services : audit et plan (7 octobre 2026)

Branche de travail : `seo/pages-services`. Rien n'est publié. Version de référence : commit `f2e1588` (voir `docs/seo/00-sauvegarde.md`).

## 1. Audit de la version en ligne

Mesuré le 7 octobre 2026 par requêtes directes sur https://fortyservices.ma/. Les robots sont simulés par leur nom (en-tête User-Agent) : cela ne prouve pas l'accès depuis leurs vraies adresses.

### Conforme

| Point | Constat |
|---|---|
| Domaine unique | `http://`, `www.` et `forty-services.onrender.com` redirigent en 301 vers `https://fortyservices.ma/` |
| Accueil | 200, titre de 64 caractères, canonique `https://fortyservices.ma/`, `index, follow`, un seul H1 |
| Hiérarchie | 1 H1, 8 H2, 17 H3, sans saut de niveau dans le contenu |
| robots.txt | `Allow: /` pour tous, sitemap déclaré |
| En-têtes | Aucun `X-Robots-Tag` |
| Robots | Googlebot, Bingbot, OAI-SearchBot et GPTBot reçoivent un 200 et la page complète |
| Contenu sans JavaScript | 926 mots présents dans le HTML : titres, services, références, FAQ, coordonnées |
| Images | Aucune image sans attribut `alt` |
| Liens | Aucune ancre cassée |
| Page 404 | Renvoie bien 404, avec `noindex` |
| Traceurs | Aucun outil de mesure installé |
| Compression et cache | Brotli actif ; CSS et JS en cache long, images un jour |

### À corriger

| N° | Constat | Correction prévue |
|---|---|---|
| A1 | `/carte/` et `/mentions-legales/` répondent 200 comme la version sans barre finale | Redirection 301 vers l'adresse sans barre finale (utile aussi pour les futures pages) |
| A2 | Le sitemap ne liste que deux adresses, sans date | Ajouter les quatre pages et une date de modification |
| A3 | Méta-description de l'accueil : 172 caractères, risque de coupure | La ramener vers 150 caractères |
| A4 | Données structurées sans identifiant stable (`@id`) | Ajouter `@id` à l'entreprise et y relier les services |
| A5 | L'accueil ne mène qu'aux mentions légales : aucun lien interne vers des pages de services | Liens « Découvrir la prestation », pied de page et navigation |
| A6 | Quatre images sans dimensions (photo d'équipe, trois logos) : décalage de mise en page au chargement | Ajouter `width` et `height` |
| A7 | Photo d'équipe : 357 Ko pour 930 × 1691 px | Version allégée, sans changer le cadrage |
| A8 | `/favicon.ico` répond 404 | Rediriger vers `favicon.svg` |
| A9 | Texte de la section équipe : « Mustapha Shait » (oubli) | « Mustapha SHAIT » |
| A10 | `/mentions-legales` sans balises de partage | Ajout simple (titre, description) |

### Statut de `/carte`

`noindex, nofollow`, sans canonique, absente du sitemap, avec ses propres balises de partage. Elle sert au partage et à l'enregistrement des coordonnées. Statut conservé.

### Décision à prendre : GPTBot

`robots.txt` autorise aujourd'hui tous les robots, donc aussi GPTBot (entraînement) et OAI-SearchBot (recherche). Rien n'a été activé pour cela : c'est l'effet de `Allow: /`. Deux choix possibles : laisser tel quel, ou autoriser OAI-SearchBot et interdire GPTBot.

### Non vérifié

- Accès réel depuis les adresses des robots (seul leur nom a été simulé). L'hébergement passe par Cloudflare : un blocage à ce niveau ne se verrait que dans Search Console ou les journaux.
- Indexation réelle dans Google et Bing : aucun accès à Search Console ni à Bing Webmaster Tools.
- Mesure de performance : à faire au moment des tests avant publication.

## 2. Mots-clés par page (hypothèses)

Aucun outil de recherche de mots-clés n'est disponible ici. Les expressions ci-dessous sont des hypothèses de travail, sans volume ni niveau de concurrence. Elles seront à confronter aux données de Search Console après quelques semaines.

| Page | Intention | Expression principale | Expressions associées |
|---|---|---|---|
| `/` | Trouver l'entreprise ou un prestataire global | Forty Services ; gardiennage et nettoyage professionnel au Maroc | société de gardiennage au Maroc ; société de gardiennage à Casablanca ; entreprise de nettoyage à Casablanca |
| `/surveillance` | Faire surveiller un site, un commerce, un événement | surveillance de sites professionnels | contrôle des accès ; rondes ; surveillance événementielle |
| `/gardiennage` | Assurer une présence sur des locaux ou un chantier | gardiennage de locaux et de chantiers | gardiennage de chantiers ; gardiennage d'entrepôts ; agent de gardiennage |
| `/nettoyage-locaux` | Faire entretenir des bureaux ou des locaux | nettoyage professionnel de bureaux et de locaux | nettoyage de bureaux ; entretien de locaux ; nettoyage de parties communes |
| `/nettoyage-fin-chantier` | Rendre des locaux propres après travaux | nettoyage de fin de chantier | nettoyage après travaux ; remise en état avant livraison |

L'accueil garde son positionnement national. Casablanca reste cité là où c'est vrai : siège à Sidi Moumen, zone d'intervention.

## 3. Plan des quatre pages

Structure commune : fil d'Ariane, H1, introduction, sites concernés, prestations, organisation de l'intervention, engagements, références associées, FAQ, bloc de contact « Demander un devis », liens vers les autres prestations. Illustration : l'image fixe déjà existante de chaque scène (`scene-0` à `scene-3`), sans nouvelle scène 3D.

Ce qui est déjà validé sur le site est noté « acquis ». Le reste est « à confirmer » : rien de cela ne sera publié sans réponse.

### /surveillance

- H1 : Surveillance de sites professionnels au Maroc
- Acquis : contrôle des accès, rondes ; sites professionnels, commerces, événements ; agents ; prévention des risques selon les besoins définis pour le site.
- Références confirmées : Consulat de la République de Slovénie, Melliber Appart Hôtel, DNA Maroc.
- À confirmer :
  1. Surveillance de jour, de nuit, ou les deux ?
  2. Les agents sont-ils en tenue identifiable ? Avec quels moyens (radio, téléphone, main courante) ?
  3. Que fait l'agent en cas d'incident (qui est prévenu, sous quelle forme) ?
  4. Événements : quels types (salons, réceptions, événements d'entreprise) ?

### /gardiennage

- H1 : Gardiennage de locaux et de chantiers au Maroc
- Acquis : bâtiments, entrepôts, chantiers ; présence ponctuelle ou régulière ; comptes rendus d'intervention ; prise en compte des contraintes du site.
- Références confirmées : AMITH, DNA Maroc.
- À confirmer :
  1. Quelle différence faites-vous, pour un client, entre surveillance et gardiennage ?
  2. Forme et rythme des comptes rendus (écrit, quotidien, à la demande) ?
  3. Gardiennage de nuit et de week-end sur chantier : oui ou non ?
  4. Durée minimale d'une mission ponctuelle, s'il y en a une ?

### /nettoyage-locaux

- H1 : Nettoyage professionnel de bureaux et de locaux au Maroc
- Acquis : bureaux, commerces, parties communes ; passages planifiés selon les besoins ; produits adaptés ; résultat contrôlé.
- Référence confirmée : AMITH.
- À confirmer :
  1. Tâches courantes réellement réalisées (sols, sanitaires, vitres, poubelles, poussière) ?
  2. Qui fournit les produits et le matériel ?
  3. Passages possibles en dehors des heures d'ouverture ?
  4. Comment le résultat est-il contrôlé, et par qui ?

### /nettoyage-fin-chantier

- H1 : Nettoyage de fin de chantier au Maroc
- Acquis : remise en état après travaux ; dépoussiérage ; vitres, sols, surfaces ; avant la livraison des locaux ; défini selon les besoins du chantier.
- Référence confirmée : aucune pour cette prestation. Le bloc de références n'apparaîtra pas sur cette page.
- À confirmer :
  1. Types de chantiers (logements, bureaux, commerces, bâtiments neufs, rénovations) ?
  2. Enlèvement des résidus (colle, peinture, ciment, protections) : oui ou non ?
  3. Évacuation des gravats : comprise ou exclue ?
  4. Une ou plusieurs passes (dégrossissage puis finition) ?
  5. Une référence de chantier citable ?

### FAQ par page

Chaque page aura ses propres questions, tirées des réponses ci-dessus. Les questions générales (zone d'intervention, devis sous 24 h) restent sur l'accueil et ne seront pas recopiées.

## 4. Suite prévue

1. Réponses aux questions « à confirmer ».
2. Corrections A1 à A10.
3. Création des quatre pages, liens, sitemap, données structurées.
4. Tests à 320, 375, 390, 430 px et sur ordinateur, puis présentation avant publication.
