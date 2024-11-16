import React from 'react';
import '../index.css'

const Table = ({ columns, data }) => {
    return (
        <div className="table-container">
            <table className="table" style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {Object.values(row).map((cell, index) => (
                                <td key={index}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
