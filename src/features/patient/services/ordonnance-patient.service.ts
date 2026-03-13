// ============================================================
// Service Ordonnances Patient (lecture seule + QR)
// ============================================================

import type { OrdonnancePatient } from '../types/patient.types';
// import { apiGet } from '@core/api';

export const ordonnancePatientService = {
  /**
   * Récupérer toutes les ordonnances du patient
   */
  getOrdonnances: async (patientId: string): Promise<OrdonnancePatient[]> => {
    // TODO: return apiGet<OrdonnancePatient[]>(`/patients/${patientId}/ordonnances`);
    await new Promise((r) => setTimeout(r, 400));
    const { getOrdonnancesForPatient } = await import('@shared/data/mock-data');
    const ords = getOrdonnancesForPatient(patientId);
    // map central shape to OrdonnancePatient used by the UI
    return ords.map((o) => ({
      id: o.id,
      medecinNom: o.medecin,
      specialite: 'Médecine générale', // placeholder, backend will supply later
      dateCreation: o.date,
      dateExpiration: '',
      status: (o.statut.toLowerCase() as any) || 'active',
      qrStatus: 'valide',
      medicaments: o.medicaments.map((m, idx) => ({
        id: `${o.id}_med_${idx}`,
        nom: m.nom,
        dosage: m.dosage,
        frequence: '',
        duree: m.duree,
        instructions: o.instructions || '',
        pris: false,
      })),
      notes: o.instructions,
      qrCode: undefined,
    }));
  },

  /**
   * Récupérer une ordonnance par ID
   */
  getOrdonnance: async (ordonnanceId: string): Promise<OrdonnancePatient> => {
    // TODO: return apiGet<OrdonnancePatient>(`/ordonnances/${ordonnanceId}`);
    await new Promise((r) => setTimeout(r, 300));
    const ordonnances = await ordonnancePatientService.getOrdonnances('');
    const found = ordonnances.find((o) => o.id === ordonnanceId);
    if (!found) throw new Error('Ordonnance introuvable');
    return found;
  },

  /**
   * Générer / rafraîchir le QR code d'une ordonnance
   */
  genererQRCode: async (ordonnanceId: string): Promise<string> => {
    // TODO: return apiPost<string>(`/ordonnances/${ordonnanceId}/qr`);
    await new Promise((r) => setTimeout(r, 500));
    return `QR_${ordonnanceId}_${Date.now()}`;
  },
};
