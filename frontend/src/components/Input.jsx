import React from 'react';
import '../index.css'

const Input = ({ label, value, onChange, type = 'text', placeholder = '', required = false, id }) => {
    return (
        <div className="input-container">
            {label && (
                <label 
                    htmlFor={id} 
                    className="input-label" 
                    style={{
                        fontFamily: 'Cairo, sans-serif', // Arabic-friendly font
                        textAlign: 'right', // Align text for RTL
                    }}
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="input-field"
                required={required}
                style={{
                    fontFamily: 'Cairo, sans-serif', // Arabic font
                    textAlign: 'right', // RTL alignment
                    direction: 'rtl', // Explicit RTL layout
                }}
            />
        </div>
    );
};

export default Input;
