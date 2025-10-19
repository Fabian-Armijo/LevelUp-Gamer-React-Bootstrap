// src/components/2-molecules/FormField/FormField.jsx
import React from 'react';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';
import './FormField.css';

// Añadimos 'error' a las props
const FormField = ({ label, type, placeholder, value, onChange, name, error }) => {
  return (
    <div className="form-field-container">
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
      />
      {/* Si existe un error, muestra este párrafo */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FormField;