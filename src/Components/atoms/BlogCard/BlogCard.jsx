import React from 'react';
import { Link } from 'react-router-dom';
import './BlogCard.css';

const BlogCard = ({ post }) => {
  const { id, title, author, date, image, excerpt } = post;

  return (
    <div className="blog-card">
      <Link to={`/blog/${id}`} className="blog-card-link">
        <div className="blog-card-image-container">
          <img src={image} alt={title} className="blog-card-image" />
        </div>
        <div className="blog-card-content">
          <h3 className="blog-card-title">{title}</h3>
          <p className="blog-card-excerpt">{excerpt}</p>
          <div className="blog-card-footer">
            <span className="blog-card-author">{author}</span>
            <span className="blog-card-date">{date}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;