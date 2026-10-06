// ROUTES — associe chaque URL à son contrôleur.
const express = require('express');
const pagesController = require('../controllers/pagesController');

const router = express.Router();

router.get('/', pagesController.accueil);
router.get('/mentions-legales', pagesController.mentionsLegales);
// Page de test de la carte numérique : accessible par son lien, non référencée (noindex), absente de la page d'accueil et du plan du site
router.get('/carte', pagesController.carte);

// Pages de services (adresses propres, indexables)
['surveillance', 'gardiennage', 'nettoyage-locaux', 'nettoyage-fin-chantier'].forEach((slug) => {
  router.get('/' + slug, pagesController.service(slug));
});

module.exports = router;
