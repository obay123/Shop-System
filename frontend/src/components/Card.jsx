import React from 'react';

const Card = ({ title, value, icon, color = '#4CAF50', children }) => {
    return (
        <div className="card">
            <div className="card-content">
                <div className="card-header">
                    <span className="card-title">{title}</span>
                    <span className="card-icon">{icon}</span>
                </div>
                <div className="card-body">
                    <span className="card-value">{value}</span>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Card;