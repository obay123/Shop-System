import axios from 'axios';

const API_URL = 'http://localhost:5000/api/debts'; // Adjust based on your server URL

export const fetchDebts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createDebt = async (debtData) => {
    const response = await axios.post(API_URL, debtData);
    return response.data;
};
