import React from 'react';

const FormLayout = ({ title, children }) => {
    return (
        <div className="form-layout">
            <h2
                style={{
                    textAlign: 'center',
                    fontFamily: 'Cairo, sans-serif',
                    marginBottom: '1rem',
                }}
            >
                {title}
            </h2>
            {children}
        </div>
    );
};

export default FormLayout;
