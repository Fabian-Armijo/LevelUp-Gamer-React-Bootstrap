// src/pages/HomePage.jsx
import React from 'react';
import Header from '../organisms/Header/Header';

const HomePage = () => {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px', minHeight: '100vh', textAlign: 'center' }}>
        <h1>Bienvenido a LevelUp-Gamer</h1>
        <p>Aquí irá el resto de tu increíble página.</p>
      </main>
    </div>
  );
};

export default HomePage;