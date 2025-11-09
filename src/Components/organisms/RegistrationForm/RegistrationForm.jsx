import React, { useState } from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import './RegistrationForm.css';
import AuthService from '../../../Services/AuthService';

const RegistrationForm = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});

  // --> 2. AÑADE ESTADOS PARA LA CARGA Y ERRORES DEL BACKEND
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null); // Para "Email en uso", etc.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  // Tu validación de frontend está perfecta
  const validateForm = () => {
    const newErrors = {};
    // ... (toda tu lógica de validación de 4 a 12 caracteres, edad, etc.)
    // ... (esta lógica sigue siendo 100% válida y necesaria)
    if (formData.username.length < 4) newErrors.username = 'El nombre de usuario debe tener al menos 4 caracteres.';
    else if (formData.username.length > 12) newErrors.username = 'El nombre de usuario no puede exceder los 12 caracteres.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Por favor, introduce un correo electrónico válido.';
    if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    else if (formData.password.length > 12) newErrors.password = 'La contraseña no puede exceder los 12 caracteres.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    if (!formData.birthDate) {
        newErrors.birthDate = 'Por favor, introduce tu fecha de nacimiento.';
    } else {
        const today = new Date();
        const birthDate = new Date(formData.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        if (age < 18) newErrors.birthDate = 'Debes ser mayor de 18 años para registrarte.';
    }

    if (!termsAccepted) {
      newErrors.terms = 'Debes aceptar los términos y condiciones para continuar.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --> 3. MODIFICA handleSubmit PARA QUE SEA ASÍNCRONO Y LLAME AL SERVICIO
  const handleSubmit = async (e) => { // La hacemos 'async'
    e.preventDefault();
    setServerError(null); // Limpia errores del servidor previos

    // 1. Valida el frontend primero
    if (!validateForm()) {
      console.log('Errores de validación detectados por React.');
      return; // Si la validación falla, no sigas.
    }

    // 2. Si la validación pasa, activa la carga
    setIsLoading(true);

    // 3. Prepara los datos para el backend
    // (Nota: quitamos 'confirmPassword', el backend no lo necesita)
    // (Nota: renombramos 'birthDate' a 'dateOfBirth' como espera el backend)
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      dateOfBirth: formData.birthDate 
    };

    try {
      // 4. Llama al servicio
      const response = await AuthService.register(userData);

      // 5. ¡Éxito! Llama a la función del padre
      console.log(response.data); // "¡Usuario registrado exitosamente!"
      onRegistrationSuccess(); // Esto te redirigirá a /login

    } catch (err) {
      // 6. ¡Error! Muestra el error del backend
      if (err.response && err.response.data) {
        // ej: "Error: ¡El email ya está en uso!"
        setServerError(err.response.data);
      } else {
        setServerError("No se pudo conectar al servidor. Inténtalo de nuevo.");
      }
      console.log('Error del backend:', err);
    } finally {
      // 7. Termina la carga, pase lo que pase
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Tus FormFields están perfectos, no se tocan */}
        <FormField label="Nombre de Usuario" type="text" name="username" placeholder="Entre 4 y 12 caracteres" value={formData.username} onChange={handleChange} error={errors.username} />
        <FormField label="Correo Electrónico" type="email" name="email" placeholder="tucorreo@ejemplo.com" value={formData.email} onChange={handleChange} error={errors.email} />
        <FormField label="Contraseña" type="password" name="password" placeholder="Entre 6 y 12 caracteres" value={formData.password} onChange={handleChange} error={errors.password} />
        <FormField label="Repetir Contraseña" type="password" name="confirmPassword" placeholder="Repite tu contraseña" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <FormField label="Fecha de Nacimiento" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} error={errors.birthDate} />

        {/* Tu Checkbox está perfecto, no se toca */}
        <div className="terms-container">
          <Checkbox
            id="terms"
            name="terms"
            checked={termsAccepted}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="terms" className="terms-label">
            Acepto los <a href="/terminos" target="_blank" rel="noopener noreferrer">Términos y Condiciones</a>
          </label>
        </div>
        {errors.terms && <p className="error-message terms-error">{errors.terms}</p>}
        
        {/* --> 4. MUESTRA EL ERROR DEL SERVIDOR (SI EXISTE) */}
        {serverError && <p className="error-message server-error">{serverError}</p>}

        {/* --> 5. DESHABILITA EL BOTÓN MIENTRAS CARGA */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;