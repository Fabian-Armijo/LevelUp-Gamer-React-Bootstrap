import React, { createContext, useContext, useState, useEffect } from 'react';
import ProfileService from '../services/ProfileService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            return Promise.resolve();
        }

        return ProfileService.getMyProfile()
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error("Fallo al refrescar usuario, cerrando sesión.", error);
                logout();
            });
    };

    useEffect(() => {
        setIsLoading(true);
        refreshUser().finally(() => {
            setIsLoading(false);
        });
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        return refreshUser();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = !!user;

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};