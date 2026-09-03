import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', onClick, ...props }) => {
  return (
    <div className={`card ${className} ${onClick ? 'clickable' : ''}`} onClick={onClick} {...props}>
      {children}
    </div>
  );
};
