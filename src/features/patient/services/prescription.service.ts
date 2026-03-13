import type { PrescriptionData } from '../types/ordonnance.types';
import { MOCK_PRESCRIPTIONS, getMockPrescriptionsForPatient } from '@shared/data/mock-data';

export const prescriptionService = {
  getPrescriptions: async (patientId: string): Promise<PrescriptionData[]> => {
    await new Promise((r) => setTimeout(r, 400));
    if (patientId) return getMockPrescriptionsForPatient(patientId);
    return MOCK_PRESCRIPTIONS;
  },

  getPrescriptionById: async (id: string): Promise<PrescriptionData | undefined> => {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_PRESCRIPTIONS.find((p) => p.id === id);
  },
};
