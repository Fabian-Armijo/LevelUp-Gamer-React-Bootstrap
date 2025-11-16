import React, { createContext, useContext, useState, useEffect } from 'react';
import ProfileService from '../services/ProfileService'; // Asegúrate que la ruta es correcta

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    // 1. El estado ahora guarda el OBJETO de usuario (o null)
    const [user, setUser] = useState(null);
    // Un estado de 'cargando' para evitar parpadeos al inicio
    const [isLoading, setIsLoading] = useState(true);

    // 2. Función para refrescar los datos del usuario (la usará Perfil y Checkout)
    const refreshUser = () => {
        // Asegúrate de que haya un token antes de intentar refrescar
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            return Promise.resolve(); // Devuelve una promesa resuelta
        }

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
        setIsLoading(true);
        refreshUser().finally(() => {
            setIsLoading(false);
        });
    }, []);

    // 4. Función de Login: guarda token Y carga el perfil
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
        refreshUser // La función para actualizar puntos
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

// El hook para usar el contexto
export const useAuth = () => {
    return useContext(AuthContext);
};