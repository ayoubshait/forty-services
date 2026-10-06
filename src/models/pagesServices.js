// CONTENU DES PAGES DE SERVICES
// Une page par prestation. On n'y écrit que des informations déjà validées par l'entreprise.
// Les points encore à confirmer sont listés dans docs/seo/02-informations-manquantes.md : rien n'en est publié ici.
// L'ordre suit celui de `services` dans entreprise.js (même index = même scène, même icône).

module.exports = [
  {
    slug: 'surveillance',
    nom: 'Surveillance de sites',
    h1: 'Surveillance de sites professionnels au Maroc',
    seoTitre: 'Surveillance de sites professionnels au Maroc | Forty Services',
    seoDescription: "Contrôle des accès et rondes pour vos sites professionnels, commerces et événements, à Casablanca et dans les autres villes du Maroc. Demandez un devis.",
    intro: "Vous devez savoir qui entre sur votre site et garder vos installations sous surveillance. Nos agents contrôlent les accès et effectuent des rondes, selon les besoins définis avec vous.",
    sitesTitre: 'Pour quels sites ?',
    sites: [
      { titre: 'Sites professionnels', texte: 'Vos bâtiments et vos installations.' },
      { titre: 'Commerces', texte: 'Vos points de vente et leurs accès.' },
      { titre: 'Événements', texte: 'Une présence le temps de votre événement.' }
    ],
    prestationsTitre: 'Ce que comprend la surveillance',
    prestations: [
      { titre: 'Contrôle des accès', texte: 'Les entrées de votre site sont contrôlées par un agent.' },
      { titre: 'Rondes', texte: 'Les agents parcourent le site pour renforcer la vigilance.' },
      { titre: 'Prévention des risques', texte: 'La présence des agents contribue à prévenir les risques, selon les besoins définis pour votre site.' }
    ],
    etapes: [
      "Indiquez l'adresse du site, sa nature (site professionnel, commerce ou événement) et la fréquence souhaitée.",
      'Nous échangeons sur votre organisation et visitons le site si nécessaire.',
      'Vous recevez un devis gratuit et détaillé, sous 24 h après réception des informations nécessaires.',
      'Les agents interviennent à la date convenue. Votre interlocuteur suit la prestation.'
    ],
    engagements: ['Un responsable dédié', 'Des moyens adaptés', 'Une organisation adaptée'],
    references: ['Consulat de la République de Slovénie', 'Melliber Appart Hôtel', 'DNA Maroc'],
    faq: [
      { q: 'Quels sites pouvez-vous surveiller ?', r: 'Nous surveillons des sites professionnels, des commerces et des événements. Décrivez-nous le vôtre : nous étudions avec vous la présence adaptée.' },
      { q: 'En quoi consiste la surveillance ?', r: "Elle repose sur le contrôle des accès et sur des rondes. Leur organisation est définie selon les besoins de votre site." },
      { q: 'Qui suit la prestation ?', r: "Un responsable dédié encadre les agents et assure le suivi des interventions. C'est aussi votre interlocuteur." }
    ]
  },
  {
    slug: 'gardiennage',
    nom: 'Gardiennage',
    h1: 'Gardiennage de locaux et de chantiers au Maroc',
    seoTitre: 'Gardiennage de locaux et de chantiers au Maroc | Forty Services',
    seoDescription: "Une présence ponctuelle ou régulière sur vos bâtiments, entrepôts et chantiers, avec des comptes rendus d'intervention. Devis gratuit sous 24 h.",
    intro: "Un bâtiment, un entrepôt ou un chantier ne doit pas rester sans présence. Nous organisons le gardiennage de vos lieux, de façon ponctuelle ou régulière, en tenant compte de vos contraintes.",
    sitesTitre: 'Pour quels lieux ?',
    sites: [
      { titre: 'Bâtiments et locaux', texte: 'Une présence sur vos locaux professionnels.' },
      { titre: 'Entrepôts', texte: 'Vos lieux de stockage gardés.' },
      { titre: 'Chantiers', texte: 'Une présence sur votre chantier.' }
    ],
    prestationsTitre: 'Ce que comprend le gardiennage',
    prestations: [
      { titre: 'Une présence sur place', texte: 'Un agent est présent sur le lieu à garder.' },
      { titre: 'Ponctuel ou régulier', texte: 'Pour un besoin limité dans le temps ou pour une présence installée dans la durée.' },
      { titre: "Comptes rendus d'intervention", texte: 'Vous êtes informé du déroulement du gardiennage.' }
    ],
    etapes: [
      "Indiquez l'adresse, le type de lieu (bâtiment, entrepôt ou chantier) et si la présence doit être ponctuelle ou régulière.",
      'Nous échangeons sur vos contraintes et visitons le lieu si nécessaire.',
      'Vous recevez un devis gratuit et détaillé, sous 24 h après réception des informations nécessaires.',
      "Le gardiennage démarre à la date convenue. Vous recevez des comptes rendus d'intervention."
    ],
    engagements: ['Un responsable dédié', 'Une organisation adaptée', 'Un devis détaillé'],
    references: ['AMITH', 'DNA Maroc'],
    faq: [
      { q: 'Le gardiennage peut-il être ponctuel ?', r: "Oui. Le gardiennage s'organise ponctuellement ou dans la durée, selon votre besoin." },
      { q: 'Quels lieux pouvez-vous garder ?', r: 'Des bâtiments, des entrepôts et des chantiers. Indiquez-nous le lieu concerné : nous étudions avec vous son organisation.' },
      { q: 'Recevons-nous un compte rendu ?', r: "Oui. Le gardiennage donne lieu à des comptes rendus d'intervention." }
    ]
  },
  {
    slug: 'nettoyage-locaux',
    nom: 'Nettoyage de locaux',
    h1: 'Nettoyage professionnel de bureaux et de locaux au Maroc',
    seoTitre: 'Nettoyage de bureaux et de locaux au Maroc | Forty Services',
    seoDescription: "Des passages planifiés pour entretenir vos bureaux, commerces et parties communes, avec des produits adaptés. Demandez un devis gratuit.",
    intro: "Des locaux propres comptent pour vos équipes comme pour vos visiteurs. Nous entretenons vos bureaux et vos locaux par des passages planifiés selon vos besoins.",
    sitesTitre: 'Pour quels locaux ?',
    sites: [
      { titre: 'Bureaux', texte: 'Les espaces de travail de vos équipes.' },
      { titre: 'Commerces', texte: 'Les espaces où vous recevez vos clients.' },
      { titre: 'Parties communes', texte: 'Les espaces partagés de vos immeubles.' }
    ],
    prestationsTitre: "Ce que comprend l'entretien",
    prestations: [
      { titre: 'Passages planifiés', texte: 'Le rythme des passages est fixé selon vos besoins.' },
      { titre: 'Produits adaptés', texte: 'Les produits sont choisis selon la prestation à réaliser.' },
      { titre: 'Résultat contrôlé', texte: "L'entretien réalisé est contrôlé." }
    ],
    etapes: [
      "Indiquez les locaux à entretenir (bureaux, commerce ou parties communes), leur adresse et la fréquence souhaitée.",
      'Nous échangeons sur votre organisation et visitons les locaux si nécessaire.',
      'Vous recevez un devis gratuit et détaillé, sous 24 h après réception des informations nécessaires.',
      'Les passages commencent à la date convenue et suivent le planning défini.'
    ],
    engagements: ['Des moyens adaptés', 'Une organisation adaptée', 'Un responsable dédié'],
    references: ['AMITH'],
    faq: [
      { q: 'À quelle fréquence intervenez-vous ?', r: 'Les passages sont planifiés selon vos besoins. La fréquence est définie avec vous avant le démarrage.' },
      { q: 'Quels locaux entretenez-vous ?', r: 'Des bureaux, des commerces et des parties communes.' },
      { q: 'Quels produits utilisez-vous ?', r: 'Des produits adaptés, choisis selon la prestation à réaliser.' }
    ]
  },
  {
    slug: 'nettoyage-fin-chantier',
    nom: 'Nettoyage de fin de chantier',
    h1: 'Nettoyage de fin de chantier au Maroc',
    seoTitre: 'Nettoyage de fin de chantier au Maroc | Forty Services',
    seoDescription: "Dépoussiérage, vitres, sols et surfaces : vos locaux remis en état après travaux, avant leur livraison. Devis gratuit sous 24 h.",
    intro: "Les travaux sont terminés, mais vos locaux ne sont pas encore prêts à être livrés. Nous les remettons en état : dépoussiérage et nettoyage des vitres, des sols et des surfaces.",
    sitesTitre: 'À quel moment ?',
    sites: [
      { titre: 'Après les travaux', texte: "L'intervention a lieu une fois le chantier terminé." },
      { titre: 'Avant la livraison', texte: 'Vos locaux sont nettoyés avant leur remise.' },
      { titre: 'Selon votre chantier', texte: 'La remise en état est définie selon les besoins du chantier.' }
    ],
    prestationsTitre: 'Ce que comprend la remise en état',
    prestations: [
      { titre: 'Dépoussiérage', texte: 'Les poussières laissées par les travaux sont éliminées.' },
      { titre: 'Vitres', texte: 'Les vitres sont nettoyées.' },
      { titre: 'Sols et surfaces', texte: 'Les sols et les surfaces sont nettoyés avant la livraison.' }
    ],
    etapes: [
      "Indiquez l'adresse du chantier et la date de livraison prévue.",
      'Nous échangeons sur les besoins du chantier et le visitons si nécessaire.',
      'Vous recevez un devis gratuit et détaillé, sous 24 h après réception des informations nécessaires.',
      "L'intervention a lieu à la date convenue, après les travaux et avant la livraison."
    ],
    engagements: ['Un devis détaillé', 'Des moyens adaptés', 'Une organisation adaptée'],
    references: [],
    faq: [
      { q: 'Quand faut-il prévoir le nettoyage de fin de chantier ?', r: 'Après les travaux et avant la livraison des locaux. Donnez-nous la date de livraison prévue : nous organisons l\'intervention en conséquence.' },
      { q: 'Que comprend ce nettoyage ?', r: 'Le dépoussiérage et le nettoyage des vitres, des sols et des surfaces.' },
      { q: 'Comment est défini le périmètre ?', r: 'Selon les besoins du chantier. Nous échangeons avec vous et visitons les lieux si nécessaire, puis le devis précise les prestations prévues et leur prix.' }
    ]
  }
];
