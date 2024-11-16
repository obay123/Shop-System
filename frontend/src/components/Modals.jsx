import React from 'react';
import '../index.css'

const Modal = ({ show, handleClose, children }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                    fontFamily: 'Cairo, sans-serif', // Arabic font
                    textAlign: 'right', // RTL alignment
                    direction: 'rtl', // Explicit RTL layout
                }}
            >
                <button className="modal-close" onClick={handleClose}>
                    &#x2715; {/* Unicode for "X" */}
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
