// ============================================================
// useGestionAcces - Hook React Query gestion des accès
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gestionAccesService } from '../services/gestion-acces.service';
import type { ReponseDemandeAccesDTO } from '../types/patient.types';
import toast from 'react-hot-toast';

export const accesKeys = {
  all: ['gestion-acces'] as const,
  autorisations: (patientId: string) => [...accesKeys.all, 'autorisations', patientId] as const,
  historique: (patientId: string) => [...accesKeys.all, 'historique', patientId] as const,
  demandes: (patientId: string) => [...accesKeys.all, 'demandes', patientId] as const,
};

/**
 * Hook pour les autorisations actives
 */
export const useAutorisations = (patientId: string | undefined) => {
  return useQuery({
    queryKey: accesKeys.autorisations(patientId ?? ''),
    queryFn: () => gestionAccesService.getAutorisations(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook pour l'historique d'accès
 */
export const useHistoriqueAcces = (patientId: string | undefined) => {
  return useQuery({
    queryKey: accesKeys.historique(patientId ?? ''),
    queryFn: () => gestionAccesService.getHistorique(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook pour les demandes en attente
 */
export const useDemandesAcces = (patientId: string | undefined) => {
  return useQuery({
    queryKey: accesKeys.demandes(patientId ?? ''),
    queryFn: () => gestionAccesService.getDemandesEnAttente(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook mutation pour répondre à une demande
 */
export const useRepondreDemande = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ReponseDemandeAccesDTO) =>
      gestionAccesService.repondreDemande(dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accesKeys.demandes(patientId) });
      queryClient.invalidateQueries({ queryKey: accesKeys.autorisations(patientId) });
      toast.success(variables.acceptee ? 'Accès autorisé' : 'Demande refusée');
    },
    onError: () => {
      toast.error('Erreur lors du traitement de la demande');
    },
  });
};

/**
 * Hook mutation pour révoquer une autorisation
 */
export const useRevoquerAutorisation = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (autorisationId: string) =>
      gestionAccesService.revoquerAutorisation(autorisationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accesKeys.autorisations(patientId) });
      toast.success('Accès révoqué avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la révocation');
    },
  });
};

/**
 * Hook mutation pour ajouter une autorisation
 */
export const useAjouterAutorisation = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      medecinId,
      typeAcces,
      dateFin,
    }: {
      medecinId: string;
      typeAcces: 'complet' | 'temporaire' | 'lecture';
      dateFin?: string;
    }) => gestionAccesService.ajouterAutorisation(patientId, medecinId, typeAcces, dateFin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accesKeys.autorisations(patientId) });
      toast.success('Autorisation ajoutée');
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout');
    },
  });
};
