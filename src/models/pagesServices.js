// CONTENU DES PAGES DE SERVICES
// Une page par prestation. On n'y écrit que des informations déjà validées par l'entreprise.
// Les points encore à confirmer sont listés dans docs/seo/02-informations-manquantes.md : rien n'en est publié ici.
// L'ordre suit celui de `services` dans entreprise.js (même index = même scène, même icône).
// `sites` : liste courte des lieux concernés ; `sitesTexte` : court paragraphe à la place de la liste, quand une liste n'apporterait rien.
// `prestations` : liste compacte (une ligne par point), sans carte ni phrase de remplissage.

module.exports = [
  {
    slug: 'surveillance',
    faqTitre: 'Vos questions sur la surveillance de sites',
    nom: 'Surveillance de sites',
    h1: 'Surveillance de sites professionnels au Maroc',
    seoTitre: 'Surveillance de sites professionnels au Maroc | Forty Services',
    seoDescription: "Contrôle des accès et rondes pour vos sites professionnels, commerces et événements, à Casablanca et dans les autres villes du Maroc. Demandez un devis.",
    intro: "Contrôlez les accès à votre site et renforcez la vigilance sur vos installations. Nos agents assurent ce contrôle et effectuent des rondes, selon les besoins définis avec vous.",
    sitesTitre: 'Pour quels sites ?',
    sites: ['Sites professionnels', 'Commerces', 'Événements'],
    prestationsTitre: 'Ce que comprend la surveillance',
    prestations: [
      'Contrôle des accès à votre site.',
      'Rondes pour renforcer la vigilance.',
      "Présence d'agents, selon les besoins définis pour votre site."
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
    faqTitre: 'Vos questions sur le gardiennage',
    nom: 'Gardiennage',
    h1: 'Gardiennage de locaux et de chantiers au Maroc',
    seoTitre: 'Gardiennage de locaux et de chantiers au Maroc | Forty Services',
    seoDescription: "Gardiennage de locaux, entrepôts et chantiers à Casablanca et dans les autres villes du Maroc. Présence ponctuelle ou régulière. Devis gratuit sous 24 h.",
    intro: "Organisez une présence sur vos locaux, entrepôts et chantiers, ponctuellement ou dans la durée. La prestation tient compte de vos contraintes et comprend des comptes rendus d'intervention.",
    sitesTitre: 'Pour quels lieux ?',
    sites: ['Bâtiments et locaux professionnels', 'Entrepôts et espaces de stockage', 'Chantiers'],
    prestationsTitre: 'Ce que comprend le gardiennage',
    prestations: [
      "Présence d'un agent sur le lieu à garder.",
      'Gardiennage ponctuel ou régulier.',
      "Comptes rendus d'intervention."
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
    faqTitre: 'Vos questions sur le nettoyage de locaux',
    nom: 'Nettoyage de locaux',
    h1: 'Nettoyage professionnel de bureaux et de locaux au Maroc',
    seoTitre: 'Nettoyage de bureaux et de locaux au Maroc | Forty Services',
    seoDescription: "Nettoyage de bureaux, commerces et parties communes à Casablanca et dans les autres villes du Maroc. Passages planifiés. Devis gratuit sous 24 h.",
    intro: "Des locaux propres comptent pour vos équipes comme pour vos visiteurs. Nous entretenons vos bureaux et vos locaux par des passages planifiés selon vos besoins.",
    sitesTitre: 'Pour quels locaux ?',
    sites: ['Bureaux', 'Commerces', 'Parties communes'],
    prestationsTitre: "Ce que comprend l'entretien",
    prestations: [
      'Passages planifiés selon vos besoins.',
      'Produits adaptés à la prestation.',
      'Résultat contrôlé.'
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
    faqTitre: 'Vos questions sur le nettoyage de fin de chantier',
    nom: 'Nettoyage de fin de chantier',
    h1: 'Nettoyage de fin de chantier au Maroc',
    seoTitre: 'Nettoyage de fin de chantier au Maroc | Forty Services',
    seoDescription: "Nettoyage de fin de chantier à Casablanca et dans les autres villes du Maroc : dépoussiérage, vitres, sols et surfaces. Devis gratuit sous 24 h.",
    intro: "Préparez la livraison de vos locaux avec un nettoyage après travaux. Nous les remettons en état : dépoussiérage et nettoyage des vitres, des sols et des surfaces.",
    sitesTitre: 'À quel moment ?',
    sitesTexte: "L'intervention a lieu après les travaux et avant la livraison de vos locaux. La remise en état est définie selon les besoins du chantier.",
    prestationsTitre: 'Ce que comprend la remise en état',
    prestations: [
      'Dépoussiérage après travaux.',
      'Nettoyage des vitres.',
      'Nettoyage des sols et des surfaces.'
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
