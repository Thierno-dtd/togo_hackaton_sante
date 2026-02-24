// ============================================================
// useRendezVous - Hook React Query pour les rendez-vous patient
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rendezVousService } from '../services/rendez-vous.service';
import type { CreateRendezVousDTO, UpdateRendezVousDTO } from '../types/patient.types';
import toast from 'react-hot-toast';

export const rendezVousKeys = {
  all: ['rendez-vous'] as const,
  list: (patientId: string) => [...rendezVousKeys.all, 'list', patientId] as const,
};

/**
 * Hook pour récupérer les rendez-vous du patient
 */
export const useRendezVous = (patientId: string | undefined) => {
  return useQuery({
    queryKey: rendezVousKeys.list(patientId ?? ''),
    queryFn: () => rendezVousService.getRendezVous(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook mutation pour créer un rendez-vous
 */
export const useCreerRendezVous = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateRendezVousDTO) =>
      rendezVousService.creerRendezVous(patientId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rendezVousKeys.list(patientId) });
      toast.success('Rendez-vous créé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création du rendez-vous');
    },
  });
};

/**
 * Hook mutation pour modifier un rendez-vous
 */
export const useModifierRendezVous = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRendezVousDTO }) =>
      rendezVousService.modifierRendezVous(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rendezVousKeys.list(patientId) });
      toast.success('Rendez-vous modifié');
    },
    onError: () => {
      toast.error('Erreur lors de la modification');
    },
  });
};

/**
 * Hook mutation pour annuler un rendez-vous
 */
export const useAnnulerRendezVous = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rendezVousId: string) =>
      rendezVousService.annulerRendezVous(rendezVousId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rendezVousKeys.list(patientId) });
      toast.success('Rendez-vous annulé');
    },
    onError: () => {
      toast.error('Erreur lors de l\'annulation');
    },
  });
};
