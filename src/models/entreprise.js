// MODÈLE : toutes les données de l'entreprise.
// Pour modifier un texte, un numéro ou un service : c'est ici, et uniquement ici.

module.exports = {
  nom: 'Forty Services',
  anneeCreation: 2013,
  ville: 'Casablanca',
  quartier: 'Sidi Moumen',
  adresse: 'Lot. Al Ward, Rue 22, Imm 4, Sidi Moumen, Casablanca',
  zone: 'Casablanca et ses environs',
  // Autres villes : on ne cite aucune ville supplémentaire tant qu'elle n'est pas confirmée
  zoneAutresVilles: "Votre site se trouve dans une autre ville ? Contactez-nous pour étudier les possibilités d'intervention.",
  gerant: 'Mustapha Shait',
  experienceGerant: 13,   // années à la tête de Forty Services
  experienceMetier: 26,   // années d'expérience du dirigeant dans la surveillance
  email: 'forty.services@gmail.com',

  // Présentation factuelle de l'entreprise (utilisée dans la section équipe)
  presentation: [
    "Depuis 2013, Forty Services accompagne les professionnels à Casablanca et ses environs pour protéger, entretenir et remettre en état leurs locaux.",
    "Basée à Sidi Moumen, l'entreprise est dirigée par Mustapha Shait, qui compte 26 ans d'expérience en surveillance. " +
    "Des équipes encadrées et un interlocuteur dédié assurent le suivi de vos prestations."
  ],

  // Informations légales (affichées dans le pied de page seulement si elles sont renseignées)
  infosLegales: { ice: '000009597000065', rc: '294027 Casablanca', patente: '' },   // ICE et RC : source annuaire Telecontact.ma, à confirmer avec vos documents officiels

  // Questions fréquentes : réponses tirées du contenu du site ; à valider avec vos pratiques réelles
  faq: [
    {
      q: "Dans quelles zones intervenez-vous ?",
      r: "Nous sommes basés à Sidi Moumen et nous intervenons à Casablanca et ses environs. " +
         "Votre site se trouve dans une autre ville ? Contactez-nous pour étudier les possibilités d'intervention."
    },
    {
      q: "Proposez-vous des prestations ponctuelles ou régulières ?",
      r: "Les deux. Le gardiennage peut être ponctuel ou régulier. Le nettoyage de bureaux et de locaux suit des passages planifiés. " +
         "Le nettoyage de fin de chantier est une intervention de remise en état après travaux."
    },
    {
      q: "Comment est préparé le devis ?",
      r: "Indiquez le service recherché, l'adresse du site et la fréquence souhaitée. " +
         "Nous vous répondons sous 48 h avec un devis gratuit, qui précise le périmètre et le prix."
    },
    {
      q: "Comment se passe le suivi ?",
      r: "Un interlocuteur identifié connaît votre site et vos contraintes. " +
         "Le gardiennage donne lieu à des comptes rendus d'intervention."
    },
    {
      q: "En quoi consiste le nettoyage de fin de chantier ?",
      r: "C'est le nettoyage après travaux : élimination des poussières, nettoyage des vitres, des sols et des surfaces, " +
         "avant la livraison des locaux."
    }
  ],

  url: 'https://forty-services.onrender.com',   // à changer le jour où le site aura son propre nom de domaine

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
    titre: 'Gardiennage et nettoyage à Casablanca | Forty Services',
    description:
      'Gardiennage, surveillance et nettoyage professionnel à Casablanca et ses environs. ' +
      'Forty Services accompagne vos sites depuis 2013. Demandez votre devis.'
  },

  // Photos (fichiers dans public/images/)
  photos: {
    equipe: {
      src: '/images/equipe.webp',
      alt: "L'équipe Forty Services devant un site client à Casablanca"
    }
  },

  // Références clients. Pour afficher un logo : ajouter  logo: '/images/clients/nom.svg'  (fichier officiel, fourni et autorisé).
  // Sans logo, le nom du client s'affiche en texte.
  referencePhare: 'Ambassade de la République de Slovénie à Rabat',
  references: [
    { nom: 'AMITH' },
    { nom: 'CMTV' },
    { nom: 'Coutexport' },
    { nom: 'DNA Maroc' },
    { nom: 'Hymco' },
    { nom: 'Lina Wash' },
    { nom: 'Maroquinerie New World' },
    { nom: 'Melliber Appart Hôtel' },
    { nom: 'Nach Garment' },
    { nom: 'Pellatex' },
    { nom: 'Résidence Dream Garden 2' },
    { nom: 'Stradyconf' },
    { nom: 'Texmara' },
    { nom: 'Village Centre Sport' }
  ],

  // `court` : libellé raccourci pour les boutons de sélection (mobile)
  services: [
    {
      titre: 'Surveillance de sites',
      court: 'Surveillance',
      description: "Contrôle d'accès, rondes et prévention des risques pour vos commerces, sites professionnels et événements.",
      icone: 'bouclier'
    },
    {
      titre: 'Gardiennage de locaux et chantiers',
      court: 'Gardiennage',
      description: "Une présence ponctuelle ou régulière pour vos bâtiments, entrepôts et chantiers, avec des comptes rendus d'intervention.",
      icone: 'badge'
    },
    {
      titre: 'Nettoyage professionnel de bureaux et locaux',
      court: 'Nettoyage de locaux',
      description: 'Entretien de bureaux, commerces et parties communes, avec des passages planifiés et un résultat contrôlé.',
      icone: 'etincelle'
    },
    {
      titre: 'Nettoyage de fin de chantier',
      court: 'Fin de chantier',
      description: 'Remise en état après travaux : élimination des poussières et nettoyage des vitres, sols et surfaces avant la livraison des locaux.',
      icone: 'chantier'
    }
  ],

  engagements: [
    {
      titre: 'Une expérience de terrain',
      description: 'Entreprise créée en 2013, dirigée par un professionnel comptant 26 ans d\'expérience en surveillance.',
      icone: 'bouclier-coche'
    },
    {
      titre: 'Des équipes encadrées',
      description: 'Un responsable dédié encadre les équipes et suit les interventions.',
      icone: 'badge'
    },
    {
      titre: 'Une organisation adaptée',
      description: 'Prestations définies selon le site et ses contraintes.',
      icone: 'horloge'
    },
    {
      titre: 'Un devis précis',
      description: "Des prestations détaillées et un prix précisé avant l'intervention.",
      icone: 'document'
    },
    {
      titre: 'Un interlocuteur identifié',
      description: 'Un interlocuteur qui connaît votre site et vos exigences.',
      icone: 'bulle'
    },
    {
      titre: 'Des moyens professionnels',
      description: 'Tenues, équipements et produits adaptés.',
      icone: 'etincelle'
    }
  ],

  etapes: [
    {
      titre: 'Votre besoin',
      description: 'Précisez le service recherché, le site concerné et la fréquence souhaitée.',
      icone: 'bulle'
    },
    {
      titre: "L'évaluation du site",
      description: 'Nous échangeons sur vos contraintes et visitons le site si nécessaire.',
      icone: 'lieu'
    },
    {
      titre: 'Votre devis',
      description: 'Vous recevez une proposition qui précise le périmètre et le prix.',
      icone: 'document'
    },
    {
      titre: "L'intervention et le suivi",
      description: 'Nous démarrons à la date convenue. Un interlocuteur identifié assure le suivi.',
      icone: 'bouclier-coche'
    }
  ]
};
