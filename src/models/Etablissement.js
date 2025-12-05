// src/models/Etablissement.js

export class Etablissement {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nom = data.nom || '';
    this.type = data.type || ''; // hopital, clinique, centre_sante, laboratoire
    this.adresse = data.adresse || '';
    this.ville = data.ville || '';
    this.codePostal = data.codePostal || '';
    this.telephone = data.telephone || '';
    this.email = data.email || '';
    this.services = data.services || [];
    this.specialistes = data.specialistes || [];
    this.horaires = data.horaires || {};
    this.urgences = data.urgences !== undefined ? data.urgences : false;
    this.coordonnees = data.coordonnees || { latitude: null, longitude: null };
    this.capacite = data.capacite || 0;
    this.disponibilite = data.disponibilite || 'normale'; // faible, normale, elevee
  }

  hasService(service) {
    return this.services.includes(service);
  }

  hasSpecialiste(specialite) {
    return this.specialistes.some(s => s.specialite === specialite);
  }

  toJSON() {
    return {
      id: this.id,
      nom: this.nom,
      type: this.type,
      adresse: this.adresse,
      ville: this.ville,
      codePostal: this.codePostal,
      telephone: this.telephone,
      email: this.email,
      services: this.services,
      specialistes: this.specialistes,
      horaires: this.horaires,
      urgences: this.urgences,
      coordonnees: this.coordonnees,
      capacite: this.capacite,
      disponibilite: this.disponibilite
    };
  }
}

export class Service {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nom = data.nom || '';
    this.description = data.description || '';
    this.disponible = data.disponible !== undefined ? data.disponible : true;
    this.delaiAttente = data.delaiAttente || 0; // en minutes
  }
}