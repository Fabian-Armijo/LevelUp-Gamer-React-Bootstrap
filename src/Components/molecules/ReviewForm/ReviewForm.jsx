import React, { useState } from 'react';
import InteractiveStarRating from '../../atoms/InteractiveStarRating/InteractiveStarRating';
import './ReviewForm.css';

const ReviewForm = ({ onAddReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      setError('Por favor, selecciona una calificación y escribe un comentario.');
      return;
    }

    onAddReview({
      rating,
      comment,
    });

    setRating(0);
    setComment('');
    setError('');
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Escribe tu reseña</h3>
      <div className="form-group">
        <label>Tu calificación:</label>
        <InteractiveStarRating rating={rating} onRatingChange={setRating} />
      </div>
      <div className="form-group">
        <label htmlFor="comment">Tu comentario:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="¿Qué te pareció el producto?"
          rows="4"
        ></textarea>
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="submit-review-btn">Enviar Reseña</button>
    </form>
  );
};

export default ReviewForm;