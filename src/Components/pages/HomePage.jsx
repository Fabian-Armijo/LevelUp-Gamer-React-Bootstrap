import React from 'react';
import Header from '../organisms/Header/Header';
import ProductSlider from '../organisms/ProductSlider/ProductSlider';
import ProductCatalog from '../organisms/ProductCatalog/ProductCatalog';
import BlogSection from '../organisms/BlogSection/BlogSection';
import EventsMapSection from '../organisms/EventsMapSection/EventsMapSection';
import AboutUsSection from '../organisms/AboutUsSection/AboutUsSection';

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
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Eventos</h1>
        </div>
        <EventsMapSection />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Acerca de nosotros...</h1>
        </div>
        <AboutUsSection />
      </main>
    </div>
  );
};

export default HomePage;