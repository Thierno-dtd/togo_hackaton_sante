import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('mediconnect_user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('mediconnect_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (roleKey, credentials = {}) => {
        // Mock authentication
        const mockUser = MOCK_USERS[roleKey];

        if (mockUser) {
            const userWithTimestamp = {
                ...mockUser,
                loginTime: new Date().toISOString()
            };

            setUser(userWithTimestamp);
            setIsAuthenticated(true);
            localStorage.setItem('mediconnect_user', JSON.stringify(userWithTimestamp));

            return { success: true, user: userWithTimestamp };
        }

        return { success: false, error: 'Invalid credentials' };
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('mediconnect_user');
    };

    const updateUser = (updates) => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
            localStorage.setItem('mediconnect_user', JSON.stringify(updatedUser));
        }
    };

    const hasRole = (role) => {
        return user?.role === role;
    };

    const hasAnyRole = (roles) => {
        return roles.includes(user?.role);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
        hasRole,
        hasAnyRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};