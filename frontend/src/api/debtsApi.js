import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

const API_URL = '/api/debts';
const getAuthToken = () => localStorage.getItem('token');

export const useDebtsApi = () => {
   

    const getDebts = async () => {  
        const token = getAuthToken();
        if(!token){
            return console.log('token is not provided',token)
        }
        try {
           
            const response = await axios.get(API_URL, {
                headers: {Authorization:token}
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error fetching debts.';
            // return console.log('token not provided',token)
        }
    };

    const addDebt = async (debtData) => {
        const token = getAuthToken();
        try {
            const response = await axios.post(`${API_URL}/create`, debtData, {
                headers: {Authorization:token}
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error adding debt.';
        }
    };

    const updateDebt = async (id, debtData) => {
        const token = getAuthToken();
        try {
            const response = await axios.patch(`${API_URL}/edit/${id}`, debtData, {
                headers: {Authorization:token}
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error updating debt.';
        }
    };

    const deleteDebt = async (id) => {
        const token = getAuthToken();
        try {
            const response = await axios.delete(`${API_URL}/delete/${id}`, {
                headers: {Authorization:token}
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error deleting debt.';
        }
    };

    return { getDebts, addDebt, updateDebt, deleteDebt };
};
