import axios from 'axios';
import { api } from './authService';

export const headmanService = {
  getGroupChoices: async () => {
    try {
        const response = await api.get('/group_head/group_choices');
        console.log('response', response.data);
        return response.data;
      } catch (error) {
        console.error('Ошибка при получении данных группы:', error);
        throw error.response?.data || error;
      }
  }
}; 