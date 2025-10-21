import React, { useState } from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    nombre: '',
    email: '',
    password: '',
  });

  const [duocMessage, setDuocMessage] = useState(''); // mensaje especial para correos duoc

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });

    // Si está escribiendo el email, verificamos el dominio
    if (name === 'email') {
      if (value.endsWith('@duocuc.cl')) {
        setDuocMessage('✨ Eres parte de la comunidad Duoc UC y tienes acceso a los puntos duocUC!');
      } else {
        setDuocMessage('');
      }
    }
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formIsValid = true;
    const newErrors = { nombre: '', email: '', password: '' };

    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es obligatorio.';
      formIsValid = false;
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 letras.';
      formIsValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'El correo es obligatorio.';
      formIsValid = false;
    } else if (!validarEmail(formData.email)) {
      newErrors.email = 'El correo debe tener un formato válido.';
      formIsValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
      formIsValid = false;
    } else if (formData.password.length < 6 || formData.password.length > 12) {
      newErrors.password = 'La contraseña debe tener entre 6 y 12 caracteres.';
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      console.log('Iniciando sesión con:', formData);
      onLoginSuccess();
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Campo Nombre */}
        <FormField
          label="Nombre"
          type="text"
          name="nombre"
          placeholder="Tu nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
        {errors.nombre && <p className="error-message">{errors.nombre}</p>}

        {/* Campo Correo */}
        <FormField
          label="Correo Electrónico"
          type="email"
          name="email"
          placeholder="tucorreo@ejemplo.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
        {duocMessage && <p className="success-message">{duocMessage}</p>}

        {/* Campo Contraseña */}
        <FormField
          label="Contraseña"
          type="password"
          name="password"
          placeholder="********"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <a href="#" className="forgot-password-link">
          ¿Olvidaste tu contraseña?
        </a>

        <Button type="submit">Entrar</Button>
      </form>
    </div>
  );
};

export default LoginForm;

