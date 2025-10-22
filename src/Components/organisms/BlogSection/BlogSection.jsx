import React from 'react';
import BlogCard from '../../atoms/BlogCard/BlogCard';
import './BlogSection.css';

const blogPosts = [
  { 
    id: 1, 
    title: 'Guía Definitiva: Cómo Limpiar tu PC Gamer sin Dañarlo',
    author: 'Equipo LevelUp', 
    date: '18 Oct, 2025',
    image: 'https://i.blogs.es/0d48a7/limpiar/1366_2000.jpeg',
    excerpt: 'Mantener tu PC limpio es crucial para su rendimiento. Te mostramos los pasos y herramientas necesarias para hacerlo de forma segura y eficiente.'
  },
  { 
    id: 2, 
    title: 'Los 5 Lanzamientos Más Esperados para Finales de 2025',
    author: 'Ana Gamers', 
    date: '15 Oct, 2025',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
    excerpt: 'Desde secuelas épicas hasta nuevas IPs que prometen revolucionar el mercado. Aquí te contamos cuáles son los juegos que no puedes perder de vista.'
  },
  { 
    id: 3, 
    title: '¿Vale la Pena un Monitor Curvo? Pros y Contras',
    author: 'Carlos Tech', 
    date: '12 Oct, 2025',
    image: 'https://img.pccomponentes.com/pcblog/5351/ventajas-monitores-curvos.jpg',
    excerpt: 'Analizamos la inmersión, el campo de visión y el impacto en el rendimiento para ayudarte a decidir si un monitor curvo es la elección correcta para tu setup.'
  }
];

const BlogSection = () => {
  return (
    <section className="blog-section">
      <h2 className="section-title">Novedades y Guías</h2>
      <div className="blog-grid">
        {blogPosts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      <div className="section-call-to-action">
        <button className="cta-button">Ver Todas las Publicaciones</button>
      </div>
    </section>
  );
};

export default BlogSection;