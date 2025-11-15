import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../organisms/Header/Header';
import ProductService from '../../../Services/ProductService'; 
import CartService from '../../../Services/CartService';
import ReviewsSection from '../../organisms/ReviewsSection/ReviewsSection';
import { Button } from 'react-bootstrap';
import './ProductDetailPage.css';
import { useAuth } from '../../../context/AuthContext'; // <-- 1. IMPORTA EL "CEREBRO"

// const isDuocUser = true; // <-- 2. BORRA esta línea harcodeada

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // --- 3. OBTÉN EL USUARIO DEL CONTEXTO ---
  // 'user' será 'null' si no está logueado, o el objeto de usuario si lo está
  const { user } = useAuth();

  // useEffect (para cargar el producto) no cambia, está perfecto
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

  // handleReviewSubmit no cambia, está perfecto
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

  // Los 'return' de Carga y Error no cambian, están perfectos
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

  // --- 4. LÓGICA DE PRECIOS Y PUNTOS (AHORA ES DINÁMICA) ---
  const numericPrice = product.price;

  // 'isDuoc' ahora se calcula dinámicamente
  const isDuoc = user && user.userRole === "ROLE_DUOC";

  // Calcula el precio final
  let finalPrice = numericPrice;
  if (isDuoc) {
    finalPrice = numericPrice * 0.80; // Aplica el 20% de descuento
  }

  // Calcula los puntos basados en el precio final
  const levelUpPoints = Math.floor(finalPrice / 1000) * 10;
  // --- FIN DE LA LÓGICA ---


  // handleAddToCart no cambia, está perfecto
  const handleAddToCart = async () => { 
    // ... (tu lógica actual está bien, ya comprueba el token)
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      navigate('/login');
      return;
    }
    try {
      await CartService.addItem({ productId: product.id, quantity: 1 });
      alert(`${product.name} se añadió al carrito 🛒`);
      window.dispatchEvent(new Event('cartUpdated')); 
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      alert("Hubo un error al añadir el producto.");
    }
  };


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

           {/* --- 5. RENDERIZADO DE PRECIO (Corregido) --- */}
            <div className="product-detail-price-container">
              {isDuoc ? (
                // Si es Duoc, muestra ambos precios
                <>
                  <p className="product-detail-price-original">
                    Precio: {numericPrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                  </p>
                  <p className="product-detail-price-duoc">
                    Precio Duoc: {finalPrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                    {/* ¡LA CORRECCIÓN! El 'span' debe estar separado */}
                    <span className="discount-badge">20% OFF</span>
                  </p>
                </>
              ) : (
                // Si no, muestra el precio normal
                <p className="product-detail-price">
                  {numericPrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </p>
              )}
            </div>
            {/* --- FIN DEL CAMBIO DE PRECIO --- */}


            <Button variant="primary" className="add-to-cart-btn" onClick={handleAddToCart}>
              Añadir al Carrito
            </Button>

            {/* --- 6. RENDERIZADO DE PUNTOS (AHORA CONDICIONAL) --- */}
            {/* Ahora solo se muestra si 'isDuoc' es 'true' */}
            {isDuoc && (
              <div className="levelup-perk mt-3">
                <p>
                  ¡Eres parte de la comunidad DuocUC! Gana <strong>{levelUpPoints} Puntos LevelUp</strong> con esta compra.
                </p>
              </div>
            )}
            {/* --- FIN DEL CAMBIO DE PUNTOS --- */}

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