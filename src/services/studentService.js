import { api } from './authService';

export const studentService = {
  confirmMeal: async (willEat) => {
    try {
      console.log('Отправляем запрос на подтверждение питания:', willEat);
      const response = await api.post(`/student/confirm_meal?having_meal=${willEat}`, '');
      console.log('Получен ответ:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при подтверждении приема пищи:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error.response?.data || error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/student/profile');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении профиля:', error);
      throw error.response?.data || error;
    }
  }
}; 