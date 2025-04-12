import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем наличие токена при загрузке
    const token = document.cookie.split('; ').find(row => row.startsWith('access_token='));
    if (token) {
      // Декодируем токен и получаем данные пользователя
      const tokenData = token.split('=')[1];
      const payload = JSON.parse(atob(tokenData.split('.')[1]));
      console.log('Full payload:', payload);
      console.log('sub field:', payload.sub);
      
      // Преобразуем строку sub в объект
      const userData = JSON.parse(payload.sub.replace(/'/g, '"'));
      console.log('Parsed user data:', userData);
      
      setUser({
        id: userData.id,
        username: userData.username,
        group: userData.group,
        role: userData.role || 'user' // Устанавливаем роль по умолчанию
      });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      
      // Устанавливаем cookies
      document.cookie = `access_token=${response.access_token}; path=/; max-age=3600`; // 1 час
      document.cookie = `refresh_token=${response.refresh_token}; path=/; max-age=2592000`; // 30 дней
      
      // Декодируем токен и получаем данные пользователя
      const payload = JSON.parse(atob(response.access_token.split('.')[1]));
      console.log('Full payload after login:', payload);
      console.log('sub field after login:', payload.sub);
      
      // Преобразуем строку sub в объект
      const userData = JSON.parse(payload.sub.replace(/'/g, '"'));
      console.log('Parsed user data after login:', userData);
      
      setUser({
        id: userData.id,
        username: userData.username,
        group: userData.group,
        role: userData.role || 'user' // Устанавливаем роль по умолчанию
      });
      
      return true;
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      return false;
    }
  };

  const logout = () => {
    // Удаляем cookies
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 