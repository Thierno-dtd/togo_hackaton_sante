// src/utils/constants.js

// Routes de l'application
export const ROUTES = {
  // Authentification
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Dashboard commun
  DASHBOARD: '/dashboard',
  
  // Patient routes
  PATIENT: {
    DOSSIER: '/patient/dossier',
    EXAMENS: '/patient/examens',
    EXAMENS_FAVORIS: '/patient/examens/favoris',
    HISTORIQUE_EXAMENS: '/patient/historique-examens',
    DIAGNOSTIC_IA: '/patient/diagnostic-ia',
    CHAT_IA: '/patient/chat-ia',
    ETAT_SANTE: '/patient/etat-sante',
    MEDICAMENTS: '/patient/medicaments',
    DISPONIBILITE: '/patient/disponibilite',
    PROFIL: '/patient/profil',
  },
  
  // Médecin routes
  MEDECIN: {
    DIAGNOSTIC_IA: '/medecin/diagnostic-ia',
    DOSSIERS_PATIENTS: '/medecin/dossiers-patients',
    CAS_SPECIAUX: '/medecin/cas-speciaux',
    CHAT_IA: '/medecin/chat-ia',
    EXAMENS: '/medecin/examens',
    HISTORIQUE_EXAMENS: '/medecin/historique-examens',
    EXAMENS_FAVORIS: '/medecin/examens-favoris',
    CONSULTATIONS: '/medecin/consultations',
    AGENDA: '/medecin/agenda',
    PROFIL: '/medecin/profil',
  },
  
  // Pharmacien routes
  PHARMACIEN: {
    SCAN_QR: '/pharmacien/scan-qr',
    STOCK: '/pharmacien/stock',
    PRODUITS_DISPONIBLES: '/pharmacien/produits-disponibles',
    PRESCRIPTIONS: '/pharmacien/prescriptions',
    PROFIL: '/pharmacien/profil',
  },
  
  // Admin routes
  ADMIN: {
    USERS: '/admin/users',
    MEDECINS: '/admin/medecins',
    PHARMACIENS: '/admin/pharmaciens',
    ETABLISSEMENTS: '/admin/etablissements',
    STATS: '/admin/stats',
    SETTINGS: '/admin/settings',
  },
};

// Statuts divers
export const STATUTS = {
  EXAMEN: {
    PLANIFIE: 'planifie',
    EFFECTUE: 'effectue',
    ANNULE: 'annule',
    EN_ATTENTE: 'en_attente',
  },
  CONSULTATION: {
    PLANIFIEE: 'planifiee',
    EN_COURS: 'en_cours',
    TERMINEE: 'terminee',
    ANNULEE: 'annulee',
  },
  PRESCRIPTION: {
    ACTIVE: 'active',
    UTILISEE: 'utilisee',
    EXPIREE: 'expiree',
    ANNULEE: 'annulee',
  },
  CAS_MEDICAL: {
    OUVERT: 'ouvert',
    EN_DISCUSSION: 'en_discussion',
    RESOLU: 'resolu',
    CLOS: 'clos',
  },
};

export const PRIORITES = {
  URGENTE: 'urgente',
  HAUTE: 'haute',
  NORMALE: 'normale',
  BASSE: 'basse',
  ROUTINE: 'routine',
};

// Types d'examens
export const TYPES_EXAMENS = [
  'Radiographie',
  'Scanner',
  'IRM',
  'Échographie',
  'Électrocardiogramme (ECG)',
  'Endoscopie',
  'Mammographie',
  'Échographie Doppler',
  'PET Scan',
  'Biopsie',
];

// Spécialités médicales
export const SPECIALITES = [
  'Cardiologie',
  'Dermatologie',
  'Neurologie',
  'Pédiatrie',
  'Chirurgie générale',
  'Orthopédie',
  'Ophtalmologie',
  'Psychiatrie',
  'Gynécologie',
  'Urologie',
  'ORL',
  'Médecine générale',
  'Radiologie',
  'Anesthésiologie',
  'Gastro-entérologie',
  'Pneumologie',
  'Rhumatologie',
  'Endocrinologie',
  'Oncologie',
  'Néphrologie',
];

export const GROUPES_SANGUINS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export const TYPES_DOCUMENTS = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  PDF: ['application/pdf'],
  MEDICAL: ['application/dicom'],
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_EMAIL: 'Email invalide',
  INVALID_PASSWORD: 'Le mot de passe doit contenir au moins 8 caractères',
  PASSWORDS_NOT_MATCH: 'Les mots de passe ne correspondent pas',
  LOGIN_FAILED: 'Email ou mot de passe incorrect',
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  FILE_TOO_LARGE: 'Le fichier est trop volumineux',
  INVALID_FILE_TYPE: 'Type de fichier non autorisé',
  UPLOAD_FAILED: 'Échec de l\'upload du fichier',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  REGISTER_SUCCESS: 'Inscription réussie',
  UPDATE_SUCCESS: 'Mise à jour réussie',
  DELETE_SUCCESS: 'Suppression réussie',
  UPLOAD_SUCCESS: 'Fichier uploadé avec succès',
  SAVE_SUCCESS: 'Enregistrement réussi',
};

export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  MAX_PAGES_DISPLAYED: 5,
};

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
};

// Couleurs des badges de statut
export const STATUS_COLORS = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  default: 'bg-gray-100 text-gray-800',
};

export const FILE_ICONS = {
  'image/jpeg': '🖼️',
  'image/jpg': '🖼️',
  'image/png': '🖼️',
  'application/pdf': '📄',
  'application/dicom': '🏥',
  default: '📎',
};

export const LOCALE_CONFIG = {
  language: 'fr-FR',
  currency: 'EUR',
  dateFormat: 'dd/MM/yyyy',
  timeFormat: 'HH:mm',
};