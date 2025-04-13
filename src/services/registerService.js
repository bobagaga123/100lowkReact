import axios from 'axios';
import { api } from './authService';

export const registerService = {
  register: async (queryData) => {
    try {
      console.log(queryData);
      const response = await api.post('/auth/register', queryData);
      console.log(response.data);
      return response.data;
    } 
    catch (error) {
      console.error('Ошибка авторизации:');
      console.error('Статус:', error);
      console.error('Данные ошибки:', error);
      console.error('Полный ответ:', error);
    }
  }
};