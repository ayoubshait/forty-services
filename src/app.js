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

// Fichiers statiques (css, js, favicon, robots, sitemap)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/', routes);

// 404 — toute route inconnue
app.use((req, res) => {
  res.status(404).render('404', { site: entreprise });
});

module.exports = app;
