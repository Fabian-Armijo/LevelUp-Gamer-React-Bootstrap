import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../organisms/Header/Header';
import ProductService from '../../../Services/ProductService'; 
import ReviewsSection from '../../organisms/ReviewsSection/ReviewsSection';
import { Button } from 'react-bootstrap';
import './ProductDetailPage.css';

const isDuocUser = true;

const ProductDetailPage = () => {
  const { productId } = useParams();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    
    ProductService.getProductById(productId)
      .then(response => {
        setProduct(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar el producto:", err);
        setError(true); 
        setIsLoading(false);
      });
  }, [productId]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await ProductService.addReviewToProduct(productId, reviewData);
      
      const newReview = response.data; 
      
      setProduct(CurrentProduct => ({
        ...CurrentProduct,
        reviews: [...CurrentProduct.reviews, newReview] 
      }));

    } catch (err) {
      console.error("Error al enviar la reseña:", err);
      alert("Hubo un error al enviar tu reseña. Inténtalo de nuevo.");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="product-not-found">
          <h2>Cargando producto...</h2>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="product-not-found">
          <h2>Producto no encontrado</h2>
          <p>Lo sentimos, el producto que buscas no existe o no se pudo cargar.</p>
        </div>
      </>
    );
  }

  const numericPrice = product.price;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity = Number(existing.quantity || 0) + 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        image: product.imageUrl,
        price: numericPrice, 
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.name} se añadió al carrito 🛒`);
  };

  const levelUpPoints = Math.floor(numericPrice / 1000) * 10;

  return (
    <div>
      <Header />
      <main className="product-detail-container">
        <div className="product-main-info">
          <div className="product-image-gallery">
            <img src={product.imageUrl} alt={product.name} className="main-product-image" />
          </div>

          <div className="product-details">
            <span className="product-detail-category">{product.category}</span>
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-description">{product.description}</p>
            
            <div className="product-origin">
              <p><strong>Fabricante:</strong> {product.manufacturer}</p>
              <p><strong>Distribuidor:</strong> {product.distributor}</p>
            </div>

            <p className="product-detail-price">
              {numericPrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
            </p>

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

        <ReviewsSection 
          product={product} 
          onSubmitReview={handleReviewSubmit} 
        />
      </main>
    </div>
  );
};

export default ProductDetailPage;
