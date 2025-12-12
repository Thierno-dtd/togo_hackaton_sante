// src/pages/common/Examens.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Examens = () => {
    const { user } = useAuth();
    const [examens, setExamens] = useState([]);
    const [filteredExamens, setFilteredExamens] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeTypeFilter, setActiveTypeFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // Données d'exemple
    const mockExamens = [
        {
            id: 'EXM-2024-058',
            titre: 'Scanner cérébral avec injection',
            patient: { nom: 'Koffi BAGNA', id: 'PAT-1234' },
            date: '15/06/2024',
            type: 'imaging',
            priorite: 'haute',
            status: 'pending',
            service: 'Neurologie',
            prescripteur: 'Dr. Prisca KAGNI',
            indications: 'Suspicion d\'AVC ischémique. Céphalées brutales avec déficit moteur droit.',
            preparations: ['À jeun depuis 6h', 'Bilan rénal récent requis', 'Allergie à vérifier (iode)'],
            urgent: true
        },
        {
            id: 'EXM-2024-059',
            titre: 'Bilan biologique complet + marqueurs',
            patient: { nom: 'Gilbert SANOU', id: 'PAT-5678' },
            date: '14/06/2024',
            type: 'lab',
            priorite: 'normale',
            status: 'scheduled',
            service: 'Médecine interne',
            prescripteur: 'Dr. BEGNI Touna',
            indications: 'Suivi diabète type 2. Évaluation fonction rénale et hépatique.',
            preparations: ['À jeun strict depuis 12h', 'Arrêt metformine 48h avant', 'Prélèvement matinal'],
            scheduledDate: '18/06/2024 - 08:30',
            location: 'Labo Central'
        },
        {
            id: 'EXM-2024-057',
            titre: 'Échographie cardiaque Doppler',
            patient: { nom: 'Sophie Laurent', id: 'PAT-9012' },
            date: '12/06/2024',
            type: 'cardio',
            priorite: 'normale',
            status: 'completed',
            service: 'Cardiologie',
            prescripteur: 'Dr. KANTAGA',
            indications: 'Souffle systolique découvert à l\'auscultation. Bilan pré-opératoire.',
            resultat: 'Insuffisance mitrale légère. Fonction VG conservée.',
            completedDate: '13/06'
        }
    ];

    useEffect(() => {
        setExamens(mockExamens);
        setFilteredExamens(mockExamens);
    }, []);

    // Filtrer les examens
    useEffect(() => {
        let filtered = examens;

        // Filtre par statut
        if (activeFilter !== 'all') {
            filtered = filtered.filter(e => e.status === activeFilter);
        }

        // Filtre par type
        if (activeTypeFilter !== 'all') {
            filtered = filtered.filter(e => e.type === activeTypeFilter);
        }

        // Recherche
        if (searchTerm) {
            filtered = filtered.filter(e =>
                e.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredExamens(filtered);
    }, [activeFilter, activeTypeFilter, searchTerm, examens]);

    const stats = {
        pending: examens.filter(e => e.status === 'pending').length,
        completed: examens.filter(e => e.status === 'completed').length,
        urgent: examens.filter(e => e.urgent).length,
        rate: 94
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'urgent-badge', icon: 'fa-clock', text: 'EN ATTENTE' },
            scheduled: { class: 'scheduled-badge', icon: 'fa-calendar-check', text: 'PLANIFIÉ' },
            completed: { class: 'completed-badge', icon: 'fa-check-circle', text: 'TERMINÉ' }
        };
        return badges[status] || badges.pending;
    };

    const getTypeTag = (type) => {
        const tags = {
            imaging: { class: 'tag-imaging', text: 'Imagerie' },
            lab: { class: 'tag-lab', text: 'Laboratoire' },
            cardio: { class: 'tag-cardio', text: 'Cardiologie' },
            neuro: { class: 'tag-neuro', text: 'Neurologie' }
        };
        return tags[type] || tags.imaging;
    };

    const getPriorityClass = (priorite) => {
        return `priority-${priorite}`;
    };

    return (
        <div id="examens-content" className="page-content">
            {/* Header */}
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(41, 128, 185, 0.8), rgba(41, 128, 185, 0.9)), url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Demandes d'Examens Médicaux</h1>
                        <p>Prescrivez et gérez les examens médicaux de vos patients de manière sécurisée et efficace</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                {/* En-tête avec statistiques */}
                <div className="examens-header">
                    <div className="header-stats">
                        <div className="stat-card-exam">
                            <div className="stat-icon">
                                <i className="fas fa-file-medical-alt"></i>
                            </div>
                            <div className="stat-info">
                                <div className="stat-number">{stats.pending}</div>
                                <div className="stat-label">En attente</div>
                            </div>
                        </div>
                        <div className="stat-card-exam">
                            <div className="stat-icon">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className="stat-info">
                                <div className="stat-number">{stats.completed}</div>
                                <div className="stat-label">Complétés</div>
                            </div>
                        </div>
                        <div className="stat-card-exam">
                            <div className="stat-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="stat-info">
                                <div className="stat-number">{stats.urgent}</div>
                                <div className="stat-label">Urgents</div>
                            </div>
                        </div>
                        <div className="stat-card-exam">
                            <div className="stat-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <div className="stat-info">
                                <div className="stat-number">{stats.rate}%</div>
                                <div className="stat-label">Taux de réalisation</div>
                            </div>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            <i className="fas fa-plus-circle"></i> Nouvelle demande
                        </button>
                        <div className="action-buttons">
                            <button className="btn btn-outline">
                                <i className="fas fa-file-import"></i> Importer
                            </button>
                            <button className="btn btn-outline">
                                <i className="fas fa-file-export"></i> Exporter
                            </button>
                            <div className="search-examens">
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder="Rechercher un examen, patient..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres */}
                <div className="examens-filters">
                    <div className="filters-container">
                        <div className="filter-group">
                            <label>Statut</label>
                            <div className="filter-chips">
                                <button
                                    className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveFilter('all')}
                                >
                                    Tous
                                </button>
                                <button
                                    className={`filter-chip ${activeFilter === 'pending' ? 'active' : ''}`}
                                    onClick={() => setActiveFilter('pending')}
                                >
                                    <i className="fas fa-clock"></i> En attente
                                </button>
                                <button
                                    className={`filter-chip ${activeFilter === 'scheduled' ? 'active' : ''}`}
                                    onClick={() => setActiveFilter('scheduled')}
                                >
                                    <i className="fas fa-calendar-check"></i> Planifiés
                                </button>
                                <button
                                    className={`filter-chip ${activeFilter === 'completed' ? 'active' : ''}`}
                                    onClick={() => setActiveFilter('completed')}
                                >
                                    <i className="fas fa-check-circle"></i> Terminés
                                </button>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Type d'examen</label>
                            <div className="filter-chips">
                                <button
                                    className={`filter-chip type-chip ${activeTypeFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveTypeFilter('all')}
                                >
                                    Tous
                                </button>
                                <button
                                    className={`filter-chip type-chip ${activeTypeFilter === 'imaging' ? 'active' : ''}`}
                                    onClick={() => setActiveTypeFilter('imaging')}
                                >
                                    <i className="fas fa-x-ray"></i> Imagerie
                                </button>
                                <button
                                    className={`filter-chip type-chip ${activeTypeFilter === 'lab' ? 'active' : ''}`}
                                    onClick={() => setActiveTypeFilter('lab')}
                                >
                                    <i className="fas fa-vial"></i> Laboratoire
                                </button>
                                <button
                                    className={`filter-chip type-chip ${activeTypeFilter === 'cardio' ? 'active' : ''}`}
                                    onClick={() => setActiveTypeFilter('cardio')}
                                >
                                    <i className="fas fa-heartbeat"></i> Cardiologie
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grille des examens */}
                <div className="examens-container">
                    <div className="examens-grid">
                        {filteredExamens.map((examen) => {
                            const statusBadge = getStatusBadge(examen.status);
                            const typeTag = getTypeTag(examen.type);

                            return (
                                <div
                                    key={examen.id}
                                    className={`examen-card ${examen.urgent ? 'urgent' : ''}`}
                                    data-status={examen.status}
                                    data-type={examen.type}
                                >
                                    {/* Header */}
                                    <div className="examen-header">
                                        <div className={`examen-badge ${statusBadge.class}`}>
                                            <i className={`fas ${statusBadge.icon}`}></i> {statusBadge.text}
                                        </div>
                                        <div className="examen-id">#{examen.id}</div>
                                    </div>

                                    {/* Body */}
                                    <div className="examen-body">
                                        <h3 className="examen-title">{examen.titre}</h3>
                                        <div className="examen-meta">
                                            <span className="meta-item">
                                                <i className="fas fa-user-injured"></i>
                                                {examen.patient.nom}
                                            </span>
                                            <span className="meta-item">
                                                <i className="fas fa-id-card"></i>
                                                {examen.patient.id}
                                            </span>
                                            <span className="meta-item">
                                                <i className="fas fa-calendar"></i>
                                                {examen.date}
                                            </span>
                                        </div>

                                        <div className="examen-details">
                                            <div className="detail-row">
                                                <span className="detail-label">Type:</span>
                                                <span className={`detail-value ${typeTag.class}`}>{typeTag.text}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Priorité:</span>
                                                <span className={`detail-value ${getPriorityClass(examen.priorite)}`}>
                                                    {examen.priorite.charAt(0).toUpperCase() + examen.priorite.slice(1)}
                                                </span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Service:</span>
                                                <span className="detail-value">{examen.service}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Prescripteur:</span>
                                                <span className="detail-value">{examen.prescripteur}</span>
                                            </div>
                                        </div>

                                        <div className="examen-indications">
                                            <h4><i className="fas fa-sticky-note"></i> Indications</h4>
                                            <p>{examen.indications}</p>
                                        </div>

                                        {examen.preparations && (
                                            <div className="examen-requirements">
                                                <h4><i className="fas fa-clipboard-check"></i> Préparations</h4>
                                                <ul>
                                                    {examen.preparations.map((prep, idx) => (
                                                        <li key={idx}>{prep}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {examen.scheduledDate && (
                                            <div className="examen-schedule">
                                                <h4><i className="fas fa-clock"></i> Planification</h4>
                                                <div className="schedule-info">
                                                    <span><i className="fas fa-hospital"></i> {examen.location}</span>
                                                    <span><i className="far fa-clock"></i> {examen.scheduledDate}</span>
                                                </div>
                                            </div>
                                        )}

                                        {examen.resultat && (
                                            <div className="examen-results">
                                                <h4><i className="fas fa-chart-line"></i> Résultats disponibles</h4>
                                                <div className="result-summary">
                                                    <span className="summary-label">Conclusion:</span>
                                                    <span className="summary-value">{examen.resultat}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="examen-footer">
                                        <div className="examen-actions">
                                            {examen.status === 'pending' && (
                                                <>
                                                    <button className="btn btn-sm btn-outline">
                                                        <i className="fas fa-edit"></i> Modifier
                                                    </button>
                                                    <button className="btn btn-sm btn-primary">
                                                        <i className="fas fa-calendar-plus"></i> Planifier
                                                    </button>
                                                    <button className="btn btn-sm btn-outline btn-danger">
                                                        <i className="fas fa-times"></i> Annuler
                                                    </button>
                                                </>
                                            )}
                                            {examen.status === 'scheduled' && (
                                                <>
                                                    <button className="btn btn-sm btn-outline">
                                                        <i className="fas fa-calendar-alt"></i> Replanifier
                                                    </button>
                                                    <button className="btn btn-sm btn-success">
                                                        <i className="fas fa-check"></i> Confirmer
                                                    </button>
                                                </>
                                            )}
                                            {examen.status === 'completed' && (
                                                <>
                                                    <button className="btn btn-sm btn-primary">
                                                        <i className="fas fa-search"></i> Analyser
                                                    </button>
                                                    <button className="btn btn-sm btn-outline">
                                                        <i className="fas fa-download"></i> Télécharger
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <div className="examen-status">
                                            <div className={`status-indicator status-${examen.status}`}></div>
                                            <span>
                                                {examen.status === 'pending' && 'En attente de planification'}
                                                {examen.status === 'scheduled' && `Planifié pour le ${examen.scheduledDate?.split('-')[0]}`}
                                                {examen.status === 'completed' && `Terminé le ${examen.completedDate}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modale Nouvelle Demande */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container modal-xl">
                        <div className="modal-header">
                            <h3><i className="fas fa-file-medical-alt"></i> Nouvelle demande d'examen médical</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="text-center text-gray-600">Formulaire de création en cours de développement...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Examens;