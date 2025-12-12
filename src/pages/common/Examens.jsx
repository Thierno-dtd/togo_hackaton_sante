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
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('imaging');
    const [selectedExamType, setSelectedExamType] = useState(null);
    const [formData, setFormData] = useState({
        priority: 'high',
        indications: '',
        questionClinique: '',
        regionAnatomique: '',
        preparations: [],
        service: 'neurology',
        prescripteur: user?.nom ? `Dr. ${user.nom} ${user.prenom}` : '',
        location: 'hospital',
        datePreferee: '',
        creneauHoraire: '10:30',
        instructions: ''
    });

    // Données d'exemple pour les patients
    const mockPatients = [
        {
            id: 'PAT-1234',
            nom: 'BIMA Afi',
            age: 42,
            sexe: 'Femme',
            groupeSanguin: 'A+',
            avatar: 'MM'
        },
        {
            id: 'PAT-5678',
            nom: 'Rebecca AZIALE',
            age: 35,
            sexe: 'Femme',
            groupeSanguin: 'O+',
            avatar: 'PD'
        }
    ];

    // Données d'exemple pour les examens
    const mockExamens = [
        {
            id: 'EXM-2024-058',
            titre: 'Scanner cérébral avec injection',
            patient: { nom: 'Marie Martin', id: 'PAT-1234' },
            date: '15/06/2024',
            type: 'imaging',
            priorite: 'haute',
            status: 'pending',
            service: 'Neurologie',
            prescripteur: 'Dr. BEGNI Touna',
            indications: 'Suspicion d\'AVC ischémique. Céphalées brutales avec déficit moteur droit.',
            preparations: ['À jeun depuis 6h', 'Bilan rénal récent requis', 'Allergie à vérifier (iode)'],
            urgent: true
        },
        {
            id: 'EXM-2024-059',
            titre: 'Bilan biologique complet + marqueurs',
            patient: { nom: 'Pierre Dubois', id: 'PAT-5678' },
            date: '14/06/2024',
            type: 'lab',
            priorite: 'normale',
            status: 'scheduled',
            service: 'Médecine interne',
            prescripteur: 'Dr. GAVON Hector',
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
            prescripteur: 'Dr. KPATCHA Martin',
            indications: 'Souffle systolique découvert à l\'auscultation. Bilan pré-opératoire.',
            resultat: 'Insuffisance mitrale légère. Fonction VG conservée.',
            completedDate: '13/06'
        }
    ];

    // Catégories d'examens
    const categories = [
        {
            id: 'imaging',
            nom: 'Imagerie médicale',
            icon: 'fas fa-x-ray',
            description: 'Scanner, IRM, Radiographie, Échographie'
        },
        {
            id: 'lab',
            nom: 'Biologie médicale',
            icon: 'fas fa-vial',
            description: 'Analyses sanguines, urinaires, marqueurs'
        },
        {
            id: 'cardio',
            nom: 'Cardiologie',
            icon: 'fas fa-heartbeat',
            description: 'ECG, Échographie cardiaque, Holter'
        },
        {
            id: 'neuro',
            nom: 'Neurologie',
            icon: 'fas fa-brain',
            description: 'EEG, EMG, Potentiels évoqués'
        }
    ];

    // Types d'examens par catégorie
    const examTypesByCategory = {
        imaging: [
            { id: 'scanner', nom: 'Scanner cérébral', description: 'Examen TDM avec/sans injection', duree: '20 min' },
            { id: 'irm', nom: 'IRM cérébrale', description: 'Imagerie par résonance magnétique', duree: '45 min' },
            { id: 'echo', nom: 'Échographie abdominale', description: 'Examen échographique complet', duree: '30 min' }
        ],
        lab: [
            { id: 'hemato', nom: 'Hématologie complète', description: 'NFS, plaquettes, formule', duree: '15 min' },
            { id: 'bio', nom: 'Biochimie', description: 'Glycémie, lipides, fonction rénale', duree: '15 min' }
        ],
        cardio: [
            { id: 'ecg', nom: 'Électrocardiogramme', description: 'ECG standard 12 dérivations', duree: '10 min' },
            { id: 'echo-cardio', nom: 'Échographie cardiaque', description: 'Echo-Doppler cardiaque', duree: '30 min' }
        ],
        neuro: [
            { id: 'eeg', nom: 'Électroencéphalogramme', description: 'EEG standard', duree: '45 min' },
            { id: 'emg', nom: 'Électromyogramme', description: 'EMG des membres', duree: '60 min' }
        ]
    };

    const creneauxHoraires = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    useEffect(() => {
        setExamens(mockExamens);
        setFilteredExamens(mockExamens);
    }, []);

    // Filtrer les examens
    useEffect(() => {
        let filtered = examens;

        if (activeFilter !== 'all') {
            filtered = filtered.filter(e => e.status === activeFilter);
        }

        if (activeTypeFilter !== 'all') {
            filtered = filtered.filter(e => e.type === activeTypeFilter);
        }

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

    // Gestion du formulaire multi-étapes
    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                if (!selectedPatient) {
                    alert('Veuillez sélectionner un patient');
                    return false;
                }
                break;
            case 2:
                if (!selectedExamType) {
                    alert('Veuillez sélectionner un type d\'examen');
                    return false;
                }
                break;
            case 3:
                if (!formData.indications.trim()) {
                    alert('Veuillez remplir les indications médicales');
                    return false;
                }
                break;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!selectedPatient || !selectedExamType) {
            alert('Veuillez compléter tous les champs obligatoires');
            return;
        }

        const newExamen = {
            id: `EXM-2024-${Math.floor(Math.random() * 1000)}`,
            titre: selectedExamType.nom,
            patient: selectedPatient,
            date: new Date().toLocaleDateString('fr-FR'),
            type: selectedCategory,
            priorite: formData.priority,
            status: 'pending',
            service: formData.service,
            prescripteur: formData.prescripteur,
            indications: formData.indications,
            preparations: formData.preparations,
            urgent: formData.priority === 'urgent'
        };

        setExamens([newExamen, ...examens]);
        setShowModal(false);
        resetForm();
        alert('Demande d\'examen créée avec succès !');
    };

    const resetForm = () => {
        setCurrentStep(1);
        setSelectedPatient(null);
        setSelectedCategory('imaging');
        setSelectedExamType(null);
        setFormData({
            priority: 'high',
            indications: '',
            questionClinique: '',
            regionAnatomique: '',
            preparations: [],
            service: 'neurology',
            prescripteur: user?.nom ? `Dr. ${user.nom} ${user.prenom}` : '',
            location: 'hospital',
            datePreferee: '',
            creneauHoraire: '10:30',
            instructions: ''
        });
    };

    const handlePreparationChange = (prep) => {
        setFormData(prev => ({
            ...prev,
            preparations: prev.preparations.includes(prep)
                ? prev.preparations.filter(p => p !== prep)
                : [...prev.preparations, prep]
        }));
    };

    const addDaysToDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
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

            {/* Modale Nouvelle Demande - Multi-étapes */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container modal-xl">
                        <div className="modal-header">
                            <h3><i className="fas fa-file-medical-alt"></i> Nouvelle demande d'examen médical</h3>
                            <button className="modal-close" onClick={() => { setShowModal(false); resetForm(); }}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="demande-form">
                                {/* Étape 1: Informations patient */}
                                {currentStep === 1 && (
                                    <div className="form-step active">
                                        <div className="step-header">
                                            <div className="step-number">1</div>
                                            <div className="step-title">
                                                <h4>Informations patient</h4>
                                                <p>Sélectionnez le patient et vérifiez ses informations</p>
                                            </div>
                                        </div>

                                        <div className="step-content">
                                            <div className="patient-selection">
                                                {mockPatients.map((patient) => (
                                                    <div
                                                        key={patient.id}
                                                        className={`patient-card ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
                                                        onClick={() => setSelectedPatient(patient)}
                                                    >
                                                        <div className="patient-avatar">{patient.avatar}</div>
                                                        <div className="patient-info">
                                                            <h5>{patient.nom}</h5>
                                                            <div className="patient-details">
                                                                <span>{patient.age} ans - {patient.sexe}</span>
                                                                <span>ID: {patient.id}</span>
                                                                <span>Groupe sanguin: {patient.groupeSanguin}</span>
                                                            </div>
                                                        </div>
                                                        <div className="patient-more">
                                                            <i className="fas fa-chevron-right"></i>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Étape 2: Type d'examen */}
                                {currentStep === 2 && (
                                    <div className="form-step active">
                                        <div className="step-header">
                                            <div className="step-number">2</div>
                                            <div className="step-title">
                                                <h4>Type d'examen</h4>
                                                <p>Sélectionnez la catégorie et le type d'examen</p>
                                            </div>
                                        </div>

                                        <div className="step-content">
                                            <div className="category-grid">
                                                {categories.map((category) => (
                                                    <div
                                                        key={category.id}
                                                        className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
                                                        onClick={() => {
                                                            setSelectedCategory(category.id);
                                                            setSelectedExamType(null);
                                                        }}
                                                    >
                                                        <div className="category-icon">
                                                            <i className={category.icon}></i>
                                                        </div>
                                                        <h5>{category.nom}</h5>
                                                        <p>{category.description}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="exam-type-list" style={{ marginTop: '2rem' }}>
                                                {examTypesByCategory[selectedCategory]?.map((examType) => (
                                                   <div key={examType.id}
                                                               className={`exam-type ${selectedExamType?.id === examType.id ? 'selected' : ''}`}
                                                               onClick={() => setSelectedExamType(examType)}
                                                    >
                                                        <div className="type-checkbox">
                                                            <i className="fas fa-check"></i>
                                                        </div>
                                                        <div className="type-info">
                                                            <h6>{examType.nom}</h6>
                                                            <p>{examType.description}</p>
                                                            <span className="type-duration">≈ {examType.duree}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Étape 3: Détails et indications */}
                                {currentStep === 3 && (
                                    <div className="form-step active">
                                        <div className="step-header">
                                            <div className="step-number">3</div>
                                            <div className="step-title">
                                                <h4>Détails et indications</h4>
                                                <p>Précisez les indications et les paramètres</p>
                                            </div>
                                        </div>

                                        <div className="step-content">
                                            <div className="form-group">
                                                <label>Priorité</label>
                                                <div className="priority-selector">
                                                    <label className="priority-option">
                                                        <input
                                                            type="radio"
                                                            name="priority"
                                                            value="normale"
                                                            checked={formData.priority === 'normale'}
                                                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                                        />
                                                        <div className="priority-card">
                                                            <i className="fas fa-clock"></i>
                                                            <span>Normale</span>
                                                            <p>À réaliser dans les 15 jours</p>
                                                        </div>
                                                    </label>
                                                    <label className="priority-option">
                                                        <input
                                                            type="radio"
                                                            name="priority"
                                                            value="haute"
                                                            checked={formData.priority === 'haute'}
                                                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                                        />
                                                        <div className="priority-card">
                                                            <i className="fas fa-exclamation-triangle"></i>
                                                            <span>Haute</span>
                                                            <p>À réaliser sous 48h</p>
                                                        </div>
                                                    </label>
                                                    <label className="priority-option">
                                                        <input
                                                            type="radio"
                                                            name="priority"
                                                            value="urgente"
                                                            checked={formData.priority === 'urgente'}
                                                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                                        />
                                                        <div className="priority-card">
                                                            <i className="fas fa-exclamation-circle"></i>
                                                            <span>Urgente</span>
                                                            <p>À réaliser immédiatement</p>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Indications médicales</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="4"
                                                    placeholder="Décrivez les symptômes, l'histoire clinique, les raisons de l'examen..."
                                                    value={formData.indications}
                                                    onChange={(e) => setFormData({...formData, indications: e.target.value})}
                                                />
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Question clinique</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Ex: Recherche de métastases cérébrales"
                                                        value={formData.questionClinique}
                                                        onChange={(e) => setFormData({...formData, questionClinique: e.target.value})}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Région anatomique</label>
                                                    <select
                                                        className="form-control"
                                                        value={formData.regionAnatomique}
                                                        onChange={(e) => setFormData({...formData, regionAnatomique: e.target.value})}
                                                    >
                                                        <option value="">Sélectionner</option>
                                                        <option value="head">Tête/Encéphale</option>
                                                        <option value="thorax">Thorax</option>
                                                        <option value="abdomen">Abdomen</option>
                                                        <option value="pelvis">Pelvis</option>
                                                        <option value="members">Membres</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Préparations spécifiques</label>
                                                <div className="preparation-options">
                                                    <label className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.preparations.includes('À jeun (6-12h)')}
                                                            onChange={() => handlePreparationChange('À jeun (6-12h)')}
                                                        />
                                                        <span className="checkbox-custom"></span>
                                                        À jeun (6-12h)
                                                    </label>
                                                    <label className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.preparations.includes('Produit de contraste')}
                                                            onChange={() => handlePreparationChange('Produit de contraste')}
                                                        />
                                                        <span className="checkbox-custom"></span>
                                                        Produit de contraste
                                                    </label>
                                                    <label className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.preparations.includes('Test d\'allergie requis')}
                                                            onChange={() => handlePreparationChange('Test d\'allergie requis')}
                                                        />
                                                        <span className="checkbox-custom"></span>
                                                        Test d'allergie requis
                                                    </label>
                                                    <label className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.preparations.includes('Arrêt médicamenteux')}
                                                            onChange={() => handlePreparationChange('Arrêt médicamenteux')}
                                                        />
                                                        <span className="checkbox-custom"></span>
                                                        Arrêt médicamenteux
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Étape 4: Planification */}
                                {currentStep === 4 && (
                                    <div className="form-step active">
                                        <div className="step-header">
                                            <div className="step-number">4</div>
                                            <div className="step-title">
                                                <h4>Planification</h4>
                                                <p>Planifiez la date et le lieu de l'examen</p>
                                            </div>
                                        </div>

                                        <div className="step-content">
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Service demandeur</label>
                                                    <select
                                                        className="form-control"
                                                        value={formData.service}
                                                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                                                    >
                                                        <option value="neurology">Neurologie</option>
                                                        <option value="cardiology">Cardiologie</option>
                                                        <option value="internal">Médecine interne</option>
                                                        <option value="surgery">Chirurgie</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Prescripteur</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.prescripteur}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Lieu de réalisation</label>
                                                <div className="location-options">
                                                    <label className="radio-label">
                                                        <input
                                                            type="radio"
                                                            name="location"
                                                            value="hospital"
                                                            checked={formData.location === 'hospital'}
                                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                        />
                                                        <span className="radio-custom"></span>
                                                        <div className="location-card">
                                                            <i className="fas fa-hospital"></i>
                                                            <div>
                                                                <strong>Hôpital Central</strong>
                                                                <p>Service d'imagerie médicale</p>
                                                                <span className="location-info">Disponibilité: Élevée</span>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="radio-label">
                                                        <input
                                                            type="radio"
                                                            name="location"
                                                            value="clinic"
                                                            checked={formData.location === 'clinic'}
                                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                        />
                                                        <span className="radio-custom"></span>
                                                        <div className="location-card">
                                                            <i className="fas fa-clinic-medical"></i>
                                                            <div>
                                                                <strong>Clinique du Parc</strong>
                                                                <p>Centre d'imagerie privé</p>
                                                                <span className="location-info">Délai: 3 jours</span>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Date souhaitée</label>
                                                <div className="date-selection">
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={formData.datePreferee}
                                                        onChange={(e) => setFormData({...formData, datePreferee: e.target.value})}
                                                    />
                                                    <div className="date-suggestions">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline"
                                                            onClick={() => setFormData({...formData, datePreferee: addDaysToDate(1)})}
                                                        >
                                                            Demain
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline"
                                                            onClick={() => setFormData({...formData, datePreferee: addDaysToDate(3)})}
                                                        >
                                                            Dans 3 jours
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline"
                                                            onClick={() => setFormData({...formData, datePreferee: addDaysToDate(7)})}
                                                        >
                                                            Dans 1 semaine
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Créneau horaire</label>
                                                <div className="time-slots">
                                                    <div className="slot-grid">
                                                        {creneauxHoraires.map((creneau) => (
                                                            <div
                                                                key={creneau}
                                                                className={`time-slot ${formData.creneauHoraire === creneau ? 'selected' : ''}`}
                                                                onClick={() => setFormData({...formData, creneauHoraire: creneau})}
                                                            >
                                                                {creneau}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Instructions pour le patient</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    placeholder="Instructions spécifiques à communiquer au patient..."
                                                    value={formData.instructions}
                                                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer avec navigation */}
                        <div className="modal-footer">
                            <div className="step-navigation">
                                {currentStep > 1 && (
                                    <button className="btn btn-outline" onClick={prevStep}>
                                        <i className="fas fa-arrow-left"></i> Précédent
                                    </button>
                                )}
                                <div className="step-progress">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{width: `${((currentStep - 1) / 3) * 100}%`}}
                                        ></div>
                                    </div>
                                    <span className="step-counter">Étape {currentStep}/4</span>
                                </div>
                                {currentStep < 4 ? (
                                    <button className="btn btn-primary" onClick={nextStep}>
                                        Suivant <i className="fas fa-arrow-right"></i>
                                    </button>
                                ) : (
                                    <button className="btn btn-success" onClick={handleSubmit}>
                                        <i className="fas fa-paper-plane"></i> Envoyer la demande
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Examens;