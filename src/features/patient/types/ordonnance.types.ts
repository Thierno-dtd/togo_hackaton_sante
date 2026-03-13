export type PurchaseStatus = "Non achetés" | "Partiellement achetés" | "Tous achetés";

export interface MedicamentWithPurchase {
  nom: string;
  dosage: string;
  forme: string;
  posologie: string;
  duree: string;
  instructions: string;
  achete: boolean;
}

export interface PrescriptionData {
  id: string;
  medecin: string;
  date: string;
  contexte: "Consultation" | "Hospitalisation";
  contextId: string;
  medicaments: MedicamentWithPurchase[];
}
