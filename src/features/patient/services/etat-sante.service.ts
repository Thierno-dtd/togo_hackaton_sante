// ============================================================
// Service État de Santé - Données vitales et indicateurs
// ============================================================

import type { EtatSanteData, MesureSante, AlerteSante } from '../types/patient.types';
// import { apiGet, apiPost } from '@core/api';

export const etatSanteService = {
  /**
   * Récupérer toutes les données de santé du patient
   */
  getEtatSante: async (patientId: string): Promise<EtatSanteData> => {
    // TODO: return apiGet<EtatSanteData>(`/patients/${patientId}/etat-sante`);
    await new Promise((r) => setTimeout(r, 400));

    return {
      indicateurs: [
        {
          id: 'ind_1',
          label: 'Tension artérielle',
          valeur: '12/8',
          status: 'normal',
          icon: 'fas fa-heartbeat',
          description: 'Tension artérielle dans les normes',
        },
        {
          id: 'ind_2',
          label: 'Glycémie',
          valeur: '0.95 g/L',
          status: 'normal',
          icon: 'fas fa-tint',
          description: 'Taux de glycémie normal',
        },
        {
          id: 'ind_3',
          label: 'IMC',
          valeur: '23.5',
          status: 'normal',
          icon: 'fas fa-weight',
          description: 'Indice de masse corporelle normal',
        },
        {
          id: 'ind_4',
          label: 'Fréquence cardiaque',
          valeur: '72 bpm',
          status: 'normal',
          icon: 'fas fa-heart',
          description: 'Rythme cardiaque au repos normal',
        },
      ],
      mesures: [
        { id: 'm1', type: 'poids', valeur: 72, unite: 'kg', date: '2024-03-15', tendance: 'stable' },
        { id: 'm2', type: 'tension', valeur: 128, unite: 'mmHg', date: '2024-03-15', tendance: 'baisse' },
        { id: 'm3', type: 'glycemie', valeur: 0.95, unite: 'g/L', date: '2024-03-14', tendance: 'stable' },
        { id: 'm4', type: 'temperature', valeur: 36.8, unite: '°C', date: '2024-03-15', tendance: 'stable' },
        { id: 'm5', type: 'frequence_cardiaque', valeur: 72, unite: 'bpm', date: '2024-03-15', tendance: 'stable' },
        { id: 'm6', type: 'saturation', valeur: 98, unite: '%', date: '2024-03-15', tendance: 'stable' },
      ],
      score: {
        global: 85,
        categories: [
          { label: 'Cardiovasculaire', score: 90, maxScore: 100 },
          { label: 'Métabolique', score: 82, maxScore: 100 },
          { label: 'Respiratoire', score: 95, maxScore: 100 },
          { label: 'Général', score: 78, maxScore: 100 },
        ],
        derniereMaj: '2024-03-15',
      },
      alertes: [
        {
          id: 'a1',
          type: 'info',
          message: 'Prochain rendez-vous de suivi dans 2 semaines',
          date: '2024-03-15',
          lue: false,
        },
        {
          id: 'a2',
          type: 'warning',
          message: 'Renouvellement d\'ordonnance à prévoir le 30 mars',
          date: '2024-03-10',
          lue: true,
        },
      ],
      recommandations: [
        'Maintenir une activité physique régulière (30 min/jour)',
        'Boire au moins 1.5L d\'eau par jour',
        'Continuer le suivi de la tension artérielle',
        'Prochain bilan sanguin à prévoir en avril',
      ],
    };
  },

  /**
   * Enregistrer une nouvelle mesure
   */
  ajouterMesure: async (patientId: string, mesure: Omit<MesureSante, 'id'>): Promise<MesureSante> => {
    // TODO: return apiPost<MesureSante>(`/patients/${patientId}/mesures`, mesure);
    await new Promise((r) => setTimeout(r, 300));
    return { ...mesure, id: `m_${Date.now()}` };
  },

  /**
   * Marquer une alerte comme lue
   */
  marquerAlerteLue: async (alerteId: string): Promise<void> => {
    // TODO: return apiPost(`/alertes/${alerteId}/lue`);
    await new Promise((r) => setTimeout(r, 200));
  },
};
