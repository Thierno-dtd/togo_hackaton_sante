// ============================================================
// Service Médicaments Patient (avec suivi de prises)
// ============================================================

import type { MedicamentSuivi, RappelMedicament } from '../types/patient.types';
// import { apiGet, apiPost } from '@core/api';

export const medicamentService = {
  /**
   * Récupérer les médicaments avec suivi
   */
  getMedicaments: async (patientId: string): Promise<MedicamentSuivi[]> => {
    // TODO: return apiGet<MedicamentSuivi[]>(`/patients/${patientId}/medicaments`);
    await new Promise((r) => setTimeout(r, 400));

    return [
      {
        id: 'med_1',
        nom: 'Amlodipine',
        dosage: '5mg',
        frequence: '1 fois/jour',
        duree: '3 mois',
        debut: '2024-01-15',
        fin: '2024-04-15',
        prescripteur: 'Dr. BEGNI Touna',
        instructions: 'Le matin au petit-déjeuner avec un verre d\'eau',
        prochainePrise: '08:00',
        prisesAujourdhui: 1,
        prisesTotalesJour: 1,
        status: 'en_cours',
      },
      {
        id: 'med_2',
        nom: 'Aspirine',
        dosage: '100mg',
        frequence: '1 fois/jour',
        duree: '3 mois',
        debut: '2024-01-15',
        fin: '2024-04-15',
        prescripteur: 'Dr. BEGNI Touna',
        instructions: 'Après le repas du midi',
        prochainePrise: '13:00',
        prisesAujourdhui: 0,
        prisesTotalesJour: 1,
        status: 'en_cours',
      },
      {
        id: 'med_3',
        nom: 'Vitamine D3',
        dosage: '1000 UI',
        frequence: '1 fois/jour',
        duree: '6 mois',
        debut: '2024-02-01',
        fin: '2024-08-01',
        prescripteur: 'Dr. Prisca KANGNI',
        instructions: 'Au cours d\'un repas contenant des graisses',
        prochainePrise: '12:00',
        prisesAujourdhui: 1,
        prisesTotalesJour: 1,
        status: 'en_cours',
      },
      {
        id: 'med_4',
        nom: 'Amoxicilline',
        dosage: '500mg',
        frequence: '3 fois/jour',
        duree: '7 jours',
        debut: '2024-02-20',
        fin: '2024-02-27',
        prescripteur: 'Dr. Prisca KANGNI',
        instructions: 'Pendant les repas',
        prisesAujourdhui: 0,
        prisesTotalesJour: 0,
        status: 'termine',
      },
    ];
  },

  /**
   * Récupérer les rappels du jour
   */
  getRappels: async (patientId: string): Promise<RappelMedicament[]> => {
    // TODO: return apiGet<RappelMedicament[]>(`/patients/${patientId}/rappels-medicaments`);
    await new Promise((r) => setTimeout(r, 300));

    const today = new Date().toISOString().split('T')[0];
    return [
      { id: 'rap_1', medicamentId: 'med_1', medicamentNom: 'Amlodipine 5mg', heure: '08:00', pris: true, date: today },
      { id: 'rap_2', medicamentId: 'med_2', medicamentNom: 'Aspirine 100mg', heure: '13:00', pris: false, date: today },
      { id: 'rap_3', medicamentId: 'med_3', medicamentNom: 'Vitamine D3', heure: '12:00', pris: true, date: today },
    ];
  },

  /**
   * Marquer un médicament comme pris
   */
  marquerPrise: async (rappelId: string): Promise<void> => {
    // TODO: return apiPost(`/rappels/${rappelId}/prise`);
    await new Promise((r) => setTimeout(r, 200));
  },
};
