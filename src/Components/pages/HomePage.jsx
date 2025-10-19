import React from 'react';
import Header from '../organisms/Header/Header';
import ProductSlider from '../organisms/ProductSlider/ProductSlider';
import ProductCatalog from '../organisms/ProductCatalog/ProductCatalog';

const HomePage = () => {
  return (
    <div>
      <Header />
      <main>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Novedades</h1>
        </div>
        <ProductSlider />
        <ProductCatalog />
      </main>
    </div>
  );
};

export default HomePage;