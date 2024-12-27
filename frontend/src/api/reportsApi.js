import axios from 'axios';

const API_URL = '/api/reports';

export const useReportsApi = () => {
    const getAuthToken = () => localStorage.getItem('token');

    const getReports = async () => {
        const token = getAuthToken()
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: token}
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error fetching reports.';
        }
    };

    const addReport = async (reportData) => {
        const token = getAuthToken()
        try {
            const response = await axios.post(`${API_URL}/create`, reportData, {
                headers: { Authorization: token }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error adding report.';
        }
    };

    const deleteReport = async (id) => {
        const token = getAuthToken()
        try {
            const response = await axios.delete(`${API_URL}/delete/${id}`, {
                headers: { Authorization: token}
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error deleting report.';
        }
    };

    return { getReports, addReport, deleteReport };
};
