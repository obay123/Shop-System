import axios from 'axios';

const API_URL = '/api/reports';

export const useReportsApi = () => {
    const getAuthToken = () => localStorage.getItem('token');

    const updateReport = async (reportId, reportData) => {
        const token = getAuthToken()
        try {
            const response = await axios.put(`${API_URL}/${reportId}`, reportData,{
                headers: { Authorization: token }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating report:', error);
            throw error;
        }
    };


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



    const getReportByDate = async(date)=>{
        const token = getAuthToken()
        try{
            const response = await axios.get(`${API_URL}/${date}`,{
                headers:{Authorization: token}
            })
           
            return response.data
        }catch(error){
                throw error.response?.data || 'error fetching report by date'
        }
    };

    const getReportById = async (id) => {
        const token = getAuthToken()
        try {
            const response = await axios.get(`${API_URL}/${id}`,{
                headers: { Authorization: token}
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
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

    return { getReports, addReport, deleteReport , getReportById ,getReportByDate,updateReport};
};
