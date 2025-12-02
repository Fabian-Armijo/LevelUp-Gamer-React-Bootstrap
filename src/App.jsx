import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './Components/pages/LoginPage';
import RegistrationPage from './Components/pages/RegistrationPage';
import HomePage from './Components/pages/HomePage';
import ProductDetailPage from './Components/pages/ProductDetailPage/ProductDetailPage';
import CartPage from './Components/pages/CartPage';
import Footer from './Components/organisms/Footer/Footer';
import ProfilePage from './Components/pages/ProfilePage/ProfilePage';
import RewardsPage from './Components/pages/RewardsPage';
import AdminDashboard from './Components/pages/AdminDashboard/AdminDashboard'; 

import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './Components/utils/ProtectedRoute'; 

import './App.css';

const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/registro';
  const isAdminPage = location.pathname.startsWith('/admin');
  
  const containerClassName = (isAuthPage || isAdminPage) ? 'app-container-fluid' : 'main-layout';
  const showFooter = !isAuthPage && !isAdminPage;

  return (
    <div className={containerClassName}>
      <Routes>
        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistrationPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/producto/:productId" element={<ProductDetailPage />} />
        
        {/* --- RUTAS PROTEGIDAS --- */}
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

        <Route path="/recompensas" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />

        {/* --- 2. RUTA DEL ADMIN DASHBOARD --- */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
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
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;