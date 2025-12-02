import React, { useEffect, useState } from 'react';
import { Button, Table, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../organisms/Header/Header';
import CartService from '../../services/CartService';
import OrderService from '../../services/OrderService';
import { useAuth } from '../../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); 
  const navigate = useNavigate();

  const { user, refreshUser } = useAuth(); 

  const fetchCart = async () => {
    try {
      const response = await CartService.getCart();
      setCart(response.data);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        logout(); 
        navigate('/login');
      }
    }
    setIsLoading(false); 
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await handleRemove(productId);
      return;
    }
    try {
      const response = await CartService.updateItem(productId, newQuantity);
      setCart(response.data); 
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
      setCart(response.data); 
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
      setCart(response.data); 
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
      alert("No se pudo vaciar el carrito.");
    }
  };

  const handleCheckout = async () => {
    const confirmCheckout = window.confirm("¿Estás seguro de que quieres finalizar esta compra?");
    if (!confirmCheckout) return;

    setIsProcessing(true); 
    try {
      const orderResponse = await OrderService.checkout();

      alert('¡Compra realizada con éxito! Has ganado ' + (orderResponse.data.pointsEarned || 0) + ' puntos.');

      await refreshUser();
      
      await fetchCart();

      window.dispatchEvent(new Event('cartUpdated')); 
      
      navigate('/');

    } catch (error) {
      console.error("Error al finalizar la compra:", error);
      alert("Hubo un error al procesar tu compra: " + (error.response?.data || error.message));
    } finally {
      setIsProcessing(false); 
    }
  };

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

  const originalTotal = cart.total;
  const isDuoc = user && user.userRole === "ROLE_DUOC";
  
  let finalTotal = originalTotal;
  if (isDuoc) {
    finalTotal = originalTotal * 0.80;
  }

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
                  <td className="d-flex align-items-center">
                    <img src={product.imageUrl} alt={product.name} width="60" className="me-3 rounded" />
                    {product.name}
                  </td>
                  <td>{price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
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
                  <td>{subtotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
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

        <div className="cart-total text-end mt-3">
            <p className="cart-subtotal">
                Subtotal: {originalTotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
            </p>

            {isDuoc && (
                <p className="duoc-discount">
                    Descuento Duoc (20%): -{(originalTotal - finalTotal).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </p>
            )}

            <h4 className="cart-final-total">
                Total a Pagar: {finalTotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
            </h4>
            
            <div className="mt-3">
                <Button variant="danger" className="me-2" onClick={handleEmptyCart} disabled={isProcessing}>
                    Vaciar Carrito
                </Button>
                <Button variant="success" onClick={handleCheckout} disabled={isProcessing}>
                    {isProcessing ? 'Procesando Compra...' : 'Finalizar Compra'}
                </Button>
            </div>
        </div>
        
      </Container>
    </div>
  );
};

export default CartPage;