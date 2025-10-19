import React from 'react';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';
import './FormField.css';

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
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FormField;