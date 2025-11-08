import React from 'react'; // --> 1. Ya no necesitas 'useState'
import StarRating from '../../atoms/StarRating/StarRating';
import ReviewForm from '../../molecules/ReviewForm/ReviewForm';
import './ReviewsSection.css';

// --> 2. Acepta la nueva prop 'onSubmitReview'
const ReviewsSection = ({ product, onSubmitReview }) => {
  
  // --> 3. ELIMINA el estado local de 'reviews'
  // const [reviews, setReviews] = useState(product.reviews);

  // --> 4. ELIMINA el manejador local. Ya no lo necesitamos aquí.
  // const handleAddReview = (newReview) => {
  //   setReviews([...reviews, { id: Date.now(), ...newReview }]);
  // };

  return (
    <div className="reviews-section">
      <h2 className="reviews-title">Reseñas y Calificaciones</h2>
      <div className="reviews-list">
        
        {/* --> 5. Lee directamente de 'product.reviews' (de las props) */}
        {product.reviews.length > 0 ? product.reviews.map(review => (
          <div key={review.id} className="review-item">
            <StarRating rating={review.rating} />
            <p className="review-comment">"{review.comment}"</p>
            <span className="review-author">- {review.author}</span>
          </div>
        // --> 6. Lee directamente de 'product.reviews' aquí también
        )) : <p>Todavía no hay reseñas para este producto. ¡Sé el primero!</p>}
      </div>
      
      {/* --> 7. Pasa la función 'onSubmitReview' al formulario
           (Asumo que ReviewForm llama a 'onAddReview' cuando se envía) */}
      <ReviewForm onAddReview={onSubmitReview} />
    </div>
  );
};

export default ReviewsSection;