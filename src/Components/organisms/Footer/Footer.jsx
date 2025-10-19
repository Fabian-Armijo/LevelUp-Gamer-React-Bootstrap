import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../atoms/Logo/Logo';
import './Footer.css';

const Footer = () => {
  const whatsappNumber = '+5612345678';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola, necesito ayuda del servicio técnico.`;

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <Logo />
          <p className="address">
            Av. Vicuña Mackenna 1234<br />
            Melipilla, Chile
          </p>
        </div>
        <div className="footer-section support">
          <h4 className="footer-title">Soporte Técnico</h4>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-button">
            Contactar por WhatsApp
          </a>
          <p className="support-text">¿Problemas con tu equipo? ¡Te ayudamos!</p>
        </div>
        <div className="footer-section social">
          <h4 className="footer-title">Síguenos</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">FB</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter/X">X</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube">YT</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">IG</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 LevelUp-Gamer. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;