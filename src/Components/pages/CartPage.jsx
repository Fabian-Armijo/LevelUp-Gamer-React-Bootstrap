import React, { useEffect, useState } from 'react';
import { Button, Table, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../organisms/Header/Header';
import CartService from '../../services/CartService';
import OrderService from '../../services/OrderService'; // <-- 1. IMPORTA EL SERVICIO DE PEDIDOS
import { useAuth } from '../../context/AuthContext'; // <-- 2. IMPORTA EL "CEREBRO"
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Estado para el checkout
  const navigate = useNavigate();

  // --- 3. OBTÉN EL USUARIO Y LA FUNCIÓN DE RECARGA ---
  const { user, refreshUser } = useAuth(); 

  // --- Carga de Datos ---
  const fetchCart = async () => {
    // No usamos setIsLoading(true) aquí para evitar parpadeos al actualizar cantidad
    try {
      const response = await CartService.getCart();
      setCart(response.data);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        logout(); // Llama a logout del contexto si lo tienes
        navigate('/login');
      }
    }
    setIsLoading(false); // Solo se pone en 'false' la primera vez
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // --- Handlers (Manejo de acciones) ---
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await handleRemove(productId);
      return;
    }
    try {
      const response = await CartService.updateItem(productId, newQuantity);
      setCart(response.data); // Actualiza el estado local con la respuesta
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      alert("No se pudo actualizar el producto.");
    }
  };

  const handleRemove = async (productId) => {
    const confirmRemove = window.confirm("¿Estás seguro de que quieres eliminar este producto del carrito?");
    if (!confirmRemove) return;
    try {
      const response = await CartService.removeItem(productId);
      setCart(response.data); // Actualiza el estado local
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Error al eliminar item:", error);
      alert("No se pudo eliminar el producto.");
    }
  };

  const handleEmptyCart = async () => {
    if (!cart || cart.items.length === 0) return;
    const confirmEmpty = window.confirm('¿Estás seguro que quieres vaciar el carrito?');
    if (!confirmEmpty) return;
    try {
      const response = await CartService.clearCart();
      setCart(response.data); // Actualiza el estado local
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
      alert("No se pudo vaciar el carrito.");
    }
  };

  // --- 4. ¡HANDLE CHECKOUT ACTUALIZADO! ---
  const handleCheckout = async () => {
    const confirmCheckout = window.confirm("¿Estás seguro de que quieres finalizar esta compra?");
    if (!confirmCheckout) return;

    setIsProcessing(true); // Activa el estado de "Procesando..."
    try {
      // Llama al backend para crear el pedido.
      // El backend se encarga del descuento, puntos y vaciar el carrito.
      const orderResponse = await OrderService.checkout();

      alert('¡Compra realizada con éxito! Has ganado ' + (orderResponse.data.pointsEarned || 0) + ' puntos.');

      // Refresca el estado global del usuario (para actualizar puntos/nivel)
      await refreshUser();
      
      // Refresca el carrito local (ahora estará vacío)
      await fetchCart();

      // Dispara el evento para que el contador del Header se ponga en 0
      window.dispatchEvent(new Event('cartUpdated')); 
      
      // Redirige al perfil para ver los puntos
      navigate('/');

    } catch (error) {
      console.error("Error al finalizar la compra:", error);
      alert("Hubo un error al procesar tu compra: " + (error.response?.data || error.message));
    } finally {
      setIsProcessing(false); // Desactiva el estado de "Procesando..."
    }
  };

  // --- Renderizado ---

  if (isLoading) {
    return (
      <div>
        <Header />
        <Container className="cart-page mt-5 mb-5">
          <h2 className="mb-4">🛒 Cargando tu Carrito...</h2>
        </Container>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div>
        <Header />
        <Container className="cart-page mt-5 mb-5">
          <h2 className="mb-4">🛒 Tu Carrito</h2>
          <p>Tu carrito está vacío. ¡Agrega productos desde el catálogo!</p>
        </Container>
      </div>
    );
  }

  // --- 5. LÓGICA DE PRECIOS Y DESCUENTOS ---
  const originalTotal = cart.total; // Total del backend
  const isDuoc = user && user.userRole === "ROLE_DUOC";
  
  let finalTotal = originalTotal;
  if (isDuoc) {
    finalTotal = originalTotal * 0.80; // Aplica el 20%
  }
  // --- FIN DE LÓGICA DE PRECIOS ---

  return (
    <div>
      <Header />
      <Container className="cart-page mt-5 mb-5">
        <h2 className="mb-4">🛒 Tu Carrito</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => {
              const product = item.product;
              const price = product.price; 
              const subtotal = price * item.quantity;
              return (
                <tr key={product.id}>
                  {/* ... (Tu <td> de Producto está perfecto) ... */}
                  <td className="d-flex align-items-center">
                    <img src={product.imageUrl} alt={product.name} width="60" className="me-3 rounded" />
                    {product.name}
                  </td>
                  {/* ... (Tu <td> de Precio está perfecto) ... */}
                  <td>{price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                  {/* ... (Tu <td> de Cantidad está perfecto) ... */}
                  <td>
                    <div className="d-flex align-items-center justify-content-center">
                      <Button variant="outline-secondary" size="sm" onClick={() => handleUpdateQuantity(product.id, item.quantity - 1)} disabled={isProcessing}>
                        -
                      </Button>
                      <span className="mx-2 quantity-number">{item.quantity}</span>
                      <Button variant="outline-secondary" size="sm" onClick={() => handleUpdateQuantity(product.id, item.quantity + 1)} disabled={isProcessing}>
                        +
                      </Button>
                    </div>
                  </td>
                  {/* ... (Tu <td> de Subtotal está perfecto) ... */}
                  <td>{subtotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                  {/* ... (Tu <td> de Acciones está perfecto) ... */}
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleRemove(product.id)} disabled={isProcessing}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        {/* --- 6. RESUMEN DE COMPRA ACTUALIZADO --- */}
        <div className="cart-total text-end mt-3">
            <p className="cart-subtotal">
                Subtotal: {originalTotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
            </p>

            {/* Muestra el descuento solo si es Duoc */}
            {isDuoc && (
                <p className="duoc-discount">
                    Descuento Duoc (20%): -{(originalTotal - finalTotal).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </p>
            )}

            {/* Muestra el total final */}
            <h4 className="cart-final-total">
                Total a Pagar: {finalTotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
            </h4>
            
            <div className="mt-3">
                <Button variant="danger" className="me-2" onClick={handleEmptyCart} disabled={isProcessing}>
                    Vaciar Carrito
                </Button>
                <Button variant="success" onClick={handleCheckout} disabled={isProcessing}>
                    {/* Cambia el texto si está procesando */}
                    {isProcessing ? 'Procesando Compra...' : 'Finalizar Compra'}
                </Button>
            </div>
        </div>
        {/* --- FIN DEL RESUMEN --- */}
        
      </Container>
    </div>
  );
};

export default CartPage;