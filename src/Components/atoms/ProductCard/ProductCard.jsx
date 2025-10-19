import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

// A simple component for social sharing
const SocialShare = ({ productLink }) => {
  const encodedLink = encodeURIComponent(productLink);
  
  return (
    <div className="social-share-buttons">
      {/* Example for sharing on Facebook */}
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`} target="_blank" rel="noopener noreferrer">FB</a>
      {/* Example for sharing on Twitter */}
      <a href={`https://twitter.com/intent/tweet?url=${encodedLink}&text=Mira este producto!`} target="_blank" rel="noopener noreferrer">TW</a>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { id, name, image, price, category } = product;
  const productUrl = `${window.location.origin}/producto/${id}`;

  return (
    <div className="product-card">
      <Link to={`/producto/${id}`} className="product-image-link">
        <img src={image} alt={name} className="product-image" />
      </Link>
      <div className="product-info">
        <span className="product-category">{category}</span>
        <h4 className="product-name">{name}</h4>
        <div className="product-footer">
          <p className="product-price">{price}</p>
          <SocialShare productLink={productUrl} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;