import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EXAMENS, MEDICAMENTS } from '../../data/mockData';

const DossierMedical = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('informations');

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.9)), url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Mon Dossier Médical</h1>
                        <p>Consultez votre historique médical complet et sécurisé</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                {/* Tabs */}
                <div className="tabs-container">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'informations' ? 'active' : ''}`}
                            onClick={() => setActiveTab('informations')}
                        >
                            <i className="fas fa-user"></i> Informations
                        </button>
                        <button
                            className={`tab ${activeTab === 'examens' ? 'active' : ''}`}
                            onClick={() => setActiveTab('examens')}
                        >
                            <i className="fas fa-file-medical"></i> Examens
                        </button>
                        <button
                            className={`tab ${activeTab === 'medicaments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('medicaments')}
                        >
                            <i className="fas fa-pills"></i> Médicaments
                        </button>
                        <button
                            className={`tab ${activeTab === 'acces' ? 'active' : ''}`}
                            onClick={() => setActiveTab('acces')}
                        >
                            <i className="fas fa-key"></i> Autorisations
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'informations' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="content-card-app">
                                <h3 className="card-title">
                                    <i className="fas fa-user-circle"></i> Informations personnelles
                                </h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">Nom complet</span>
                                        <span className="value">{user.prenom} {user.nom}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Date de naissance</span>
                                        <span className="value">{user.dateNaissance}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Âge</span>
                                        <span className="value">{user.age} ans</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Groupe sanguin</span>
                                        <span className="value badge badge-danger">{user.groupeSanguin}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">N° Sécurité sociale</span>
                                        <span className="value">{user.numeroSecu}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Email</span>
                                        <span className="value">{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="content-card-app">
                                <h3 className="card-title">
                                    <i className="fas fa-heartbeat"></i> Informations médicales
                                </h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="label">Allergies connues</span>
                                        <span className="value">Pénicilline, Pollen</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Maladies chroniques</span>
                                        <span className="value">Aucune</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Médecin traitant</span>
                                        <span className="value">Dr. BEGNI Touna</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Dernière consultation</span>
                                        <span className="value">15 Mars 2024</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'examens' && (
                        <div className="content-card-app">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="card-title">
                                    <i className="fas fa-file-medical"></i> Historique des examens
                                </h3>
                                <span className="badge badge-info">{EXAMENS.length} examens</span>
                            </div>
                            <div className="examens-list">
                                {EXAMENS.map(exam => (
                                    <div key={exam.id} className="examen-item">
                                        <div className="examen-icon">
                                            <i className="fas fa-x-ray"></i>
                                        </div>
                                        <div className="examen-info">
                                            <h4>{exam.type}</h4>
                                            <p>{exam.description}</p>
                                            <div className="examen-meta">
                                                <span><i className="fas fa-calendar"></i> {exam.date}</span>
                                                <span><i className="fas fa-user-md"></i> {exam.medecin}</span>
                                            </div>
                                        </div>
                                        <div className="examen-status">
                      <span className={`badge ${exam.status === 'effectue' ? 'badge-success' : 'badge-warning'}`}>
                        {exam.status === 'effectue' ? 'Effectué' : 'Planifié'}
                      </span>
                                            {exam.resultat && <p className="mt-2 text-sm">Résultat: {exam.resultat}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'medicaments' && (
                        <div className="content-card-app">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="card-title">
                                    <i className="fas fa-pills"></i> Médicaments en cours
                                </h3>
                                <span className="badge badge-info">{MEDICAMENTS.length} traitements</span>
                            </div>
                            <div className="medicaments-list">
                                {MEDICAMENTS.map(med => (
                                    <div key={med.id} className="medicament-item">
                                        <div className="medicament-icon">
                                            <i className="fas fa-capsules"></i>
                                        </div>
                                        <div className="medicament-info">
                                            <h4>{med.nom}</h4>
                                            <p>{med.instructions}</p>
                                            <div className="medicament-details">
                                                <span className="badge badge-medical">{med.frequence}</span>
                                                <span className="text-sm text-gray-600">
                          <i className="fas fa-calendar"></i> Du {med.debut} au {med.fin}
                        </span>
                                            </div>
                                        </div>
                                        <div className="medicament-prescripteur">
                                            <i className="fas fa-user-md"></i>
                                            <span>{med.prescripteur}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'acces' && (
                        <div className="content-card-app">
                            <h3 className="card-title">
                                <i className="fas fa-key"></i> Autorisations d'accès
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Gérez les professionnels de santé qui peuvent accéder à votre dossier médical.
                            </p>
                            <div className="acces-list">
                                <div className="acces-item">
                                    <div className="flex items-center gap-4">
                                        <div className="avatar">JD</div>
                                        <div>
                                            <h4>Dr. BEGNI Touna</h4>
                                            <p className="text-sm text-gray-600">Cardiologue - Médecin traitant</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="badge badge-success">Accès complet</span>
                                        <button className="btn btn-outline btn-sm">Révoquer</button>
                                    </div>
                                </div>
                                <div className="acces-item">
                                    <div className="flex items-center gap-4">
                                        <div className="avatar">ML</div>
                                        <div>
                                            <h4>Dr. Prisca KANGNI</h4>
                                            <p className="text-sm text-gray-600">Généraliste</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="badge badge-warning">Accès temporaire</span>
                                        <button className="btn btn-outline btn-sm">Révoquer</button>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-primary mt-4">
                                <i className="fas fa-plus"></i> Autoriser un médecin
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DossierMedical;