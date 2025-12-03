import React, { useState } from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import './LoginForm.css';
import AuthService from '../../../services/AuthService';
import { useAuth } from '../../../context/AuthContext'; 

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); 
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = { username: '', password: '' };
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es obligatorio.';
      formIsValid = false;
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
      formIsValid = false;
    }
    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const credentials = {
      username: formData.username,
      password: formData.password
    };

    try {
      const response = await AuthService.login(credentials);
      const token = response.data.token;
      await login(token);
      onLoginSuccess();

    } catch (err) {
      console.error("Error en el proceso de login:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setServerError("Nombre de usuario o contraseña incorrectos.");
      } else {
          setServerError("Error al conectar con el servidor. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Nombre de Usuario"
          type="text"
          name="username"
          placeholder="Tu nombre de usuario"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className="error-message">{errors.username}</p>}

        <FormField
          label="Contraseña"
          type="password"
          name="password"
          placeholder="********"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        {serverError && <p className="error-message server-error">{serverError}</p>}

        <a href="#" className="forgot-password-link">
          ¿Olvidaste tu contraseña?
        </a>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;