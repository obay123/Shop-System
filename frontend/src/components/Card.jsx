import React from 'react';
import './Card.css';

const Card = ({ title, value, icon, color = '#4CAF50' }) => {
    return (
        <div className="card" style={{ borderColor: color }}>
            <div className="card-header">
                <span className="card-title">{title}</span>
                <span className="card-icon" style={{ color }}>
                    {icon}
                </span>
            </div>
            <div className="card-body">
                <span className="card-value" style={{ color }}>
                    {value}
                </span>
            </div>
        </div>
    );
};

export default Card;
