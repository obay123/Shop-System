import React from 'react';
import '../index.css'

const Button = ({ 
    children, 
    onClick, 
    type = 'button', 
    variant = 'primary', 
    size = 'medium', 
    disabled = false 
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`btn btn-${variant} btn-${size}`}
            disabled={disabled}
            style={{
                fontFamily: 'Cairo, sans-serif', // Arabic-friendly font
                direction: 'rtl', // Explicit RTL
                textAlign: 'center', // Center-align text for consistency
                margin: '1px'
            }}
        >
            {children}
        </button>
    );
};

export default Button;
