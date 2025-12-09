
export const MOCK_USERS = {
  medecin: {
    id: 'med_001',
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@mediconnect.com',
    role: 'medecin',
    avatar: 'JD',
    specialite: 'Cardiologie',
    telephone: '+33 1 23 45 67 89',
    numeroOrdre: 'ORD-12345'
  },
  patient: {
    id: 'pat_001',
    nom: 'Martin',
    prenom: 'Marie',
    email: 'marie.martin@email.com',
    role: 'patient',
    avatar: 'MM',
    age: 35,
    dateNaissance: '1989-05-15',
    groupeSanguin: 'A+',
    numeroSecu: '1 89 05 75 123 456 78'
  },
  pharmacien: {
    id: 'pharm_001',
    nom: 'Durand',
    prenom: 'Sophie',
    email: 'sophie.durand@pharmacie-centrale.com',
    role: 'pharmacien',
    avatar: 'SD',
    pharmacie: 'Pharmacie Centrale',
    adresse: '12 Rue de la Santé, 75014 Paris',
    numeroOrdre: 'PHARM-67890'
  },
  admin: {
    id: 'admin_001',
    nom: 'Admin',
    prenom: 'Système',
    email: 'admin@mediconnect.com',
    role: 'admin',
    avatar: 'AS',
    permissions: 'all'
  }
};

export const DASHBOARD_CARDS = {
  common: [
    {
      id: 'diagnostic-ia',
      title: 'Diagnostic IA',
      description: 'Analysez des images médicales avec l\'IA pour un diagnostic précis et rapide.',
      icon: 'fas fa-stethoscope',
      route: '/diagnostic-ia',
      color: 'blue',
      roles: ['medecin', 'patient']
    },
    {
      id: 'expert-medical',
      title: 'Expert Médical',
      description: 'Chatbot médical avec modes patient et médecin pour des conseils adaptés.',
      icon: 'fas fa-comments',
      route: '/expert-medical',
      color: 'green',
      roles: ['medecin', 'patient', 'pharmacien']
    },
    {
      id: 'examens',
      title: 'Examens médicaux',
      description: 'Créez, planifiez et gérez l\'historique de vos examens médicaux.',
      icon: 'fas fa-file-medical',
      route: '/examens',
      color: 'purple',
      roles: ['medecin', 'patient']
    },
    {
      id: 'disponibilites',
      title: 'Disponibilités des centres',
      description: 'Trouvez les cliniques, hôpitaux et pharmacies disponibles près de vous.',
      icon: 'fas fa-map-marker-alt',
      route: '/disponibilites',
      color: 'orange',
      roles: ['medecin', 'patient']
    }
  ],

  patient: [
    {
      id: 'dossier-medical',
      title: 'Mon dossier médical',
      description: 'Consultez votre historique médical complet, crypté et sécurisé.',
      icon: 'fas fa-folder-open',
      route: '/patient/dossier',
      color: 'blue',
      badge: 'Pa'
    },
    {
      id: 'etat-sante',
      title: 'Mon état de santé',
      description: 'Visualisez l\'état prédictif de votre santé basé sur vos analyses.',
      icon: 'fas fa-heartbeat',
      route: '/patient/etat-sante',
      color: 'red',
      badge: 'Pa'
    },
    {
      id: 'medicaments',
      title: 'Analyser mes médicaments',
      description: 'Vérifiez les interactions et obtenez des informations sur vos médicaments.',
      icon: 'fas fa-pills',
      route: '/patient/medicaments',
      color: 'green',
      badge: 'Pa'
    }
  ],

  medecin: [
    {
      id: 'dossiers-patients',
      title: 'Dossiers patients',
      description: 'Accédez aux dossiers médicaux de vos patients autorisés.',
      icon: 'fas fa-user-injured',
      route: '/medecin/patients',
      color: 'blue',
      badge: 'Dr'
    },
    {
      id: 'cas-speciaux',
      title: 'Cas spéciaux',
      description: 'Collaborez avec d\'autres experts sur des cas médicaux complexes.',
      icon: 'fas fa-user-friends',
      route: '/medecin/cas-speciaux',
      color: 'purple',
      badge: 'Dr'
    },
    {
      id: 'ordonnances',
      title: 'Ordonnances QR',
      description: 'Créez des ordonnances sécurisées avec code QR.',
      icon: 'fas fa-prescription',
      route: '/medecin/ordonnances',
      color: 'green',
      badge: 'Dr'
    }
  ],

  pharmacien: [
    {
      id: 'dechiffrage-ordonnances',
      title: 'Déchiffrage d\'ordonnances',
      description: 'Scannez et déchiffrez les ordonnances QR des patients.',
      icon: 'fas fa-qrcode',
      route: '/pharmacien/scan-qr',
      color: 'blue',
      badge: 'Ph'
    },
    {
      id: 'gestion-pharmacie',
      title: 'Gestion pharmacie',
      description: 'Gérez votre stock et la disponibilité des médicaments.',
      icon: 'fas fa-clinic-medical',
      route: '/pharmacien/gestion',
      color: 'green',
      badge: 'Ph'
    }
  ],

  admin: [
    {
      id: 'users',
      title: 'Utilisateurs',
      description: 'Gérez tous les utilisateurs de la plateforme.',
      icon: 'fas fa-users',
      route: '/admin/users',
      color: 'blue'
    },
    {
      id: 'statistiques',
      title: 'Statistiques',
      description: 'Consultez les statistiques d\'utilisation de la plateforme.',
      icon: 'fas fa-chart-bar',
      route: '/admin/statistiques',
      color: 'purple'
    },
    {
      id: 'etablissements',
      title: 'Établissements',
      description: 'Gérez les hôpitaux, cliniques et pharmacies.',
      icon: 'fas fa-hospital',
      route: '/admin/etablissements',
      color: 'green'
    }
  ]
};

export const NOTIFICATIONS = [
  {
    id: 'notif_1',
    type: 'info',
    title: 'Nouvel examen disponible',
    message: 'Les résultats de votre examen sont disponibles',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    roles: ['patient']
  },
  {
    id: 'notif_2',
    type: 'warning',
    title: 'Rendez-vous à venir',
    message: 'Vous avez un rendez-vous demain à 14h',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: false,
    roles: ['patient', 'medecin']
  },
  {
    id: 'notif_3',
    type: 'success',
    title: 'Prescription validée',
    message: 'Votre ordonnance a été validée par le médecin',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
    roles: ['patient']
  }
];

export const EXAMENS = [
  {
    id: 'exam_1',
    type: 'Radiographie',
    date: '2024-03-15',
    status: 'effectue',
    medecin: 'Dr. Jean Dupont',
    description: 'Radiographie thoracique de contrôle',
    resultat: 'Normal',
    fichiers: ['radio_thorax_001.jpg']
  },
  {
    id: 'exam_2',
    type: 'Prise de sang',
    date: '2024-03-10',
    status: 'effectue',
    medecin: 'Dr. Marie Laurent',
    description: 'Bilan sanguin complet',
    resultat: 'En attente',
    fichiers: []
  },
  {
    id: 'exam_3',
    type: 'IRM',
    date: '2024-04-05',
    status: 'planifie',
    medecin: 'Dr. Jean Dupont',
    description: 'IRM cérébrale',
    resultat: null,
    fichiers: []
  }
];

export const MEDICAMENTS = [
  {
    id: 'med_1',
    nom: 'Doliprane 1000mg',
    dosage: '1000mg',
    frequence: '3 fois par jour',
    duree: '7 jours',
    debut: '2024-03-01',
    fin: '2024-03-08',
    prescripteur: 'Dr. Jean Dupont',
    instructions: 'À prendre après les repas'
  },
  {
    id: 'med_2',
    nom: 'Amoxicilline 500mg',
    dosage: '500mg',
    frequence: '2 fois par jour',
    duree: '10 jours',
    debut: '2024-03-05',
    fin: '2024-03-15',
    prescripteur: 'Dr. Jean Dupont',
    instructions: 'Antibiotique - Terminer le traitement complet'
  }
];

export const PATIENTS = [
  {
    id: 'pat_001',
    nom: 'Martin Marie',
    age: 35,
    groupeSanguin: 'A+',
    dernierExamen: '2024-03-15',
    status: 'Stable',
    avatar: 'MM'
  },
  {
    id: 'pat_002',
    nom: 'Bernard Pierre',
    age: 52,
    groupeSanguin: 'O+',
    dernierExamen: '2024-03-12',
    status: 'Suivi requis',
    avatar: 'BP'
  },
  {
    id: 'pat_003',
    nom: 'Dubois Sophie',
    age: 28,
    groupeSanguin: 'B+',
    dernierExamen: '2024-03-10',
    status: 'Stable',
    avatar: 'SD'
  }
];

export const ETABLISSEMENTS = [
  {
    id: 'etab_1',
    nom: 'Hôpital Saint-Louis',
    type: 'Hôpital',
    adresse: '1 Avenue Claude Vellefaux, 75010 Paris',
    telephone: '+33 1 42 49 49 49',
    services: ['Urgences', 'Cardiologie', 'Neurologie', 'Radiologie'],
    disponibilite: 'Disponible',
    coordinates: { lat: 48.8738, lng: 2.3701 }
  },
  {
    id: 'etab_2',
    nom: 'Pharmacie Centrale',
    type: 'Pharmacie',
    adresse: '12 Rue de la Santé, 75014 Paris',
    telephone: '+33 1 45 65 43 21',
    services: ['Médicaments', 'Garde 24h'],
    disponibilite: 'Disponible',
    coordinates: { lat: 48.8345, lng: 2.3387 }
  },
  {
    id: 'etab_3',
    nom: 'Clinique du Parc',
    type: 'Clinique',
    adresse: '45 Boulevard de la République, 92100 Boulogne',
    telephone: '+33 1 46 05 67 89',
    services: ['Consultations', 'Imagerie', 'Laboratoire'],
    disponibilite: 'Complet',
    coordinates: { lat: 48.8350, lng: 2.2399 }
  }
];