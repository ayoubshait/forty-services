# Sauvegarde Forty Services du 7 octobre 2026 (avant le chantier SEO)

## Ce qui est sauvegardé

- **Version de référence** : commit `f2e15885ffef9c1c7f9bf975b03910efc09dc7bd` (court : `f2e1588`).
  C'est la version en ligne sur https://fortyservices.ma/ au moment de la sauvegarde : le site servait ses fichiers avec l'empreinte `f2e15885ffef`.
- **Dans Git (local)** : tag `sauvegarde-2026-10-07-avant-seo` et branche `sauvegarde/2026-10-07-avant-seo`, tous deux sur ce commit.
- **Archive** : `forty-services-2026-10-07-avant-seo-f2e1588.zip` (dans ce dossier). Elle contient le code, les fichiers publics, les fichiers de dépendances, les supports commerciaux et les fichiers Wallet, y compris ceux qui ne sont pas dans Git.
- **Historique Git complet** : `forty-services-2026-10-07-avant-seo.bundle` (dans ce dossier, et dans l'archive). C'est un fichier `git bundle` : il remplace le dossier `.git`, exclu de l'archive. Vérifié : un clone de ce fichier contient les 62 commits du dépôt, le tag et la branche de sauvegarde.
- **Sur GitHub** : le tag et la branche de sauvegarde y sont aussi depuis le 7 octobre 2026 (dépôt `ayoubshait/forty-services`).

Exclus volontairement : `node_modules` (se réinstalle), `.git` (remplacé par le fichier `.bundle`), `.claude` (réglages locaux), et tout secret (`wallet/secrets/`, fichiers `.p12`, `.pem`, `.key`, `.cer`, `.env`, `service-account*.json`). Aucun fichier de ce type n'existait au moment de la sauvegarde.

## Revenir à cette version sans effacer les nouveaux travaux

Procédure testée le 7 octobre 2026 dans une copie isolée du dépôt, avec de faux travaux comprenant une modification, un ajout, une suppression et un commit de fusion.

**Attention : la commande `git restore` écrase les modifications locales des fichiers suivis.** Tout travail en cours qui n'est pas encore enregistré dans un commit serait perdu. Avant de l'exécuter, vérifiez avec `git status` qu'il ne reste rien à enregistrer. S'il reste des modifications, enregistrez-les d'abord dans un commit, ou mettez-les de côté avec `git stash`.

```bash
cd C:\Users\shait\Downloads\fortyService
git status
git checkout main
git restore --source=sauvegarde-2026-10-07-avant-seo --staged --worktree -- .
git commit -m "Retour a la version du 2026-10-07 (avant SEO)"
git push origin main
```

Ce que fait cette procédure, vérifié par le test :

- le contenu suivi par Git redevient strictement identique à la sauvegarde (même empreinte d'arbre) ;
- les fichiers ajoutés depuis disparaissent du site, ceux supprimés depuis reviennent ;
- l'historique est conservé : les nouveaux travaux restent consultables et récupérables ;
- les fichiers non suivis (`wallet/`, `carte-de-visite/`, `fiche-commerciale/`) ne sont pas touchés ;
- le site redémarre et sert l'accueil et le pass Wallet.

Après le `git push`, Render redéploie automatiquement. Vérification : l'adresse de la feuille de style de l'accueil change d'empreinte, et le contenu redevient celui du 7 octobre.

À ne pas utiliser : `git revert --no-commit sauvegarde-2026-10-07-avant-seo..HEAD`. Testée elle aussi, elle échoue dès que l'historique contient un commit de fusion.

Autre moyen, sans toucher à Git : dans le tableau de bord Render, onglet des déploiements du service, rétablir le déploiement du commit `f2e1588`. Non testé ici, faute d'accès au tableau de bord.

## Consulter cette version sans rien changer

```bash
git checkout sauvegarde-2026-10-07-avant-seo
npm ci
npm start
```

Puis revenir au travail en cours : `git checkout main` (ou la branche de travail).

## Repartir de l'archive (ordinateur neuf, dépôt perdu)

1. Décompresser `forty-services-2026-10-07-avant-seo-f2e1588.zip`.
2. Dans le dossier obtenu : `npm ci`, puis `npm start`. Le site tourne sur http://localhost:3000.
3. Pour retrouver tout l'historique Git : `git clone forty-services-2026-10-07-avant-seo.bundle forty-services`, puis `git remote set-url origin https://github.com/ayoubshait/forty-services.git`.

## À savoir

- Les dossiers `wallet/`, `carte-de-visite/` et `fiche-commerciale/` ne sont pas dans Git : ils ne sont sauvegardés que par l'archive.
- Les fichiers `.pkpass` de l'archive sont les cartes Wallet déjà publiques ; ce ne sont pas des secrets.
