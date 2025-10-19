import React, { useState, useMemo } from 'react';
import ProductCard from '../../atoms/ProductCard/ProductCard';
import './ProductCatalog.css';

// --- Dummy Product Data ---
const allProducts = [
  { id: 1, name: 'Catan', price: '$29.990 CLP', category: 'Juegos de Mesa', image: 'https://devirinvestments.s3.eu-west-1.amazonaws.com/img/catalog/product/8436017220100-1200-face3d.jpg' },
  { id: 2, name: 'Carcassonne', price: '$24.990 CLP', category: 'Juegos de Mesa', image: 'https://devirinvestments.s3.eu-west-1.amazonaws.com/img/catalog/product/8436017222593-1200-frontflat-copy.jpg' },
  { id: 3, name: 'Controlador Inalámbrico Xbox Series X', price: '$59.990 CLP', category: 'Accesorios', image: 'https://prophonechile.cl/wp-content/uploads/2023/11/purpleeee.png' },
  { id: 4, name: 'Auriculares Gamer HyperX Cloud II', price: '$79.990 CLP', category: 'Accesorios', image: 'https://row.hyperx.com/cdn/shop/files/hyperx_cloud_ii_red_1_main.jpg?v=1737720332' },
  { id: 5, name: 'PlayStation 5', price: '$549.990 CLP', category: 'Consolas', image: 'https://static.pcfactory.cl/imagenes/53428-3.jpg' },
  { id: 6, name: 'PC Gamer ASUS ROG Strix', price: '$1.299.990 CLP', category: 'Computadores Gamers', image: 'https://www.asus.com/media/Odin/Websites/global/Series/52.png' },
  { id: 7, name: 'Silla Gamer Secretlab Titan', price: '$349.990 CLP', category: 'Sillas Gamers', image: 'https://images.secretlab.co/turntable/tr:n-w_750/R22PU-Stealth_02.jpg' },
  { id: 8, name: 'Mouse Gamer Logitech G502 HERO', price: '$49.990 CLP', category: 'Mouse', image: 'https://media.spdigital.cl/thumbnails/products/snbujg5__29f7dd61_thumbnail_4096.jpg' },
  { id: 9, name: 'Mousepad Razer Goliathus Chroma', price: '$29.990 CLP', category: 'Mousepad', image: 'https://cl-cenco-pim-resizer.ecomm.cencosud.com/unsafe/adaptive-fit-in/3840x0/filters:quality(75)/prd-cl/product-medias/bb228f59-3aa1-4d9e-bbf4-b5f71bc89ca0/MK8YWFQA7I/MK8YWFQA7I-1/1737041557738-MK8YWFQA7I-1-1.jpg'},
  { id: 10, name: 'Polera Gamer Personalizada "Level-Up" ', price: '$14.990 CLP', category: 'Poleras Personalizadas', image: './polera/polera.png' }
];

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