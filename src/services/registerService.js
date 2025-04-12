import axios from 'axios';

const api = axios.create({
  baseURL: 'http://0.0.0.0:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerService = {
  register: async (username, password, group) => {
    try {

      const response = await api.post('/auth/register', { 
        username, password, group 
    });
      console.log(response.data);
      return response.data;

    } 
    catch (error) {
      console.error('Ошибка авторизации:');
      console.error('Статус:', error.response?.status);
      console.error('Данные ошибки:', error.response?.data);
      console.error('Полный ответ:', error.response);
    }
  
  }
};