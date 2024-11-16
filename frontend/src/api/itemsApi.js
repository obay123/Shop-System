import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/items';

export const useItemsApi = () => {
    const { authToken } = useAuth();

    const getItems = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error fetching items.';
        }
    };

    const addItem = async (itemData) => {
        try {
            const response = await axios.post(`${API_URL}/create`, itemData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error adding item.';
        }
    };

    const updateItem = async (id, itemData) => {
        try {
            const response = await axios.patch(`${API_URL}/edit/${id}`, itemData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error updating item.';
        }
    };

    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/delete/${id}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error deleting item.';
        }
    };

    return { getItems, addItem, updateItem, deleteItem };
};
