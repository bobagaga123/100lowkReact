import { useState, useEffect } from 'react';
import '../styles/DishCard.css';
import '../styles/Schedule.css';
import '../styles/Home.css';
import DishCard from '../components/DishCard.jsx'
import Schedule from '../components/Schedule.jsx';
import MealConfirmation from '../components/MealConfirmation.jsx';
import { menuService } from '../services/menuService';
import { sheduleService } from '../services/sheduleService';
import { useAuth } from '../contexts/AuthContext';

const categoryTranslations = {
  breakfast: 'Завтраки',
  lunch: 'Обеды',
  dinner: 'Ужины'
};

const Home = () => { 
  const [products, setProducts] = useState({});
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [error, setError] = useState(null);
  const { role } = useAuth();

  useEffect(() => {
    async function fetchMenu() {
      try {
        const data = await menuService.getMenu();
        console.log('Меню пришло:', data);
        if (data.menu) {
          setProducts(data.menu);
        }
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при получении меню:', err);
        setError('Не удалось загрузить меню');
        setLoading(false);
      }
    }
    
    async function fetchShedule() {
      try {
        const data = await sheduleService.getShedule();
        console.log('Расписание пришло:', data.schedule);
        if (data.schedule) {
          setSchedule(data.schedule);
        }
        setScheduleLoading(false);
      } catch (err) {
        console.error('Ошибка при получении расписания:', err);
        setError('Не удалось загрузить расписание');
        setScheduleLoading(false);
      }
    }
      
      // fetchMenu();
      // fetchShedule();
  }, []);

  // if (loading || scheduleLoading) {
  //   return <div>Загрузка...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <div>
      
      
      <div id="menu">
        <h2>Меню</h2>
        {(role === 'student' || role === 'group_head') && <MealConfirmation />}
        <div className="menu-categories">
          {Object.entries(products).map(([category, items]) => (
            <div key={category} className="menu-section">
              <h3>{categoryTranslations[category] || category}</h3>
              <div className="dish-grid">
                {items.map((item) => (
                  <DishCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="schedule">
        <Schedule schedule={schedule} />
      </div>

      <div id="contacts" className="contacts-container">
        <h2 className="contacts-title">Контакты</h2>
        <div className="contacts-content">
          <p>Адрес: ул. Примерная, д. 123</p>
          <p>Телефон: +7 (123) 456-78-90</p>
          <p>Email: example@example.com</p>
          <p>Часы работы: Пн-Пт 9:00-18:00</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 

