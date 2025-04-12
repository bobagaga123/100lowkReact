import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const sheduleService = {
  getShedule: async () => {
    try {
      const response = await api.get('/guest/schedule');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}; 