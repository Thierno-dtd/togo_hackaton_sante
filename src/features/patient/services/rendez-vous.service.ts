// ============================================================
// Service Rendez-vous Patient
// ============================================================

import type { RendezVous, CreateRendezVousDTO, UpdateRendezVousDTO } from '../types/patient.types';
// import { apiGet, apiPost, apiPut, apiDelete } from '@core/api';

export const rendezVousService = {
  /**
   * Récupérer tous les rendez-vous du patient
   */
  getRendezVous: async (patientId: string): Promise<RendezVous[]> => {
    // TODO: return apiGet<RendezVous[]>(`/patients/${patientId}/rendez-vous`);
    await new Promise((r) => setTimeout(r, 400));

    return [
      {
        id: 'rdv_1',
        medecinId: 'med_001',
        medecinNom: 'Dr. BEGNI Touna',
        specialite: 'Cardiologie',
        date: '2024-03-25',
        heure: '09:30',
        type: 'consultation',
        status: 'confirme',
        lieu: 'Cabinet médical - 15 rue de la Santé',
        motif: 'Suivi cardiologique trimestriel',
        avatar: 'BT',
      },
      {
        id: 'rdv_2',
        medecinId: 'med_002',
        medecinNom: 'Dr. Prisca KANGNI',
        specialite: 'Médecine générale',
        date: '2024-04-02',
        heure: '14:00',
        type: 'suivi',
        status: 'planifie',
        lieu: 'Clinique Pasteur - Salle 12',
        motif: 'Bilan de santé annuel',
        avatar: 'PK',
      },
      {
        id: 'rdv_3',
        medecinId: 'med_003',
        medecinNom: 'Dr. A. MBARGA',
        specialite: 'Dermatologie',
        date: '2024-03-20',
        heure: '11:00',
        type: 'consultation',
        status: 'termine',
        lieu: 'Hôpital Central - Bâtiment B',
        motif: 'Consultation dermatologique',
        notes: 'RAS - Peau en bon état général',
        avatar: 'AM',
      },
      {
        id: 'rdv_4',
        medecinId: 'med_001',
        medecinNom: 'Dr. BEGNI Touna',
        specialite: 'Cardiologie',
        date: '2024-03-18',
        heure: '08:30',
        type: 'teleconsultation',
        status: 'termine',
        lieu: 'En ligne',
        motif: 'Suivi résultats ECG',
        notes: 'Résultats normaux, continuer traitement',
        avatar: 'BT',
      },
    ];
  },

  /**
   * Créer un nouveau rendez-vous
   */
  creerRendezVous: async (patientId: string, dto: CreateRendezVousDTO): Promise<RendezVous> => {
    // TODO: return apiPost<RendezVous>(`/patients/${patientId}/rendez-vous`, dto);
    await new Promise((r) => setTimeout(r, 400));
    return {
      id: `rdv_${Date.now()}`,
      medecinId: dto.medecinId,
      medecinNom: 'Dr. Nouveau Médecin',
      specialite: 'Médecine générale',
      date: dto.date,
      heure: dto.heure,
      type: dto.type,
      status: 'planifie',
      lieu: dto.lieu ?? 'À confirmer',
      motif: dto.motif,
      avatar: 'NM',
    };
  },

  /**
   * Modifier un rendez-vous
   */
  modifierRendezVous: async (rendezVousId: string, dto: UpdateRendezVousDTO): Promise<RendezVous> => {
    // TODO: return apiPut<RendezVous>(`/rendez-vous/${rendezVousId}`, dto);
    await new Promise((r) => setTimeout(r, 300));
    return {} as RendezVous; // Retournera le RDV mis à jour depuis le backend
  },

  /**
   * Annuler un rendez-vous
   */
  annulerRendezVous: async (rendezVousId: string): Promise<void> => {
    // TODO: return apiDelete<void>(`/rendez-vous/${rendezVousId}`);
    await new Promise((r) => setTimeout(r, 300));
  },
};
