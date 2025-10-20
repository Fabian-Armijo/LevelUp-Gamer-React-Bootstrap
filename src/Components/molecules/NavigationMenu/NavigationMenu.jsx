// src/Components/organisms/NavigationMenu/NavigationMenu.jsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import './NavigationMenu.css';

const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
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

  // ✅ Función para actualizar el contador leyendo desde localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  // ✅ Al montar el componente, cargamos y escuchamos cambios
  useEffect(() => {
    updateCartCount();

    // Escuchar cambios en el localStorage (por ejemplo, cuando agregas un producto)
    window.addEventListener('storage', updateCartCount);

    // También escuchar eventos personalizados que emitiremos desde otras partes
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

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

        {/* ✅ Ícono del carrito con contador */}
        <RouterLink to="/carrito" className="cart-link" onClick={handleLinkClick}>
          🛒
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </RouterLink>
      </div>
    </nav>
  );
};

export default NavigationMenu;
