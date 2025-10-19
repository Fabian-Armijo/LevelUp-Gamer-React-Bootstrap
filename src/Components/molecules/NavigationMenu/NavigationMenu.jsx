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
      // Cierra el menú en móvil antes de navegar
      setIsOpen(false);
      navigate(path);
    }
  };

  // Función para cerrar el menú al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navigation">
      {/* Botón de hamburguesa que solo se ve en móvil */}
      <button className="hamburger-button" onClick={toggleMenu}>
        ☰
      </button>

      {/* Contenedor único para todos los enlaces */}
      <div className={`nav-links ${isOpen ? 'show' : ''}`}>
        <Link to="/" onClick={handleLinkClick}>Inicio</Link>
        <select onChange={handleProfileChange} className="profile-select">
          <option value="">Perfil</option>
          <option value="/perfil">Mi Perfil</option>
          <option value="/login">Iniciar Sesión</option>
          <option value="/registro">Registrarse</option>
        </select>
        <Link to="/slider" onClick={handleLinkClick}>Novedades</Link>
        <Link to="/catalogo" onClick={handleLinkClick}>Catálogo</Link>
        <Link to="/eventos" onClick={handleLinkClick}>Eventos</Link>
        <Link to="/acerca-de" onClick={handleLinkClick}>Acerca de</Link>
        <Link to="/contacto" onClick={handleLinkClick}>Contacto</Link>
        
        {/* El carrito de compras ahora es parte de la misma lista */}
        <Link to="/carrito" className="cart-link" onClick={handleLinkClick}>
          🛒
          <span className="cart-count">0</span>
        </Link>
      </div>
    </nav>
  );
};

export default NavigationMenu;