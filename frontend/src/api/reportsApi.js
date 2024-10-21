import axios from 'axios';

const API_URL = '/api/reports';

// Function to create a new report
export const createReport = async (reportData) => {
    try {
        const response = await axios.post(`${API_URL}/create`, reportData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to fetch a report by ID
export const fetchReportById = async (reportId) => {
    try {
        const response = await axios.get(`${API_URL}/${reportId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to edit a report
export const editReport = async (reportId, updateData) => {
    try {
        const response = await axios.put(`${API_URL}/edit/${reportId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to delete a report
export const deleteReport = async (reportId) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${reportId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to get all reports
export const getAllReports = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
