import axios from 'axios';

const API_URL = '/api/milk';

export const getMilkEntries = async () => {
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const addMilkEntry = async (milkData) => {
    const response = await axios.post(`${API_URL}/create`, milkData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const updateMilkEntry = async (id, milkData) => {
    const response = await axios.patch(`${API_URL}/edit/${id}`, milkData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const deleteMilkEntry = async (id) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};
