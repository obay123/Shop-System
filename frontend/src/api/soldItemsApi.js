import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/soldItems';

export const useSoldItemsApi = () => {
    const { authToken } = useAuth();

    const addSoldItem = async (reportId, itemData) => {
        try {
            const response = await axios.post(`${API_URL}/${reportId}/add`, itemData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error adding sold item.';
        }
    };

    const editSoldItem = async (reportId, soldItemId, updatedData) => {
        try {
            const response = await axios.put(`${API_URL}/${reportId}/edit/${soldItemId}`, updatedData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error editing sold item.';
        }
    };

    const deleteSoldItem = async (reportId, soldItemId) => {
        try {
            const response = await axios.delete(`${API_URL}/${reportId}/delete/${soldItemId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error deleting sold item.';
        }
    };

    return { addSoldItem, editSoldItem, deleteSoldItem };
};
