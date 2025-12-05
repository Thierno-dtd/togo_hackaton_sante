// src/models/Prescription.js

export class Prescription {
  constructor(data = {}) {
    this.id = data.id || null;
    this.patientId = data.patientId || null;
    this.medecinId = data.medecinId || null;
    this.date = data.date || new Date();
    this.dateExpiration = data.dateExpiration || null;
    this.medicaments = data.medicaments || [];
    this.qrCode = data.qrCode || null;
    this.statut = data.statut || 'active'; // active, utilisee, expiree, annulee
    this.consultationId = data.consultationId || null;
    this.renouvellable = data.renouvellable !== undefined ? data.renouvellable : false;
    this.nombreRenouvellements = data.nombreRenouvellements || 0;
    this.recommandations = data.recommandations || '';
  }

  isExpired() {
    if (!this.dateExpiration) return false;
    return new Date() > new Date(this.dateExpiration);
  }

  isActive() {
    return this.statut === 'active' && !this.isExpired();
  }

  generateQRData() {
    return {
      id: this.id,
      patientId: this.patientId,
      medecinId: this.medecinId,
      date: this.date,
      medicaments: this.medicaments,
      authentification: this.generateHash()
    };
  }

  generateHash() {
    // Simulation de hash pour authentification
    return `HASH_${this.id}_${Date.now()}`;
  }

  toJSON() {
    return {
      id: this.id,
      patientId: this.patientId,
      medecinId: this.medecinId,
      date: this.date,
      dateExpiration: this.dateExpiration,
      medicaments: this.medicaments,
      qrCode: this.qrCode,
      statut: this.statut,
      consultationId: this.consultationId,
      renouvellable: this.renouvellable,
      nombreRenouvellements: this.nombreRenouvellements,
      recommandations: this.recommandations
    };
  }
}

export class PrescriptionMedicament {
  constructor(data = {}) {
    this.medicamentId = data.medicamentId || null;
    this.nom = data.nom || '';
    this.dosage = data.dosage || '';
    this.forme = data.forme || '';
    this.quantite = data.quantite || 1;
    this.posologie = data.posologie || '';
    this.duree = data.duree || '';
    this.instructions = data.instructions || '';
  }
}