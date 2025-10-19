import React from 'react';
import './Input.css';

const Input = ({ type, placeholder, value, onChange, name }) => {
  return (
    <input
      className="custom-input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
    />
  );
};

export default Input;