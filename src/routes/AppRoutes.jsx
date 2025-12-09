import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Layout
import MainLayout from '../components/layout/MainLayout';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import Dashboard from '../pages/common/Dashboard';
import DiagnosticIA from '../pages/common/DiagnosticIA';
import ExpertMedical from '../pages/common/ExpertMedical';
import Examens from '../pages/common/Examens';
import Disponibilites from '../pages/common/Disponibilites';
import VerificationQR from '../pages/common/VerificationQR';

// Patient pages
import DossierMedical from '../pages/patient/DossierMedical';
import EtatSante from '../pages/patient/EtatSante';
import Medicaments from '../pages/patient/Medicaments';

// Medecin pages
import DossiersPatients from '../pages/medecin/DossiersPatients';
import CasSpeciaux from '../pages/medecin/CasSpeciaux';
import Ordonnances from '../pages/medecin/Ordonnances';

// Pharmacien pages
import ScanQR from '../pages/pharmacien/ScanQR';
import GestionPharmacie from '../pages/pharmacien/GestionPharmacie';
import GestionStock from '../pages/pharmacien/GestionStock';

// Admin pages
import Users from '../pages/admin/Users';
import Medecins from '../pages/admin/Medecins';
import Pharmaciens from '../pages/admin/Pharmaciens';
import Etablissements from '../pages/admin/Etablissements';
import Statistiques from '../pages/admin/Statistiques';
import Settings from '../pages/admin/Settings';

// Error pages
import Unauthorized from '../pages/error/Unauthorized';
import NotFound from '../pages/error/NotFound';

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />

            {/* Protected routes */}
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                {/* Common routes */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="diagnostic-ia" element={<DiagnosticIA />} />
                <Route path="expert-medical" element={<ExpertMedical />} />
                <Route path="examens" element={<Examens />} />
                <Route path="disponibilites" element={<Disponibilites />} />
                <Route path="verification-qr" element={<VerificationQR />} />

                {/* Patient routes */}
                <Route
                    path="patient/dossier"
                    element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <DossierMedical />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="patient/etat-sante"
                    element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <EtatSante />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="patient/medicaments"
                    element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <Medicaments />
                        </ProtectedRoute>
                    }
                />

                {/* Medecin routes */}
                <Route
                    path="medecin/patients"
                    element={
                        <ProtectedRoute allowedRoles={['medecin']}>
                            <DossiersPatients />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="medecin/cas-speciaux"
                    element={
                        <ProtectedRoute allowedRoles={['medecin']}>
                            <CasSpeciaux />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="medecin/ordonnances"
                    element={
                        <ProtectedRoute allowedRoles={['medecin']}>
                            <Ordonnances />
                        </ProtectedRoute>
                    }
                />

                {/* Pharmacien routes */}
                <Route
                    path="pharmacien/scan-qr"
                    element={
                        <ProtectedRoute allowedRoles={['pharmacien']}>
                            <ScanQR />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="pharmacien/gestion"
                    element={
                        <ProtectedRoute allowedRoles={['pharmacien']}>
                            <GestionPharmacie />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="pharmacien/stock"
                    element={
                        <ProtectedRoute allowedRoles={['pharmacien']}>
                            <GestionStock />
                        </ProtectedRoute>
                    }
                />

                {/* Admin routes */}
                <Route
                    path="admin/users"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Users />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/medecins"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Medecins />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/pharmaciens"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Pharmaciens />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/etablissements"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Etablissements />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/statistiques"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Statistiques />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="admin/settings"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Settings />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Error routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;