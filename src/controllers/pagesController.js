// CONTRÔLEUR — relie le modèle aux vues.
const entreprise = require('../models/entreprise');

exports.accueil = (req, res) => {
  res.render('index', { site: entreprise });
};
