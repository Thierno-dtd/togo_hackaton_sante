import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [selectedRole, setSelectedRole] = useState('patient');
    const [credentials, setCredentials] = useState({
        identifier: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = login(selectedRole, credentials);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError('Identifiants incorrects');
            }
        } catch (err) {
            setError('Une erreur est survenue lors de la connexion');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div id="login-page">
            <div className="login-container">
                <div className="login-left">
                    <div className="back-home">
                        <a href="#" onClick={(e) => { e.preventDefault(); handleBackToHome(); }}>
                            <i className="fas fa-arrow-left"></i> Retour à l'accueil
                        </a>
                    </div>
                    <h2>Bienvenue sur MediConnect</h2>
                    <p>
                        Connectez-vous pour accéder à votre espace sécurisé et bénéficier de toutes les
                        fonctionnalités de la plateforme.
                    </p>

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

                    <div style={{ marginTop: '50px' }}>
                        <p style={{ fontSize: '14px', opacity: 0.7 }}>
                            <i className="fas fa-info-circle"></i> Application développée pour la compétition
                            nationale de santé.
                        </p>
                    </div>
                </div>

                <div className="login-right">
                    <form className="login-form" onSubmit={handleLogin}>
                        <h3>Connexion</h3>
                        <p>Accédez à votre compte en fonction de votre profil</p>

                        {error && (
                            <div className="alert alert-danger">
                                <i className="fas fa-exclamation-circle"></i> {error}
                            </div>
                        )}

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
                                value={credentials.identifier}
                                onChange={(e) => setCredentials({ ...credentials, identifier: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-password">Mot de passe</label>
                            <input
                                type="password"
                                id="login-password"
                                className="form-control"
                                placeholder="Entrez votre mot de passe"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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
                            type="submit"
                            className="btn btn-primary login-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Connexion...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>

                        <div className="demo-note">
                            <p>
                                <i className="fas fa-info-circle"></i> Pour la démonstration, cliquez simplement
                                sur "Se connecter" après avoir choisi votre profil.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;