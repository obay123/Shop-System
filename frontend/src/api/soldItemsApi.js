import axios from 'axios';

const API_URL = '/api/solditems';

// Function to add a sold item to a specific report
export const addSoldItemToReport = async (reportId, soldItemData) => {
    const response = await axios.post(`${API_URL}/${reportId}/add`, soldItemData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

// Function to edit a specific sold item in a report
export const editSoldItemInReport = async (reportId, soldItemId, soldItemData) => {
    const response = await axios.put(`${API_URL}/${reportId}/edit/${soldItemId}`, soldItemData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

// Function to delete a specific sold item from a report
export const deleteSoldItemFromReport = async (reportId, soldItemId) => {
    const response = await axios.delete(`${API_URL}/${reportId}/delete/${soldItemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};