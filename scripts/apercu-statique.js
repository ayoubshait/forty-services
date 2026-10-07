// Aperçu local de la version statique (dist/), sans Express ni EJS.
// Ce petit serveur IMITE le comportement attendu d'un hébergeur statique, avec les règles de regles-statique.js :
// un fichier existant est servi tel quel ; sinon on applique redirections puis réécritures ; sinon 404.html.
// Ce n'est pas Render : le comportement réel reste à vérifier sur une prévisualisation hébergée.
//
// Usage : npm run build:statique && npm run apercu:statique   (http://localhost:3078)
const http = require('http');
const fs = require('fs');
const path = require('path');
const regles = require('./regles-statique');

const DIST = path.join(__dirname, '..', 'dist');
const PORT = process.env.PORT || 3078;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.vcf': 'text/vcard; charset=utf-8', '.pkpass': 'application/octet-stream' };

// correspondance de chemin à la manière de Render : * = un segment, ** = plusieurs
const motif = (m) => new RegExp('^' + m.split('/').map((s) => s === '**' ? '.*' : s.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*')).join('/') + '$');

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const chemin = decodeURIComponent(url.pathname);
  const servir = (fichier, code) => {
    const entetes = { 'Content-Type': TYPES[path.extname(fichier)] || 'application/octet-stream' };
    regles.entetes.forEach((e) => { if (motif(e.chemin).test(chemin)) entetes[e.nom] = e.valeur; });
    res.writeHead(code, entetes);
    fs.createReadStream(fichier).pipe(res);
  };
  const cible = path.join(DIST, chemin === '/' ? 'index.html' : chemin);
  if (!cible.startsWith(DIST)) { res.writeHead(403); return res.end(); }

  // 1) les redirections « propres » passent d'abord quand elles visent une page (un hébergeur servirait sinon le .html en double)
  const redir = regles.redirections.find((r) => r.source === chemin);
  if (redir && (chemin.endsWith('.html') || chemin.endsWith('/') || !fs.existsSync(cible))) { res.writeHead(301, { Location: redir.destination + url.search }); return res.end(); }
  // 2) un fichier existant est servi tel quel
  if (fs.existsSync(cible) && fs.statSync(cible).isFile()) return servir(cible, 200);
  // 3) réécriture : l'adresse reste, le contenu vient du .html
  const reec = regles.reecritures.find((r) => r.source === chemin);
  if (reec) return servir(path.join(DIST, reec.destination), 200);
  // 4) adresse inconnue
  servir(path.join(DIST, '404.html'), 404);
}).listen(PORT, () => console.log('Aperçu statique : http://localhost:' + PORT));
