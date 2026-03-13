// Types spécifiques au carnet médical (HealthRecord)

export type PassageType = 'consultation' | 'hospitalisation';

export interface TimelineEvent {
  id: string;
  type: PassageType;
  date: string;
  hopital: string;
  motif: string;
  diagnostic: string;
  medecin?: string;
  service?: string;
  datesSejour?: string;
  resumeSyndromique?: string;
  examens?: string[];
  traitement?: string;
  evolution?: string;
  prochainRdv?: string;
  bilan?: string;
}
