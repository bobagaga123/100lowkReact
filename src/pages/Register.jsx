import { useState } from 'react';
import { registerService } from '../services/registerService';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const ROLES = [
  { value: 'student', label: 'Студент' },
  { value: 'group_head', label: 'Староста' }
];

const GROUPS = [
  { value: 'ИКБО-04-21', label: 'ИКБО-04-21' },
  { value: 'ИКБО-06-21', label: 'ИКБО-06-21' },
  { value: 'ИКБО-08-21', label: 'ИКБО-08-21' },
  { value: 'ИКБО-10-21', label: 'ИКБО-10-21' },
  { value: 'ИКБО-13-21', label: 'ИКБО-13-21' },
  { value: 'ИКБО-16-21', label: 'ИКБО-16-21' },
  { value: 'ИКБО-20-21', label: 'ИКБО-20-21' },
  { value: 'ИКБО-24-21', label: 'ИКБО-24-21' },
  { value: 'ИКБО-28-21', label: 'ИКБО-28-21' },
];

const Register = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [group, setGroup] = useState(null);
  const [role, setRole] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !group) {
      setError('Пожалуйста, выберите роль и группу');
      return;
    }
    
    setLoading(true);
    try {
      const queryData = {
        username: login,
        password: password,
        group: group.value,
        role: role.value
      };
      console.log('queryData', queryData);

      await registerService.register(queryData);
      // При успешной регистрации перенаправляем на страницу входа
      navigate('/login');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка при регистрации';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Регистрация</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Имя пользователя:</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            disabled={loading}
            placeholder="Введите имя пользователя"
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="Введите пароль"
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Роль:</label>
          <Select
            value={role}
            onChange={setRole}
            options={ROLES}
            isDisabled={loading}
            placeholder="Выберите роль"
            className="form-control"
            classNamePrefix="select"
            isSearchable={false}
            required
          />
        </div>
        <div className="form-group">
          <label>Группа:</label>
          <Select
            value={group}
            onChange={setGroup}
            options={GROUPS}
            isDisabled={loading}
            placeholder="Выберите группу"
            className="form-control"
            classNamePrefix="select"
            isSearchable
            filterOption={(option, inputValue) => 
              option.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            required
          />
        </div>
        
        <button className="login-button" type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
        <div className="reg-text">
          <p>Есть аккаунт?</p>
          <a className='reg-alert' href='/login'>Войти</a>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Register; 