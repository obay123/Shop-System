import axios from 'axios';

const API_URL = '/api/items';

export const useItemsApi = () => {
    const getAuthToken = () => localStorage.getItem('token');

    const getItems = async () => {
        const token = getAuthToken();
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error fetching items.';
        }
    };

    const addItem = async (itemData) => {
        const token = getAuthToken();
        try {
            const response = await axios.post(`${API_URL}/create`, itemData, {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error adding item.';
        }
    };

    const updateItem = async (id, itemData) => {
        const token = getAuthToken();
        try {
            const response = await axios.patch(`${API_URL}/edit/${id}`, itemData, {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error updating item.';
        }
    };

    const deleteItem = async (id) => {
        const token = getAuthToken();
        try {
            const response = await axios.delete(`${API_URL}/delete/${id}`, {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error deleting item.';
        }
    };

    return { getItems, addItem, updateItem, deleteItem };
};