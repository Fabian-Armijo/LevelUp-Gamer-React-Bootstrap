import React from 'react';
import Slider from 'react-slick';
import Slide from '../../atoms/Slide/Slide';
import './ProductSlider.css';

// Datos de ejemplo para los productos
const productsData = [
  {
    id: 1,
    name: 'Cybernetic X Pro',
    price: '$899.99',
    description: 'La nueva generación de consolas con IA integrada.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=2070&auto=format&fit=crop',
    linkTo: '/producto/1',
  },
  {
    id: 2,
    name: 'Astro-Headset V2',
    price: '$149.99',
    description: 'Audio inmersivo para una experiencia de otro nivel.',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256ec346?q=80&w=1974&auto=format&fit=crop',
    linkTo: '/producto/2',
  },
  {
    id: 3,
    name: 'Ratón Quantum',
    price: '$79.99',
    description: 'Precisión y velocidad para el gamer competitivo.',
    image: 'https://images.unsplash.com/photo-1604328993130-1a137a51d45c?q=80&w=1974&auto=format&fit=crop',
    linkTo: '/producto/3',
  },
  {
    id: 4,
    name: 'Silla Gamer Ergo-X',
    price: '$399.99',
    description: 'Comodidad ergonómica para largas sesiones de juego.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1916&auto=format&fit=crop',
    linkTo: '/producto/4',
  },
];

const ProductSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true, // Muestra las flechas
  };

  return (
    <section className="slider-section">
      <Slider {...settings}>
        {productsData.map((product) => (
          <Slide key={product.id} product={product} />
        ))}
      </Slider>
    </section>
  );
};

export default ProductSlider;