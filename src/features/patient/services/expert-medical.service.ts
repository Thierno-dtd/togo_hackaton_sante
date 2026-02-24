// ============================================================
// Service Expert Médical - Chat IA patient
// ============================================================

import type {
  Conversation,
  ConversationMessage,
  SendMessageDTO,
  ExpertResponse,
} from '../types/patient.types';
// import { apiGet, apiPost } from '@core/api';

const DISCLAIMER =
  'Les informations fournies par l\'expert médical IA sont à titre informatif uniquement et ne remplacent pas une consultation médicale. En cas d\'urgence, contactez le SAMU (119) ou rendez-vous aux urgences les plus proches.';

/** Réponses simulées de l'expert IA */
const AI_RESPONSES: Record<string, string> = {
  default:
    'Je comprends votre préoccupation. Pouvez-vous me donner plus de détails sur vos symptômes ? Depuis quand les ressentez-vous et à quelle fréquence ?',
  douleur:
    'Les douleurs peuvent avoir plusieurs origines. Je vous recommande de noter la localisation exacte, l\'intensité (de 1 à 10), et les circonstances d\'apparition. Si la douleur est intense ou soudaine, consultez un médecin rapidement.',
  fievre:
    'La fièvre est souvent le signe d\'une infection. Si elle dépasse 39°C ou persiste plus de 48h, il est important de consulter. En attendant, hydratez-vous bien et reposez-vous.',
  fatigue:
    'La fatigue peut avoir de nombreuses causes : manque de sommeil, stress, carences, ou pathologies sous-jacentes. Si elle persiste depuis plus de 2 semaines, un bilan sanguin pourrait être utile.',
  medicament:
    'Concernant vos médicaments, il est essentiel de respecter les prescriptions de votre médecin. N\'hésitez pas à vérifier les interactions avec votre pharmacien.',
  allergie:
    'Les réactions allergiques doivent être prises au sérieux. Si vous observez un gonflement, des difficultés respiratoires ou une éruption étendue, appelez immédiatement le SAMU.',
};

function generateAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('douleur') || lower.includes('mal')) return AI_RESPONSES.douleur;
  if (lower.includes('fièvre') || lower.includes('température')) return AI_RESPONSES.fievre;
  if (lower.includes('fatigué') || lower.includes('fatigue')) return AI_RESPONSES.fatigue;
  if (lower.includes('médicament') || lower.includes('traitement')) return AI_RESPONSES.medicament;
  if (lower.includes('allergi')) return AI_RESPONSES.allergie;
  return AI_RESPONSES.default;
}

export const expertMedicalService = {
  /**
   * Récupérer l'historique des conversations
   */
  getConversations: async (patientId: string): Promise<Conversation[]> => {
    // TODO: return apiGet<Conversation[]>(`/patients/${patientId}/conversations`);
    await new Promise((r) => setTimeout(r, 300));

    return [
      {
        id: 'conv_1',
        titre: 'Questions sur mon traitement cardiaque',
        messages: [
          {
            id: 'msg_1',
            role: 'user',
            content: 'Bonjour, j\'ai des questions sur mon traitement à l\'Amlodipine.',
            timestamp: '2024-03-14T10:00:00Z',
          },
          {
            id: 'msg_2',
            role: 'assistant',
            content:
              'Bonjour ! Je suis l\'assistant médical IA de LAMESSE DAMA. Concernant l\'Amlodipine, il est important de la prendre régulièrement. Quelles sont vos questions spécifiques ?',
            timestamp: '2024-03-14T10:00:30Z',
            sources: ['Vidal - Amlodipine'],
          },
        ],
        dateCreation: '2024-03-14T10:00:00Z',
        dernierMessage: '2024-03-14T10:00:30Z',
      },
    ];
  },

  /**
   * Envoyer un message à l'expert
   */
  sendMessage: async (patientId: string, dto: SendMessageDTO): Promise<ExpertResponse> => {
    // TODO: return apiPost<ExpertResponse>(`/patients/${patientId}/expert-medical`, dto);
    await new Promise((r) => setTimeout(r, 800));

    const response = generateAIResponse(dto.message);
    return {
      message: {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      },
      suggestions: [
        'Quand dois-je consulter un médecin ?',
        'Quels sont les effets secondaires possibles ?',
        'Puis-je prendre d\'autres médicaments en même temps ?',
      ],
      disclaimer: DISCLAIMER,
    };
  },

  /**
   * Créer une nouvelle conversation
   */
  creerConversation: async (patientId: string, premierMessage: string): Promise<Conversation> => {
    // TODO: return apiPost<Conversation>(`/patients/${patientId}/conversations`, { message: premierMessage });
    await new Promise((r) => setTimeout(r, 300));

    return {
      id: `conv_${Date.now()}`,
      titre: premierMessage.substring(0, 50) + (premierMessage.length > 50 ? '...' : ''),
      messages: [
        {
          id: `msg_${Date.now()}`,
          role: 'user',
          content: premierMessage,
          timestamp: new Date().toISOString(),
        },
      ],
      dateCreation: new Date().toISOString(),
      dernierMessage: new Date().toISOString(),
    };
  },
};
