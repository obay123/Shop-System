import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/debts';

export const useDebtsApi = () => {
    const { authToken } = useAuth();

    const getDebts = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error fetching debts.';
        }
    };

    const addDebt = async (debtData) => {
        try {
            const response = await axios.post(`${API_URL}/create`, debtData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error adding debt.';
        }
    };

    const updateDebt = async (id, debtData) => {
        try {
            const response = await axios.patch(`${API_URL}/edit/${id}`, debtData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error updating debt.';
        }
    };

    const deleteDebt = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/delete/${id}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error deleting debt.';
        }
    };

    return { getDebts, addDebt, updateDebt, deleteDebt };
};
