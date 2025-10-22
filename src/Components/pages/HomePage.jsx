import React, { useEffect } from 'react';
import { scroller } from 'react-scroll';
import Header from '../organisms/Header/Header';
import ProductSlider from '../organisms/ProductSlider/ProductSlider';
import ProductCatalog from '../organisms/ProductCatalog/ProductCatalog';
import BlogSection from '../organisms/BlogSection/BlogSection';
import EventsMapSection from '../organisms/EventsMapSection/EventsMapSection';
import AboutUsSection from '../organisms/AboutUsSection/AboutUsSection';

const HomePage = () => {
  // ✅ Escucha el evento personalizado y hace scroll a la sección correspondiente
  useEffect(() => {
    const handleScrollToSection = (e) => {
      const section = e.detail;
      scroller.scrollTo(section, {
        smooth: true,
        offset: -80, // ajusta según el alto del header
        duration: 500,
      });
    };

    window.addEventListener('scrollToSection', handleScrollToSection);
    return () => window.removeEventListener('scrollToSection', handleScrollToSection);
  }, []);

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
          <h1>Catálogo</h1>
        </div>
        <section id="catalogo">
          <ProductCatalog />
        </section>

        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Noticias</h1>
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
