// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './Components/pages/LoginPage';
import RegistrationPage from './Components/pages/RegistrationPage';
import HomePage from './Components/pages/HomePage';
import ProductDetailPage from './Components/pages/ProductDetailPage/ProductDetailPage';
import CartPage from './Components/pages/CartPage'; // ✅ Importa el carrito
import Footer from './Components/organisms/Footer/Footer';
import './App.css';

// Componente "inteligente" para manejar el layout
const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/registro';
  const containerClassName = isAuthPage ? 'app-container' : 'main-layout';

  const showFooter = !isAuthPage;

  return (
    <div className={containerClassName}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistrationPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/producto/:productId" element={<ProductDetailPage />} />
        
        {/* ✅ Nueva ruta del carrito */}
        <Route path="/carrito" element={<CartPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
