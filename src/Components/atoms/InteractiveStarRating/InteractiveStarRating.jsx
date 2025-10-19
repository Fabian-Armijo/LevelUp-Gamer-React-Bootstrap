import React, { useState } from 'react';
import './InteractiveStarRating.css';

const InteractiveStarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="star-rating interactive">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={ratingValue}
            className={ratingValue <= (hoverRating || rating) ? "on" : "off"}
            onClick={() => onRatingChange(ratingValue)}
            onMouseEnter={() => setHoverRating(ratingValue)}
            onMouseLeave={() => setHoverRating(0)}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default InteractiveStarRating;