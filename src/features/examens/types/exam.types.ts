export type ExamStatus = "Planifié" | "Confirmé" | "Reporté" | "Réalisé" | "Non réalisé";
export type ExamContext = "Consultation" | "Hospitalisation";

export interface ExamResult {
  dateResultat: string;
  commentaireMedecin: string;
  interpretation: string;
  fichiers: { nom: string; type: "pdf" | "image" }[];
}

export interface Exam {
  id: string;
  nom: string;
  date: string;
  lieu: string;
  statut: ExamStatus;
  dureeEstimee: string;
  contexte: ExamContext;
  contextId: string;
  resultat?: ExamResult;
}
