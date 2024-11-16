import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/reports';

export const useReportsApi = () => {
    const { authToken } = useAuth();

    const getReports = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error fetching reports.';
        }
    };

    const addReport = async (reportData) => {
        try {
            const response = await axios.post(`${API_URL}/create`, reportData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error adding report.';
        }
    };

    const deleteReport = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/delete/${id}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error deleting report.';
        }
    };

    return { getReports, addReport, deleteReport };
};
