import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CartService from '../../../Services/CartService';
import './NavigationMenu.css';
import { useAuth } from '../../../context/AuthContext';
import { Modal, Button } from 'react-bootstrap';
import ProfileService from '../../../Services/ProfileService'; 

const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  // ... (Tus funciones handleLinkClick, handleConfirmLogout, getModalMessage, etc. no cambian) ...

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleConfirmLogout = () => {
    handleLinkClick();
    logout();
    navigate('/');
    setShowLogoutModal(false);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutModal(true);
  };

  const getModalMessage = () => {
    if (cartCount > 0) {
      return `Tienes ${cartCount} producto(s) en tu carrito. ¿Estás seguro de que quieres cerrar sesión?`;
    }
    return '¿Estás seguro de que quieres cerrar sesión?';
  };

  const updateCartCount = async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    try {
      const response = await CartService.getCart();
      const totalItems = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.warn("No se pudo cargar el contador del carrito");
      setCartCount(0);
    }
  };

  useEffect(() => {
    const loadHeaderData = async () => {
      if (isAuthenticated) {
        try {
          const profilePromise = ProfileService.getMyProfile();
          updateCartCount(); // Llama a tu función del carrito
          const profileResponse = await profilePromise;
          setProfilePicUrl(profileResponse.data.profilePictureUrl);
        } catch (error) {
          console.error("Error al cargar datos del header:", error);
          setProfilePicUrl(null);
        }
      } else {
        setCartCount(0);
        setProfilePicUrl(null);
      }
    };
    loadHeaderData();
    window.addEventListener('storage', loadHeaderData);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', loadHeaderData);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [isAuthenticated]);

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
    <>
      <nav className="navigation">
        <button className="hamburger-button" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        <div className={`nav-links ${isOpen ? 'show' : ''}`}>
          
          {/* --- Grupo de Enlaces de Navegación (Izquierda) --- */}
          <button onClick={() => handleScrollLink('inicio')}>Inicio</button>
          <button onClick={() => handleScrollLink('catalogo')}>Catálogo</button>
          <button onClick={() => handleScrollLink('blog')}>Blog</button>
          <button onClick={() => handleScrollLink('eventos')}>Eventos</button>
          <button onClick={() => handleScrollLink('acerca-de')}>Acerca de</button>
          <button onClick={() => handleScrollLink('contacto')}>Contacto</button>

          {/* --- Grupo de Acciones (Derecha) --- */}
          <div className="nav-actions-group">
            {isAuthenticated ? (
              // --- Logueado (Orden Corregido: Carrito -> Perfil -> Logout) ---
              <>
                {/* 1. Carrito */}
                <RouterLink to="/carrito" className="cart-link" onClick={handleLinkClick} title="Carrito">
                  🛒
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </RouterLink>

                {/* 2. Perfil (La foto) */}
                <RouterLink to="/perfil" className="nav-profile-link" onClick={handleLinkClick} title="Mi Perfil">
                  {profilePicUrl ? (
                    <img
                      src={profilePicUrl}
                      alt="Perfil"
                      className="header-profile-pic"
                    />
                  ) : (
                    <span className="profile-icon">👤</span> 
                  )}
                </RouterLink>
                
                {/* 3. Cerrar Sesión */}
                <button onClick={handleLogoutClick} className="nav-button" title="Cerrar Sesión">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              // --- No Logueado ---
              <>
                <RouterLink to="/login" className="nav-button" onClick={handleLinkClick}>
                  Iniciar Sesión
                </RouterLink>
                <RouterLink to="/registro" className="nav-button" onClick={handleLinkClick}>
                  Registrarse
                </RouterLink>
                <RouterLink to="/carrito" className="cart-link" onClick={handleLinkClick} title="Carrito">
                  🛒
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </RouterLink>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Modal de Logout (sin cambios) */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cierre de Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>{getModalMessage()}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmLogout}>
            Sí, cerrar sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavigationMenu;