// Génère une version entièrement statique du site dans dist/ (aucun serveur nécessaire pour la servir).
// Principe : on démarre l'application Express telle qu'elle tourne aujourd'hui, on lui demande chaque page,
// et on enregistre le HTML reçu. Les pages statiques sont donc identiques à celles du serveur actuel.
//
// Usage : npm run build:statique
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');

const RACINE = path.join(__dirname, '..');
const DIST = path.join(RACINE, 'dist');

// Empreinte des fichiers (paramètre ?v= des css/js) : commit fourni par l'hébergeur, sinon commit local
if (!process.env.RENDER_GIT_COMMIT) {
  try { process.env.RENDER_GIT_COMMIT = execSync('git rev-parse HEAD', { cwd: RACINE }).toString().trim(); } catch (e) { /* hors dépôt Git : empreinte horaire */ }
}

const app = require('../src/app');
const pagesServices = require('../src/models/pagesServices');

// Chaque page et le fichier qui la contient. L'hébergeur servira « /surveillance » depuis « surveillance.html » (règle de réécriture).
const PAGES = [
  { url: '/', fichier: 'index.html' },
  { url: '/carte', fichier: 'carte.html' },
  { url: '/mentions-legales', fichier: 'mentions-legales.html' }
].concat(pagesServices.map((p) => ({ url: '/' + p.slug, fichier: p.slug + '.html' })));

function copier(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const a = path.join(src, e.name), b = path.join(dest, e.name);
    if (e.isDirectory()) copier(a, b); else fs.copyFileSync(a, b);
  }
}

(async () => {
  fs.rmSync(DIST, { recursive: true, force: true });
  copier(path.join(RACINE, 'public'), DIST);                       // css, js, images, wallet, robots.txt, sitemap.xml, favicon

  const serveur = http.createServer(app);
  await new Promise((ok) => serveur.listen(0, ok));
  const base = 'http://127.0.0.1:' + serveur.address().port;
  try {
    for (const p of PAGES) {
      const r = await fetch(base + p.url);
      if (r.status !== 200) throw new Error(p.url + ' a répondu ' + r.status);
      fs.writeFileSync(path.join(DIST, p.fichier), await r.text());
      console.log('page    ', p.url.padEnd(26), '->', p.fichier);
    }
    // Page d'erreur : celle que le serveur actuel renvoie pour une adresse inconnue
    const r404 = await fetch(base + '/adresse-qui-n-existe-pas');
    if (r404.status !== 404) throw new Error('la page introuvable a répondu ' + r404.status);
    fs.writeFileSync(path.join(DIST, '404.html'), await r404.text());
    console.log('erreur   404                        -> 404.html');
  } finally {
    serveur.close();
  }

  const nb = (function compter(d) { return fs.readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? compter(path.join(d, e.name)) : 1), 0); })(DIST);
  console.log('dist/ prêt :', nb, 'fichiers, empreinte', String(process.env.RENDER_GIT_COMMIT || '').slice(0, 12) || '(horaire)');
})().catch((e) => { console.error('ÉCHEC :', e.message); process.exit(1); });
