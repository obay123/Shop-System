import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/milk';

export const useMilkApi = () => {
    const { authToken } = useAuth();

    const getMilkRecords = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error fetching milk records.';
        }
    };

    const addMilkRecord = async (recordData) => {
        try {
            const response = await axios.post(`${API_URL}/create`, recordData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error adding milk record.';
        }
    };

    const updateMilkEntry =async(id,milkData)=>{
        try{
            const response = await axios.patch(`${API_URL}/edit/${id}`,milkData,{
                headers:{Authorization:`Bearer ${authToken}`}
        })
        return response.data
        }catch(error){
            throw error.response?.data || 'error editing milk record'
        }
    };
    const deleteMilkEntry = async(id)=>{
        try{
            const response = await axios.delete(`${API_URL}/delete/${id}`,{
                headers:{Authorization:`Bearer ${authToken}`}
            })
            return response.data;
        }catch(error){
            throw error.response?.data || 'error deleting milk record'
        }
    }

    return { getMilkRecords, addMilkRecord,updateMilkEntry,deleteMilkEntry };
};

