import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CartService from '../../../Services/CartService';
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

const updateCartCount = async () => {
  const token = localStorage.getItem('token');
 
  if (!token) {
  // Si no hay token, el carrito es 0
  setCartCount(0);
  return;
  }

  // Si hay token, pregunta al backend
  try {
    const response = await CartService.getCart();
    // Asumiendo que el backend devuelve { items: [...] }
    const totalItems = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  } catch (error) {
    console.warn("No se pudo cargar el contador del carrito (quizás el token expiró)");
    setCartCount(0);
  }
 };

useEffect(() => {
  updateCartCount(); // Llama al cargar la página

  // Los listeners siguen siendo útiles para actualizar en tiempo real
  window.addEventListener('storage', updateCartCount);
  window.addEventListener('cartUpdated', updateCartCount);

  return () => {
    window.removeEventListener('storage', updateCartCount);
    window.removeEventListener('cartUpdated', updateCartCount);
  };
}, []);

  const handleScrollLink = (sectionId) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const event = new CustomEvent('scrollToSection', { detail: sectionId });
        window.dispatchEvent(event);
      }, 100); 
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

        <RouterLink to="/carrito" className="cart-link" onClick={handleLinkClick}>
          🛒
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </RouterLink>
      </div>
    </nav>
  );
};

export default NavigationMenu;
