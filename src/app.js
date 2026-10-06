// Configuration de l'application Express (MVC)
const path = require('path');
const express = require('express');

const routes = require('./routes');
const entreprise = require('./models/entreprise');

const app = express();

// Ne pas révéler la technologie du serveur (bonne pratique sécurité)
app.disable('x-powered-by');

// Vues : moteur EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ancienne adresse (hébergeur) : redirection permanente vers le domaine officiel, pour éviter les doublons dans Google.
// Seule l'adresse onrender.com est redirigée ; les contrôles internes de l'hébergeur ne le sont pas.
const ANCIEN_HOTE = 'forty-services.onrender.com';
app.use((req, res, next) => {
  const hote = String(req.headers.host || '').split(':')[0].toLowerCase();
  const controleInterne = /^Render\//i.test(String(req.headers['user-agent'] || ''));
  if (hote === ANCIEN_HOTE && !controleInterne) {
    return res.redirect(301, entreprise.url + req.originalUrl);
  }
  next();
});

// Une seule adresse par page : « /page/ » redirige vers « /page » (évite les doublons dans les moteurs de recherche)
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith('/')) {
    const suite = req.originalUrl.slice(req.path.length);
    return res.redirect(301, req.path.replace(/\/+$/, '') + suite);
  }
  next();
});

// Les navigateurs et les robots demandent /favicon.ico : on les envoie vers l'icône du site
app.get('/favicon.ico', (req, res) => res.redirect(301, '/favicon.svg'));

// Version des fichiers : change à chaque déploiement (empreinte du commit chez Render), ce qui permet un cache long sur les css/js
entreprise.version = String(process.env.RENDER_GIT_COMMIT || Date.now().toString(36)).slice(0, 12);

// Fichiers statiques : css/js appelés avec ?v=<version> = cache d'un an ; images et icônes = 1 jour ; le reste (sitemap, robots) = revalidé
app.use(express.static(path.join(__dirname, '..', 'public'), {
  setHeaders: (res, fichier) => {
    if (/\.vcf$/.test(fichier)) { res.setHeader('Content-Type', 'text/vcard; charset=utf-8'); res.setHeader('Cache-Control', 'no-cache'); }
    else if (/\.pkpass$/.test(fichier)) { res.setHeader('Content-Type', 'application/vnd.apple.pkpass'); res.setHeader('Cache-Control', 'no-cache'); }
    else if (/\.(css|js)$/.test(fichier)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    else if (/\.(webp|jpg|jpeg|png|svg)$/.test(fichier)) res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

// Routes
app.use('/', routes);

// 404 — toute route inconnue
app.use((req, res) => {
  res.status(404).render('404', { site: entreprise });
});

module.exports = app;
