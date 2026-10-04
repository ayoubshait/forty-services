// MODÈLE : toutes les données de l'entreprise.
// Pour modifier un texte, un numéro ou un service : c'est ici, et uniquement ici.

module.exports = {
  nom: 'Forty Services',
  anneeCreation: 2013,
  formeJuridique: 'S.A.R.L',   // d'après le logo officiel
  ville: 'Casablanca',
  quartier: 'Sidi Moumen',
  adresse: 'Lot. Al Ward, Rue 22, Imm 4, Sidi Moumen, Casablanca',
  zone: 'Casablanca et ses environs',
  // Autres villes : on ne cite aucune ville supplémentaire tant qu'elle n'est pas confirmée
  zoneAutresVilles: "Pour une intervention dans une autre ville, contactez-nous afin d'étudier les possibilités.",
  gerant: 'Mustapha Shait',
  experienceGerant: 13,   // années à la tête de Forty Services
  experienceMetier: 26,   // années d'expérience du dirigeant dans la surveillance
  email: 'forty.services@gmail.com',

  // Présentation factuelle de l'entreprise (utilisée dans la section équipe)
  presentation: [
    "Depuis 2013, Forty Services accompagne les professionnels à Casablanca et ses environs dans la surveillance, le gardiennage et la propreté de leurs locaux.",
    "Basée à Sidi Moumen, l'entreprise est dirigée par Mustapha Shait, qui compte 26 ans d'expérience en surveillance."
  ],

  // Informations légales (affichées dans le pied de page seulement si elles sont renseignées)
  // Source du capital : annuaire Telecontact.ma (« 300 000 »), à vérifier avec les statuts
  capital: '300 000 MAD',
  // Hébergeur du site (à mettre à jour si le site change d'hébergeur)
  hebergeur: { nom: 'Render Services, Inc.', adresse: '525 Brannan Street, Suite 300, San Francisco, CA 94107, États-Unis', site: 'https://render.com' },

  infosLegales: { ice: '000009597000065', rc: '294027 Casablanca', patente: '' },   // ICE et RC : source annuaire Telecontact.ma, à confirmer avec vos documents officiels

  // Questions fréquentes : réponses tirées du contenu du site ; à valider avec vos pratiques réelles
  faq: [
    {
      q: "Où intervenez-vous ?",
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
         "Nous vous répondons sous 24 h avec un devis gratuit et détaillé, qui précise le périmètre et le prix. Le délai court à partir de la réception des informations nécessaires."
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
  delaiDevis: '24 h',   // devis gratuit : délai à compter de la réception des informations nécessaires
  horairesContact: '',   // à renseigner quand ils seront confirmés (ex. « du lundi au samedi, de 8 h à 18 h ») : la ligne apparaît alors dans le contact

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

  // Références clients.
  // Pour afficher un logo : ajouter  logo: '/images/clients/nom.svg'  (fichier officiel, fourni et autorisé par le client)
  // et  logoFond: 'sombre'  si le logo est blanc ou clair (version « blanche »), sinon 'clair'.
  // Sans logo, seul le nom du client s'affiche.
  // Attention : on indique les prestations réalisées, sans préciser si le contrat est en cours (à ne pas affirmer sans confirmation).
  referencesPhares: [
    { nom: 'Ambassade de la République de Slovénie à Rabat', prestations: ['Surveillance'], logo: '/images/clients/slovenie.png', logoFond: 'clair' },
    { nom: 'AMITH', prestations: ['Nettoyage', 'Gardiennage'], logo: '/images/clients/amith-mauve.svg', logoFond: 'clair' },
    { nom: 'Melliber Appart Hôtel', prestations: ['Surveillance'], logo: '/images/clients/melliber.png', logoFond: 'sombre' },
    { nom: 'DNA Maroc', prestations: ['Surveillance', 'Gardiennage'] }
  ],
  // Autres références (liste compacte) : ne pas y répéter les clients ci-dessus
  references: [
    { nom: 'CMTV' },
    { nom: 'Coutexport' },
    { nom: 'Hymco' },
    { nom: 'Lina Wash' },
    { nom: 'Maroquinerie New World' },
    { nom: 'Nach Garment' },
    { nom: 'Pellatex' },
    { nom: 'Résidence Dream Garden 2' },
    { nom: 'Stradyconf' },
    { nom: 'Texmara' },
    { nom: 'Village Centre Sport' }
  ],

  // `court` : libellé raccourci des boutons de sélection ; `courte` : phrase courte de la fiche sous la maquette (la description complète est dans les cartes)
  services: [
    {
      titre: 'Surveillance de sites',
      court: 'Surveillance',
      courte: "Contrôle des accès et rondes pour renforcer la vigilance sur vos sites, commerces et événements.",
      description: "Renforcez la vigilance sur vos sites professionnels, commerces et événements. Contrôle des accès et rondes : nos agents contribuent à prévenir les risques selon les besoins définis pour votre site.",
      icone: 'bouclier'
    },
    {
      titre: 'Gardiennage de locaux et de chantiers',
      court: 'Gardiennage',
      courte: "Une présence ponctuelle ou régulière sur vos locaux et chantiers, avec des comptes rendus d'intervention.",
      description: "Organisez une présence sur vos bâtiments, entrepôts et chantiers. Ponctuelle ou régulière, la prestation tient compte de vos contraintes et comprend des comptes rendus d'intervention.",
      icone: 'badge'
    },
    {
      titre: 'Nettoyage professionnel de bureaux et de locaux',
      court: 'Nettoyage de locaux',
      courte: "Des passages planifiés pour entretenir vos bureaux, commerces et parties communes.",
      description: 'Offrez à vos équipes et à vos visiteurs des espaces propres et entretenus. Nous planifions les passages selon vos besoins, avec des produits adaptés et un résultat contrôlé.',
      icone: 'etincelle'
    },
    {
      titre: 'Nettoyage de fin de chantier',
      court: 'Fin de chantier',
      courte: "Dépoussiérage et nettoyage des vitres, sols et surfaces avant la livraison de vos locaux.",
      description: 'Préparez vos locaux à la livraison après travaux. Dépoussiérage et nettoyage des vitres, sols et surfaces : une remise en état définie selon les besoins du chantier.',
      icone: 'chantier'
    }
  ],

  engagements: [
    {
      titre: 'Une expérience de terrain',
      description: "Une entreprise créée en 2013, dirigée par un professionnel comptant 26 ans d'expérience en surveillance.",
      icone: 'bouclier-coche'
    },
    {
      titre: 'Des équipes encadrées',
      description: 'Un responsable dédié encadre les équipes et suit les interventions.',
      icone: 'badge'
    },
    {
      titre: 'Une organisation adaptée',
      description: 'Les prestations sont définies selon votre site, votre activité et vos contraintes.',
      icone: 'horloge'
    },
    {
      titre: 'Un devis détaillé',
      description: 'Vous connaissez les prestations prévues et leur prix avant le démarrage.',
      icone: 'document'
    },
    {
      titre: 'Un interlocuteur dédié',
      description: 'Vous échangez avec un responsable qui connaît votre site et vos exigences.',
      icone: 'bulle'
    },
    {
      titre: 'Des moyens adaptés',
      description: 'Tenues, équipements et produits sont choisis selon la prestation à réaliser.',
      icone: 'etincelle'
    }
  ],

  etapes: [
    {
      titre: 'Vous précisez votre besoin',
      description: "Indiquez le service recherché, l'adresse du site et la fréquence souhaitée.",
      icone: 'bulle'
    },
    {
      titre: 'Nous évaluons les contraintes',
      description: 'Nous échangeons sur votre organisation et visitons le site si nécessaire.',
      icone: 'lieu'
    },
    {
      titre: 'Vous recevez votre devis',
      description: 'La proposition détaille les prestations prévues et leur prix.',
      icone: 'document'
    },
    {
      titre: 'Nous intervenons et assurons le suivi',
      description: 'La prestation démarre à la date convenue. Votre interlocuteur suit les interventions.',
      icone: 'bouclier-coche'
    }
  ]
};
