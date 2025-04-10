import React from 'react';
import '../styles/DishCard.css';

const DishCard = ({ product }) => {
  return (
    <div className="dish-card">
      <img 
        src={product.image} 
        alt={product.name} 
        className="menu-image"
      />
      <h3 className="dish-title">{product.name}</h3>
      <p className="dish-description">{product.description}</p>
      <div className="price">{product.price} ₽</div>
      <button className="btn primary">Подробнее</button>
    </div>
  );
};

export default DishCard;