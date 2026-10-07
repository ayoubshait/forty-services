// Règles à déclarer chez l'hébergeur statique (Render : « Redirects/Rewrites » et « Headers »).
// Source unique : elles servent à la fois à l'aperçu local (apercu-statique.js) et à la notice de migration.
const pagesServices = require('../src/models/pagesServices');

const PAGES = ['carte', 'mentions-legales'].concat(pagesServices.map((p) => p.slug));

module.exports = {
  // « /surveillance » affiche surveillance.html, sans changer l'adresse
  reecritures: PAGES.map((p) => ({ source: '/' + p, destination: '/' + p + '.html' })),
  // une seule adresse par page : la barre finale et les fichiers .html renvoient vers l'adresse propre
  redirections: PAGES.map((p) => ({ source: '/' + p + '/', destination: '/' + p }))
    .concat(PAGES.map((p) => ({ source: '/' + p + '.html', destination: '/' + p })))
    .concat([{ source: '/index.html', destination: '/' }, { source: '/favicon.ico', destination: '/favicon.svg' }]),
  // en-têtes par chemin (syntaxe Render : « /*.css » ne couvre que la racine, « /**/*.css » les sous-dossiers)
  entetes: [
    { chemin: '/wallet/*.pkpass', nom: 'Content-Type', valeur: 'application/vnd.apple.pkpass' },
    { chemin: '/wallet/*.vcf', nom: 'Content-Type', valeur: 'text/vcard; charset=utf-8' },
    { chemin: '/wallet/*', nom: 'Cache-Control', valeur: 'no-cache' },
    { chemin: '/css/*', nom: 'Cache-Control', valeur: 'public, max-age=31536000, immutable' },
    { chemin: '/js/*', nom: 'Cache-Control', valeur: 'public, max-age=31536000, immutable' },
    { chemin: '/favicon.svg', nom: 'Cache-Control', valeur: 'public, max-age=86400' },
    { chemin: '/images/*', nom: 'Cache-Control', valeur: 'public, max-age=86400' },
    { chemin: '/images/**/*', nom: 'Cache-Control', valeur: 'public, max-age=86400' }
  ]
};
