// src/utils/helpers.js
import { format, formatDistance, formatRelative } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date selon le format souhaité
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '';
  return format(new Date(date), formatStr, { locale: fr });
};

/**
 * Formate une date en format relatif (il y a X jours)
 */
export const formatRelativeDate = (date) => {
  if (!date) return '';
  return formatDistance(new Date(date), new Date(), { 
    addSuffix: true, 
    locale: fr 
  });
};

/**
 * Formate une date en format relatif complet
 */
export const formatRelativeFull = (date) => {
  if (!date) return '';
  return formatRelative(new Date(date), new Date(), { locale: fr });
};

/**
 * Valide un email
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Valide un mot de passe (min 8 caractères)
 */
export const validatePassword = (password) => {
  return password && password.length >= 8;
};

/**
 * Tronque un texte
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalise la première lettre
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formate un numéro de téléphone français
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
  }
  return phone;
};

/**
 * Génère un ID unique
 */
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formate une taille de fichier
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * Obtient l'extension d'un fichier
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

/**
 * Vérifie si un fichier est une image
 */
export const isImageFile = (file) => {
  if (!file) return false;
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  return imageTypes.includes(file.type);
};

/**
 * Vérifie si un fichier est un PDF
 */
export const isPdfFile = (file) => {
  if (!file) return false;
  return file.type === 'application/pdf';
};

/**
 * Convertit un fichier en Base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Debounce une fonction
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Copie du texte dans le presse-papiers
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erreur lors de la copie:', err);
    return false;
  }
};

/**
 * Génère une couleur aléatoire pour les avatars
 */
export const generateAvatarColor = (name) => {
  if (!name) return '#3b82f6';
  const colors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
    '#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Obtient les initiales d'un nom
 */
export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Calcule l'âge à partir d'une date de naissance
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

/**
 * Génère une couleur de badge selon le statut
 */
export const getStatusColor = (status) => {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[status] || colors.default;
};

/**
 * Génère une couleur de badge selon la priorité
 */
export const getPriorityColor = (priority) => {
  const colors = {
    urgente: 'bg-red-100 text-red-800 border-red-200',
    haute: 'bg-orange-100 text-orange-800 border-orange-200',
    normale: 'bg-blue-100 text-blue-800 border-blue-200',
    basse: 'bg-gray-100 text-gray-800 border-gray-200',
    routine: 'bg-green-100 text-green-800 border-green-200',
  };
  return colors[priority] || colors.normale;
};

/**
 * Génère un gradient aléatoire
 */
export const generateGradient = (seed = '') => {
  const gradients = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-pink-500 to-rose-600',
    'from-yellow-500 to-orange-600',
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-pink-600',
  ];
  const index = seed ? seed.charCodeAt(0) % gradients.length : 0;
  return gradients[index];
};

/**
 * Formate un montant en euros
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0,00 €';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

/**
 * Vérifie si une date est dans le futur
 */
export const isFutureDate = (date) => {
  if (!date) return false;
  return new Date(date) > new Date();
};

/**
 * Vérifie si une date est dans le passé
 */
export const isPastDate = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};