import axios from 'axios';

const API_URL = '/api/items';

// Function to create a new item
export const createItem = async (itemData) => {
    try {
        const response = await axios.post(`${API_URL}/create`, itemData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to fetch a single item by ID
export const fetchItemById = async (itemId) => {
    try {
        const response = await axios.get(`${API_URL}/${itemId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to edit an item
export const editItem = async (itemId, updateData) => {
    try {
        const response = await axios.put(`${API_URL}/edit/${itemId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to delete an item
export const deleteItem = async (itemId) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${itemId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to get all items
export const getAllItems = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
