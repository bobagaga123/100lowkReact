import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { headmanService } from '../services/headmanService';
import '../styles/HeadmanPanel.css';

const HeadmanPanel = () => {
  const { role } = useAuth();
  const [groupChoices, setGroupChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupChoices = async () => {
      try {
        const response = await headmanService.getGroupChoices();
        setGroupChoices(response.choices);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при получении данных группы:', err);
        setError('Не удалось загрузить данные группы');
        setLoading(false);
      }
    };

    fetchGroupChoices();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="headman-panel">
      <h2>Панель старосты</h2>
      <div className="group-choices">
        <h3>Статус питания группы</h3>
        <div className="choices-table">
          <table>
            <thead>
              <tr>
                <th>Имя пользователя</th>
                <th>Статус питания</th>
              </tr>
            </thead>
            <tbody>
              {groupChoices.map((student) => (
                <tr key={student.username}>
                  <td>{student.username}</td>
                  <td className={student.having_meal ? 'status-confirmed' : 'status-not-confirmed'}>
                    {student.having_meal ? 'Подтверждено' : 'Не подтверждено'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HeadmanPanel; 