import { useState } from 'react';
import { studentService } from '../services/studentService';
import '../styles/MealConfirmation.css';

const MealConfirmation = () => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirmation = async (willEat) => {
        setLoading(true);
        try {
            await studentService.confirmMeal(willEat);
            setStatus(willEat ? 'Подтверждено' : 'Отменено');
        } catch (error) {
            setStatus('Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="meal-confirmation">
            <h3>Вы будете сегодня есть?</h3>
            <div className="confirmation-buttons">
                <button 
                    className="confirm-button"
                    onClick={() => handleConfirmation(true)}
                    disabled={loading}
                >
                    Да
                </button>
                <button 
                    className="decline-button"
                    onClick={() => handleConfirmation(false)}
                    disabled={loading}
                >
                    Нет
                </button>
            </div>
            {status && <p className="status-message">{status}</p>}
            {loading && <p className="loading-message">Загрузка...</p>}
        </div>
    );
};

export default MealConfirmation; 