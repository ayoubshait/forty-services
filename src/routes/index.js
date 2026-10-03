// ROUTES — associe chaque URL à son contrôleur.
const express = require('express');
const pagesController = require('../controllers/pagesController');

const router = express.Router();

router.get('/', pagesController.accueil);
router.get('/mentions-legales', pagesController.mentionsLegales);

module.exports = router;
