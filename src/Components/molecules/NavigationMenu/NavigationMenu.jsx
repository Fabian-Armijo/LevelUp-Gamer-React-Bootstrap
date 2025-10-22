import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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

  // ✅ Nueva función: permite hacer scroll incluso si estás fuera del Home
  const handleScrollLink = (sectionId) => {
    if (window.location.pathname !== '/') {
      navigate('/'); // volvemos al inicio
      setTimeout(() => {
        const event = new CustomEvent('scrollToSection', { detail: sectionId });
        window.dispatchEvent(event);
      }, 300); // pequeño retraso para que la Home se monte
    } else {
      const event = new CustomEvent('scrollToSection', { detail: sectionId });
      window.dispatchEvent(event);
    }
    handleLinkClick();
  };

  return (
    <nav className="navigation">
      <button className="hamburger-button" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <div className={`nav-links ${isOpen ? 'show' : ''}`}>
        <button onClick={() => handleScrollLink('inicio')}>Inicio</button>

        <select onChange={handleProfileChange} className="profile-select" value="">
          <option value="" disabled>Perfil</option>
          <option value="/perfil">Mi Perfil</option>
          <option value="/login">Iniciar Sesión</option>
          <option value="/registro">Registrarse</option>
        </select>

        <button onClick={() => handleScrollLink('catalogo')}>Catálogo</button>
        <button onClick={() => handleScrollLink('blog')}>Blog</button>
        <button onClick={() => handleScrollLink('eventos')}>Eventos</button>
        <button onClick={() => handleScrollLink('acerca-de')}>Acerca de</button>
        <button onClick={() => handleScrollLink('contacto')}>Contacto</button>

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
