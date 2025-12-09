import React, { useState, useEffect } from 'react';
import './styles/main.css';
import './styles/animations.css';

// ==================== DONNÉES FACTICES ====================
const MOCK_USERS = {
    medecin: {
        id: 'med_001',
        nom: 'Dr. Jean Dupont',
        prenom: 'Jean',
        role: 'Médecin',
        roleKey: 'medecin',
        avatar: 'JD',
        specialite: 'Cardiologie'
    },
    patient: {
        id: 'pat_001',
        nom: 'Marie Martin',
        prenom: 'Marie',
        role: 'Patient',
        roleKey: 'patient',
        avatar: 'MM',
        age: 35
    },
    pharmacien: {
        id: 'pharm_001',
        nom: 'Pharmacie Centrale',
        prenom: 'Sophie',
        role: 'Pharmacien',
        roleKey: 'pharmacien',
        avatar: 'SP',
        pharmacie: 'Pharmacie Centrale'
    },
    admin: {
        id: 'admin_001',
        nom: 'Admin System',
        prenom: 'Admin',
        role: 'Administrateur',
        roleKey: 'admin',
        avatar: 'AS'
    }
};

// Configuration des menus par rôle
const MENU_CONFIG = {
    medecin: [
        {
            section: 'Général',
            items: [
                { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', badge: null },
                { id: 'diagnostic', label: 'Diagnostic IA', icon: 'fas fa-stethoscope', badge: 'Dr' },
                { id: 'expert', label: 'Expert Médical', icon: 'fas fa-comments', badge: null }
            ]
        },
        {
            section: 'Dossiers & Examens',
            items: [
                { id: 'patients', label: 'Dossiers patients', icon: 'fas fa-user-injured', badge: 'Dr' },
                { id: 'special-cases', label: 'Cas spéciaux', icon: 'fas fa-user-friends', badge: 'Dr' },
                { id: 'examens', label: 'Examens médicaux', icon: 'fas fa-file-medical', badge: null }
            ]
        },
        {
            section: 'Médicaments & Ordonnances',
            items: [
                { id: 'ordonnances', label: 'Ordonnances QR', icon: 'fas fa-prescription', badge: null },
                { id: 'qr-verification', label: 'Vérification QR', icon: 'fas fa-qrcode', badge: null }
            ]
        },
        {
            section: 'Santé & Disponibilités',
            items: [
                { id: 'disponibilites', label: 'Disponibilités des centres', icon: 'fas fa-map-marker-alt', badge: null }
            ]
        }
    ],
    patient: [
        {
            section: 'Général',
            items: [
                { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', badge: null },
                { id: 'diagnostic', label: 'Diagnostic IA', icon: 'fas fa-stethoscope', badge: 'Dr' },
                { id: 'expert', label: 'Expert Médical', icon: 'fas fa-comments', badge: null }
            ]
        },
        {
            section: 'Dossiers & Examens',
            items: [
                { id: 'dossiers', label: 'Mes dossiers médicaux', icon: 'fas fa-folder-open', badge: 'Pa' },
                { id: 'examens', label: 'Examens médicaux', icon: 'fas fa-file-medical', badge: null }
            ]
        },
        {
            section: 'Médicaments & Ordonnances',
            items: [
                { id: 'medicaments', label: 'Analyser mes médicaments', icon: 'fas fa-pills', badge: 'Pa' },
                { id: 'qr-verification', label: 'Vérification QR', icon: 'fas fa-qrcode', badge: null }
            ]
        },
        {
            section: 'Santé & Disponibilités',
            items: [
                { id: 'etat', label: 'Mon état de santé', icon: 'fas fa-heartbeat', badge: 'Pa' },
                { id: 'disponibilites', label: 'Disponibilités des centres', icon: 'fas fa-map-marker-alt', badge: null }
            ]
        }
    ],
    pharmacien: [
        {
            section: 'Général',
            items: [
                { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', badge: null },
                { id: 'expert', label: 'Expert Médical', icon: 'fas fa-comments', badge: null }
            ]
        },
        {
            section: 'Médicaments & Ordonnances',
            items: [
                { id: 'ordonnances', label: 'Déchiffrage d\'ordonnances', icon: 'fas fa-prescription', badge: 'Ph' },
                { id: 'qr-verification', label: 'Vérification QR', icon: 'fas fa-qrcode', badge: null }
            ]
        },
        {
            section: 'Santé & Disponibilités',
            items: [
                { id: 'pharmacies', label: 'Gestion pharmacie', icon: 'fas fa-clinic-medical', badge: 'Ph' }
            ]
        }
    ],
    admin: [
        {
            section: 'Général',
            items: [
                { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', badge: null }
            ]
        },
        {
            section: 'Administration',
            items: [
                { id: 'users', label: 'Utilisateurs', icon: 'fas fa-users', badge: null },
                { id: 'medecins', label: 'Médecins', icon: 'fas fa-user-md', badge: null },
                { id: 'pharmaciens', label: 'Pharmaciens', icon: 'fas fa-prescription-bottle-alt', badge: null },
                { id: 'etablissements', label: 'Établissements', icon: 'fas fa-hospital', badge: null },
                { id: 'statistiques', label: 'Statistiques', icon: 'fas fa-chart-bar', badge: null },
                { id: 'settings', label: 'Paramètres', icon: 'fas fa-cog', badge: null }
            ]
        }
    ]
};

// ==================== COMPOSANT PRINCIPAL ====================
const MediConnectApp = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [pageTitle, setPageTitle] = useState('Tableau de bord');

    const handleLogin = (roleKey) => {
        setCurrentUser(MOCK_USERS[roleKey]);
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
        setPageTitle('Tableau de bord');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setCurrentPage('dashboard');
    };

    const handleNavigation = (pageId, label) => {
        setCurrentPage(pageId);
        setPageTitle(label);
    };

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div id="app-page">
            <div className="app-container">
                <Sidebar
                    user={currentUser}
                    currentPage={currentPage}
                    onNavigate={handleNavigation}
                />
                <div className="main-content">
                    <TopBar
                        pageTitle={pageTitle}
                        onLogout={handleLogout}
                    />
                    <div className="content-area">
                        <PageContent
                            pageId={currentPage}
                            user={currentUser}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== LOGIN PAGE ====================
const LoginPage = ({ onLogin }) => {
    const [selectedRole, setSelectedRole] = useState('patient');

    return (
        <div id="login-page">
            <div className="login-container">
                <div className="login-left">
                    <div className="back-home">
                        <a href="#home">
                            <i className="fas fa-arrow-left"></i> Retour à l'accueil
                        </a>
                    </div>
                    <h2>Bienvenue sur MediConnect</h2>
                    <p>Connectez-vous pour accéder à votre espace sécurisé et bénéficier de toutes les fonctionnalités de la plateforme.</p>

                    <div className="login-features">
                        <div className="login-feature">
                            <i className="fas fa-shield-alt"></i>
                            <span>Données médicales cryptées de haute sécurité</span>
                        </div>
                        <div className="login-feature">
                            <i className="fas fa-robot"></i>
                            <span>Diagnostic assisté par intelligence artificielle</span>
                        </div>
                        <div className="login-feature">
                            <i className="fas fa-handshake"></i>
                            <span>Collaboration simplifiée entre professionnels</span>
                        </div>
                    </div>

                    <div style={{marginTop: '50px'}}>
                        <p style={{fontSize: '14px', opacity: 0.7}}>
                            <i className="fas fa-info-circle"></i> Cette application est développée pour la compétition nationale de santé.
                        </p>
                    </div>
                </div>

                <div className="login-right">
                    <div className="login-form">
                        <h3>Connexion</h3>
                        <p>Accédez à votre compte en fonction de votre profil</p>

                        <div className="user-type-selector">
                            <div
                                className={`user-type-btn ${selectedRole === 'patient' ? 'active' : ''}`}
                                onClick={() => setSelectedRole('patient')}
                            >
                                <i className="fas fa-user-injured"></i> Patient
                            </div>
                            <div
                                className={`user-type-btn ${selectedRole === 'medecin' ? 'active' : ''}`}
                                onClick={() => setSelectedRole('medecin')}
                            >
                                <i className="fas fa-user-md"></i> Médecin
                            </div>
                            <div
                                className={`user-type-btn ${selectedRole === 'pharmacien' ? 'active' : ''}`}
                                onClick={() => setSelectedRole('pharmacien')}
                            >
                                <i className="fas fa-prescription-bottle-alt"></i> Pharmacien
                            </div>
                            <div
                                className={`user-type-btn ${selectedRole === 'admin' ? 'active' : ''}`}
                                onClick={() => setSelectedRole('admin')}
                            >
                                <i className="fas fa-cog"></i> Admin
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-id">Identifiant unique</label>
                            <input
                                type="text"
                                id="login-id"
                                className="form-control"
                                placeholder="Entrez votre ID unique"
                                defaultValue={`user_${selectedRole}`}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-password">Mot de passe</label>
                            <input
                                type="password"
                                id="login-password"
                                className="form-control"
                                placeholder="Entrez votre mot de passe"
                                defaultValue="demo123"
                            />
                        </div>

                        <div className="form-group form-check">
                            <input type="checkbox" id="remember-me" />
                            <label htmlFor="remember-me">Se souvenir de moi</label>
                        </div>

                        <div className="forgot-password">
                            <a href="#forgot">Mot de passe oublié ?</a>
                        </div>

                        <button
                            className="btn btn-primary login-btn"
                            onClick={() => onLogin(selectedRole)}
                        >
                            Se connecter
                        </button>

                        <div className="demo-note">
                            <p><i className="fas fa-info-circle"></i> Pour la démonstration, utilisez n'importe quel identifiant et mot de passe.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== SIDEBAR ====================
const Sidebar = ({ user, currentPage, onNavigate }) => {
    const menuSections = MENU_CONFIG[user.roleKey] || [];

    const checkAccess = (badge) => {
        if (!badge) return true;
        if (badge === 'Dr' && user.roleKey !== 'medecin') return false;
        if (badge === 'Pa' && user.roleKey !== 'patient') return false;
        if (badge === 'Ph' && user.roleKey !== 'pharmacien') return false;
        return true;
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="app-logo">
                    <i className="fas fa-heartbeat"></i>
                    Medi<span>Connect</span>
                </div>
            </div>

            <div className="sidebar-nav">
                {menuSections.map((section, idx) => (
                    <div className="nav-section" key={idx}>
                        <div className="nav-title">{section.section}</div>
                        <div className="nav-links-app">
                            {section.items.map((item) => {
                                const hasAccess = checkAccess(item.badge);
                                return (
                                    <a
                                        key={item.id}
                                        href="#"
                                        className={`nav-link-app ${currentPage === item.id ? 'active' : ''} ${!hasAccess ? 'disabled' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (hasAccess) {
                                                onNavigate(item.id, item.label);
                                            } else {
                                                alert('Cette fonctionnalité n\'est pas disponible pour votre profil');
                                            }
                                        }}
                                        style={{
                                            opacity: hasAccess ? 1 : 0.5,
                                            pointerEvents: hasAccess ? 'auto' : 'none'
                                        }}
                                    >
                                        <i className={item.icon}></i>
                                        {item.label}
                                        {item.badge && <span className="badge">{item.badge}</span>}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar" id="user-avatar">{user.avatar}</div>
                    <div className="user-info">
                        <h4 id="user-name">{user.nom}</h4>
                        <p id="user-role">{user.role}</p>
                    </div>
                    <div className="user-menu">
                        <i className="fas fa-chevron-down"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== TOP BAR ====================
const TopBar = ({ pageTitle, onLogout }) => {
    return (
        <div className="top-bar">
            <div className="page-title">{pageTitle}</div>
            <div className="top-bar-actions">
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Rechercher..." />
                </div>
                <div className="notifications">
                    <i className="fas fa-bell"></i>
                    <div className="notification-badge">3</div>
                </div>
                <button className="btn btn-outline" onClick={onLogout}>
                    <i className="fas fa-sign-out-alt"></i> Déconnexion
                </button>
            </div>
        </div>
    );
};

// ==================== PAGE CONTENT ====================
const PageContent = ({ pageId, user }) => {
    switch(pageId) {
        case 'dashboard':
            return <DashboardContent user={user} />;
        case 'diagnostic':
            return <DiagnosticContent />;
        case 'expert':
            return <ExpertContent user={user} />;
        default:
            return <EmptyPageContent pageId={pageId} />;
    }
};

// ==================== DASHBOARD CONTENT ====================
const DashboardContent = ({ user }) => {
    return (
        <div id="dashboard-content" className="page-content">
            <div className="content-header-app">
                <div className="header-image">
                    <div className="header-overlay">
                        <h1>Tableau de bord MediConnect</h1>
                        <p>Plateforme sécurisée de gestion médicale. Accédez à vos fonctionnalités selon votre profil.</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                <div className="content-grid">
                    {getDashboardCards(user.roleKey).map((card, idx) => (
                        <DashboardCard key={idx} {...card} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const DashboardCard = ({ title, description, icon, accessible }) => {
    return (
        <div
            className="content-card-app"
            style={{ opacity: accessible ? 1 : 0.5 }}
        >
            <div className="card-header">
                <div className="card-icon">
                    <i className={icon}></i>
                </div>
                <h3>{title}</h3>
            </div>
            <div className="card-content">
                <p>{description}</p>
            </div>
            <div className="card-actions">
                <a href="#" className="card-btn">{accessible ? 'Accéder' : 'Non disponible'}</a>
            </div>
        </div>
    );
};

const getDashboardCards = (role) => {
    const allCards = [
        {
            title: 'Diagnostic IA',
            description: 'Analysez des images médicales (radiographies) avec l\'assistance de l\'intelligence artificielle pour un diagnostic précis et rapide.',
            icon: 'fas fa-stethoscope',
            accessible: role === 'medecin'
        },
        {
            title: 'Expert Médical',
            description: 'Chatbot médical avec deux modes : patient (explications simplifiées) et médecin (analyse technique approfondie).',
            icon: 'fas fa-comments',
            accessible: true
        },
        {
            title: 'Mes dossiers médicaux',
            description: 'Consultez votre historique médical complet, crypté et sécurisé. Contrôlez les accès des professionnels de santé.',
            icon: 'fas fa-folder-open',
            accessible: role === 'patient'
        },
        {
            title: 'Collaboration experts',
            description: 'Discutez de cas médicaux complexes avec d\'autres experts via une plateforme sécurisée de collaboration.',
            icon: 'fas fa-user-friends',
            accessible: role === 'medecin'
        },
        {
            title: 'Examens médicaux',
            description: 'Créez de nouveaux examens médicaux, planifiez-les et gérez l\'historique de vos examens favoris.',
            icon: 'fas fa-file-medical',
            accessible: true
        },
        {
            title: 'Mon état de santé',
            description: 'Visualisez l\'état prédictif de votre santé basé sur vos analyses antérieures et les recommandations médicales.',
            icon: 'fas fa-heartbeat',
            accessible: role === 'patient'
        },
        {
            title: 'Disponibilités des centres',
            description: 'Trouvez les cliniques, hôpitaux et pharmacies disponibles selon vos besoins et la disponibilité des médicaments.',
            icon: 'fas fa-map-marker-alt',
            accessible: true
        },
        {
            title: 'Gestion pharmacie',
            description: 'Pour les pharmaciens : gérez le stock en ligne, lisez les ordonnances QR et vérifiez les médicaments.',
            icon: 'fas fa-prescription-bottle-alt',
            accessible: role === 'pharmacien'
        }
    ];

    return allCards;
};

// ==================== DIAGNOSTIC CONTENT ====================
const DiagnosticContent = () => {
    return (
        <div id="diagnostic-content" className="page-content">
            <div className="content-header-app">
                <div
                    className="header-image"
                    style={{
                        background: 'linear-gradient(rgba(42, 107, 143, 0.8), rgba(42, 107, 143, 0.9)), url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="header-overlay">
                        <h1>Diagnostic IA - Radiologie</h1>
                        <p>Téléchargez des images médicales pour une analyse assistée par intelligence artificielle</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                <div className="content-card-app" style={{maxWidth: '800px', margin: '0 auto'}}>
                    <div className="card-header">
                        <div className="card-icon">
                            <i className="fas fa-x-ray"></i>
                        </div>
                        <h3>Analyse de radiographie</h3>
                    </div>
                    <div className="card-content">
                        <p style={{marginBottom: '20px'}}>
                            Cette fonctionnalité est réservée aux médecins. Téléchargez une image de radiographie pour obtenir une analyse préliminaire par IA.
                        </p>

                        <div className="upload-area">
                            <i className="fas fa-cloud-upload-alt"></i>
                            <h3>Déposer une image médicale</h3>
                            <p>Formats acceptés : JPG, PNG, DICOM</p>
                            <button className="btn btn-primary">Parcourir les fichiers</button>
                        </div>

                        <div className="security-note">
                            <h4><i className="fas fa-shield-alt"></i> Sécurité des données</h4>
                            <p>Toutes les images téléchargées sont cryptées avec des algorithmes de haute sécurité. Les données sont anonymisées et stockées de manière sécurisée conformément aux réglementations médicales.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== EXPERT CONTENT ====================
const ExpertContent = ({ user }) => {
    const [chatMode, setChatMode] = useState('patient');
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: 'Bonjour ! Je suis l\'assistant médical de MediConnect. En mode patient, je fournis des explications simplifiées et adaptées. En mode médecin, l\'analyse est plus technique. Comment puis-je vous aider aujourd\'hui ?'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        setMessages([...messages,
            { type: 'user', content: inputMessage },
            {
                type: 'bot',
                content: chatMode === 'patient'
                    ? 'Je comprends votre inquiétude. Pour cette situation, je vous recommande de consulter votre médecin traitant pour un examen approfondi.'
                    : 'Sur la base des données fournies, on pourrait suspecter une pathologie de type [condition médicale]. Je recommande des examens complémentaires.'
            }
        ]);
        setInputMessage('');
    };

    return (
        <div id="expert-content" className="page-content">
            <div className="content-header-app">
                <div
                    className="header-image"
                    style={{
                        background: 'linear-gradient(rgba(74, 157, 124, 0.8), rgba(74, 157, 124, 0.9)), url(https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="header-overlay">
                        <h1>Expert Médical - Chatbot</h1>
                        <p>Obtenez des conseils et analyses médicales adaptés à votre profil</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                <div className="content-card-app" style={{maxWidth: '800px', margin: '0 auto'}}>
                    <div className="card-header">
                        <div className="card-icon">
                            <i className="fas fa-robot"></i>
                        </div>
                        <h3>Chatbot médical intelligent</h3>
                    </div>
                    <div className="card-content">
                        <div className="chat-mode-selector">
                            <div
                                className={`user-type-btn ${chatMode === 'patient' ? 'active' : ''}`}
                                onClick={() => setChatMode('patient')}
                            >
                                <i className="fas fa-user-injured"></i> Mode Patient
                            </div>
                            <div
                                className={`user-type-btn ${chatMode === 'medecin' ? 'active' : ''}`}
                                onClick={() => setChatMode('medecin')}
                            >
                                <i className="fas fa-user-md"></i> Mode Médecin
                            </div>
                        </div>

                        <div className="chat-container">
                            <div className="chat-messages" id="chat-messages">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`message ${msg.type}`}>
                                        <div className="message-avatar">
                                            <i className={msg.type === 'bot' ? 'fas fa-robot' : 'fas fa-user'}></i>
                                        </div>
                                        <div className="message-content">
                                            <p>{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="chat-input-container">
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder="Posez votre question médicale..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button className="btn btn-primary chat-send-btn" onClick={handleSendMessage}>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>

                        <div className="chat-actions">
                            <button className="btn btn-outline">
                                <i className="fas fa-phone-alt"></i> Appel vocal
                            </button>
                            <button className="btn btn-outline">
                                <i className="fas fa-video"></i> Visioconférence
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== EMPTY PAGE CONTENT ====================
const EmptyPageContent = ({ pageId }) => {
    return (
        <div className="page-content">
            <div className="content-body" style={{textAlign: 'center', padding: '80px 20px'}}>
                <div className="card-icon" style={{width: '80px', height: '80px', margin: '0 auto 30px', fontSize: '40px'}}>
                    <i className="fas fa-file-medical"></i>
                </div>
                <h2 style={{marginBottom: '15px', fontSize: '2rem'}}>Page en développement</h2>
                <p style={{color: '#6c757d', fontSize: '1.1rem'}}>
                    Cette page ({pageId}) sera disponible prochainement.
                </p>
            </div>
        </div>
    );
};

export default MediConnectApp;