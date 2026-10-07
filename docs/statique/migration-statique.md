# Version statique : étude et notice de prévisualisation

Branche : `statique/pre-rendu` (non publiée). Rien n'est changé sur `main`, sur le service Render actuel, sur le domaine ni sur le DNS.

## Principe

`npm run build:statique` démarre l'application Express actuelle en mémoire, lui demande chaque page et enregistre le HTML dans `dist/`, puis y copie `public/`. Le site continue donc de s'écrire comme aujourd'hui (EJS, modèles) ; seul l'hébergement change.

| Commande | Rôle |
|---|---|
| `npm run build:statique` | génère `dist/` (7 pages + `404.html` + fichiers de `public/`) |
| `npm run apercu:statique` | sert `dist/` sur http://localhost:3078 en imitant un hébergeur statique |
| `npm run test:statique` | compare la version statique au serveur actuel (66 contrôles) |

## Réglages du site statique Render (prévisualisation)

À créer dans le tableau de bord Render : New > Static Site, même dépôt GitHub.

- Branch : `statique/pre-rendu`
- Build Command : `npm install && npm run build:statique`
- Publish Directory : `dist`
- Ne pas ajouter de domaine personnalisé à ce stade.

### Redirects / Rewrites

| Source | Destination | Action |
|---|---|---|
| `/carte` | `/carte.html` | Rewrite |
| `/mentions-legales` | `/mentions-legales.html` | Rewrite |
| `/surveillance` | `/surveillance.html` | Rewrite |
| `/gardiennage` | `/gardiennage.html` | Rewrite |
| `/nettoyage-locaux` | `/nettoyage-locaux.html` | Rewrite |
| `/nettoyage-fin-chantier` | `/nettoyage-fin-chantier.html` | Rewrite |
| `/carte/` | `/carte` | Redirect |
| `/mentions-legales/` | `/mentions-legales` | Redirect |
| `/surveillance/` | `/surveillance` | Redirect |
| `/gardiennage/` | `/gardiennage` | Redirect |
| `/nettoyage-locaux/` | `/nettoyage-locaux` | Redirect |
| `/nettoyage-fin-chantier/` | `/nettoyage-fin-chantier` | Redirect |
| `/favicon.ico` | `/favicon.svg` | Redirect |

Les règles de réécriture ne sont peut-être pas nécessaires (certains hébergeurs servent `/page` depuis `page.html` d'office) : à constater sur la prévisualisation avant de les saisir.

### Headers

| Path | Name | Value |
|---|---|---|
| `/wallet/*.pkpass` | `Content-Type` | `application/vnd.apple.pkpass` |
| `/wallet/*.vcf` | `Content-Type` | `text/vcard; charset=utf-8` |
| `/wallet/*` | `Cache-Control` | `no-cache` |
| `/css/*` | `Cache-Control` | `public, max-age=31536000, immutable` |
| `/js/*` | `Cache-Control` | `public, max-age=31536000, immutable` |
| `/favicon.svg` | `Cache-Control` | `public, max-age=86400` |
| `/images/*` | `Cache-Control` | `public, max-age=86400` |
| `/images/**/*` | `Cache-Control` | `public, max-age=86400` |

Source de ces deux tableaux : `scripts/regles-statique.js`.

## À vérifier sur la prévisualisation Render (non vérifiable en local)

1. `/surveillance` répond 200 (avec ou sans règle de réécriture) et `/surveillance/` renvoie vers `/surveillance`.
2. Une adresse inconnue répond bien **404** avec `404.html` (et non 200).
3. `/wallet/forty-services.pkpass` est servi en `application/vnd.apple.pkpass` : c'est ce qui déclenche l'ajout dans Cartes sur iPhone.
4. `/robots.txt` reste celui du dépôt après plus de 15 minutes sans visite.
5. `/surveillance.html` : servi en double ou non (la balise canonique pointe de toute façon vers l'adresse propre).

## Migration (plus tard, sur accord)

1. Fusionner la branche dans `main` et régler le site statique sur `main`.
2. Dans Render : retirer `fortyservices.ma` et `www.fortyservices.ma` du service web, les ajouter au site statique.
3. DNS : l'enregistrement A de `fortyservices.ma` (216.24.57.1) est l'adresse générale de Render ; le CNAME de `www` pointe aujourd'hui vers `forty-services.onrender.com` et devra pointer vers le nom du site statique. Suivre les valeurs affichées par Render au moment de l'ajout.
4. Garder le service web actuel (il continue de rediriger l'ancienne adresse onrender vers le domaine) jusqu'à vérification complète.
5. Retour arrière : remettre les domaines sur le service web.
