import React from 'react';
import './Checkbox.css';

const Checkbox = ({ id, checked, onChange, name }) => {
  return (
    <input
      id={id}
      type="checkbox"
      className="custom-checkbox"
      checked={checked}
      onChange={onChange}
      name={name}
    />
  );
};

export default Checkbox;