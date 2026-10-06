// MODÈLE : toutes les données de l'entreprise.
// Pour modifier un texte, un numéro ou un service : c'est ici, et uniquement ici.

module.exports = {
  nom: 'Forty Services',
  anneeCreation: 2013,
  formeJuridique: 'S.A.R.L',   // d'après le logo officiel
  ville: 'Casablanca',
  quartier: 'Sidi Moumen',
  adresse: 'Lot. Al Ward, Rue 22, Imm 4, Sidi Moumen, Casablanca',
  // Zone annoncée : « Casablanca et les autres villes du Maroc » (formulation validée par le dirigeant : ancrage local sans se limiter à une ville)
  zone: 'Casablanca et les autres villes du Maroc',
  gerant: 'Mustapha SHAIT',
  experienceGerant: 13,   // années à la tête de Forty Services
  experienceMetier: 26,   // années d'expérience du dirigeant dans la surveillance
  email: 'forty.services@gmail.com',

  // Présentation factuelle de l'entreprise (utilisée dans la section équipe)
  presentation: [
    "Depuis 2013, Forty Services accompagne les professionnels à Casablanca et dans d'autres villes du Maroc dans la surveillance, le gardiennage et la propreté de leurs locaux.",
    "Basée à Sidi Moumen, à Casablanca, l'entreprise est dirigée par Mustapha SHAIT, qui compte 26 ans d'expérience en surveillance."
  ],

  // Informations légales (affichées dans le pied de page seulement si elles sont renseignées)
  // Source du capital : annuaire Telecontact.ma (« 300 000 »), à vérifier avec les statuts
  capital: '300 000 MAD',
  infosLegales: { ice: '000009597000065', rc: '294027 Casablanca', patente: '' },   // ICE et RC : source annuaire Telecontact.ma, à confirmer avec vos documents officiels

  // Questions fréquentes : réponses tirées du contenu du site ; à valider avec vos pratiques réelles
  faq: [
    {
      q: "Où intervenez-vous ?",
      r: "Basés à Sidi Moumen, à Casablanca, nous intervenons aussi dans d'autres villes du Maroc. " +
         "Communiquez-nous l'adresse de votre site : nous étudions avec vous l'organisation de l'intervention."
    },
    {
      q: "Proposez-vous des prestations ponctuelles ou régulières ?",
      r: "Les deux. Le gardiennage s'organise ponctuellement ou dans la durée. Le nettoyage de bureaux et de locaux suit des passages planifiés. " +
         "Le nettoyage de fin de chantier est une remise en état après travaux."
    },
    {
      q: "Comment est préparé le devis ?",
      r: "Pour commencer, indiquez le service recherché, l'adresse du site et la fréquence souhaitée. " +
         "Selon la prestation, nous échangeons sur votre organisation et visitons le site si nécessaire. " +
         "Vous recevez ensuite un devis gratuit et détaillé, sous 24 h après réception des informations nécessaires."
    },
    {
      q: "Comment se passe le suivi ?",
      r: "Vous échangez avec un interlocuteur dédié, qui connaît votre site et vos contraintes. " +
         "Pour le gardiennage, vous recevez des comptes rendus d'intervention."
    },
    {
      q: "En quoi consiste le nettoyage de fin de chantier ?",
      r: "C'est la remise en état après travaux : dépoussiérage, nettoyage des vitres, des sols et des surfaces, " +
         "avant la livraison des locaux."
    }
  ],

  // Carte numérique : pass Apple (fichier signé) et lien Google Wallet. Version complète à l'identité Forty Services : voir wallet/PREREQUIS.md
  carteNumerique: {
    apple: '/wallet/forty-services.pkpass',
    // Lien « Ajouter à Google Wallet » (pass de test signé par l'outil gratuit WalletWallet, émetteur tiers)
    google: 'https://pay.google.com/gp/v/save/eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3YWxsZXR3YWxsZXQtbG9jYWxAZ3Jvd3NwYWNlLXJvLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwiYXVkIjoiZ29vZ2xlIiwidHlwIjoic2F2ZXRvd2FsbGV0IiwiaWF0IjoxNzkxMjc0NTQxLCJvcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCIsImh0dHBzOi8vd2FsbGV0d2FsbGV0LWxvY2FsLmFsZW4ucm8iLCJodHRwczovL3dhbGxldHdhbGxldC5hbGVuLnJvIl0sInBheWxvYWQiOnsiZ2VuZXJpY0NsYXNzZXMiOlt7ImlkIjoiMzM4ODAwMDAwMDAyMzA4Mzc3MC53YWxsZXR3YWxsZXQtZ2VuZXJpYyJ9XSwiZ2VuZXJpY09iamVjdHMiOlt7ImlkIjoiMzM4ODAwMDAwMDAyMzA4Mzc3MC5mb3J0eS1zZXJ2aWNlcy1jNDMxYjRiNy0yMjE1LTQ1ZjYtODc3My02MTU3NWNjYTM1MGIiLCJjbGFzc0lkIjoiMzM4ODAwMDAwMDAyMzA4Mzc3MC53YWxsZXR3YWxsZXQtZ2VuZXJpYyIsInN0YXRlIjoiQUNUSVZFIiwiYmFyY29kZSI6eyJ0eXBlIjoiUVJfQ09ERSIsInZhbHVlIjoiaHR0cHM6Ly9mb3J0eXNlcnZpY2VzLm1hLyIsImFsdGVybmF0ZVRleHQiOiJodHRwczovL2ZvcnR5c2VydmljZXMubWEvIn0sImNhcmRUaXRsZSI6eyJkZWZhdWx0VmFsdWUiOnsibGFuZ3VhZ2UiOiJlbi1VUyIsInZhbHVlIjoiRm9ydHkgU2VydmljZXMifX0sImhlYWRlciI6eyJkZWZhdWx0VmFsdWUiOnsibGFuZ3VhZ2UiOiJlbi1VUyIsInZhbHVlIjoiKzIxMiA2MTEgNjIgNDcgMTgifX0sInN1YmhlYWRlciI6eyJkZWZhdWx0VmFsdWUiOnsibGFuZ3VhZ2UiOiJlbi1VUyIsInZhbHVlIjoiTXVzdGFwaGEgU0hBSVQgwrcgR8OpcmFudCDCtyBmb3J0eXNlcnZpY2VzLm1hIn19LCJoZXhCYWNrZ3JvdW5kQ29sb3IiOiIjMTgxODFiIn1dfX0.p4RQQv_PyC5DRpQy-4omC0iDzPzs05dTBpw-OLrhHQFvDtdtsFQx8vADHEMduH2rkVp-aX6PEgz_gldH8NP-q3lC1H03UIG292XTKrQdZfdw7bnP4r-V6TYe9OCnX--vjoybHa0vwNYbhoEG6syJa5F5NXUd8DdkRK6siVxjs8pyeDyfK17vve8qoS8Q9XrjmAJqaFvMykMX3GMnDyQlvONup4h4FyPkoE-YLDi2fWcbKJTENKt8XymQRaFqSua5wCe7IYGzZytYmObcJwkDERzstux6PesKgy-8hGUrib7D5FoQBYnSIzPd6Zx8gfcAe1h71DZmWAs6dOugpm1m9A'
  },
  url: 'https://fortyservices.ma',   // adresse officielle (source unique : balises SEO, partage, données structurées) ; sitemap.xml et robots.txt la répètent

  telephones: [
    { affiche: '06 11 62 47 18', e164: '+212611624718' },
    { affiche: '06 69 31 05 47', e164: '+212669310547' }
  ],

  // Numéro WhatsApp au format international sans + ni espaces
  whatsapp: '212611624718',
  whatsappMessage: 'Bonjour, je souhaite un devis pour une prestation.',

  disponibilite: '24 h/24 et 7 j/7',
  delaiDevis: '24 h',   // devis gratuit : délai à compter de la réception des informations nécessaires
  horairesContact: '',   // le contact est joignable 24 h/24 (confirmé par le dirigeant) : déjà couvert par la ligne « Disponibilité et contact » ; ne renseigner que si des horaires distincts apparaissent

  seo: {
    titre: 'Gardiennage et nettoyage professionnel au Maroc | Forty Services',
    description:
      'Gardiennage, surveillance et nettoyage professionnel à Casablanca et dans les autres villes du Maroc. ' +
      'Forty Services accompagne vos sites depuis 2013. Demandez votre devis.'
  },

  // Photos (fichiers dans public/images/)
  photos: {
    equipe: {
      src: '/images/equipe.webp',
      alt: "L'équipe Forty Services devant un site client"
    }
  },

  // Références clients.
  // Pour afficher un logo : ajouter  logo: '/images/clients/nom.svg'  (fichier officiel, fourni et autorisé par le client)
  // et  logoFond: 'sombre'  si le logo est blanc ou clair (version « blanche »), sinon 'clair'.
  // logoHauteur : hauteur d'affichage en px (ne jamais dépasser la taille du fichier) ; nomDansLogo : le logo écrit déjà le nom (pas de répétition).
  // Sans logo, seul le nom du client s'affiche.
  // Attention : on indique les prestations réalisées, sans préciser si le contrat est en cours (à ne pas affirmer sans confirmation).
  referencesPhares: [
    { nom: 'Consulat de la République de Slovénie', prestations: ['Surveillance'], logo: '/images/clients/slovenie.png', logoFond: 'clair', logoHauteur: 40, logoLargeur: 199, logoHauteurFichier: 49 },
    { nom: 'AMITH', prestations: ['Nettoyage', 'Gardiennage'], logo: '/images/clients/amith-mauve.svg', logoFond: 'clair', logoHauteur: 68, nomDansLogo: true, logoLargeur: 230, logoHauteurFichier: 120 },
    { nom: 'Melliber Appart Hôtel', prestations: ['Surveillance'], logo: '/images/clients/melliber.png', logoFond: 'sombre', logoHauteur: 48, logoLargeur: 300, logoHauteurFichier: 234 },
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

  // `visible` : titre affiché sur la carte ; `points` : trois points clés de la carte (une ligne chacun) ; `titre` : intitulé complet (pied de page, message WhatsApp, données structurées)
  // `court` : libellé raccourci des boutons de sélection ; `courte` : phrase courte de la fiche sous la maquette (la description complète est dans les cartes)
  services: [
    {
      titre: 'Surveillance de sites',
      slug: 'surveillance',   // adresse de la page dédiée : /surveillance
      court: 'Surveillance',
      visible: 'Surveillance de sites',
      points: ["Contrôle des accès", "Rondes", "Sites, commerces, événements"],
      courte: "Contrôle des accès et rondes pour renforcer la vigilance sur vos sites, commerces et événements.",
      description: "Renforcez la vigilance sur vos sites professionnels, commerces et événements. Contrôle des accès et rondes : nos agents contribuent à prévenir les risques selon les besoins définis pour votre site.",
      icone: 'bouclier'
    },
    {
      titre: 'Gardiennage de locaux et de chantiers',
      slug: 'gardiennage',   // adresse de la page dédiée : /gardiennage
      court: 'Gardiennage',
      visible: 'Gardiennage',
      points: ["Locaux, entrepôts, chantiers", "Ponctuel ou régulier", "Comptes rendus d'intervention"],
      courte: "Une présence ponctuelle ou régulière sur vos locaux et chantiers, avec des comptes rendus d'intervention.",
      description: "Organisez une présence sur vos bâtiments, entrepôts et chantiers. Ponctuelle ou régulière, la prestation tient compte de vos contraintes et comprend des comptes rendus d'intervention.",
      icone: 'badge'
    },
    {
      titre: 'Nettoyage professionnel de bureaux et de locaux',
      slug: 'nettoyage-locaux',   // adresse de la page dédiée : /nettoyage-locaux
      court: 'Nettoyage de locaux',
      visible: 'Nettoyage de locaux',
      points: ["Bureaux, commerces, parties communes", "Passages planifiés", "Produits adaptés"],
      courte: "Des passages planifiés pour entretenir vos bureaux, commerces et parties communes.",
      description: 'Offrez à vos équipes et à vos visiteurs des espaces propres et entretenus. Nous planifions les passages selon vos besoins, avec des produits adaptés et un résultat contrôlé.',
      icone: 'etincelle'
    },
    {
      titre: 'Nettoyage de fin de chantier',
      slug: 'nettoyage-fin-chantier',   // adresse de la page dédiée : /nettoyage-fin-chantier
      court: 'Fin de chantier',
      visible: 'Nettoyage de fin de chantier',
      points: ["Dépoussiérage", "Vitres, sols, surfaces", "Avant la livraison"],
      courte: "Dépoussiérage et nettoyage des vitres, sols et surfaces avant la livraison de vos locaux.",
      description: 'Préparez vos locaux à la livraison après travaux. Dépoussiérage et nettoyage des vitres, sols et surfaces : une remise en état définie selon les besoins du chantier.',
      icone: 'chantier'
    }
  ],

  // Quatre engagements (les chiffres 2013 et 26 ans restent dans le bandeau d'accueil et la section équipe)
  engagements: [
    {
      titre: 'Un responsable dédié',
      description: 'Votre interlocuteur encadre les équipes et assure le suivi des interventions.',
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
      titre: 'Intervention et suivi',
      description: 'La prestation démarre à la date convenue. Votre interlocuteur suit les interventions.',
      icone: 'bouclier-coche'
    }
  ]
};
