import React, { createContext, useContext, useState, useEffect } from 'react';
import ProfileService from '../services/ProfileService'; // Asegúrate que la ruta es correcta

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    // 1. El estado ahora guarda el OBJETO de usuario (o null)
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 2. Función para refrescar los datos del usuario (la usaremos después del checkout)
    const refreshUser = () => {
        return ProfileService.getMyProfile()
            .then(response => {
                setUser(response.data); // Guarda el perfil completo
            })
            .catch(error => {
                console.error("Fallo al refrescar usuario, cerrando sesión.", error);
                logout(); // Si el token expiró, cierra sesión
            });
    };

    // 3. Comprueba (al cargar la app) si ya existe un token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            refreshUser().finally(() => setIsLoading(false)); // Carga el perfil
        } else {
            setIsLoading(false); // No hay token, no hay usuario
        }
    }, []);

    // 4. Función de Login: guarda token Y perfil
    const login = (token) => {
        localStorage.setItem('token', token);
        // Inmediatamente después del login, busca el perfil
        return refreshUser(); // Usamos la nueva función
    };

    // 5. Función de Logout: borra token Y perfil
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = !!user; // 'true' si user no es null

    // 6. Proveemos el 'user' completo y la nueva función
    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser // ¡Nueva función!
    };

    // No renderiza la app hasta saber si estamos logueados o no
    if (isLoading) {
        return <div>Cargando...</div>; // O un spinner
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