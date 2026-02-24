// ============================================================
// useOrdonnancePatient - Hook React Query ordonnances patient
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordonnancePatientService } from '../services/ordonnance-patient.service';
import toast from 'react-hot-toast';

export const ordonnancePatientKeys = {
  all: ['ordonnances-patient'] as const,
  list: (patientId: string) => [...ordonnancePatientKeys.all, 'list', patientId] as const,
  detail: (ordonnanceId: string) => [...ordonnancePatientKeys.all, 'detail', ordonnanceId] as const,
};

/**
 * Hook pour récupérer les ordonnances du patient
 */
export const useOrdonnancesPatient = (patientId: string | undefined) => {
  return useQuery({
    queryKey: ordonnancePatientKeys.list(patientId ?? ''),
    queryFn: () => ordonnancePatientService.getOrdonnances(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook pour récupérer une ordonnance détaillée
 */
export const useOrdonnanceDetail = (ordonnanceId: string | undefined) => {
  return useQuery({
    queryKey: ordonnancePatientKeys.detail(ordonnanceId ?? ''),
    queryFn: () => ordonnancePatientService.getOrdonnance(ordonnanceId!),
    enabled: !!ordonnanceId,
  });
};

/**
 * Hook mutation pour générer un QR code
 */
export const useGenererQRCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ordonnanceId: string) =>
      ordonnancePatientService.genererQRCode(ordonnanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordonnancePatientKeys.all });
      toast.success('QR Code généré avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la génération du QR Code');
    },
  });
};
