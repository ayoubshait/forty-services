// CONTRÔLEUR : relie le modèle aux vues.
const entreprise = require('../models/entreprise');

// Typographie française : une espace insécable avant « ? ! : ; » et à l'intérieur des guillemets français.
// Appliquée au texte visible seulement (pas aux attributs, ni aux scripts et styles).
function typographie(html) {
  return html.replace(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>)|>([^<]+)</g, function (m, bloc, texte) {
    if (bloc) return m;
    return '>' + texte
      .replace(/ ([?!:;»])/g, '\u00a0$1')
      .replace(/(«) /g, '$1\u00a0') + '<';
  });
}

exports.accueil = (req, res, next) => {
  res.render('index', { site: entreprise }, (erreur, html) => {
    if (erreur) return next(erreur);
    res.send(typographie(html));
  });
};

exports.mentionsLegales = (req, res) => {
  res.render('mentions-legales', { site: entreprise });
};

exports.carte = (req, res, next) => {
  res.render('carte', { site: entreprise }, (erreur, html) => {
    if (erreur) return next(erreur);
    res.send(typographie(html));
  });
};
