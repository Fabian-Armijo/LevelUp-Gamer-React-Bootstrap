import React from 'react';
import Header from '../organisms/Header/Header';
import ProductSlider from '../organisms/ProductSlider/ProductSlider'; // <-- Importa el slider

const HomePage = () => {
  return (
    <div>
      <Header />
      <main>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Novedades</h1>
        </div>
        <ProductSlider />
      </main>
    </div>
  );
};

export default HomePage;