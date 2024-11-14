import axios from 'axios';

const API_URL = '/api/debts';

export const getDebts = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return response.data;
    } catch (error) {
        throw error.response.data
    }
};
export const findByName = async (name) => {

}

export const addDebt = async (debtData) => {
    const response = await axios.post(`${API_URL}/create`, debtData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const updateDebt = async (id, debtData) => {
    const response = await axios.patch(`${API_URL}/edit/${id}`, debtData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const deleteDebt = async (id) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};
