import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import '../styles/MenuManagement.css';

const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner'
};

const MEAL_TITLES = {
  [MEAL_TYPES.BREAKFAST]: 'Завтрак',
  [MEAL_TYPES.LUNCH]: 'Обед',
  [MEAL_TYPES.DINNER]: 'Ужин'
};

const MenuItemCard = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [itemData, setItemData] = useState(item);
  const [preview, setPreview] = useState(item.imageUrl);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setItemData(prev => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const handleSave = () => {
    onUpdate(itemData);
    setIsEditing(false);
  };

  return (
    <div className="menu-item-card">
      {isEditing ? (
        <>
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            {preview ? (
              <img src={preview} alt="Preview" className="preview-image" />
            ) : (
              <p>Перетащите изображение или кликните для выбора</p>
            )}
          </div>
          <input
            type="text"
            value={itemData.name}
            onChange={(e) => setItemData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Название блюда"
            className="menu-item-input"
          />
          <input
            type="number"
            value={itemData.price}
            onChange={(e) => setItemData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="Цена"
            className="menu-item-input"
          />
          <textarea
            value={itemData.description}
            onChange={(e) => setItemData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Описание"
            className="menu-item-textarea"
          />
          <div className="card-actions">
            <button onClick={handleSave} className="save-button">Сохранить</button>
            <button onClick={() => setIsEditing(false)} className="cancel-button">Отмена</button>
          </div>
        </>
      ) : (
        <>
          <img src={preview} alt={itemData.name} className="menu-item-image" />
          <h4>{itemData.name}</h4>
          <p className="price">{itemData.price} ₽</p>
          <p className="description">{itemData.description}</p>
          <div className="card-actions">
            <button onClick={() => setIsEditing(true)} className="edit-button">Редактировать</button>
            <button onClick={() => onDelete(item.id)} className="delete-button">Удалить</button>
          </div>
        </>
      )}
    </div>
  );
};

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState({
    [MEAL_TYPES.BREAKFAST]: [],
    [MEAL_TYPES.LUNCH]: [],
    [MEAL_TYPES.DINNER]: []
  });

  const addMenuItem = (mealType) => {
    const newItem = {
      id: Date.now(),
      name: '',
      price: '',
      description: '',
      imageUrl: '',
      mealType
    };
    setMenuItems(prev => ({
      ...prev,
      [mealType]: [...prev[mealType], newItem]
    }));
  };

  const updateMenuItem = (mealType, updatedItem) => {
    setMenuItems(prev => ({
      ...prev,
      [mealType]: prev[mealType].map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    }));
  };

  const deleteMenuItem = (mealType, itemId) => {
    setMenuItems(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(item => item.id !== itemId)
    }));
  };

  const handleSaveMenu = async () => {
    try {
      const formData = new FormData();
      
      // Преобразуем структуру меню для отправки
      Object.entries(menuItems).forEach(([mealType, items]) => {
        items.forEach(item => {
          if (item.image) {
            formData.append(`images`, item.image, `${item.id}.${item.image.name.split('.').pop()}`);
          }
        });
      });
      
      formData.append('menu', JSON.stringify(menuItems));

      const response = await fetch('/api/admin/menu', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to save menu');
      }

      alert('Меню успешно сохранено');
    } catch (error) {
      console.error('Error saving menu:', error);
      alert('Ошибка при сохранении меню');
    }
  };

  return (
    <div className="menu-management">
      <div className="menu-actions">
        <button onClick={handleSaveMenu} className="save-menu-button">
          Сохранить меню
        </button>
      </div>
      
      {Object.entries(MEAL_TITLES).map(([mealType, title]) => (
        <div key={mealType} className="meal-section">
          <h3>{title}</h3>
          <div className="menu-items-grid">
            {menuItems[mealType].map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onUpdate={(updatedItem) => updateMenuItem(mealType, updatedItem)}
                onDelete={(itemId) => deleteMenuItem(mealType, itemId)}
              />
            ))}
            <button
              onClick={() => addMenuItem(mealType)}
              className="add-item-button"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuManagement; 