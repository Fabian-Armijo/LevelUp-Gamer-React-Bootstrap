import React, { useState } from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.email && formData.password) {
      console.log('Iniciando sesión con:', formData);
      onLoginSuccess();
    } else {
      setErrorMessage('Por favor, completa todos los campos.');
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Correo Electrónico"
          type="email"
          name="email"
          placeholder="tucorreo@ejemplo.com"
          value={formData.email}
          onChange={handleChange}
        />
        <FormField
          label="Contraseña"
          type="password"
          name="password"
          placeholder="********"
          value={formData.password}
          onChange={handleChange}
        />
        <a href="#" className="forgot-password-link">
          ¿Olvidaste tu contraseña?
        </a>
        <Button type="submit">Entrar</Button>
      </form>
      {errorMessage && <p className="form-message error-message">{errorMessage}</p>}
    </div>
  );
};

export default LoginForm;