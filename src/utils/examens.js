
let currentStep = 1;
const totalSteps = 4;

// Ouvrir la modale de nouvelle demande
document.getElementById('nouvelle-demande-btn')?.addEventListener('click', function () {
    document.getElementById('nouvelle-demande-modal').classList.remove('hidden');
    resetForm();
});

// Fermer la modale
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', function () {
        this.closest('.modal-overlay').classList.add('hidden');
    });
});

// Fermer en cliquant en dehors
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
});

// Navigation des étapes
document.getElementById('prev-step-btn')?.addEventListener('click', prevStep);
document.getElementById('next-step-btn')?.addEventListener('click', nextStep);

function prevStep() {
    if (currentStep > 1) {
        goToStep(currentStep - 1);
    }
}

function nextStep() {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            goToStep(currentStep + 1);
        } else {
            submitDemande();
        }
    }
}

function goToStep(step) {
    // Cacher l'étape actuelle
    document.getElementById(`step-${currentStep}`).classList.remove('active');

    // Afficher la nouvelle étape
    document.getElementById(`step-${step}`).classList.add('active');
    currentStep = step;

    // Mettre à jour la navigation
    updateNavigation();
}

function updateNavigation() {
    const progressFill = document.querySelector('.progress-fill');
    const stepCounter = document.querySelector('.step-counter');
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    const submitBtn = document.getElementById('submit-demande-btn');

    // Mettre à jour la progression
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = `${progressPercent}%`;

    // Mettre à jour le compteur
    stepCounter.textContent = `Étape ${currentStep}/${totalSteps}`;

    // Gérer la visibilité des boutons
    prevBtn.style.display = currentStep > 1 ? 'flex' : 'none';
    nextBtn.style.display = currentStep < totalSteps ? 'flex' : 'none';
    submitBtn.style.display = currentStep === totalSteps ? 'flex' : 'none';
}

function validateStep(step) {
    switch (step) {
        case 1:
            const selectedPatient = document.querySelector('.patient-card.selected');
            if (!selectedPatient) {
                alert('Veuillez sélectionner un patient');
                return false;
            }
            break;
        case 2:
            const selectedExam = document.querySelector('.exam-type.selected');
            if (!selectedExam) {
                alert('Veuillez sélectionner un type d\'examen');
                return false;
            }
            break;
        case 3:
            const indications = document.querySelector('.editor-content').innerHTML;
            if (!indications.trim()) {
                alert('Veuillez remplir les indications médicales');
                return false;
            }
            break;
    }
    return true;
}

function resetForm() {
    currentStep = 1;
    goToStep(1);

    // Réinitialiser les sélections
    document.querySelectorAll('.patient-card.selected, .category-card.selected, .exam-type.selected').forEach(el => {
        el.classList.remove('selected');
    });

    // Réinitialiser les formulaires
    document.querySelector('.editor-content').innerHTML = '';
    document.querySelectorAll('input, textarea, select').forEach(input => {
        if (!input.hasAttribute('readonly')) {
            input.value = '';
        }
    });
}

function submitDemande() {
    // Récupérer les données du formulaire
    const patient = document.querySelector('.patient-card.selected');
    const examType = document.querySelector('.exam-type.selected');
    const priority = document.querySelector('input[name="priority"]:checked');
    const indications = document.querySelector('.editor-content').innerHTML;
    const date = document.getElementById('preferred-date').value;

    if (!patient || !examType || !priority || !indications || !date) {
        alert('Veuillez compléter tous les champs obligatoires');
        return;
    }

    // Simulation d'envoi
    const demandeData = {
        patientId: patient.getAttribute('data-patient-id'),
        patientName: patient.querySelector('h5').textContent,
        examType: examType.querySelector('h6').textContent,
        priority: priority.value,
        indications: indications,
        date: date,
        timestamp: new Date().toISOString()
    };

    console.log('Demande envoyée:', demandeData);

    // Afficher confirmation
    alert(`Demande d'examen créée avec succès !\n\nPatient: ${demandeData.patientName}\nExamen: ${demandeData.examType}\nDate souhaitée: ${new Date(demandeData.date).toLocaleDateString()}\n\nUn code de suivi vous a été attribué.`);

    // Fermer la modale
    document.getElementById('nouvelle-demande-modal').classList.add('hidden');

    // Ajouter à la liste (simulation)
    addNewExamenToGrid(demandeData);
}

function addNewExamenToGrid(data) {
    // Cette fonction ajouterait dynamiquement la nouvelle demande à la grille
    console.log('Ajout de la nouvelle demande:', data);
    // Dans une application réelle, on mettrait à jour la liste des examens
}

// Gestion des sélections
document.querySelectorAll('.patient-card').forEach(card => {
    card.addEventListener('click', function () {
        document.querySelectorAll('.patient-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
    });
});

document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function () {
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');

        // Filtrer les types d'examen selon la catégorie
        const category = this.getAttribute('data-category');
        filterExamTypes(category);
    });
});

document.querySelectorAll('.exam-type').forEach(type => {
    type.addEventListener('click', function () {
        document.querySelectorAll('.exam-type').forEach(t => t.classList.remove('selected'));
        this.classList.add('selected');
    });
});

function filterExamTypes(category) {
    // Dans une application réelle, on chargerait les types d'examen depuis une API
    console.log('Filtrer les examens pour la catégorie:', category);
}

// Gestion des filtres
document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', function () {
        const filterType = this.closest('.filter-group').querySelector('label').textContent;

        if (filterType === 'Statut') {
            document.querySelectorAll('.filter-chip[data-filter]').forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');
            filterExamensByStatus(filterValue);
        }

        if (filterType === 'Type d\'examen') {
            document.querySelectorAll('.filter-chip[data-type]').forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const typeValue = this.getAttribute('data-type');
            filterExamensByType(typeValue);
        }
    });
});

function filterExamensByStatus(status) {
    const cards = document.querySelectorAll('.examen-card');

    cards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');

        if (status === 'all' || cardStatus === status) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    updateStats();
}

function filterExamensByType(type) {
    const cards = document.querySelectorAll('.examen-card');

    cards.forEach(card => {
        const cardType = card.getAttribute('data-type');

        if (type === 'all' || cardType === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function updateStats() {
    // Mettre à jour les statistiques affichées
    const pending = document.querySelectorAll('.examen-card[data-status="pending"]:not([style*="display: none"])').length;
    const urgent = document.querySelectorAll('.examen-card.urgent:not([style*="display: none"])').length;

    document.getElementById('pending-exams').textContent = pending;
    document.getElementById('urgent-exams').textContent = urgent;
}

// Gestion des actions sur les cartes
document.querySelectorAll('.modifier-examen-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const examenCard = this.closest('.examen-card');
        const examenId = examenCard.querySelector('.examen-id').textContent;
        openModificationModal(examenId);
    });
});

document.querySelectorAll('.planifier-examen-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const examenCard = this.closest('.examen-card');
        const examenTitle = examenCard.querySelector('.examen-title').textContent;
        const patientName = examenCard.querySelector('.meta-item:nth-child(1)').textContent.replace(' ', '');

        openPlanificationModal(examenTitle, patientName);
    });
});

document.querySelectorAll('.annuler-examen-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const examenCard = this.closest('.examen-card');
        const examenTitle = examenCard.querySelector('.examen-title').textContent;

        if (confirm(`Êtes-vous sûr de vouloir annuler l'examen : "${examenTitle}" ?`)) {
            examenCard.style.opacity = '0.5';
            setTimeout(() => {
                examenCard.remove();
                updateStats();
                alert('Examen annulé avec succès.');
            }, 500);
        }
    });
});

document.querySelectorAll('.voir-resultats-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const examenCard = this.closest('.examen-card');
        const examenTitle = examenCard.querySelector('.examen-title').textContent;

        alert(`Ouverture des résultats pour : ${examenTitle}\n\nDans une application réelle, cela ouvrirait une fenêtre avec les résultats détaillés.`);
    });
});

// Recherche d'examens
const searchInput = document.querySelector('.search-examens input');
searchInput?.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const cards = document.querySelectorAll('.examen-card');

    cards.forEach(card => {
        const title = card.querySelector('.examen-title').textContent.toLowerCase();
        const patient = card.querySelector('.meta-item:nth-child(1)').textContent.toLowerCase();
        const id = card.querySelector('.examen-id').textContent.toLowerCase();

        if (title.includes(searchTerm) || patient.includes(searchTerm) || id.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    updateStats();
});

// Gestion des suggestions de dates
document.querySelectorAll('.date-suggestions button').forEach(btn => {
    btn.addEventListener('click', function () {
        const days = parseInt(this.getAttribute('data-days'));
        const date = new Date();
        date.setDate(date.getDate() + days);

        const formattedDate = date.toISOString().split('T')[0];
        document.getElementById('preferred-date').value = formattedDate;
    });
});

// Gestion des créneaux horaires
document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', function () {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Import/Export
document.getElementById('import-exam-btn')?.addEventListener('click', function () {
    alert('Dans une application réelle, cela permettrait d\'importer des demandes d\'examen depuis un fichier CSV ou XML.');
});

document.getElementById('export-exams-btn')?.addEventListener('click', function () {
    alert('Export des demandes d\'examen...\n\nFormat disponibles: PDF, Excel, CSV');
});

// Fonctions utilitaires pour les modales
function openModificationModal(examenId) {
    // Dans une application réelle, on chargerait les données de l'examen
    alert(`Modification de la demande ${examenId}\n\nDans une application réelle, cela ouvrirait une modale avec le formulaire pré-rempli.`);
}

function openPlanificationModal(examenTitle, patientName) {
    // Dans une application réelle, on ouvrirait la modale de planification
    alert(`Planification de l'examen : ${examenTitle}\nPatient : ${patientName}\n\nSélectionnez une date et un créneau horaire.`);
}

updateStats();