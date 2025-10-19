import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavigationMenu.css';

const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileChange = (e) => {
    const path = e.target.value;
    if (path) {
      navigate(path);
    }
  };

  return (
    <nav className="navigation">
      <button className="hamburger-button" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`nav-links ${isOpen ? 'show' : ''}`}>
        <Link to="/" onClick={toggleMenu}>Inicio</Link>
        <select onChange={handleProfileChange} className="profile-select">
          <option value="">Perfil</option>
          <option value="/perfil">Mi Perfil</option>
          <option value="/login">Iniciar Sesión</option>
          <option value="/registro">Registrarse</option>
        </select>
        <Link to="/slider" onClick={toggleMenu}>Slider</Link>
        <Link to="/catalogo" onClick={toggleMenu}>Catálogo</Link>
        <Link to="/eventos" onClick={toggleMenu}>Eventos</Link>
        <Link to="/acerca-de" onClick={toggleMenu}>Acerca de</Link>
        <Link to="/contacto" onClick={toggleMenu}>Contacto</Link>
      </div>
    </nav>
  );
};

export default NavigationMenu;