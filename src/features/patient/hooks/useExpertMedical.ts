// ============================================================
// useExpertMedical - Hook React Query Expert Médical IA
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expertMedicalService } from '../services/expert-medical.service';
import type { SendMessageDTO } from '../types/patient.types';
import toast from 'react-hot-toast';

export const expertKeys = {
  all: ['expert-medical'] as const,
  conversations: (patientId: string) => [...expertKeys.all, 'conversations', patientId] as const,
};

/**
 * Hook pour récupérer l'historique des conversations
 */
export const useConversations = (patientId: string | undefined) => {
  return useQuery({
    queryKey: expertKeys.conversations(patientId ?? ''),
    queryFn: () => expertMedicalService.getConversations(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook mutation pour envoyer un message
 */
export const useSendMessage = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: SendMessageDTO) =>
      expertMedicalService.sendMessage(patientId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expertKeys.conversations(patientId) });
    },
    onError: () => {
      toast.error('Erreur lors de l\'envoi du message');
    },
  });
};

/**
 * Hook mutation pour créer une conversation
 */
export const useCreerConversation = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (premierMessage: string) =>
      expertMedicalService.creerConversation(patientId, premierMessage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expertKeys.conversations(patientId) });
    },
    onError: () => {
      toast.error('Erreur lors de la création de la conversation');
    },
  });
};
