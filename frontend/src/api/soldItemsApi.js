import axios from 'axios';


const API_URL = '/api/soldItems';

export const useSoldItemsApi = () => {
    const getAuthToken = () => localStorage.getItem('token');

    const addSoldItem = async (reportId, itemData) => {
        const token = getAuthToken()
        try {
            const response = await axios.post(`${API_URL}/${reportId}/add`, itemData, {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error adding sold item.';
        }
    };

    const editSoldItem = async (reportId, soldItemId, updatedData) => {
        const token = getAuthToken()
        try {
            const response = await axios.put(`${API_URL}/${reportId}/edit/${soldItemId}`, updatedData, {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error editing sold item.';
        }
    };

    const deleteSoldItem = async (reportId, soldItemId) => {
        const token = getAuthToken()
        try {
            const response = await axios.delete(`${API_URL}/${reportId}/delete/${soldItemId}`, {
                headers: { Authorization: token }
            });
            return response.data;   
        } catch (error) {
            throw error.response?.data || 'Error deleting sold item.';
        }
    };

    return { addSoldItem, editSoldItem, deleteSoldItem };
};
