import axios from 'axios';

const API_URL = 'api/auth'; // Update base URL if necessary

export const registerShop = async (shopData) => {
    return axios.post(`${API_URL}/register`, shopData);
};

export const loginShop = async (shopData) => {
    return axios.post(`${API_URL}/login`, shopData);
};
export const deleteShop = async(shopId)=>{
    return axios.delete(`${API_URL}/delete/${shopId}`)
}