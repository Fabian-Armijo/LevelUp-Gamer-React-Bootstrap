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
        <section id="inicio">
          <ProductSlider />
        </section>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Catalogo</h1>
        </div>
        <section id="catalogo">
          <ProductCatalog />
        </section>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>noticias</h1>
        </div>
        <section id="blog">
          <BlogSection />
        </section>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Eventos</h1>
        </div>
        <section id="eventos">
          <EventsMapSection />
        </section>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Acerca de nosotros...</h1>
        </div>
        <section id="acerca-de">
          <AboutUsSection />
        </section>
      </main>
    </div>
  );
};

export default HomePage;