// ============================================================
// Types Patient - DTOs et interfaces pour le module patient
// Compatible Spring Boot Backend
// ============================================================

import type { ExamenStatus, Priorite, ConsultationStatus, PrescriptionStatus } from '@shared/types';

// ─── Rendez-vous ───────────────────────────────────────────

/** Statut d'un rendez-vous patient */
export type RendezVousStatus = 'planifie' | 'confirme' | 'en_cours' | 'termine' | 'annule';

/** Type de rendez-vous */
export type RendezVousType = 'consultation' | 'suivi' | 'urgence' | 'teleconsultation' | 'examen';

/** Rendez-vous médical côté patient */
export interface RendezVous {
  id: string;
  medecinId: string;
  medecinNom: string;
  specialite: string;
  date: string;
  heure: string;
  type: RendezVousType;
  status: RendezVousStatus;
  lieu: string;
  motif: string;
  notes?: string;
  avatar: string;
}

/** DTO création rendez-vous (envoyé au backend) */
export interface CreateRendezVousDTO {
  medecinId: string;
  date: string;
  heure: string;
  type: RendezVousType;
  motif: string;
  lieu?: string;
}

/** DTO mise à jour rendez-vous */
export interface UpdateRendezVousDTO {
  date?: string;
  heure?: string;
  motif?: string;
  status?: RendezVousStatus;
}

// ─── Ordonnances Patient (lecture seule) ────────────────────

/** Statut QR d'une ordonnance */
export type OrdonnanceQRStatus = 'valide' | 'utilisee' | 'expiree';

/** Médicament dans une ordonnance (vue patient) */
export interface OrdonnanceMedicamentPatient {
  id: string;
  nom: string;
  dosage: string;
  frequence: string;
  duree: string;
  instructions?: string;
  pris: boolean;
}

/** Ordonnance côté patient */
export interface OrdonnancePatient {
  id: string;
  medecinNom: string;
  specialite: string;
  dateCreation: string;
  dateExpiration: string;
  status: PrescriptionStatus;
  qrStatus: OrdonnanceQRStatus;
  medicaments: OrdonnanceMedicamentPatient[];
  notes?: string;
  qrCode?: string;
}

// ─── État de santé ──────────────────────────────────────────

/** Mesure de santé (poids, tension, etc.) */
export interface MesureSante {
  id: string;
  type: 'poids' | 'tension' | 'glycemie' | 'temperature' | 'frequence_cardiaque' | 'saturation';
  valeur: number;
  unite: string;
  date: string;
  tendance: 'hausse' | 'baisse' | 'stable';
}

/** Indicateur de santé clé */
export interface IndicateurSante {
  id: string;
  label: string;
  valeur: string;
  status: 'normal' | 'attention' | 'critique';
  icon: string;
  description: string;
}

/** Score de santé global */
export interface ScoreSante {
  global: number;
  categories: {
    label: string;
    score: number;
    maxScore: number;
  }[];
  derniereMaj: string;
}

/** Données complètes état de santé */
export interface EtatSanteData {
  indicateurs: IndicateurSante[];
  mesures: MesureSante[];
  score: ScoreSante;
  alertes: AlerteSante[];
  recommandations: string[];
}

/** Alerte santé */
export interface AlerteSante {
  id: string;
  type: 'info' | 'warning' | 'danger';
  message: string;
  date: string;
  lue: boolean;
}

// ─── Centre de santé / Disponibilités ───────────────────────

/** Type d'établissement */
export type TypeEtablissement = 'Hôpital' | 'Clinique' | 'Pharmacie' | 'Laboratoire' | 'Cabinet';

/** Statut de disponibilité */
export type DisponibiliteStatus = 'Disponible' | 'Complet' | 'Partiellement disponible';

/** Centre de santé avec disponibilités */
export interface CentreSante {
  id: string;
  nom: string;
  type: TypeEtablissement;
  adresse: string;
  telephone: string;
  email?: string;
  services: string[];
  disponibilite: DisponibiliteStatus;
  horaires: string;
  distance?: string;
  note?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

/** Filtre de recherche centres */
export interface CentreSanteFilter {
  search?: string;
  type?: TypeEtablissement;
  disponibilite?: DisponibiliteStatus;
  service?: string;
}

// ─── Expert Médical (Chat IA) ───────────────────────────────

/** Rôle dans la conversation */
export type MessageRole = 'user' | 'assistant' | 'system';

/** Message de conversation */
export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  sources?: string[];
}

/** Conversation avec l'expert médical */
export interface Conversation {
  id: string;
  titre: string;
  messages: ConversationMessage[];
  dateCreation: string;
  dernierMessage: string;
}

/** DTO envoi de message */
export interface SendMessageDTO {
  conversationId?: string;
  message: string;
  contexte?: {
    allergies?: string[];
    medicamentsActuels?: string[];
    antecedents?: string[];
  };
}

/** Réponse de l'expert */
export interface ExpertResponse {
  message: ConversationMessage;
  suggestions?: string[];
  disclaimer: string;
}

// ─── Gestion des accès ─────────────────────────────────────

/** Type d'accès étendu */
export type TypeAcces = 'complet' | 'temporaire' | 'lecture' | 'urgence';

/** Historique d'accès */
export interface HistoriqueAcces {
  id: string;
  medecinId: string;
  medecinNom: string;
  specialite: string;
  action: 'consultation' | 'modification' | 'export';
  details: string;
  date: string;
}

/** Demande d'accès en attente */
export interface DemandeAcces {
  id: string;
  medecinId: string;
  medecinNom: string;
  specialite: string;
  typeAcces: TypeAcces;
  motif: string;
  dateDemande: string;
  avatar: string;
}

/** DTO réponse à une demande d'accès */
export interface ReponseDemandeAccesDTO {
  demandeId: string;
  acceptee: boolean;
  dateFin?: string;
}

// ─── Appel vidéo ────────────────────────────────────────────

/** Statut d'un appel vidéo */
export type AppelVideoStatus = 'en_attente' | 'en_cours' | 'termine' | 'manque';

/** Session d'appel vidéo */
export interface AppelVideo {
  id: string;
  rendezVousId: string;
  medecinId: string;
  medecinNom: string;
  specialite: string;
  dateHeure: string;
  status: AppelVideoStatus;
  duree?: number;
  lienReunion?: string;
  avatar: string;
}

/** Configuration WebRTC (prêt pour intégration) */
export interface WebRTCConfig {
  iceServers: { urls: string }[];
  sessionId: string;
  token: string;
}

// ─── Médicaments (vue patient enrichie) ─────────────────────

/** Médicament avec suivi de prise */
export interface MedicamentSuivi {
  id: string;
  nom: string;
  dosage: string;
  frequence: string;
  duree: string;
  debut: string;
  fin: string;
  prescripteur: string;
  instructions: string;
  prochainePrise?: string;
  prisesAujourdhui: number;
  prisesTotalesJour: number;
  status: 'en_cours' | 'termine' | 'a_renouveler';
}

/** Rappel de prise de médicament */
export interface RappelMedicament {
  id: string;
  medicamentId: string;
  medicamentNom: string;
  heure: string;
  pris: boolean;
  date: string;
}
