import React from 'react';
import Header from '../organisms/Header/Header';
import ProductSlider from '../organisms/ProductSlider/ProductSlider';
import ProductCatalog from '../organisms/ProductCatalog/ProductCatalog';
import BlogSection from '../organisms/BlogSection/BlogSection';

const HomePage = () => {
  return (
    <div>
      <Header />
      <main>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Novedades</h1>
        </div>
        <ProductSlider />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Catalogo</h1>
        </div>
        <ProductCatalog />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>noticias</h1>
        </div>
        <BlogSection />
      </main>
    </div>
  );
};

export default HomePage;