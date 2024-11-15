import React from 'react';
import './Input.css';

const Input = ({ label, value, onChange, type = 'text', placeholder = '', required = false }) => {
    return (
        <div className="input-container">
            {label && <label className="input-label">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="input-field"
                required={required}
            />
        </div>
    );
};

export default Input;
