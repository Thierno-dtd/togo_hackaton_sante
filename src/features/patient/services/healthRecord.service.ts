import { getPatientRecord, getConsultationsForPatient, getHospitalisationsForPatient } from '@shared/data/mock-data';
import type { PatientRecord, ConsultationRecord, HospitalisationRecord } from '@shared/types/patient-record.types';

export const healthRecordService = {
  getPatient: async (patientId: string): Promise<PatientRecord | undefined> => {
    await new Promise((r) => setTimeout(r, 300));
    return getPatientRecord(patientId);
  },

  getConsultations: async (patientId: string): Promise<ConsultationRecord[]> => {
    await new Promise((r) => setTimeout(r, 400));
    return getConsultationsForPatient(patientId);
  },

  getHospitalisations: async (patientId: string): Promise<HospitalisationRecord[]> => {
    await new Promise((r) => setTimeout(r, 400));
    return getHospitalisationsForPatient(patientId);
  },
};
