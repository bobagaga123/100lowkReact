import axios from 'axios';

// Базовый URL для всех запросов
const BASE_URL = 'http://localhost:8000';

// Создаем экземпляр для запросов с form-urlencoded (логин)
const formApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
});

// Создаем экземпляр для обычных JSON запросов
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Добавляем интерцептор для автоматического добавления токена
api.interceptors.request.use((config) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('access_token='));
  if (token) {
    const tokenValue = token.split('=')[1];
    config.headers.Authorization = `Bearer ${tokenValue}`;
    console.log('Отправляем запрос с токеном:', tokenValue);
  } else {
    console.log('Токен не найден в cookies');
  }
  return config;
}, (error) => {
  console.error('Ошибка в интерцепторе запроса:', error);
  return Promise.reject(error);
});

// Добавляем интерцептор для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('Получена ошибка:', error.response?.status);
    if (error.response?.status === 401) {
      console.log('Получен 401, пробуем обновить токен');
      const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refresh_token='));
      if (refreshToken) {
        try {
          const refreshTokenValue = refreshToken.split('=')[1];
          console.log('Пробуем обновить токен используя refresh_token:', refreshTokenValue);
          
          const response = await api.post('/auth/refresh', {
            refresh_token: refreshTokenValue
          });
          
          console.log('Получены новые токены:', response.data);
          
          // Обновляем токены
          document.cookie = `access_token=${response.data.access_token}; path=/; max-age=3600`;
          document.cookie = `refresh_token=${response.data.refresh_token}; path=/; max-age=2592000`;
          
          // Повторяем оригинальный запрос
          error.config.headers.Authorization = `Bearer ${response.data.access_token}`;
          return api(error.config);
        } catch (refreshError) {
          console.error('Не удалось обновить токен:', refreshError);
          // Если не удалось обновить токен, удаляем все токены
          document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      console.log('Отправляем запрос на логин с данными:', formData.toString());
      const response = await formApi.post('/auth/login', formData);
      console.log('Получен ответ от сервера:', response.data);

      return response.data;
    } catch (error) {
      console.error('Ошибка при логине:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  refreshToken: async () => {
    const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refresh_token='));
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }
    
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken.split('=')[1]
    });
    return response.data;
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      throw error;
    }
  },
};