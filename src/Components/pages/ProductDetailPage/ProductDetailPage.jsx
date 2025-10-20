// src/Components/pages/ProductDetailPage/ProductDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../organisms/Header/Header';
import { allProducts } from '../../../data/products';
import ReviewsSection from '../../organisms/ReviewsSection/ReviewsSection';
import { Button } from 'react-bootstrap';
import './ProductDetailPage.css';

const isDuocUser = true;

const ProductDetailPage = () => {
  const { productId } = useParams();
  const product = allProducts.find(p => p.id === parseInt(productId));

  if (!product) {
    return (
      <>
        <Header />
        <div className="product-not-found">
          <h2>Producto no encontrado</h2>
          <p>Lo sentimos, el producto que buscas no existe.</p>
        </div>
      </>
    );
  }

  // Función para formatear precio a CLP
  const formatPriceCLP = (value) => {
    if (!value) return 'CLP 0';
    // Eliminar puntos de miles y cualquier símbolo
    const cleaned = String(value).replace(/\./g, '').replace(/[^0-9]/g, '');
    const number = Number(cleaned) || 0;
    return number.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };

  // Precio numérico para cálculos (sin símbolos)
  const numericPrice = Number(String(product.price).replace(/\./g, '').replace(/[^0-9]/g, '')) || 0;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity = Number(existing.quantity || 0) + 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: numericPrice, // Guardamos como número entero en CLP
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.name} se añadió al carrito 🛒`);
  };

  // Puntos LevelUp
  const levelUpPoints = Math.floor(numericPrice / 1000) * 10;

  return (
    <div>
      <Header />
      <main className="product-detail-container">
        <div className="product-main-info">
          <div className="product-image-gallery">
            <img src={product.image} alt={product.name} className="main-product-image" />
          </div>

          <div className="product-details">
            <span className="product-detail-category">{product.category}</span>
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-description">{product.description}</p>
            
            <div className="product-origin">
              <p><strong>Fabricante:</strong> {product.manufacturer}</p>
              <p><strong>Distribuidor:</strong> {product.distributor}</p>
            </div>

            {/* Precio formateado */}
            <p className="product-detail-price">{formatPriceCLP(product.price)}</p>

            {/* Botón Añadir al Carrito */}
            <Button variant="primary" className="add-to-cart-btn" onClick={handleAddToCart}>
              Añadir al Carrito
            </Button>

            {isDuocUser && (
              <div className="levelup-perk mt-3">
                <p>
                  ¡Eres parte de la comunidad DuocUC! Gana <strong>{levelUpPoints} Puntos LevelUp</strong> con esta compra.
                </p>
              </div>
            )}
          </div>
        </div>

        <ReviewsSection product={product} />
      </main>
    </div>
  );
};

export default ProductDetailPage;
