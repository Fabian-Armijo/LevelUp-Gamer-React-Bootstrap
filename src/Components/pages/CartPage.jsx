import React, { useEffect, useState } from 'react';
import { Button, Table, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../organisms/Header/Header';
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleIncrease = (productId) => {
    const updated = cart.map(item =>
      item.id === productId
        ? { ...item, quantity: (Number(item.quantity) || 0) + 1 }
        : item
    );
    updateCart(updated);
  };

  const handleDecrease = (productId) => {
    const updated = cart
      .map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max((Number(item.quantity) || 0) - 1, 1) }
          : item
      )
      .filter(item => item.quantity > 0);
    updateCart(updated);
  };

  const handleRemove = (productId) => {
    const updated = cart.filter(item => item.id !== productId);
    updateCart(updated);
  };

  const handleEmptyCart = () => {
    if (cart.length === 0) return;
    const confirmEmpty = window.confirm('¿Estás seguro que quieres vaciar el carrito?');
    if (confirmEmpty) {
      updateCart([]);
    }
  };

  const parsePrice = (value) => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    const cleaned = String(value).replace(/\./g, '').replace(/[^0-9]/g, '');
    return Number(cleaned) || 0;
  };

  const total = cart.reduce((acc, item) => {
    return acc + parsePrice(item.price) * (Number(item.quantity) || 0);
  }, 0);

  const handleCheckout = () => {
    alert('Compra finalizada 🎉');
    updateCart([]);
    navigate('/');
  };

  return (
    <div>
      <Header />
      <Container className="cart-page mt-5 mb-5">
        <h2 className="mb-4">🛒 Tu Carrito</h2>

        {cart.length === 0 ? (
          <p>Tu carrito está vacío. ¡Agrega productos desde el catálogo!</p>
        ) : (
          <>
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
                {cart.map((item) => {
                  const price = parsePrice(item.price);
                  const subtotal = price * (Number(item.quantity) || 0);

                  return (
                    <tr key={item.id}>
                      <td className="d-flex align-items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          width="60"
                          className="me-3 rounded"
                        />
                        {item.name}
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
                            onClick={() => handleDecrease(item.id)}
                          >
                            -
                          </Button>
                          <span className="mx-2 quantity-number">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleIncrease(item.id)}
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
                          onClick={() => handleRemove(item.id)}
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
          </>
        )}
      </Container>
    </div>
  );
};

export default CartPage;


