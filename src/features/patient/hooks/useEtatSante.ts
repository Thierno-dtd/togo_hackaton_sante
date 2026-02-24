// ============================================================
// useEtatSante - Hook React Query pour l'état de santé
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { etatSanteService } from '../services/etat-sante.service';
import type { MesureSante } from '../types/patient.types';
import toast from 'react-hot-toast';

export const etatSanteKeys = {
  all: ['etat-sante'] as const,
  detail: (patientId: string) => [...etatSanteKeys.all, patientId] as const,
};

/**
 * Hook pour récupérer l'état de santé complet
 */
export const useEtatSante = (patientId: string | undefined) => {
  return useQuery({
    queryKey: etatSanteKeys.detail(patientId ?? ''),
    queryFn: () => etatSanteService.getEtatSante(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook mutation pour ajouter une mesure
 */
export const useAjouterMesure = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mesure: Omit<MesureSante, 'id'>) =>
      etatSanteService.ajouterMesure(patientId, mesure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: etatSanteKeys.detail(patientId) });
      toast.success('Mesure enregistrée');
    },
    onError: () => {
      toast.error('Erreur lors de l\'enregistrement');
    },
  });
};

/**
 * Hook mutation pour marquer une alerte comme lue
 */
export const useMarquerAlerteLue = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alerteId: string) => etatSanteService.marquerAlerteLue(alerteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: etatSanteKeys.detail(patientId) });
    },
  });
};
