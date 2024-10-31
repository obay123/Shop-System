import axios from 'axios';

const API_URL = '/api/debts'; // Adjust this if your API base URL is different

// Function to create a new debt
export const createDebt = async (debtData) => {
    try {
        const response = await axios.post(`${API_URL}/create`, debtData);
        return response.data;
    } catch (error) {
        throw error.response.data; // Propagate the error for handling
    }
};

// Function to fetch a debt by name
export const fetchDebtByName = async (debtName) => {
    try {
        const response = await axios.post(`${API_URL}/fetchByName`, { name: debtName });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to edit a debt
export const editDebt = async (debtId, updateData) => {
    try {
        const response = await axios.put(`${API_URL}/edit/${debtId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to delete a debt
export const deleteDebt = async (debtId) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${debtId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to get all debts (if needed)
export const getAllDebts = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
