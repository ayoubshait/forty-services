// CONTRÔLEUR : relie le modèle aux vues.
const entreprise = require('../models/entreprise');
const pagesServices = require('../models/pagesServices');

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

// Pages de services : une par prestation, rendues entièrement côté serveur
exports.service = (slug) => (req, res, next) => {
  const index = pagesServices.findIndex((p) => p.slug === slug);
  if (index < 0) return next();
  const page = pagesServices[index];
  const service = entreprise.services[index];
  const references = entreprise.referencesPhares.filter((client) => page.references.includes(client.nom));
  const engagements = page.engagements.map((titre) => entreprise.engagements.find((e) => e.titre === titre)).filter(Boolean);
  const autres = entreprise.services.filter((s, i) => i !== index);
  res.render('service', {
    site: entreprise,
    base: '/',
    page, service, index, references, engagements, autres,
    lienDevis: 'https://wa.me/' + entreprise.whatsapp + '?text=' + encodeURIComponent('Bonjour, je souhaite un devis pour : ' + service.titre + '.'),
    meta: {
      titre: page.seoTitre,
      description: page.seoDescription,
      chemin: '/' + page.slug,
      image: '/images/partage-' + page.slug + '.jpg',
      imageAlt: page.nom + ' : ' + entreprise.nom,
      service: { nom: service.titre, description: page.intro },
      faq: page.faq
    }
  }, (erreur, html) => {
    if (erreur) return next(erreur);
    res.send(typographie(html));
  });
};
