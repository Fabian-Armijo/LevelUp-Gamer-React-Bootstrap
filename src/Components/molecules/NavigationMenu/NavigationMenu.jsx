import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CartService from '../../../Services/CartService'; // Asegúrate de que esta ruta sea correcta
import './NavigationMenu.css';
import { useAuth } from '../../../context/AuthContext'; // Asegúrate de que esta ruta sea correcta
import { Modal, Button } from 'react-bootstrap'; // Importa el Modal y Botón

const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  
  // 1. Obtiene el estado y las funciones de autenticación
  const { isAuthenticated, logout } = useAuth();

  // 2. Añade un estado para controlar la visibilidad del modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Cierra el menú hamburguesa (al hacer clic en un enlace)
  const handleLinkClick = () => {
    setIsOpen(false); 
  };

  // 3. Esta es la función que SÍ cierra la sesión (llamada por el modal)
  const handleConfirmLogout = () => {
    handleLinkClick(); // Cierra el menú
    logout(); // Borra el token y actualiza el estado global
    navigate('/'); // Redirige al inicio
    setShowLogoutModal(false); // Cierra el modal
  };

  // 4. Esta función ahora solo ABRE el modal
  const handleLogoutClick = () => {
    setIsOpen(false); // Cierra el menú si está abierto
    setShowLogoutModal(true); // Abre el modal
  };

  // 5. Crea el mensaje dinámico para el modal
  const getModalMessage = () => {
    if (cartCount > 0) {
      return `Tienes ${cartCount} producto(s) en tu carrito. ¿Estás seguro de que quieres cerrar sesión?`;
    }
    return '¿Estás seguro de que quieres cerrar sesión?';
  };

  // 6. Lógica para actualizar el contador del carrito
  const updateCartCount = async () => {
    // Usa el 'isAuthenticated' del contexto (más fiable)
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }

    try {
      const response = await CartService.getCart();
      const totalItems = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.warn("No se pudo cargar el contador del carrito (quizás el token expiró)");
      setCartCount(0);
    }
  };

  // 7. useEffect para cargar el carrito
  useEffect(() => {
    updateCartCount(); // Llama al cargar la página

    // Listeners para actualizar el carrito en tiempo real
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
    // 8. ¡CLAVE! Se ejecuta de nuevo si 'isAuthenticated' cambia
  }, [isAuthenticated]); 

  // Tu lógica para el scroll (sin cambios)
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
    // 9. Envuelve todo en un Fragment (<>) para que el Modal sea un "hermano"
    <>
      <nav className="navigation">
        <button className="hamburger-button" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        <div className={`nav-links ${isOpen ? 'show' : ''}`}>
          <button onClick={() => handleScrollLink('inicio')}>Inicio</button>

          {/* --- 10. La lógica condicional para Iniciar/Cerrar Sesión --- */}
          {isAuthenticated ? (
            // Si está logueado:
            <>
              <RouterLink to="/perfil" className="nav-button" onClick={handleLinkClick}>
                Mi Perfil
              </RouterLink>
              {/* El botón de logout ahora solo abre el modal */}
              <button onClick={handleLogoutClick} className="nav-button">
                Cerrar Sesión
              </button>
            </>
          ) : (
            // Si NO está logueado:
            <>
              <RouterLink to="/login" className="nav-button" onClick={handleLinkClick}>
                Iniciar Sesión
              </RouterLink>
              <RouterLink to="/registro" className="nav-button" onClick={handleLinkClick}>
                Registrarse
              </RouterLink>
            </>
          )}
          {/* --- Fin de la lógica condicional --- */}

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

      {/* --- 11. El Modal de Confirmación --- */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Cierre de Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Aquí usa el mensaje dinámico */}
          {getModalMessage()}
        </Modal.Body>
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