import React from 'react';
import StarRating from '../../atoms/StarRating/StarRating';
import ReviewForm from '../../molecules/ReviewForm/ReviewForm';
import './ReviewsSection.css';

const ReviewsSection = ({ product, onSubmitReview }) => {

  return (
    <div className="reviews-section">
      <h2 className="reviews-title">Reseñas y Calificaciones</h2>
      <div className="reviews-list">
        
        {product.reviews.length > 0 ? product.reviews.map(review => (
          <div key={review.id} className="review-item">
            <StarRating rating={review.rating} />
            <p className="review-comment">"{review.comment}"</p>
            <span className="review-author">- {review.author}</span>
          </div>
        )) : <p>Todavía no hay reseñas para este producto. ¡Sé el primero!</p>}
      </div>
      
      <ReviewForm onAddReview={onSubmitReview} />
    </div>
  );
};

export default ReviewsSection;