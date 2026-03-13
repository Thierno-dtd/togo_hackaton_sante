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
    // use centralized mock-data helper
    const { getRendezVousForPatient } = await import("@shared/data/mock-data");
    return getRendezVousForPatient(patientId);
  },

  /**
   * Créer un nouveau rendez-vous
   */
  // keep existing create stub for now, may be replaced with mock-data writing logic later
  creerRendezVous: async (patientId: string, dto: CreateRendezVousDTO): Promise<RendezVous> => {
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
