// src/models/User.js

export const UserRoles = {
  PATIENT: 'patient',
  MEDECIN: 'medecin',
  PHARMACIEN: 'pharmacien',
  ADMIN: 'admin'
};

export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.nom = data.nom || '';
    this.prenom = data.prenom || '';
    this.role = data.role || UserRoles.PATIENT;
    this.telephone = data.telephone || '';
    this.dateNaissance = data.dateNaissance || null;
    this.avatar = data.avatar || null;
    this.dateInscription = data.dateInscription || new Date();
    this.actif = data.actif !== undefined ? data.actif : true;
  }

  get nomComplet() {
    return `${this.prenom} ${this.nom}`;
  }

  isPatient() {
    return this.role === UserRoles.PATIENT;
  }

  isMedecin() {
    return this.role === UserRoles.MEDECIN;
  }

  isPharmacien() {
    return this.role === UserRoles.PHARMACIEN;
  }

  isAdmin() {
    return this.role === UserRoles.ADMIN;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      nom: this.nom,
      prenom: this.prenom,
      role: this.role,
      telephone: this.telephone,
      dateNaissance: this.dateNaissance,
      avatar: this.avatar,
      dateInscription: this.dateInscription,
      actif: this.actif
    };
  }
}

export class Patient extends User {
  constructor(data = {}) {
    super({ ...data, role: UserRoles.PATIENT });
    this.numeroSecu = data.numeroSecu || '';
    this.groupeSanguin = data.groupeSanguin || '';
    this.allergies = data.allergies || [];
    this.antecedents = data.antecedents || [];
    this.medecinTraitant = data.medecinTraitant || null;
    this.assurance = data.assurance || null;
  }
}

export class Medecin extends User {
  constructor(data = {}) {
    super({ ...data, role: UserRoles.MEDECIN });
    this.numeroOrdre = data.numeroOrdre || '';
    this.specialite = data.specialite || '';
    this.etablissement = data.etablissement || '';
    this.adresseCabinet = data.adresseCabinet || '';
    this.horairesConsultation = data.horairesConsultation || {};
    this.tarifs = data.tarifs || {};
    this.diplomes = data.diplomes || [];
    this.langues = data.langues || ['Français'];
  }
}

export class Pharmacien extends User {
  constructor(data = {}) {
    super({ ...data, role: UserRoles.PHARMACIEN });
    this.numeroOrdre = data.numeroOrdre || '';
    this.nomPharmacie = data.nomPharmacie || '';
    this.adressePharmacie = data.adressePharmacie || '';
    this.horairesOuverture = data.horairesOuverture || {};
    this.telephone = data.telephone || '';
  }
}