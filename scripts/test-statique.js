// Compare la version statique (dist/ servi par apercu-statique.js) au serveur Express actuel.
// Usage : npm run build:statique && npm run test:statique
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const RACINE = path.join(__dirname, '..');
if (!process.env.RENDER_GIT_COMMIT) process.env.RENDER_GIT_COMMIT = execSync('git rev-parse HEAD', { cwd: RACINE }).toString().trim();
const app = require('../src/app');
const regles = require('./regles-statique');

const PORT_STATIQUE = 3979;
let echecs = 0, total = 0;
const verifier = (ok, libelle, detail) => { total++; if (!ok) echecs++; console.log((ok ? '  ok    ' : '  ÉCHEC ') + libelle + (detail && !ok ? '  -> ' + detail : '')); };
const demander = (base, chemin) => fetch(base + chemin, { redirect: 'manual' });

(async () => {
  const serveur = http.createServer(app);
  await new Promise((ok) => serveur.listen(0, ok));
  const A = 'http://127.0.0.1:' + serveur.address().port;      // serveur actuel
  const S = 'http://127.0.0.1:' + PORT_STATIQUE;                // version statique
  const apercu = spawn(process.execPath, [path.join(__dirname, 'apercu-statique.js')], { env: Object.assign({}, process.env, { PORT: PORT_STATIQUE }), stdio: 'ignore' });
  await new Promise((ok) => setTimeout(ok, 700));

  try {
    const pages = ['/'].concat(regles.reecritures.map((r) => r.source));

    console.log('\n1. Pages : même code et même HTML que le serveur actuel');
    const html = {};
    for (const p of pages) {
      const [a, s] = [await demander(A, p), await demander(S, p)];
      const [ta, ts] = [await a.text(), await s.text()];
      html[p] = ts;
      verifier(a.status === 200 && s.status === 200 && ta === ts, p + '  (' + ts.length + ' caractères)', 'codes ' + a.status + '/' + s.status + ', identique : ' + (ta === ts));
      verifier(/^text\/html/.test(s.headers.get('content-type')), p + '  type text/html', s.headers.get('content-type'));
    }

    console.log('\n2. Redirections (301) : même destination que le serveur actuel');
    for (const p of regles.redirections.filter((r) => !r.source.endsWith('.html')).map((r) => r.source).concat(['/surveillance/?a=1'])) {
      const [a, s] = [await demander(A, p), await demander(S, p)];
      verifier(s.status === 301 && a.status === 301 && a.headers.get('location') === s.headers.get('location'), p + ' -> ' + s.headers.get('location'), 'actuel ' + a.status + ' ' + a.headers.get('location') + ' / statique ' + s.status + ' ' + s.headers.get('location'));
    }
    console.log('   Adresses en .html (elles n\'existent pas sur le serveur actuel : 404) renvoyées vers l\'adresse propre');
    for (const r of regles.redirections.filter((x) => x.source.endsWith('.html'))) {
      const s = await demander(S, r.source);
      verifier(s.status === 301 && s.headers.get('location') === r.destination, r.source + ' -> ' + s.headers.get('location'));
    }

    console.log('\n3. Fichiers : même type, même cache, même contenu');
    const fichiers = [];
    (function lister(d, prefixe) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) lister(path.join(d, e.name), prefixe + e.name + '/'); else fichiers.push(prefixe + e.name); } })(path.join(RACINE, 'public'), '/');
    for (const f of fichiers) {
      const [a, s] = [await demander(A, f), await demander(S, f)];
      const [ba, bs] = [Buffer.from(await a.arrayBuffer()), Buffer.from(await s.arrayBuffer())];
      const type = (r) => String(r.headers.get('content-type')).toLowerCase().replace(/\s/g, '').replace('text/javascript', 'application/javascript');
      const cache = (r) => r.headers.get('cache-control') || '(aucun)';
      const memeCache = cache(a) === cache(s) || (cache(a) === 'public, max-age=0' && cache(s) === '(aucun)');
      verifier(s.status === 200 && ba.equals(bs) && type(a) === type(s) && memeCache, f.padEnd(52) + type(s) + ' | ' + cache(s), 'actuel : ' + type(a) + ' | ' + cache(a));
    }

    console.log('\n4. robots.txt et sitemap');
    const robots = await (await demander(S, '/robots.txt')).text();
    verifier(/Allow: \//.test(robots) && !/Disallow/i.test(robots), 'robots.txt autorise l\'exploration, aucun Disallow');
    const sitemap = await (await demander(S, '/sitemap.xml')).text();
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    for (const u of urls) {
      const chemin = new URL(u).pathname;
      const s = await demander(S, chemin);
      const canonique = ((await s.text()).match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
      verifier(s.status === 200 && canonique === u, 'sitemap ' + u + '  (200, canonique identique)', s.status + ' canonique ' + canonique);
    }

    console.log('\n5. Adresse inconnue');
    const [a404, s404] = [await demander(A, '/inconnue'), await demander(S, '/inconnue')];
    verifier(s404.status === 404 && (await a404.text()) === (await s404.text()), '/inconnue -> 404 avec la même page d\'erreur');

    console.log('\n6. Liens internes de toutes les pages (href, src, srcset)');
    const liens = new Set();
    for (const p of Object.keys(html)) {
      for (const m of html[p].matchAll(/(?:href|src)="([^"]+)"/g)) liens.add(m[1]);
      for (const m of html[p].matchAll(/srcset="([^"]+)"/g)) m[1].split(',').forEach((x) => liens.add(x.trim().split(/\s+/)[0]));
    }
    const internes = [...liens].map((l) => l.replace(/^https:\/\/fortyservices\.ma/, '') || '/').filter((l) => l.startsWith('/') && !l.startsWith('//')).map((l) => l.split('#')[0] || '/');
    const uniques = [...new Set(internes)];
    let casses = [];
    for (const l of uniques) { const s = await demander(S, l); await s.arrayBuffer(); if (s.status !== 200) casses.push(l + ' (' + s.status + ')'); }
    verifier(casses.length === 0, uniques.length + ' adresses internes distinctes, toutes en 200 sans redirection', casses.join(', '));
    const externes = [...liens].filter((l) => /^https?:\/\//.test(l) && !l.startsWith('https://fortyservices.ma'));
    console.log('   (' + externes.length + ' liens externes non testés ici : WhatsApp, Google Wallet, cartes, polices…)');

    console.log('\n' + (echecs ? echecs + ' ÉCHEC(S)' : 'Tout est conforme') + ' sur ' + total + ' contrôles.');
  } finally {
    apercu.kill();
    serveur.close();
  }
  process.exit(echecs ? 1 : 0);
})().catch((e) => { console.error('ERREUR :', e); process.exit(1); });
