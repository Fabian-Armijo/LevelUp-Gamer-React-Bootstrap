// src/Components/pages/ProductDetailPage/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react'; // --> 1. Importa useState y useEffect
import { useParams } from 'react-router-dom';
import Header from '../../organisms/Header/Header';
// import { allProducts } from '../../../data/products'; // --> 2. ELIMINA la data local
import ProductService from '../../../Services/ProductService'; 
import ReviewsSection from '../../organisms/ReviewsSection/ReviewsSection';
import { Button } from 'react-bootstrap';
import './ProductDetailPage.css';

const isDuocUser = true; // Asumimos que esto sigue bien

const ProductDetailPage = () => {
  const { productId } = useParams();
  
  // --> 4. CREA ESTADOS para el producto, la carga y el error
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // --> 5. AGREGA useEffect para cargar los datos del backend
  useEffect(() => {
    // Resetea los estados por si el usuario cambia de un producto a otro
    setIsLoading(true);
    setError(false);
    
    ProductService.getProductById(productId)
      .then(response => {
        setProduct(response.data); // Guarda el producto del backend
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar el producto:", err);
        setError(true); // Activa el estado de error
        setIsLoading(false);
      });
  }, [productId]); // Se ejecuta cada vez que el 'productId' de la URL cambia

  // --> 6. NUEVA FUNCIÓN para manejar el envío de reseñas
  const handleReviewSubmit = async (reviewData) => {
    try {
      // Llama al servicio con el ID del producto y los datos de la reseña
      const response = await ProductService.addReviewToProduct(productId, reviewData);
      
      // ¡Éxito!
      const newReview = response.data; // La reseña nueva (con su ID)
      
      // Actualiza el estado del producto para mostrar la nueva reseña AL INSTANTE
      setProduct(CurrentProduct => ({
        ...CurrentProduct,
        reviews: [...CurrentProduct.reviews, newReview] // Añade la nueva reseña al array
      }));

    } catch (err) {
      console.error("Error al enviar la reseña:", err);
      alert("Hubo un error al enviar tu reseña. Inténtalo de nuevo.");
    }
  };

  // --> 7. MOSTRAR ESTADO DE CARGA
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

  // --> 8. MOSTRAR ERROR (Tu lógica de "No encontrado" ahora usa el estado 'error')
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

  // --> 9. AJUSTES A LA LÓGICA DE PRECIO
  // 'product.price' ahora es un NÚMERO (ej: 29990), tu lógica anterior se simplifica
  const numericPrice = product.price; // ¡Mucho más simple!

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity = Number(existing.quantity || 0) + 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        image: product.imageUrl, // --> 10. CAMBIO: usa imageUrl
        price: numericPrice, 
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.name} se añadió al carrito 🛒`);
  };

  // Esta lógica ahora funciona perfecto con 'numericPrice'
  const levelUpPoints = Math.floor(numericPrice / 1000) * 10;

  return (
    <div>
      <Header />
      <main className="product-detail-container">
        <div className="product-main-info">
          <div className="product-image-gallery">
            {/* --> 11. CAMBIO: usa imageUrl */}
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

            {/* --> 12. CAMBIO: Formato de precio simplificado */}
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

        {/* --> 13. CAMBIO: Pasa la nueva función al componente de reseñas */}
        <ReviewsSection 
          product={product} 
          onSubmitReview={handleReviewSubmit} 
        />
      </main>
    </div>
  );
};

export default ProductDetailPage;
