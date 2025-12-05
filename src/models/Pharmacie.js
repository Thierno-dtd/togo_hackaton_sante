// src/models/Pharmacie.js

export class Pharmacie {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nom = data.nom || '';
    this.adresse = data.adresse || '';
    this.ville = data.ville || '';
    this.codePostal = data.codePostal || '';
    this.telephone = data.telephone || '';
    this.email = data.email || '';
    this.pharmacienResponsable = data.pharmacienResponsable || null;
    this.horaires = data.horaires || {};
    this.services = data.services || [];
    this.medicamentsDisponibles = data.medicamentsDisponibles || [];
    this.coordonnees = data.coordonnees || { latitude: null, longitude: null };
    this.garde = data.garde !== undefined ? data.garde : false;
    this.dateMAJ = data.dateMAJ || new Date();
  }

  isOuvert() {
    const now = new Date();
    const jour = now.toLocaleDateString('fr-FR', { weekday: 'long' });
    const heure = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
    
    const horaireJour = this.horaires[jour];
    if (!horaireJour) return false;
    
    return heure >= horaireJour.ouverture && heure <= horaireJour.fermeture;
  }

  hasMedicament(medicamentId) {
    return this.medicamentsDisponibles.some(m => m.id === medicamentId);
  }

  toJSON() {
    return {
      id: this.id,
      nom: this.nom,
      adresse: this.adresse,
      ville: this.ville,
      codePostal: this.codePostal,
      telephone: this.telephone,
      email: this.email,
      pharmacienResponsable: this.pharmacienResponsable,
      horaires: this.horaires,
      services: this.services,
      medicamentsDisponibles: this.medicamentsDisponibles,
      coordonnees: this.coordonnees,
      garde: this.garde,
      dateMAJ: this.dateMAJ
    };
  }
}

export class MedicamentDisponible {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nom = data.nom || '';
    this.dosage = data.dosage || '';
    this.forme = data.forme || '';
    this.fabricant = data.fabricant || '';
    this.stock = data.stock || 0;
    this.prix = data.prix || 0;
    this.remboursable = data.remboursable !== undefined ? data.remboursable : false;
    this.tauxRemboursement = data.tauxRemboursement || 0;
    this.ordonnanceRequise = data.ordonnanceRequise !== undefined ? data.ordonnanceRequise : true;
    this.disponible = data.disponible !== undefined ? data.disponible : true;
    this.dateMAJ = data.dateMAJ || new Date();
  }

  isDisponible() {
    return this.disponible && this.stock > 0;
  }
}