import React from 'react';
import './Button.css';

export const Button = ({ children, type = 'button', variant = 'primary', className = '', ...props }) => {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};
