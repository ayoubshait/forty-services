// MODÈLE — toutes les données de l'entreprise.
// Pour modifier un texte, un numéro ou un service : c'est ici, et uniquement ici.

module.exports = {
  nom: 'Forty Services',
  anneeCreation: 2013,
  ville: 'Casablanca',
  quartier: 'Sidi Moumen',
  adresse: 'Lot. Al Ward, Rue 22, Imm 4 — Sidi Moumen, Casablanca',
  zone: 'tout le Grand Casablanca',
  gerant: 'Mustapha Shait',
  experienceGerant: 13,   // années à la tête de Forty Services
  experienceMetier: 26,   // années dans le domaine de la surveillance
  email: 'forty.services@gmail.com',

  telephones: [
    { affiche: '06 11 62 47 18', e164: '+212611624718' },
    { affiche: '06 69 31 05 47', e164: '+212669310547' }
  ],

  // Numéro WhatsApp au format international sans + ni espaces
  whatsapp: '212611624718',
  whatsappMessage: 'Bonjour, je souhaite un devis pour une prestation.',

  disponibilite: '24 h/24 et 7 j/7',
  delaiDevis: '48 h',

  seo: {
    titre: 'Forty Services — Surveillance, gardiennage et nettoyage à Casablanca',
    description:
      'Forty Services, Casablanca : surveillance, gardiennage, nettoyage de locaux et nettoyage de fin de chantier ' +
      'depuis 2013. Disponibles 24 h/24, 7 j/7. Devis gratuit sous 48 h.'
  },

  // Photos (fichiers dans public/images/)
  photos: {
    equipe: {
      src: '/images/equipe.jpeg',
      alt: "L'équipe Forty Services en costume devant un site client à Casablanca"
    }
  },

  // Références clients (affichées dans la section « Ils nous font confiance »)
  referencePhare: 'Ambassade de la République de Slovénie à Rabat',
  references: [
    'AMITH',
    'CMTV',
    'Coutexport',
    'DNA Maroc',
    'Hymco',
    'Lina Wash',
    'Maroquinerie New World',
    'Melliber Appart Hôtel',
    'Nach Garment',
    'Pellatex',
    'Résidence Dream Garden 2',
    'Stradyconf',
    'Texmara',
    'Village Centre Sport'
  ],

  services: [
    {
      titre: 'Surveillance',
      description:
        "Agents qualifiés pour vos sites, événements et commerces. Prévention des risques, contrôle d'accès, rondes de surveillance.",
      icone: 'bouclier'
    },
    {
      titre: 'Gardiennage',
      description:
        'Présence continue ou ponctuelle sur vos locaux, entrepôts et chantiers. De jour comme de nuit, comptes rendus systématiques.',
      icone: 'badge'
    },
    {
      titre: 'Nettoyage de locaux',
      description:
        'Entretien régulier de bureaux, commerces et parties communes. Passages planifiés, produits professionnels, résultat contrôlé.',
      icone: 'etincelle'
    },
    {
      titre: 'Nettoyage fin de chantier',
      description:
        'Remise en état complète après travaux : poussières, vitres, sols et finitions. Livraison de locaux impeccables.',
      icone: 'casque'
    }
  ],

  engagements: [
    {
      titre: '26 ans de métier',
      description: "L'entreprise depuis 2013, un gérant fort de 26 ans dans la surveillance : usines, hôtels, résidences, institutions.",
      icone: 'bouclier-coche'
    },
    {
      titre: 'Personnel formé et encadré',
      description: 'Des intervenants qualifiés, suivis par un responsable. Aucune sous-traitance opaque.',
      icone: 'badge'
    },
    {
      titre: 'Réactivité réelle',
      description: 'Réponse rapide, devis sous 48 h, interventions 24 h/24 et 7 j/7.',
      icone: 'horloge'
    },
    {
      titre: 'Devis clair, sans surprise',
      description: 'Un prix ferme, un périmètre écrit, aucun coût caché en cours de contrat.',
      icone: 'document'
    },
    {
      titre: 'Un interlocuteur unique',
      description: 'Un responsable joignable directement, qui connaît votre site et vos contraintes.',
      icone: 'bulle'
    },
    {
      titre: 'Moyens professionnels',
      description: 'Tenues, matériel et produits adaptés à chaque site : usine, hôtel, résidence ou chantier.',
      icone: 'etincelle'
    }
  ],

  etapes: [
    {
      titre: 'Vous nous contactez',
      description: 'Par téléphone, WhatsApp ou e-mail. Décrivez votre besoin en deux minutes, nous posons les bonnes questions.'
    },
    {
      titre: 'Visite et devis sous 48 h',
      description: 'Nous nous déplaçons sur votre site si nécessaire et vous remettons un devis précis, gratuit et sans engagement.'
    },
    {
      titre: 'Nous intervenons',
      description: 'Prestation ponctuelle ou contrat régulier : nos équipes démarrent à la date convenue, avec un suivi assuré.'
    }
  ]
};
