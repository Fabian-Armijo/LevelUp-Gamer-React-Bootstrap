import React, { useState } from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import './RegistrationForm.css';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const validateForm = () => {
    const newErrors = {};
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('¡Registro exitoso! Redirigiendo a Login...');
      onRegistrationSuccess(); 
    } else {
      console.log('Errores de validación detectados por React.');
    }
  };

  return (
    <div className="form-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* ... (todos los FormField se mantienen igual) ... */}
        <FormField label="Nombre de Usuario" type="text" name="username" placeholder="Entre 4 y 12 caracteres" value={formData.username} onChange={handleChange} error={errors.username} />
        <FormField label="Correo Electrónico" type="email" name="email" placeholder="tucorreo@ejemplo.com" value={formData.email} onChange={handleChange} error={errors.email} />
        <FormField label="Contraseña" type="password" name="password" placeholder="Entre 6 y 12 caracteres" value={formData.password} onChange={handleChange} error={errors.password} />
        <FormField label="Repetir Contraseña" type="password" name="confirmPassword" placeholder="Repite tu contraseña" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <FormField label="Fecha de Nacimiento" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} error={errors.birthDate} />

        {/* 4. Campo de Checkbox añadido aquí */}
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

        <Button type="submit">Registrarse</Button>
      </form>
    </div>
  );
};

export default RegistrationForm;