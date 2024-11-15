import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'medium', disabled = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`btn btn-${variant} btn-${size}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
