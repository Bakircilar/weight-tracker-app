// src/components/FoodQuantityModal.js
import React, { useState, useEffect } from 'react';

const FoodQuantityModal = ({ food, onConfirm, onCancel }) => {
  const [quantity, setQuantity] = useState(100); // Varsayılan değer 100 gram
  const [calculatedNutrition, setCalculatedNutrition] = useState({...food.nutrition});
  
  // Miktar değiştiğinde besin değerlerini yeniden hesapla
  useEffect(() => {
    if (!food) return;
    
    const factor = quantity / 100; // 100 gram baz alınarak hesaplama faktörü
    
    setCalculatedNutrition({
      calories: Math.round(food.nutrition.calories * factor),
      protein: parseFloat((food.nutrition.protein * factor).toFixed(1)),
      carbs: parseFloat((food.nutrition.carbs * factor).toFixed(1)),
      fat: parseFloat((food.nutrition.fat * factor).toFixed(1))
    });
  }, [quantity, food]);
  
  const handleConfirm = () => {
    // Yeni besin değerleri ve miktar bilgisiyle birlikte yiyeceği döndür
    const updatedFood = {
      ...food,
      quantity: quantity,
      nutrition: calculatedNutrition
    };
    
    onConfirm(updatedFood);
  };
  
  // Miktar giriş alanını değiştirme işleme
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    
    // Geçerli bir sayı değilse veya negatifse, 0 olarak ayarla
    if (isNaN(value) || value < 0) {
      setQuantity(0);
    } else {
      setQuantity(value);
    }
  };
  
  // Hızlı miktar seçimi için ön tanımlı değerler
  const presetQuantities = [50, 100, 150, 200, 250];
  
  return (
    <div className="modal-overlay">
      <div className="quantity-modal">
        <div className="modal-header">
          <h3>Miktar Seçin</h3>
          <button className="btn-close" onClick={onCancel}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="food-preview">
            <div className="food-image-preview">
              {food.image ? (
                <img src={food.image} alt={food.name} />
              ) : (
                <div className="no-image">Görsel Yok</div>
              )}
            </div>
            <div className="food-info-preview">
              <h4>{food.name}</h4>
              <p className="food-category">{food.category}</p>
            </div>
          </div>
          
          <div className="quantity-input-group">
            <label htmlFor="quantity">Miktar (gram):</label>
            <div className="quantity-controls">
              <button 
                className="btn-qty-decrease" 
                onClick={() => setQuantity(prev => Math.max(5, prev - 5))}
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="0"
                step="5"
              />
              <button 
                className="btn-qty-increase" 
                onClick={() => setQuantity(prev => prev + 5)}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="preset-quantities">
            {presetQuantities.map((qty) => (
              <button 
                key={qty} 
                className={`preset-qty-btn ${quantity === qty ? 'active' : ''}`}
                onClick={() => setQuantity(qty)}
              >
                {qty}g
              </button>
            ))}
          </div>
          
          <div className="nutrition-preview">
            <h4>Besin Değerleri ({quantity}g)</h4>
            <div className="nutrition-values">
              <div className="nutrition-value">
                <span className="nutrition-label">Kalori</span>
                <span className="nutrition-amount">{calculatedNutrition.calories} kcal</span>
              </div>
              <div className="nutrition-value">
                <span className="nutrition-label">Protein</span>
                <span className="nutrition-amount">{calculatedNutrition.protein}g</span>
              </div>
              <div className="nutrition-value">
                <span className="nutrition-label">Karbonhidrat</span>
                <span className="nutrition-amount">{calculatedNutrition.carbs}g</span>
              </div>
              <div className="nutrition-value">
                <span className="nutrition-label">Yağ</span>
                <span className="nutrition-amount">{calculatedNutrition.fat}g</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onCancel}>İptal</button>
          <button className="btn-primary" onClick={handleConfirm}>Ekle</button>
        </div>
      </div>
    </div>
  );
};

export default FoodQuantityModal;