import axios from 'axios';

// Базовый URL для всех запросов
const BASE_URL = 'http://0.0.0.0:8000';

// Создаем экземпляр для запросов с form-urlencoded (логин)
const formApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// Создаем экземпляр для обычных JSON запросов
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерцептор для автоматического добавления токена
api.interceptors.request.use((config) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('access_token='));
  if (token) {
    config.headers.Authorization = `Bearer ${token.split('=')[1]}`;
  }
  return config;
});

// Добавляем интерцептор для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Если токен истек, пробуем обновить его
      const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refresh_token='));
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh', {
            refresh_token: refreshToken.split('=')[1]
          });
          
          // Обновляем токены
          document.cookie = `access_token=${response.data.access_token}; path=/; max-age=3600`;
          document.cookie = `refresh_token=${response.data.refresh_token}; path=/; max-age=2592000`;
          
          // Повторяем оригинальный запрос
          error.config.headers.Authorization = `Bearer ${response.data.access_token}`;
          return api(error.config);
        } catch (refreshError) {
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
      formData.append('grant_type', 'password');
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await formApi.post('/auth/login', formData);

      console.log('response', response);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
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
  }
};