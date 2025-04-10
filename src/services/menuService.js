import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const menuService = {
  getMenu: async () => {
    try {
      const response = await api.get('/guest/menu');
      return response.data;
    } 
    catch (error) {
      throw error.response?.data?.detail || 'Произошла ошибка при авторизации';
    }
  }
}; 