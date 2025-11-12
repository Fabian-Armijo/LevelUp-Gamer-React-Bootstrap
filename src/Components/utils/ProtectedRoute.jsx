import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ajusta la ruta a tu AuthContext

const ProtectedRoute = ({ children }) => {
    // 1. Obtiene el estado de autenticación del "cerebro" (el contexto)
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // 2. Si NO está autenticado...
    if (!isAuthenticated) {
        // 3. Redirige al login.
        // 'replace' evita que el usuario pueda "volver atrás" a la pág. de perfil
        // 'state' guarda la página que intentaba visitar, para redirigirlo allí después del login
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // 4. Si SÍ está autenticado, simplemente muestra la página que intentaba ver
    return children;
};

export default ProtectedRoute;