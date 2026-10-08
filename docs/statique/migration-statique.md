# Version statique : étude et notice de prévisualisation

Branche : `statique/pre-rendu` (non publiée). Rien n'est changé sur `main`, sur le service Render actuel, sur le domaine ni sur le DNS.

## État au 8 octobre 2026 : bascule faite

- `fortyservices.ma` et `www.fortyservices.ma` sont attachés au site statique Render `forty-services-static` (branche `main`), certificats émis. Coupure constatée : environ 2 minutes.
- Le DNS n'a pas été modifié : Render a vérifié les deux domaines avec les enregistrements existants (A `216.24.57.1`, CNAME `www` vers `forty-services.onrender.com`).
- Réglages réellement en place sur le site statique : un en-tête (`/wallet/*.pkpass` — `Content-Type` — `application/vnd.apple.pkpass`) et une redirection (`/favicon.ico` vers `/favicon.svg`). Render sert les adresses sans `.html` et la page 404 sans règle ; les règles de réécriture listées plus bas sont inutiles.
- Les en-têtes `X-Robots-Tag` de prévisualisation ont été supprimés avant la bascule.
- L'ancien service web `forty-services` (offre Free) est conservé, sans domaine : il sert de retour arrière et redirige `forty-services.onrender.com` vers le domaine.
- Différence connue : `/page/` (barre finale) répond 200 au lieu de rediriger ; la balise canonique désigne l'adresse sans barre.

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

### Protection de la prévisualisation contre l'indexation

Uniquement dans le tableau de bord du site statique (rien dans le dépôt, donc aucun effet sur le domaine officiel ni sur `robots.txt`) :

| Path | Name | Value |
|---|---|---|
| `/` | `X-Robots-Tag` | `noindex, nofollow` |
| `/*` | `X-Robots-Tag` | `noindex, nofollow` |
| `/**/*` | `X-Robots-Tag` | `noindex, nofollow` |

`robots.txt` reste celui du dépôt (`Allow: /`) : le test à froid reste donc possible. Les balises canoniques pointent déjà vers `https://fortyservices.ma`.

**Ces trois lignes doivent être supprimées avant d'attacher le domaine officiel au site statique**, sinon le site officiel serait désindexé.

## À vérifier sur la prévisualisation Render (non vérifiable en local)

1. `/surveillance` répond 200 (avec ou sans règle de réécriture) et `/surveillance/` renvoie vers `/surveillance`.
2. Une adresse inconnue répond bien **404** avec `404.html` (et non 200).
3. `/wallet/forty-services.pkpass` est servi en `application/vnd.apple.pkpass` : c'est ce qui déclenche l'ajout dans Cartes sur iPhone.
4. `/robots.txt` reste celui du dépôt après plus de 15 minutes sans visite.
5. `/surveillance.html` : servi en double ou non (la balise canonique pointe de toute façon vers l'adresse propre).

## Migration (plus tard, sur accord explicite)

Chez Render, un domaine personnalisé n'appartient qu'à un seul service à la fois, et c'est Render qui choisit le service selon le domaine demandé. Modifier le DNS seul ne suffit donc pas : il faut déplacer le domaine d'un service à l'autre dans le tableau de bord.

### Avant

1. Tous les points de la prévisualisation sont conformes.
2. Fusionner `statique/pre-rendu` dans `main` ; régler la branche du site statique sur `main` ; attendre la fin de la génération.
3. Supprimer les trois en-têtes `X-Robots-Tag` du site statique, puis vérifier sur son adresse onrender qu'ils ont disparu.
4. Noter les valeurs DNS actuelles : A `fortyservices.ma` = `216.24.57.1` ; CNAME `www` = `forty-services.onrender.com`.
5. La veille, si le gestionnaire DNS le permet, abaisser la durée de vie (TTL) du CNAME `www` à 300 secondes.
6. Choisir une heure creuse : le site est indisponible entre les étapes 1 et 3 ci-dessous (quelques minutes si tout s'enchaîne).

### Bascule

1. Service web actuel > Settings > Custom Domains : supprimer `fortyservices.ma` et `www.fortyservices.ma`. Ne pas supprimer ni suspendre le service.
2. Site statique > Settings > Custom Domains : ajouter `fortyservices.ma` (Render ajoute `www` avec lui).
3. DNS : appliquer exactement ce que Render affiche. Attendu : l'enregistrement A de `fortyservices.ma` reste `216.24.57.1` ; le CNAME `www` passe à `<nom-du-site-statique>.onrender.com`.
4. Cliquer sur « Verify » pour chaque domaine et attendre « Certificate Issued » : Render émet lui-même le certificat HTTPS (Let's Encrypt ou Google Trust Services), gratuitement. Tant que le certificat n'est pas émis, le navigateur affiche une alerte de sécurité.

### Contrôles après bascule

- `https://fortyservices.ma/` et les six autres pages : 200, cadenas valide.
- `http://fortyservices.ma` renvoie vers `https://` ; `www` renvoie vers le domaine sans `www`.
- Aucun en-tête `X-Robots-Tag` sur le domaine officiel ; `/carte` garde sa propre balise `noindex`, comme aujourd'hui.
- `/robots.txt` (Allow), `/sitemap.xml`, `.pkpass` et `.vcf` avec leurs types, une adresse inconnue en 404.
- Search Console : nouvelle exploration de `robots.txt`, puis inspection d'une page.

### Retour arrière

1. Site statique > Custom Domains : supprimer les deux domaines.
2. Service web > Custom Domains : les rajouter, « Verify », attendre le certificat.
3. DNS : remettre le CNAME `www` sur `forty-services.onrender.com` (A inchangé).
4. Le code du service web n'a pas été modifié : il repart tel quel. La sauvegarde `sauvegarde-2026-10-07-avant-seo` reste disponible.

Garder le service web au moins deux semaines après la bascule : il sert de retour arrière et continue de renvoyer l'ancienne adresse `forty-services.onrender.com` vers le domaine.
