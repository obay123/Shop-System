import axios from 'axios';

const API_URL = '/api/items';

export const getItems = async () => {
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const addItem = async (itemData) => {
    const response = await axios.post(`${API_URL}/create`, itemData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const updateItem = async (id, itemData) => {
    const response = await axios.patch(`${API_URL}/edit/${id}`, itemData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const deleteItem = async (id) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};
