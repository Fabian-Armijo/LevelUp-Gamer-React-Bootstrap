import React, { useState, useMemo } from 'react';
import ProductCard from '../../atoms/ProductCard/ProductCard';
import './ProductCatalog.css';
import { allProducts } from '../../../data/products';



const categories = [
  'Todos', 'Juegos de Mesa', 'Accesorios', 'Consolas', 'Computadores Gamers', 
  'Sillas Gamers', 'Mouse', 'Mousepad', 'Poleras Personalizadas'
];

const ProductCatalog = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'Todos') {
      return allProducts;
    }
    return allProducts.filter(p => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="catalog-section">
      <aside className="filter-sidebar">
        <h3 className="filter-title">Categorías</h3>
        <ul>
          {categories.map(category => (
            <li key={category}>
              <button 
                className={activeFilter === category ? 'active' : ''}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="product-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductCatalog;