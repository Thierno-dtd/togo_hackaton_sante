import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NOTIFICATIONS } from '../../data/mockData';

const TopBar = ({ pageTitle, onMenuToggle }) => {
    const { logout, user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);

    // Filter notifications by user role
    const userNotifications = NOTIFICATIONS.filter(
        notif => !notif.roles || notif.roles.includes(user?.role)
    );

    const unreadCount = userNotifications.filter(n => !n.read).length;

    return (
        <div className="top-bar">
            <button
                className="menu-toggle md:hidden"
                onClick={onMenuToggle}
                aria-label="Toggle menu"
            >
                <i className="fas fa-bars"></i>
            </button>

            <div className="page-title">{pageTitle}</div>

            <div className="top-bar-actions">
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Rechercher..." />
                </div>

                <div
                    className="notifications"
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                    <i className="fas fa-bell"></i>
                    {unreadCount > 0 && (
                        <div className="notification-badge">{unreadCount}</div>
                    )}

                    {showNotifications && (
                        <div className="notifications-dropdown">
                            <div className="dropdown-header">
                                <h4>Notifications</h4>
                                <button className="btn-text">Tout marquer comme lu</button>
                            </div>
                            <div className="notifications-list">
                                {userNotifications.length > 0 ? (
                                    userNotifications.map(notif => (
                                        <div
                                            key={notif.id}
                                            className={`notification-item ${notif.read ? 'read' : ''}`}
                                        >
                                            <div className={`notif-icon ${notif.type}`}>
                                                <i className={getNotificationIcon(notif.type)}></i>
                                            </div>
                                            <div className="notif-content">
                                                <h5>{notif.title}</h5>
                                                <p>{notif.message}</p>
                                                <span className="notif-time">
                                                    {formatRelativeTime(notif.date)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-notifications">
                                        <i className="fas fa-bell-slash"></i>
                                        <p>Aucune notification</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button className="btn btn-outline" onClick={logout} id="logout-btn">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

// Helper functions restent identiques
const getNotificationIcon = (type) => {
    const icons = {
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle',
        success: 'fas fa-check-circle',
        danger: 'fas fa-times-circle'
    };
    return icons[type] || icons.info;
};

const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Il y a quelques minutes';
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return new Date(date).toLocaleDateString('fr-FR');
};

export default TopBar;