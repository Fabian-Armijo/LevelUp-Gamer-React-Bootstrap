import React from 'react';
import Slider from 'react-slick';
import Slide from '../../atoms/Slide/Slide';
import './ProductSlider.css';

const productsData = [
  {
    id: 1,
    name: 'PlayStation 5',
    price: '$549.990 CLP',
    description: 'La nueva generación de consolas.',
    image: 'https://static2.pisapapeles.net/uploads/2024/09/GXH7fzoXIAAqLGh.jpeg',
    linkTo: '/producto/1',
  },
  {
    id: 2,
    name: 'Auriculares Gamer HyperX Cloud II',
    price: '$79.990 CLP',
    description: 'Audio inmersivo para una experiencia de otro nivel.',
    image: 'https://cdn.shopify.com/s/files/1/0477/6368/5540/files/12.png?v=1648130543',
    linkTo: '/producto/2',
  },
  {
    id: 3,
    name: 'Mouse Gamer Logitech G502 HERO',
    price: '$49.990 CLP',
    description: 'Precisión y velocidad para el gamer competitivo.',
    image: 'https://jasaltec.cl/wp-content/uploads/2022/01/Screenshot_7-4.jpg',
    linkTo: '/producto/3',
  },
  {
    id: 4,
    name: 'Silla Gamer Secretlab Titan',
    price: '$349.990 CLP',
    description: 'Comodidad ergonómica para largas sesiones de juego.',
    image: 'https://images.secretlab.co/subimage/tr:n-display_gallery/M07-E24PU-STELH1R_Hero.jpg',
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
    arrows: true,
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