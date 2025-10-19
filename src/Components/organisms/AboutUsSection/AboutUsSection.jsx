import React from 'react';
import './AboutUsSection.css';
import aboutUsImage from '../../../assets/imagenes/logo/logo.png'; 

const AboutUsSection = () => {
  return (
    <section className="about-us-section">
      <div className="about-us-content">
        <div className="about-us-text">
          <h2 className="section-title">Nuestra Pasión, Tu Juego</h2>
          <p className="about-us-paragraph">
            <strong>LevelUp-Gamer</strong> nació de una idea simple: crear un espacio por y para gamers en Chile. No somos solo una tienda; somos un punto de encuentro, una comunidad donde la pasión por los videojuegos nos une.
          </p>
          <p className="about-us-paragraph">
            Cada producto que seleccionamos, desde un mouse de alta precisión hasta un juego de mesa para compartir con amigos, ha sido elegido pensando en la calidad y en la experiencia que te brindará. Creemos en la autenticidad y trabajamos directamente con los mejores fabricantes y distribuidores para asegurarnos de que solo recibas lo mejor.
          </p>
          <p className="about-us-paragraph">
            Nuestra misión es potenciar tu experiencia de juego. Ya sea que busques mejorar tu setup, descubrir nuevos títulos o participar en eventos, en LevelUp-Gamer encontrarás el apoyo y los productos que necesitas para llevar tu pasión al siguiente nivel.
          </p>
        </div>
        <div className="about-us-image-container">
          <img src={aboutUsImage} alt="Comunidad Gamer" className="about-us-image" />
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;