import React from 'react';
import { Link } from 'react-router-dom';
import siteLogo from '../../../assets/imagenes/logo/logo.png';
import './Logo.css';

const Logo = () => {
  return (
    <Link to="/" className="logo-container">
      <img src={siteLogo} alt="LevelUp-Gamer Logo" className="logo-img" />
      <span className="logo-text">LevelUp-Gamer</span>
    </Link>
  );
};

export default Logo;