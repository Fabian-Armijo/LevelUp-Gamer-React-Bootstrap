import React, { createContext, useContext, useState } from 'react';

// 1. Creamos el contexto
const AuthContext = createContext();

// 2. Creamos el "Proveedor" del contexto
export const AuthProvider = ({ children }) => {
    
    // 3. El estado de autenticación.
    // ¡LA CLAVE! Se inicializa leyendo localStorage.
    // (!! convierte el string del token (o null) en un booleano 'true' o 'false')
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    // 4. Función de Login
    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    // 5. Función de Logout
    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    // 6. Proveemos el estado y las funciones a todos los "hijos"
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 7. Creamos un "Hook" personalizado para usar el contexto fácilmente
export const useAuth = () => {
    return useContext(AuthContext);
};