import React from 'react';
import '../index.css'

const Notification = ({ message, type = 'info' }) => {
    return (
        <div
            className={`notification notification-${type}`}
            style={{
                direction: 'rtl', // For Arabic layout
                fontFamily: 'Cairo, sans-serif', // Arabic-friendly font
                textAlign: 'right', // Align text to the right
            }}
        >
            {message}
        </div>
    );
};

export default Notification;
