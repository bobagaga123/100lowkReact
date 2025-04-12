import { useState } from 'react';
import { registerService } from '../services/registerService';
import { Link } from 'react-router-dom';

const Register = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [group, setGroup] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await registerService.register(login, password, group);

      
      
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка при авторизации';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

    <div className="login-container">
      <h2>Регистрация</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Имя пользователя:</label>
          <input
            type="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Группа:</label>
          <input
            type="group"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <button className="login-button" type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
        <div className="reg-text">
          <p>Есть аккаунт?</p>
          <a className='reg-alert' href='/login'>Войти</a>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
    </>
  );
};

export default Register; 