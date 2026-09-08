# Forty Services — Site vitrine (MVC Express)

Site vitrine de **Forty Services** (Casablanca) : surveillance, gardiennage, nettoyage de locaux et nettoyage de fin de chantier.

Architecture **MVC** avec Node.js, Express et EJS.

## Structure du projet

```
fortyService/
├── server.js                  Point d'entrée (démarre le serveur)
├── package.json
├── src/
│   ├── app.js                 Configuration Express
│   ├── models/
│   │   └── entreprise.js      MODÈLE : toutes les données (textes, numéros, services)
│   ├── controllers/
│   │   └── pagesController.js CONTRÔLEUR : relie modèle et vues
│   ├── routes/
│   │   └── index.js           ROUTES : URL → contrôleur
│   └── views/                 VUES (gabarits EJS)
│       ├── index.ejs          Page d'accueil
│       ├── 404.ejs            Page d'erreur
│       └── partials/          Morceaux réutilisables
│           ├── tete.ejs       <head> : SEO, Open Graph, JSON-LD
│           ├── entete.ejs     Barre de navigation
│           ├── pied.ejs       Pied de page + bouton WhatsApp
│           ├── marque.ejs     Logo flèche de la marque
│           ├── icones.ejs     Bibliothèque d'icônes SVG
│           └── whatsapp-icone.ejs
└── public/                    Fichiers statiques
    ├── css/style.css          Toute la feuille de style
    ├── js/main.js             Menu mobile + apparition au défilement
    ├── favicon.svg
    ├── robots.txt
    └── sitemap.xml
```

**Règle d'or : pour changer un texte, un numéro ou un service, modifier UNIQUEMENT
`src/models/entreprise.js`.** Les vues se mettent à jour toutes seules.

## Lancer en local

```bash
npm install
npm start          # http://localhost:3000
npm run dev        # avec rechargement automatique
```

## Mise en ligne (hébergement Node.js)

### Option 1 — Render (gratuit, recommandé)

1. Pousser ce dossier sur un dépôt GitHub
2. Sur <https://render.com> : New → Web Service → connecter le dépôt
3. Réglages : Build Command `npm install`, Start Command `npm start`
4. Le site est en ligne sur une adresse `*.onrender.com`

> Le plan gratuit de Render met le serveur en veille après 15 min d'inactivité
> (premier chargement lent). Pour un site professionnel, le plan payant (~7 $/mois)
> ou Railway supprime cette veille.

### Option 2 — Railway

<https://railway.app> : New Project → Deploy from GitHub repo. Détection automatique.

### Nom de domaine personnalisé

Un domaine type `fortyservices.ma` ou `.com` se branche dans les réglages
de Render/Railway (Custom Domain), puis pointer les DNS chez le registrar.

## Après la mise en ligne — une seule fois

1. **Remplacer** `fortyservices.example` par le vrai domaine dans
   `public/robots.txt` et `public/sitemap.xml`
2. **Google Search Console** : <https://search.google.com/search-console> —
   déclarer le site, soumettre `sitemap.xml`
3. **Google Business Profile** : <https://business.google.com> — fiche gratuite
   (adresse Sidi Moumen, horaires 24/7, lien vers le site).
   Pour une entreprise locale, c'est la première source d'appels.
