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

    return [
      {
        id: 'ord_1',
        medecinNom: 'Dr. BEGNI Touna',
        specialite: 'Cardiologie',
        dateCreation: '2024-03-15',
        dateExpiration: '2024-06-15',
        status: 'active',
        qrStatus: 'valide',
        medicaments: [
          {
            id: 'med_o1_1',
            nom: 'Amlodipine',
            dosage: '5mg',
            frequence: '1 fois/jour',
            duree: '3 mois',
            instructions: 'Le matin au petit-déjeuner',
            pris: true,
          },
          {
            id: 'med_o1_2',
            nom: 'Aspirine',
            dosage: '100mg',
            frequence: '1 fois/jour',
            duree: '3 mois',
            instructions: 'Après le repas du midi',
            pris: false,
          },
        ],
        notes: 'Traitement de fond cardiovasculaire',
        qrCode: 'QR_ORD_001_2024',
      },
      {
        id: 'ord_2',
        medecinNom: 'Dr. Prisca KANGNI',
        specialite: 'Médecine générale',
        dateCreation: '2024-02-20',
        dateExpiration: '2024-03-20',
        status: 'utilisee',
        qrStatus: 'utilisee',
        medicaments: [
          {
            id: 'med_o2_1',
            nom: 'Amoxicilline',
            dosage: '500mg',
            frequence: '3 fois/jour',
            duree: '7 jours',
            instructions: 'Pendant les repas',
            pris: true,
          },
          {
            id: 'med_o2_2',
            nom: 'Paracétamol',
            dosage: '1000mg',
            frequence: 'Si douleur (max 3/jour)',
            duree: '5 jours',
            pris: true,
          },
        ],
      },
      {
        id: 'ord_3',
        medecinNom: 'Dr. BEGNI Touna',
        specialite: 'Cardiologie',
        dateCreation: '2023-12-01',
        dateExpiration: '2024-01-15',
        status: 'expiree',
        qrStatus: 'expiree',
        medicaments: [
          {
            id: 'med_o3_1',
            nom: 'Bisoprolol',
            dosage: '2.5mg',
            frequence: '1 fois/jour',
            duree: '1 mois',
            instructions: 'Le matin',
            pris: true,
          },
        ],
      },
    ];
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
