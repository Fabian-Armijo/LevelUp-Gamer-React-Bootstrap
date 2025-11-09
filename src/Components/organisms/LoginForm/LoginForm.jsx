import React, { useState } from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import './LoginForm.css';
import AuthService from '../../../Services/AuthService';
import { useNavigate } from 'react-router-dom'; // --> 2. Importa useNavigate

const LoginForm = ({ onLoginSuccess }) => {
  // --> 3. CAMBIA el estado para que coincida con el backend
  const [formData, setFormData] = useState({
    username: '', // Cambiado
    password: '',
  });

  // --> 4. SIMPLIFICA los errores
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  
  // --> 5. AÑADE estados para el servidor
  const [serverError, setServerError] = useState(null); // Para "clave incorrecta"
  const [isLoading, setIsLoading] = useState(false);

  // El 'duocMessage' ya no es relevante aquí, se ha quitado.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Limpia el error de frontend al escribir
  };

  // Validación de frontend (simple)
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

  // --> 6. REESCRIBE handleSubmit para llamar al backend
  const handleSubmit = async (e) => { // La hacemos 'async'
    e.preventDefault();
    setServerError(null); // Limpia errores del servidor

    // 1. Validar formulario
    if (!validateForm()) {
      return;
    }

    // 2. Activar la carga
    setIsLoading(true);

    // 3. Preparar credenciales
    const credentials = {
      username: formData.username,
      password: formData.password
    };

    try {
      // 4. Llamar al servicio de login
      const response = await AuthService.login(credentials);
      
      // 5. ¡ÉXITO! Guardar el token (el pasaporte)
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      // 6. Llamar a la función del padre (que te redirigirá)
      onLoginSuccess();

    } catch (err) {
      // 7. Mostrar error de "Usuario o clave incorrecta"
      console.error(err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          // 401 o 403 significa "Autenticación fallida"
          setServerError("Nombre de usuario o contraseña incorrectos.");
      } else {
          setServerError("Error al conectar con el servidor. Inténtalo de nuevo.");
      }
    } finally {
      // 8. Detener la carga, pase lo que pase
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} noValidate>
        
        {/* --> 7. CAMBIA los campos del formulario */}
        
        {/* Campo Nombre de Usuario */}
        <FormField
          label="Nombre de Usuario"
          type="text"
          name="username" // <-- CAMBIADO
          placeholder="Tu nombre de usuario"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className="error-message">{errors.username}</p>}

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

        {/* --> 8. MUESTRA el error del servidor */}
        {serverError && <p className="error-message server-error">{serverError}</p>}

        <a href="#" className="forgot-password-link">
          ¿Olvidaste tu contraseña?
        </a>

        {/* --> 9. DESHABILITA el botón mientras carga */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;