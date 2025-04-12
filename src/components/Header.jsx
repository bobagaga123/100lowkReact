import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-text">Столовая</span>
            <span className="logo-app">WebApp</span>
          </Link>
          <nav className="nav-links">
            <button onClick={() => scrollToSection('menu')}>Меню</button>
            <button onClick={() => scrollToSection('schedule')}>Расписание</button>
            <button onClick={() => scrollToSection('contacts')}>Контакты</button>
          </nav>
        </div>
        <div className="header-right">
          {user ? (
            <>
            {console.log(user)}
              {/* <span className="user-info">Привет, {user.username}</span> */}
              {user.role === 'admin' && (
                <Link to="/admin" className="auth-button">
                  Админ-панель
                </Link>
              )}
              <button onClick={handleLogout} className="auth-button outlined">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-button">Авторизация</Link>
              <Link to="/register" className="auth-button outlined">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
  