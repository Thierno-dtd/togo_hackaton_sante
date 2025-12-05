// src/models/IA.js

export class DiagnosticIA {
  constructor(data = {}) {
    this.id = data.id || null;
    this.patientId = data.patientId || null;
    this.date = data.date || new Date();
    this.type = data.type || 'image'; // image, symptomes, mixte
    this.modeAnalyse = data.modeAnalyse || 'patient'; // patient, medecin
    this.image = data.image || null;
    this.symptomes = data.symptomes || [];
    this.resultatIA = data.resultatIA || null;
    this.confianceScore = data.confianceScore || 0;
    this.diagnosticsPossibles = data.diagnosticsPossibles || [];
    this.recommandations = data.recommandations || [];
    this.signesAlertes = data.signesAlertes || [];
    this.statut = data.statut || 'en_attente'; // en_attente, traite, valide_medecin
    this.medecinValidateur = data.medecinValidateur || null;
  }

  addDiagnosticPossible(diagnostic, probabilite) {
    this.diagnosticsPossibles.push({
      nom: diagnostic,
      probabilite: probabilite,
      description: ''
    });
  }

  toJSON() {
    return {
      id: this.id,
      patientId: this.patientId,
      date: this.date,
      type: this.type,
      modeAnalyse: this.modeAnalyse,
      image: this.image,
      symptomes: this.symptomes,
      resultatIA: this.resultatIA,
      confianceScore: this.confianceScore,
      diagnosticsPossibles: this.diagnosticsPossibles,
      recommandations: this.recommandations,
      signesAlertes: this.signesAlertes,
      statut: this.statut,
      medecinValidateur: this.medecinValidateur
    };
  }
}

export class PredictionSante {
  constructor(data = {}) {
    this.id = data.id || null;
    this.patientId = data.patientId || null;
    this.date = data.date || new Date();
    this.etatActuel = data.etatActuel || {};
    this.risques = data.risques || [];
    this.tendances = data.tendances || [];
    this.recommandations = data.recommandations || [];
    this.scoreGlobal = data.scoreGlobal || 0;
    this.metriques = data.metriques || {};
  }

  addRisque(nom, niveau, description) {
    this.risques.push({
      nom: nom,
      niveau: niveau, // faible, moyen, eleve
      description: description,
      dateDetection: new Date()
    });
  }
}

export class ConversationIA {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.userRole = data.userRole || 'patient';
    this.dateDebut = data.dateDebut || new Date();
    this.dateFin = data.dateFin || null;
    this.messages = data.messages || [];
    this.contexte = data.contexte || {};
    this.sujet = data.sujet || '';
    this.active = data.active !== undefined ? data.active : true;
  }

  addMessage(message, sender, type = 'text') {
    this.messages.push({
      id: Date.now().toString(),
      sender: sender, // user, ia
      type: type, // text, image, audio, video
      content: message,
      timestamp: new Date(),
      lu: false
    });
  }

  getLastMessage() {
    return this.messages[this.messages.length - 1] || null;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      userRole: this.userRole,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      messages: this.messages,
      contexte: this.contexte,
      sujet: this.sujet,
      active: this.active
    };
  }
}