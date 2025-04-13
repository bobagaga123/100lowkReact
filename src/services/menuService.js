import axios from 'axios';
import { api } from './authService';

export const menuService = {
  getMenu: async () => {
    try {
      const response = await api.get('/guest/menu');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}; 