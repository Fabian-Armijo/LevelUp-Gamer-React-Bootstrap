import React, { useEffect, useState } from 'react';
import { Button, Table, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../organisms/Header/Header';
import CartService from '../../Services/CartService'; // Asegúrate que la ruta sea correcta
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState(null); // Almacenará el objeto { items: [], total: ... }
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // --- Carga de Datos ---

   // Función para cargar el carrito desde el backend
   const fetchCart = async () => {
     setIsLoading(true);
     try {
        const response = await CartService.getCart();
        // Asumimos que el backend devuelve un objeto como: { items: [...], total: 50000 }
        setCart(response.data);
     } catch (error) {
        console.error("Error al cargar el carrito:", error);
        // Si el token es inválido (401) o no tiene permisos (403), lo enviamos al login
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
          navigate('/login');
        }
     }
     setIsLoading(false);
   };

   // Cargar el carrito la primera vez que se monta la página
   useEffect(() => {
     fetchCart();
   }, []);

   // --- Handlers (Manejo de acciones) ---

   const handleUpdateQuantity = async (productId, newQuantity) => {
     if (newQuantity < 1) {
        await handleRemove(productId); // Si la cantidad es 0, eliminar
        return;
     }
     try {
        await CartService.updateItem(productId, newQuantity);
        fetchCart(); // Recarga el carrito desde el backend
        window.dispatchEvent(new Event('cartUpdated')); // Actualiza el contador del header
     } catch (error) {
        console.error("Error al actualizar cantidad:", error);
        alert("No se pudo actualizar el producto.");
     }
   };

   const handleRemove = async (productId) => {
     const confirmRemove = window.confirm("¿Estás seguro de que quieres eliminar este producto del carrito?");
     if (!confirmRemove) return;

     try {
        await CartService.removeItem(productId);
        fetchCart(); // Recarga
        window.dispatchEvent(new Event('cartUpdated')); // Actualiza header
     } catch (error) {
        console.error("Error al eliminar item:", error);
        alert("No se pudo eliminar el producto.");
     }
   };

   const handleEmptyCart = async () => {
    // 1. Revisa si hay algo que vaciar
    if (!cart || cart.items.length === 0) return;
    
    // 2. Esta es la línea que faltaba
    const confirmEmpty = window.confirm('¿Estás seguro que quieres vaciar el carrito?');
    
    // 3. Si el usuario cancela, no hagas nada
    if (!confirmEmpty) return;

    // 4. Si el usuario acepta, procede
    try {
      await CartService.clearCart();
      await fetchCart(); // Espera a que se recarguen los datos
      window.dispatchEvent(new Event('cartUpdated')); // Actualiza el header
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
      alert("No se pudo vaciar el carrito.");
    }
  };

  const handleCheckout = async () => {
    alert('Compra finalizada 🎉 (Simulación)');

    try {
      await CartService.clearCart();
      window.dispatchEvent(new Event('cartUpdated'));
      await fetchCart(); // <-- AÑADE AWAIT

    } catch (error) {
      console.error("Error al vaciar el carrito post-compra:", error);
      alert("Tu compra fue exitosa, pero hubo un error al vaciar tu carrito.");
    }
  };

  // --- Renderizado ---

  // 1. Estado de Carga
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

  // 2. Estado Vacío
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

  // 3. Estado con Productos
  // Asumimos que el backend nos envía el total calculado
  const total = cart.total; 

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
               {/*                   Ajustamos el .map para leer 'cart.items'.
                  Asumimos que cada 'item' tiene { product: {...}, quantity: X }
               */}
               {cart.items.map((item) => {
                  const product = item.product; // Objeto producto anidado
                  const price = product.price; // Precio unitario
                  const subtotal = price * item.quantity;

                  return (
                    <tr key={product.id}>
                       <td className="d-flex align-items-center">
                         <img
                            src={product.imageUrl} // Usamos la URL del objeto 'product'
                            alt={product.name}
                            width="60"
                            className="me-3 rounded"
                         />
                         {product.name}
                       </td>
                       <td>
                         {price.toLocaleString('es-CL', {
                            style: 'currency',
                            currency: 'CLP',
                         })}
                       </td>
                       <td>
                         <div className="d-flex align-items-center justify-content-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleUpdateQuantity(product.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="mx-2 quantity-number">{item.quantity}</span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleUpdateQuantity(product.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                         </div>
                       </td>
                       <td>
                         {subtotal.toLocaleString('es-CL', {
                            style: 'currency',
                            currency: 'CLP',
                         })}
                       </td>
                       <td>
                         <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemove(product.id)}
                         >
                            Eliminar
                         </Button>
                       </td>
                    </tr>
                  );
               })}
             </tbody>
          </Table>

          <div className="cart-total text-end mt-3">
             <h4>
               Total:{' '}
               {total.toLocaleString('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
               })}
             </h4>
             <div className="mt-3">
               <Button variant="danger" className="me-2" onClick={handleEmptyCart}>
                  Vaciar Carrito
               </Button>
               <Button variant="success" onClick={handleCheckout}>
                  Finalizar Compra
               </Button>
             </div>
          </div>
        </Container>
     </div>
   );
};

export default CartPage;