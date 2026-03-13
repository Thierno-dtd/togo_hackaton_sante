import { useQuery } from '@tanstack/react-query';
import { healthRecordService } from '../services/healthRecord.service';

export const healthRecordKeys = {
  all: ['health-record'] as const,
  patient: (patientId: string) => [...healthRecordKeys.all, 'patient', patientId] as const,
  consultations: (patientId: string) => [...healthRecordKeys.all, 'consultations', patientId] as const,
  hospitalisations: (patientId: string) => [...healthRecordKeys.all, 'hospitalisations', patientId] as const,
};

export const useHealthRecord = (patientId: string | undefined) => {
  const patientQuery = useQuery({
    queryKey: healthRecordKeys.patient(patientId ?? ''),
    queryFn: () => healthRecordService.getPatient(patientId!),
    enabled: !!patientId,
  });

  const consultationsQuery = useQuery({
    queryKey: healthRecordKeys.consultations(patientId ?? ''),
    queryFn: () => healthRecordService.getConsultations(patientId!),
    enabled: !!patientId,
  });

  const hospitalisationsQuery = useQuery({
    queryKey: healthRecordKeys.hospitalisations(patientId ?? ''),
    queryFn: () => healthRecordService.getHospitalisations(patientId!),
    enabled: !!patientId,
  });

  return {
    patient: patientQuery,
    consultations: consultationsQuery,
    hospitalisations: hospitalisationsQuery,
  };
};
