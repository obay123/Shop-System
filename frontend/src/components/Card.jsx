import React from 'react';
import '../index.css'

const Card = ({ title, value, icon, color = '#4CAF50' }) => {
    return (
        <div 
            className="card" 
            style={{ 
                borderColor: color, 
                direction: 'rtl', // Explicit RTL for Arabic layout
            }}
        >
            <div className="card-header">
                <span 
                    className="card-title" 
                    style={{
                        fontFamily: 'Cairo, sans-serif', // Arabic-friendly font
                        textAlign: 'right', // Align text to the right
                    }}
                >
                    {title}
                </span>
                <span 
                    className="card-icon" 
                    style={{ 
                        color, 
                        textAlign: 'right', 
                    }}
                >
                    {icon}
                </span>
            </div>
            <div className="card-body">
                <span 
                    className="card-value" 
                    style={{
                        fontFamily: 'Cairo, sans-serif', 
                        color,
                        textAlign: 'right',
                    }}
                >
                    {value}
                </span>
            </div>
        </div>
    );
};

export default Card;
