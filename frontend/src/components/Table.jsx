
import React from 'react';


const Table = ({ columns, data }) => {
    return (
        <div className="table-container">
            <table>
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
                            {columns.map((col, colIndex) => {
                                let cellContent = row[col];

                                // Handle objects/arrays properly
                                if (Array.isArray(cellContent)) {
                                    cellContent = cellContent
                                        .map(item => `${item.itemName} (${item.quantity} x ${item.price})`)
                                        .join(', ');
                                } else if (typeof cellContent === 'object' && !React.isValidElement(cellContent)) {
                                    cellContent = JSON.stringify(cellContent);
                                }

                                return (
                                    <td key={colIndex}>
                                        {/* Render content directly if it's a React element */}
                                        {React.isValidElement(cellContent) ? cellContent : cellContent}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
