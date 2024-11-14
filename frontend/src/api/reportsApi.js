import axios from 'axios';

const API_URL = '/api/reports';

export const getReports = async (date) => {
    const response = await axios.get(`${API_URL}/${date}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const addReport = async (reportData) => {
    const response = await axios.post(`${API_URL}/create`, reportData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

// export const updateReport = async (id, reportData) => {
//     const response = await axios.patch(`${API_URL}/delete/${id}`, reportData, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     });
//     return response.data;
// };

export const deleteReport = async (id) => {
    const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};
