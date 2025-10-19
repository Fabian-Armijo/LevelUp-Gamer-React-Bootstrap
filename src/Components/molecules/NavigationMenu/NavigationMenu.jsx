import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import './NavigationMenu.css';

const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleProfileChange = (e) => {
    const path = e.target.value;
    if (path) {
      handleLinkClick();
      navigate(path);
      e.target.value = "";
    }
  };

  const scrollProps = {
    spy: true,
    smooth: true,
    offset: -80,
    duration: 500,
    onClick: handleLinkClick,
    activeClass: 'active-link',
  };

  return (
    <nav className="navigation">
      <button className="hamburger-button" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <div className={`nav-links ${isOpen ? 'show' : ''}`}>
        <ScrollLink to="inicio" {...scrollProps}>Inicio</ScrollLink>
        <select onChange={handleProfileChange} className="profile-select" value="">
          <option value="" disabled>Perfil</option>
          <option value="/perfil">Mi Perfil</option>
          <option value="/login">Iniciar Sesión</option>
          <option value="/registro">Registrarse</option>
        </select>
        
        <ScrollLink to="catalogo" {...scrollProps}>Catálogo</ScrollLink>
        <ScrollLink to="blog" {...scrollProps}>Blog</ScrollLink>
        <ScrollLink to="eventos" {...scrollProps}>Eventos</ScrollLink>
        <ScrollLink to="acerca-de" {...scrollProps}>Acerca de</ScrollLink>
        <ScrollLink to="contacto" {...scrollProps}>Contacto</ScrollLink>
        
        <RouterLink to="/#" className="cart-link" onClick={handleLinkClick}>
          🛒
          <span className="cart-count">0</span>
        </RouterLink>
      </div>
    </nav>
  );
};

export default NavigationMenu;