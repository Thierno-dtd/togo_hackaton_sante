// ============================================================
// Service Centres de Santé / Disponibilités
// ============================================================

import type { CentreSante, CentreSanteFilter } from '../types/patient.types';
// import { apiGet } from '@core/api';

export const healthCenterService = {
  /**
   * Récupérer les centres de santé avec filtres
   */
  getCentres: async (filters?: CentreSanteFilter): Promise<CentreSante[]> => {
    // TODO: return apiGet<CentreSante[]>('/centres-sante', { params: filters });
    await new Promise((r) => setTimeout(r, 400));

    const centres: CentreSante[] = [
      {
        id: 'cs_1',
        nom: 'Hôpital Central de Yaoundé',
        type: 'Hôpital',
        adresse: 'Avenue Ahmadou Ahidjo, Yaoundé',
        telephone: '+237 222 23 40 20',
        email: 'contact@hcy.cm',
        services: ['Urgences', 'Cardiologie', 'Chirurgie', 'Radiologie', 'Pédiatrie'],
        disponibilite: 'Disponible',
        horaires: '24h/24 - 7j/7',
        distance: '2.3 km',
        note: 4.2,
        coordinates: { lat: 3.866, lng: 11.517 },
      },
      {
        id: 'cs_2',
        nom: 'Clinique Pasteur',
        type: 'Clinique',
        adresse: '12 Rue de Nachtigal, Yaoundé',
        telephone: '+237 222 31 12 00',
        services: ['Médecine générale', 'Gynécologie', 'Laboratoire', 'Échographie'],
        disponibilite: 'Disponible',
        horaires: 'Lun-Sam: 7h-20h',
        distance: '1.1 km',
        note: 4.5,
        coordinates: { lat: 3.870, lng: 11.520 },
      },
      {
        id: 'cs_3',
        nom: 'Pharmacie du Centre',
        type: 'Pharmacie',
        adresse: '5 Boulevard du 20 Mai, Yaoundé',
        telephone: '+237 222 22 50 30',
        services: ['Médicaments', 'Parapharmacie', 'Conseil pharmaceutique'],
        disponibilite: 'Disponible',
        horaires: 'Lun-Sam: 8h-21h, Dim: 9h-13h',
        distance: '0.8 km',
        note: 4.0,
        coordinates: { lat: 3.868, lng: 11.515 },
      },
      {
        id: 'cs_4',
        nom: 'Laboratoire BioAnalyse',
        type: 'Laboratoire',
        adresse: '28 Rue Joseph Mballa, Yaoundé',
        telephone: '+237 222 20 15 60',
        services: ['Analyses sanguines', 'Bactériologie', 'Biochimie', 'Hématologie'],
        disponibilite: 'Partiellement disponible',
        horaires: 'Lun-Ven: 6h30-18h, Sam: 7h-13h',
        distance: '3.5 km',
        note: 4.3,
        coordinates: { lat: 3.875, lng: 11.510 },
      },
      {
        id: 'cs_5',
        nom: 'Hôpital Général de Douala',
        type: 'Hôpital',
        adresse: 'Boulevard de la Liberté, Douala',
        telephone: '+237 233 42 60 10',
        services: ['Urgences', 'Neurologie', 'Orthopédie', 'Réanimation'],
        disponibilite: 'Complet',
        horaires: '24h/24 - 7j/7',
        distance: '245 km',
        note: 3.9,
        coordinates: { lat: 4.050, lng: 9.700 },
      },
      {
        id: 'cs_6',
        nom: 'Cabinet Dr. Njoya',
        type: 'Cabinet',
        adresse: '10 Avenue Kennedy, Yaoundé',
        telephone: '+237 699 88 77 66',
        services: ['Médecine générale', 'Consultations', 'Certificats médicaux'],
        disponibilite: 'Disponible',
        horaires: 'Lun-Ven: 8h-17h',
        distance: '1.8 km',
        note: 4.7,
        coordinates: { lat: 3.867, lng: 11.522 },
      },
    ];

    // Appliquer les filtres côté client (sera fait côté serveur)
    let result = centres;
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.nom.toLowerCase().includes(s) ||
          c.adresse.toLowerCase().includes(s) ||
          c.services.some((svc) => svc.toLowerCase().includes(s))
      );
    }
    if (filters?.type) {
      result = result.filter((c) => c.type === filters.type);
    }
    if (filters?.disponibilite) {
      result = result.filter((c) => c.disponibilite === filters.disponibilite);
    }
    return result;
  },

  /**
   * Récupérer un centre par ID
   */
  getCentre: async (centreId: string): Promise<CentreSante> => {
    // TODO: return apiGet<CentreSante>(`/centres-sante/${centreId}`);
    const centres = await healthCenterService.getCentres();
    const found = centres.find((c) => c.id === centreId);
    if (!found) throw new Error('Centre introuvable');
    return found;
  },
};
