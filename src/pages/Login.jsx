import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const success = await authLogin(login, password);
      if (success) {
        navigate('/');
      } else {
        setError('Неверный логин или пароль');
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      setError('Произошла ошибка при авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <h2>Вход в систему</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
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
          
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
          <div className="reg-text">
            <p>Нет аккаунта?</p>
            <Link to="/register" className='reg-alert'>Регистрация</Link>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </>
  );
};

export default Login; 