import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './Components/pages/LoginPage';
import RegistrationPage from './Components/pages/RegistrationPage';
import HomePage from './Components/pages/HomePage';
import ProductDetailPage from './Components/pages/ProductDetailPage/ProductDetailPage';
import CartPage from './Components/pages/CartPage';
import Footer from './Components/organisms/Footer/Footer';
import ProfilePage from './Components/pages/ProfilePage/ProfilePage';

// --- 1. IMPORTA EL CONTEXTO Y EL GUARDIA ---
import { AuthProvider } from './context/AuthContext'; // Ajusta esta ruta
import ProtectedRoute from './Components/utils/ProtectedRoute'; // Ajusta esta ruta

import './App.css';

const AppLayout = () => {
  const location = useLocation();
  // Tu lógica para ocultar el footer está perfecta
  const isAuthPage = location.pathname === '/login' || location.pathname === '/registro';
  const containerClassName = isAuthPage ? 'app-container' : 'main-layout';
  const showFooter = !isAuthPage;

  return (
    <div className={containerClassName}>
      <Routes>
        {/* --- 2. RUTAS PÚBLICAS (Cualquiera puede verlas) --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistrationPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/producto/:productId" element={<ProductDetailPage />} />
        
        {/* --- 3. RUTAS PROTEGIDAS (Requieren login) --- */}
        {/* Envolvemos las rutas privadas con el "Guardia" */}
        
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/carrito" 
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* --- 4. "ENCHUFA" EL CEREBRO --- */}
      {/* AuthProvider le da a AppLayout (y a todos sus hijos)
          acceso al estado 'isAuthenticated' */}
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;