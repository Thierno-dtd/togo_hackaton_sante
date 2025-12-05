// src/models/DossierMedical.js

export class DossierMedical {
  constructor(data = {}) {
    this.id = data.id || null;
    this.patientId = data.patientId || null;
    this.dateCreation = data.dateCreation || new Date();
    this.dateMiseAJour = data.dateMiseAJour || new Date();
    this.consultations = data.consultations || [];
    this.analyses = data.analyses || [];
    this.examens = data.examens || [];
    this.medicaments = data.medicaments || [];
    this.allergies = data.allergies || [];
    this.antecedents = data.antecedents || [];
    this.vaccinations = data.vaccinations || [];
    this.hospitalisations = data.hospitalisations || [];
    this.documents = data.documents || [];
  }

  addConsultation(consultation) {
    this.consultations.push(consultation);
    this.dateMiseAJour = new Date();
  }

  addAnalyse(analyse) {
    this.analyses.push(analyse);
    this.dateMiseAJour = new Date();
  }

  addExamen(examen) {
    this.examens.push(examen);
    this.dateMiseAJour = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      patientId: this.patientId,
      dateCreation: this.dateCreation,
      dateMiseAJour: this.dateMiseAJour,
      consultations: this.consultations,
      analyses: this.analyses,
      examens: this.examens,
      medicaments: this.medicaments,
      allergies: this.allergies,
      antecedents: this.antecedents,
      vaccinations: this.vaccinations,
      hospitalisations: this.hospitalisations,
      documents: this.documents
    };
  }
}

export class Consultation {
  constructor(data = {}) {
    this.id = data.id || null;
    this.date = data.date || new Date();
    this.medecinId = data.medecinId || null;
    this.medecinNom = data.medecinNom || '';
    this.motif = data.motif || '';
    this.symptomes = data.symptomes || [];
    this.diagnostic = data.diagnostic || '';
    this.traitement = data.traitement || '';
    this.prescriptions = data.prescriptions || [];
    this.examensPrescrits = data.examensPrescrits || [];
    this.suiviNecessaire = data.suiviNecessaire || false;
    this.dateSuivi = data.dateSuivi || null;
    this.notes = data.notes || '';
    this.type = data.type || 'cabinet'; // cabinet, urgence, teleconsultation
    this.statut = data.statut || 'terminee'; // planifiee, en_cours, terminee, annulee
  }
}

export class Analyse {
  constructor(data = {}) {
    this.id = data.id || null;
    this.date = data.date || new Date();
    this.type = data.type || '';
    this.laboratoire = data.laboratoire || '';
    this.prescripteur = data.prescripteur || '';
    this.resultats = data.resultats || [];
    this.fichier = data.fichier || null;
    this.statut = data.statut || 'en_attente'; // en_attente, recu, valide
    this.interpretation = data.interpretation || '';
    this.commentaires = data.commentaires || '';
  }
}

export class Examen {
  constructor(data = {}) {
    this.id = data.id || null;
    this.date = data.date || new Date();
    this.type = data.type || ''; // radio, scanner, irm, echo, etc.
    this.lieu = data.lieu || '';
    this.prescripteur = data.prescripteur || '';
    this.motif = data.motif || '';
    this.resultat = data.resultat || '';
    this.images = data.images || [];
    this.compteRendu = data.compteRendu || '';
    this.statut = data.statut || 'planifie'; // planifie, effectue, annule
    this.priorite = data.priorite || 'normale'; // urgente, normale, routine
    this.favori = data.favori || false;
  }
}

export class Medicament {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nom = data.nom || '';
    this.dosage = data.dosage || '';
    this.forme = data.forme || ''; // comprime, gelule, sirop, etc.
    this.frequence = data.frequence || '';
    this.duree = data.duree || '';
    this.dateDebut = data.dateDebut || new Date();
    this.dateFin = data.dateFin || null;
    this.prescripteur = data.prescripteur || '';
    this.instructions = data.instructions || '';
    this.effetsSecondaires = data.effetsSecondaires || [];
    this.actif = data.actif !== undefined ? data.actif : true;
  }
}