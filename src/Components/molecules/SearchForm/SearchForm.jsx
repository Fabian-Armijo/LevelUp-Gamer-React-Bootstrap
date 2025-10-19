import React from 'react';
import './SearchForm.css';

const SearchForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para procesar la búsqueda
    console.log('Búsqueda enviada...');
  };

  return (
    <form className="header-search-form" onSubmit={handleSubmit}>
      <input 
        type="search" 
        placeholder="Buscar productos..." 
        className="search-input" 
      />
      <button type="submit" className="search-button">
        {/* Ícono de lupa. Puedes reemplazarlo por un SVG para mejor calidad */}
        🔍
      </button>
    </form>
  );
};

export default SearchForm;