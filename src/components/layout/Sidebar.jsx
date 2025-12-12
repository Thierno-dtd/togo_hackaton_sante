import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMenuForRole } from '../../data/menuConfig';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    const menuSections = getMenuForRole(user.role);

    const handleNavigate = (route) => {
        navigate(route);
    };

    const isActive = (route) => {
        return location.pathname === route;
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="app-logo">
                    <i className="fas fa-heartbeat"></i>
                    LAMESSE<span>DAMA</span>
                </div>
            </div>

            <div className="sidebar-nav">
                {menuSections.map((section, idx) => (
                    <div className="nav-section" key={idx}>
                        <div className="nav-title">{section.section}</div>
                        <div className="nav-links-app">
                            {section.items.map((item) => (
                                <a
                                    key={item.id}
                                    href="#"
                                    className={`nav-link-app ${isActive(item.route) ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigate(item.route);
                                    }}
                                >
                                    <i className={item.icon}></i>
                                    {item.label}
                                    {item.badge && <span className="badge">{item.badge}</span>}
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div
                        className="user-avatar"
                        style={{
                            background: `linear-gradient(135deg, ${getAvatarColor(user.nom)} 0%, ${getAvatarColorSecondary(user.nom)} 100%)`
                        }}
                    >
                        {user.avatar}
                    </div>
                    <div className="user-info">
                        <h4>{user.nom} {user.prenom}</h4>
                        <p>{getRoleLabel(user.role)}</p>
                    </div>
                    <div className="user-menu" onClick={logout} title="Déconnexion">
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper functions
const getAvatarColor = (name) => {
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
};

const getAvatarColorSecondary = (name) => {
    const colors = ['#dc2626', '#d97706', '#059669', '#2563eb', '#4f46e5', '#7c3aed'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
};

const getRoleLabel = (role) => {
    const labels = {
        medecin: 'Médecin',
        patient: 'Patient',
        pharmacien: 'Pharmacien',
        admin: 'Administrateur'
    };
    return labels[role] || role;
};

export default Sidebar;