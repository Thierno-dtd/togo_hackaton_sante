import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const MainLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Get page title from route
    const getPageTitle = () => {
        const pathParts = location.pathname.split('/').filter(Boolean);

        const titles = {
            dashboard: 'Tableau de bord',
            'diagnostic-ia': 'Diagnostic IA',
            'expert-medical': 'Expert Médical',
            examens: 'Examens médicaux',
            disponibilites: 'Disponibilités des centres',
            'verification-qr': 'Vérification QR',
            // Patient
            'patient/dossier': 'Mon dossier médical',
            'patient/etat-sante': 'Mon état de santé',
            'patient/medicaments': 'Mes médicaments',
            // Medecin
            'medecin/patients': 'Dossiers patients',
            'medecin/cas-speciaux': 'Cas spéciaux',
            'medecin/ordonnances': 'Ordonnances',
            // Pharmacien
            'pharmacien/scan-qr': 'Scanner ordonnance',
            'pharmacien/gestion': 'Gestion pharmacie',
            'pharmacien/stock': 'Gestion du stock',
            // Admin
            'admin/users': 'Utilisateurs',
            'admin/medecins': 'Médecins',
            'admin/pharmaciens': 'Pharmaciens',
            'admin/etablissements': 'Établissements',
            'admin/statistiques': 'Statistiques',
            'admin/settings': 'Paramètres'
        };

        const path = pathParts.join('/');
        return titles[path] || 'LAMESSE DAMA';
    };

    return (
        <div id="app-page">
            <div className="app-container">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="main-content">
                    <TopBar
                        pageTitle={getPageTitle()}
                        onMenuToggle={toggleSidebar}
                    />
                    <div className="content-area">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;