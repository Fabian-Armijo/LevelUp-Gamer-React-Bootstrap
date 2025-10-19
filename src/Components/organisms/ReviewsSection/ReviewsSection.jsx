import React, { useState } from 'react';
import StarRating from '../../atoms/StarRating/StarRating';
import ReviewForm from '../../molecules/ReviewForm/ReviewForm';
import './ReviewsSection.css';

const ReviewsSection = ({ product }) => {
  const [reviews, setReviews] = useState(product.reviews);

  const handleAddReview = (newReview) => {
    setReviews([...reviews, { id: Date.now(), ...newReview }]);
  };

  return (
    <div className="reviews-section">
      <h2 className="reviews-title">Reseñas y Calificaciones</h2>
      <div className="reviews-list">
        {reviews.length > 0 ? reviews.map(review => (
          <div key={review.id} className="review-item">
            <StarRating rating={review.rating} />
            <p className="review-comment">"{review.comment}"</p>
            <span className="review-author">- {review.author}</span>
          </div>
        )) : <p>Todavía no hay reseñas para este producto. ¡Sé el primero!</p>}
      </div>
      <ReviewForm onAddReview={handleAddReview} />
    </div>
  );
};

export default ReviewsSection;