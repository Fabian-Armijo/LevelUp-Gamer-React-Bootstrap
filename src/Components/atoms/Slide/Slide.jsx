import React from 'react';
import { Link } from 'react-router-dom';
import './Slide.css';

const Slide = ({ product }) => {
  const { image, name, price, description, linkTo } = product;

  return (
    <div className="slide-container">
      <Link to={linkTo} className="slide-link">
        <img src={image} alt={name} className="slide-image" draggable="false" />
        <div className="slide-overlay">
          <h3 className="slide-name">{name}</h3>
          <p className="slide-description">{description}</p>
          <span className="slide-price">{price}</span>
        </div>
      </Link>
    </div>
  );
};

export default Slide;