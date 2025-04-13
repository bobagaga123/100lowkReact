import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { studentService } from '../services/studentService';
import '../styles/Profile.css';

const Profile = () => {
  const { role } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await studentService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Ошибка при получении профиля:', err);
        setError('Не удалось загрузить профиль');
      } finally {
        setLoading(false);
      }
    };
      fetchProfile();
  }, [role]);

  if (loading) {
    return <div className="profile-container">Загрузка...</div>;
  }

  if (error) {
    return <div className="profile-container">{error}</div>;
  }

  if (!profile) {
    return <div className="profile-container">Профиль не найден</div>;
  }

  return (
    <div className="profile-container">
      <h2>Профиль</h2>
      <div className="profile-info">
        <div className="profile-field">
          <span className="field-label">Имя пользователя:</span>
          <span className="field-value">{profile.username}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Роль:</span>
          <span className="field-value">{profile.role}</span>
        </div>
        {role !== 'cafe_admin' && (
          <div className="profile-field">
            <span className="field-label">Группа:</span>
            <span className="field-value">{profile.group}</span>
          </div>
        )}
        {role !== 'cafe_admin' && (
        <div className="profile-field">
          <span className="field-label">Статус питания:</span>
          <span className={`field-value ${profile.having_meal ? 'confirmed' : 'not-confirmed'}`}>
            {profile.having_meal ? 'Подтверждено' : 'Не подтверждено'}
          </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
