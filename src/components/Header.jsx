import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const Header = () => {

  const { role, logout } = useAuth();
  console.log('role', role);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
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
          {role ? (
            <>
              <div className="header-right-section">
                {role === 'cafe_admin' && (
                  <Link to="/admin" className="auth-button">
                    Админ-панель
                  </Link>
                )}
                {role === 'group_head' && (
                  <Link to="/headman" className="auth-button">
                    Панель старосты
                  </Link>
                )}
              </div>
              <div className="header-right-section">
                {role !== 'guest' && (
                  <Link to="/profile" className="profile-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </Link>
                )}
                <button onClick={handleLogout} className="auth-button outlined">
                  Выйти
                </button>
              </div>
            </>
          ) : (
            <div className="header-right-section">
              <Link to="/login" className="auth-button">Авторизация</Link>
              <Link to="/register" className="auth-button outlined">Регистрация</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
  