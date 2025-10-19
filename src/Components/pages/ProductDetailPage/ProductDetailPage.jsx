// src/pages/ProductDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../organisms/Header/Header';
import { allProducts } from '../../../data/products';
import ReviewsSection from '../../organisms/ReviewsSection/ReviewsSection'; 
import './ProductDetailPage.css';

// Simulación de un usuario logueado con correo de Duoc
const isDuocUser = true; // Cambia esto a `false` para ver el cambio

const ProductDetailPage = () => {
  const { productId } = useParams(); // Obtiene el ID del producto desde la URL
  const product = allProducts.find(p => p.id === parseInt(productId));

  // Manejo por si el producto no se encuentra
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

  return (
    <div>
      <Header />
      <main className="product-detail-container">
        {/* --- Sección de Información Principal --- */}
        <div className="product-main-info">
          <div className="product-image-gallery">
            <img src={product.image} alt={product.name} className="main-product-image" />
          </div>
          <div className="product-details">
            <span className="product-detail-category">{product.category}</span>
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-description">{product.description}</p>
            
            {/* --- Origen de Productos --- */}
            <div className="product-origin">
              <p><strong>Fabricante:</strong> {product.manufacturer}</p>
              <p><strong>Distribuidor:</strong> {product.distributor}</p>
            </div>

            <p className="product-detail-price">{product.price}</p>
            <button className="add-to-cart-btn">Añadir al Carrito</button>

            {/* --- Sistema de Puntos LevelUp --- */}
            {isDuocUser && (
              <div className="levelup-perk">
                <p>¡Eres parte de la comunidad DuocUC! Gana <strong>{product.price.length * 10} Puntos LevelUp</strong> con esta compra.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- Sección de Reseñas --- */}
        <ReviewsSection product={product} />
      </main>
    </div>
  );
};

export default ProductDetailPage;