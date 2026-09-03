import React from 'react';
import './Input.css';

export const Input = ({ label, id, type = 'text', ...props }) => {
  return (
    <div className="input-group">
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input id={id} type={type} className="input-field" {...props} />
    </div>
  );
};
