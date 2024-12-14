import axios from 'axios';

const API_URL = '/auth'; // Update base URL if necessary

export const registerShop = async (shopData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, shopData);
        return response;
    } catch (error) {
        console.error('Error during registration:', error.response ? error.response.data : error.message);
        throw error; // Re-throw to be handled by your component
    }
};


export const loginShop = async (shopData) => {
    try {
        const response = axios.post(`${API_URL}/login`, shopData);
        return response;
    } catch (error) {
        console.error('Error during logging in:', error.response ? error.response.data : error.message);
        throw error; // Re-throw to be handled by your component
    }

};
export const deleteShop = async (shopId) => {
    try {
        const resposne = axios.delete(`${API_URL}/deleteShop/${shopId}`)
        return resposne
    } catch (error) {
        console.error('Error during deleting the shop:', error.response ? error.response.data : error.message);
        throw error; // Re-throw to be handled by your component
    }

}

export const logoutShop = async () => {
    return axios.post(`${API_URL}/logout`);
};

