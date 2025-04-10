import { useState, useEffect } from 'react';
import '../styles/DishCard.css';
import DishCard from '../components/DishCard.jsx'
import Header from '../components/Header.jsx';
import { menuService } from '../services/menuService';

const Home = () => { 
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    
    fetchMenu();
  }, []);

  if (error) {
    return (
      <>
        <Header />
        <div>{error}</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="products-container">
        <h1 className="menu-title">Меню на сегодня</h1>
        
        {products.breakfast && (
          <div className="menu-section">
            
            <div className="section-container">
            <h2 className="section-title">Завтрак</h2>
              {products.breakfast.map((product) => (
                <DishCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
        
        {products.lunch && (
          <div className="menu-section">
            <h2 className="section-title">Обед</h2>
            <div className="section-container">
              {products.lunch.map((product) => (
                <DishCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
        
        {products.dinner && (
          <div className="menu-section">
            <h2 className="section-title">Ужин</h2>
            <div className="section-container">
              {products.dinner.map((product) => (
                <DishCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home; 

