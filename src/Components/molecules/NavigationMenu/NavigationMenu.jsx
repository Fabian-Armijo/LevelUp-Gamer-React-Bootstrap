import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CartService from '../../../services/CartService';
import './NavigationMenu.css';
import { useAuth } from '../../../context/AuthContext';
import { Modal, Button } from 'react-bootstrap';
import ProfileService from '../../../services/ProfileService'; 

const LevelFlair = ({ level }) => {
  if (!level || level < 2) return null; 
  let flair = '';
  let title = '';
  switch (level) {
    case 2: flair = '🥈'; title = 'Nivel 2: Plata'; break;
    case 3: flair = '🥇'; title = 'Nivel 3: Oro'; break;
    case 4: flair = '👑'; title = 'Nivel 4: Maestro'; break;
    default: return null;
  }
  return <span className="level-flair" title={title}>{flair}</span>;
};


const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLinkClick = () => { setIsOpen(false); };
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
    updateCartCount(); 
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
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
          
          <button onClick={() => handleScrollLink('inicio')}>Inicio</button>
          <button onClick={() => handleScrollLink('catalogo')}>Catálogo</button>
          <button onClick={() => handleScrollLink('blog')}>Blog</button>
          <button onClick={() => handleScrollLink('eventos')}>Eventos</button>
          <button onClick={() => handleScrollLink('acerca-de')}>Acerca de</button>
          <button onClick={() => handleScrollLink('contacto')}>Contacto</button>

          <div className="nav-actions-group">
            {isAuthenticated ? (
              <>
                <RouterLink to="/carrito" className="cart-link" onClick={handleLinkClick} title="Carrito">
                  🛒
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </RouterLink>
                <RouterLink to="/perfil" className="nav-profile-link" onClick={handleLinkClick} title="Mi Perfil">
                  
                  {user && user.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt="Perfil"
                      className="header-profile-pic"
                    />
                  ) : (
                    <span className="profile-icon">👤</span> 
                  )}
                  
                  {user && user.userRole === "ROLE_DUOC" && <LevelFlair level={user.userLevel} />}

                </RouterLink>
                
                <button onClick={handleLogoutClick} className="nav-button" title="Cerrar Sesión">
                  Cerrar Sesión
                </button>
              </>
            ) : (
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