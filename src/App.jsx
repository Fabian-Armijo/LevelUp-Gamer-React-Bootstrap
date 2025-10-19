// src/App.jsx - VERSIÓN FINAL Y CORRECTA
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './Components/pages/LoginPage';
import RegistrationPage from './Components/pages/RegistrationPage';
import HomePage from './Components/pages/HomePage';
import './App.css';

// Creamos un componente "inteligente" para manejar el layout
const AppLayout = () => {
  const location = useLocation(); // Obtiene la información de la ruta actual

  // Decide si la página actual necesita el contenedor de centrado
  const isAuthPage = location.pathname === '/login' || location.pathname === '/registro';
  
  // Asigna la clase correcta basándose en la página
  const containerClassName = isAuthPage ? 'app-container' : 'main-layout';

  return (
    <div className={containerClassName}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistrationPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

// El componente App ahora solo se encarga del Router
function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;