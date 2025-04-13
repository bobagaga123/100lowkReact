import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MenuManagement from '../components/MenuManagement';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('menu');
  const { role } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'menu':
        return <MenuManagement />;
      // Добавьте другие секции по мере необходимости
      default:
        return <div>Выберите раздел</div>;
    }
  };

  return (
    <div className="admin-panel">
      <h2>Панель администратора</h2>
      <div className="admin-content">
        <div className="panel-section">
          <nav className="admin-nav">
            <button
              className={`nav-button ${activeSection === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveSection('menu')}
            >
              Управление меню
            </button>
            {/* Добавьте другие кнопки навигации по мере необходимости */}
          </nav>
          <div className="section-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 