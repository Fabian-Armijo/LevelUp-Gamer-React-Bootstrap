import React, { useState, useMemo, useEffect } from 'react'; // --> 1. Importa useEffect
import ProductCard from '../../atoms/ProductCard/ProductCard';
import './ProductCatalog.css';
// import { allProducts } from '../../../data/products'; // --> 2. ELIMINA esta línea
import ProductService from '../../../Services/ProductService'; // --> 3. Importa tu servicio (ajusta la ruta si es necesario)

// Las categorías estáticas están perfectas, las puedes dejar
const categories = [
  'Todos', 'Juegos de Mesa', 'Accesorios', 'Consolas', 'Computadores Gamers', 
  'Sillas Gamers', 'Mouse', 'Mousepad', 'Poleras Personalizadas'
];

const ProductCatalog = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  
  // --> 4. NUEVOS ESTADOS: uno para los productos y otro para saber si están cargando
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Para mostrar un "Cargando..."

  // --> 5. NUEVO HOOK: Esto se ejecuta 1 vez cuando el componente se monta
  useEffect(() => {
    // Llama al método de tu servicio
    ProductService.getAllProducts()
      .then(response => {
        // Cuando el backend responde, guarda los productos en el estado
        setAllProducts(response.data);
        setIsLoading(false); // Deja de cargar
      })
      .catch(error => {
        console.error("¡Error al cargar el catálogo desde el backend!", error);
        setIsLoading(false); // Deja de cargar incluso si hay error
      });
  }, []); // El array vacío [] significa "ejecútate solo una vez"

  // --> 6. Tu 'useMemo' ahora depende de 'allProducts' (el estado)
  const filteredProducts = useMemo(() => {
    if (activeFilter === 'Todos') {
      return allProducts; // 'allProducts' ahora es tu variable de estado
    }
    return allProducts.filter(p => p.category === activeFilter);
  }, [activeFilter, allProducts]); // --> Añade 'allProducts' a las dependencias

  // --> 7. Muestra un mensaje de carga mientras espera la API
  if (isLoading) {
    return (
      <section className="catalog-section">
        <aside className="filter-sidebar">
          <h3 className="filter-title">Categorías</h3>
        </aside>
        <div className="product-grid">
          <p>Cargando productos...</p>
        </div>
      </section>
    );
  }

  // Tu JSX para mostrar los filtros y productos ya estaba perfecto.
  // No necesita ningún cambio, ya que 'filteredProducts' se calcula
  // automáticamente cuando 'allProducts' (del estado) se actualiza.
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