// src/components/ImprovedFoodQuantityModal.js
import React, { useState, useEffect } from 'react';

const ImprovedFoodQuantityModal = ({ food, onConfirm, onCancel, maxCalories }) => {
  const [quantity, setQuantity] = useState(100); // Varsayılan değer 100 gram
  const [calculatedNutrition, setCalculatedNutrition] = useState({...food.nutrition});
  const [errorMessage, setErrorMessage] = useState('');
  const [maxAllowedQuantity, setMaxAllowedQuantity] = useState(1000); // Varsayılan maksimum miktar
  
  // Maksimum izin verilen miktar hesapla
  useEffect(() => {
    if (food && maxCalories) {
      // 100g için kalori değeri
      const caloriesPer100g = food.nutrition.calories;
      
      if (caloriesPer100g > 0) {
        // Maksimum izin verilen miktar (g) = (maxCalories / caloriesPer100g) * 100
        const maxQuantity = Math.floor((maxCalories / caloriesPer100g) * 100);
        setMaxAllowedQuantity(maxQuantity);
        
        // Eğer varsayılan miktar maksimumdan fazlaysa, maksimum değere ayarla
        if (quantity > maxQuantity) {
          setQuantity(maxQuantity);
        }
      }
    }
  }, [food, maxCalories]);
  
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
    
    // Kalori sınırı kontrolü
    if (maxCalories && calculatedNutrition.calories > maxCalories) {
      setErrorMessage(`Bu miktar kalori sınırını aşıyor. Maksimum ${maxAllowedQuantity}g ekleyebilirsiniz.`);
    } else {
      setErrorMessage('');
    }
  }, [quantity, food, maxCalories]);
  
  const handleConfirm = () => {
    // Kalori limiti kontrolü
    if (maxCalories && calculatedNutrition.calories > maxCalories) {
      return; // Limit aşılıyorsa işlem yapma
    }
    
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
  const presetQuantities = [25, 50, 75, 100, 150, 200];
  
  // Kalan kalori miktarını göster
  const getRemainingCalories = () => {
    if (!maxCalories) return null;
    
    const remaining = maxCalories - calculatedNutrition.calories;
    return (
      <div className={`remaining-calories ${remaining < 0 ? 'negative' : 'positive'}`}>
        <span>Kalan kalori: {remaining} kcal</span>
      </div>
    );
  };
  
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
              {maxCalories && (
                <p className="max-quantity-note">
                  <span>Maksimum eklenebilir: {maxAllowedQuantity}g</span>
                  <span>(100g = {food.nutrition.calories} kcal)</span>
                </p>
              )}
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
                max={maxAllowedQuantity || 1000}
                step="5"
              />
              <button 
                className="btn-qty-increase" 
                onClick={() => setQuantity(prev => Math.min(maxAllowedQuantity || 1000, prev + 5))}
              >
                +
              </button>
            </div>
            
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          
          <div className="preset-quantities">
            {presetQuantities.map((qty) => (
              <button 
                key={qty} 
                className={`preset-qty-btn ${quantity === qty ? 'active' : ''}`}
                onClick={() => setQuantity(qty)}
                disabled={maxAllowedQuantity && qty > maxAllowedQuantity}
              >
                {qty}g
              </button>
            ))}
            
            {maxAllowedQuantity < 200 && maxAllowedQuantity > 0 && (
              <button 
                className={`preset-qty-btn ${quantity === maxAllowedQuantity ? 'active' : ''}`}
                onClick={() => setQuantity(maxAllowedQuantity)}
              >
                {maxAllowedQuantity}g
              </button>
            )}
          </div>
          
          <div className="nutrition-preview">
            <h4>Besin Değerleri ({quantity}g)</h4>
            {getRemainingCalories()}
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
          <button 
            className="btn-primary" 
            onClick={handleConfirm}
            disabled={maxCalories && calculatedNutrition.calories > maxCalories}
          >
            {maxCalories && calculatedNutrition.calories > maxCalories 
              ? 'Kalori Sınırı Aşıldı'
              : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImprovedFoodQuantityModal;