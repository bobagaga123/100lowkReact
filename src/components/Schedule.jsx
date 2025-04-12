import React from 'react';
import '../styles/Schedule.css';

const Schedule = ({ schedule }) => {
  const daysOfWeek = [
    { key: 'monday', name: 'Понедельник' },
    { key: 'tuesday', name: 'Вторник' },
    { key: 'wednesday', name: 'Среда' },
    { key: 'thursday', name: 'Четверг' },
    { key: 'friday', name: 'Пятница' },
    { key: 'saturday', name: 'Суббота' },
    { key: 'sunday', name: 'Воскресенье' }
  ];

  return (
    <div id="schedule" className="schedule-container">
      <h2 className="schedule-title">Расписание работы столовой</h2>
      <div className="schedule-days">
        {daysOfWeek.map((day) => (
          <div key={day.key} className="schedule-day">
            <h3 className="day-title">{day.name}</h3>
            <div className="meal-cards">
              <div className="meal-card">
                <div className="meal-title">Завтрак</div>
                <div className="meal-time">
                  {schedule[day.key]?.breakfast?.start} - {schedule[day.key]?.breakfast?.end}
                </div>
              </div>
              <div className="meal-card">
                <div className="meal-title">Обед</div>
                <div className="meal-time">
                  {schedule[day.key]?.lunch?.start} - {schedule[day.key]?.lunch?.end}
                </div>
              </div>
              <div className="meal-card">
                <div className="meal-title">Ужин</div>
                <div className="meal-time">
                  {schedule[day.key]?.dinner?.start} - {schedule[day.key]?.dinner?.end}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="schedule-note">
        * В праздничные дни график работы может быть изменен
      </div>
    </div>
  );
};

export default Schedule; 