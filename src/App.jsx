// src/App.jsx - VERSIÓN FINAL Y CORRECTA
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './Components/pages/LoginPage';
import RegistrationPage from './Components/pages/RegistrationPage';
import HomePage from './Components/pages/HomePage';
import ProductDetailPage from './Components/pages/ProductDetailPage/ProductDetailPage';
import Footer from './Components/organisms/Footer/Footer';
import './App.css';

// Creamos un componente "inteligente" para manejar el layout
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