
export const MENU_CONFIG = {
    medecin: [
        {
            section: 'Général',
            items: [
                {
                    id: 'dashboard',
                    label: 'Tableau de bord',
                    icon: 'fas fa-tachometer-alt',
                    route: '/dashboard'
                },
                {
                    id: 'diagnostic',
                    label: 'Diagnostic IA',
                    icon: 'fas fa-stethoscope',
                    badge: 'Dr',
                    route: '/diagnostic-ia'
                },
                {
                    id: 'expert',
                    label: 'Expert Médical',
                    icon: 'fas fa-comments',
                    route: '/expert-medical'
                }
            ]
        },
        {
            section: 'Dossiers & Examens',
            items: [
                {
                    id: 'patients',
                    label: 'Dossiers patients',
                    icon: 'fas fa-user-injured',
                    badge: 'Dr',
                    route: '/medecin/patients'
                },
                {
                    id: 'special-cases',
                    label: 'Cas spéciaux',
                    icon: 'fas fa-user-friends',
                    badge: 'Dr',
                    route: '/medecin/cas-speciaux'
                },
                {
                    id: 'examens',
                    label: 'Examens médicaux',
                    icon: 'fas fa-file-medical',
                    route: '/examens'
                }
            ]
        },
        {
            section: 'Médicaments & Ordonnances',
            items: [
                {
                    id: 'ordonnances',
                    label: 'Ordonnances QR',
                    icon: 'fas fa-prescription',
                    route: '/medecin/ordonnances'
                },
                {
                    id: 'qr-verification',
                    label: 'Vérification QR',
                    icon: 'fas fa-qrcode',
                    route: '/verification-qr'
                }
            ]
        },
        {
            section: 'Santé & Disponibilités',
            items: [
                {
                    id: 'disponibilites',
                    label: 'Disponibilités des centres',
                    icon: 'fas fa-map-marker-alt',
                    route: '/disponibilites'
                }
            ]
        }
    ],

    patient: [
        {
            section: 'Général',
            items: [
                {
                    id: 'dashboard',
                    label: 'Tableau de bord',
                    icon: 'fas fa-tachometer-alt',
                    route: '/dashboard'
                },
                {
                    id: 'diagnostic',
                    label: 'Diagnostic IA',
                    icon: 'fas fa-stethoscope',
                    route: '/diagnostic-ia'
                },
                {
                    id: 'expert',
                    label: 'Expert Médical',
                    icon: 'fas fa-comments',
                    route: '/expert-medical'
                }
            ]
        },
        {
            section: 'Dossiers & Examens',
            items: [
                {
                    id: 'dossiers',
                    label: 'Mon dossier médical',
                    icon: 'fas fa-folder-open',
                    badge: 'Pa',
                    route: '/patient/dossier'
                },
                {
                    id: 'examens',
                    label: 'Mes examens',
                    icon: 'fas fa-file-medical',
                    route: '/examens'
                }
            ]
        },
        {
            section: 'Médicaments & Ordonnances',
            items: [
                {
                    id: 'medicaments',
                    label: 'Analyser mes médicaments',
                    icon: 'fas fa-pills',
                    badge: 'Pa',
                    route: '/patient/medicaments'
                },
                {
                    id: 'qr-verification',
                    label: 'Vérification QR',
                    icon: 'fas fa-qrcode',
                    route: '/verification-qr'
                }
            ]
        },
        {
            section: 'Santé & Disponibilités',
            items: [
                {
                    id: 'etat',
                    label: 'Mon état de santé',
                    icon: 'fas fa-heartbeat',
                    badge: 'Pa',
                    route: '/patient/etat-sante'
                },
                {
                    id: 'disponibilites',
                    label: 'Disponibilités des centres',
                    icon: 'fas fa-map-marker-alt',
                    route: '/disponibilites'
                }
            ]
        }
    ],

    pharmacien: [
        {
            section: 'Général',
            items: [
                {
                    id: 'dashboard',
                    label: 'Tableau de bord',
                    icon: 'fas fa-tachometer-alt',
                    route: '/dashboard'
                },
                {
                    id: 'expert',
                    label: 'Expert Médical',
                    icon: 'fas fa-comments',
                    route: '/expert-medical'
                }
            ]
        },
        {
            section: 'Médicaments & Ordonnances',
            items: [
                {
                    id: 'ordonnances',
                    label: 'Déchiffrage d\'ordonnances',
                    icon: 'fas fa-prescription',
                    badge: 'Ph',
                    route: '/pharmacien/scan-qr'
                }
            ]
        },
        {
            section: 'Gestion',
            items: [
                {
                    id: 'pharmacies',
                    label: 'Gestion pharmacie',
                    icon: 'fas fa-clinic-medical',
                    badge: 'Ph',
                    route: '/pharmacien/gestion'
                },
                {
                    id: 'stock',
                    label: 'Gestion du stock',
                    icon: 'fas fa-boxes',
                    badge: 'Ph',
                    route: '/pharmacien/stock'
                }
            ]
        }
    ],

    admin: [
        {
            section: 'Général',
            items: [
                {
                    id: 'dashboard',
                    label: 'Tableau de bord',
                    icon: 'fas fa-tachometer-alt',
                    route: '/dashboard'
                }
            ]
        },
        {
            section: 'Administration',
            items: [
                {
                    id: 'users',
                    label: 'Utilisateurs',
                    icon: 'fas fa-users',
                    route: '/admin/users'
                },
                {
                    id: 'medecins',
                    label: 'Médecins',
                    icon: 'fas fa-user-md',
                    route: '/admin/medecins'
                },
                {
                    id: 'pharmaciens',
                    label: 'Pharmaciens',
                    icon: 'fas fa-prescription-bottle-alt',
                    route: '/admin/pharmaciens'
                },
                {
                    id: 'etablissements',
                    label: 'Établissements',
                    icon: 'fas fa-hospital',
                    route: '/admin/etablissements'
                },
                {
                    id: 'statistiques',
                    label: 'Statistiques',
                    icon: 'fas fa-chart-bar',
                    route: '/admin/statistiques'
                },
                {
                    id: 'settings',
                    label: 'Paramètres',
                    icon: 'fas fa-cog',
                    route: '/admin/settings'
                }
            ]
        }
    ]
};

// Helper function to get menu for specific role
export const getMenuForRole = (role) => {
    return MENU_CONFIG[role] || [];
};

// Helper function to check if user has access to a route
export const hasAccessToRoute = (userRole, route) => {
    const menu = MENU_CONFIG[userRole];
    if (!menu) return false;

    for (const section of menu) {
        const hasRoute = section.items.some(item => item.route === route);
        if (hasRoute) return true;
    }

    return false;
};