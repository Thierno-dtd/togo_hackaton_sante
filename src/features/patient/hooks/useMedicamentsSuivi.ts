// ============================================================
// useMedicamentsSuivi - Hook React Query médicaments patient
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicamentService } from '../services/medicament.service';
import toast from 'react-hot-toast';

export const medicamentKeys = {
  all: ['medicaments-patient'] as const,
  list: (patientId: string) => [...medicamentKeys.all, 'list', patientId] as const,
  rappels: (patientId: string) => [...medicamentKeys.all, 'rappels', patientId] as const,
};

/**
 * Hook pour récupérer les médicaments avec suivi
 */
export const useMedicamentsSuivi = (patientId: string | undefined) => {
  return useQuery({
    queryKey: medicamentKeys.list(patientId ?? ''),
    queryFn: () => medicamentService.getMedicaments(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook pour récupérer les rappels de prise
 */
export const useRappelsMedicaments = (patientId: string | undefined) => {
  return useQuery({
    queryKey: medicamentKeys.rappels(patientId ?? ''),
    queryFn: () => medicamentService.getRappels(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook mutation pour marquer une prise
 */
export const useMarquerPrise = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rappelId: string) => medicamentService.marquerPrise(rappelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicamentKeys.rappels(patientId) });
      queryClient.invalidateQueries({ queryKey: medicamentKeys.list(patientId) });
      toast.success('Prise enregistrée');
    },
    onError: () => {
      toast.error('Erreur lors de l\'enregistrement');
    },
  });
};
