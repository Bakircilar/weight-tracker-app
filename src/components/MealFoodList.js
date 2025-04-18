// src/components/MealFoodList.js - Miktar gösterimli versiyon
import React from 'react';

const MealFoodList = ({ foods, totalCalories, maxCalories, onRemove }) => {
  // Toplam besin değerlerini hesapla
  const calcTotalNutrition = () => {
    return foods.reduce((total, food) => {
      return {
        calories: total.calories + (food.nutrition.calories || 0),
        protein: total.protein + (food.nutrition.protein || 0),
        carbs: total.carbs + (food.nutrition.carbs || 0),
        fat: total.fat + (food.nutrition.fat || 0)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };
  
  const totalNutrition = calcTotalNutrition();
  const caloriePercentage = maxCalories ? Math.min(100, (totalNutrition.calories / maxCalories) * 100) : 0;
  
  return (
    <div className="meal-food-list">
      <div className="nutrition-summary">
        <h4>Besin Değerleri</h4>
        <div className="nutrition-stats">
          <div className="nutrition-stat">
            <span className="stat-label">Kalori:</span>
            <span className="stat-value">{Math.round(totalNutrition.calories)} kcal</span>
          </div>
          <div className="nutrition-stat">
            <span className="stat-label">Protein:</span>
            <span className="stat-value">{totalNutrition.protein.toFixed(1)}g</span>
          </div>
          <div className="nutrition-stat">
            <span className="stat-label">Karbonhidrat:</span>
            <span className="stat-value">{totalNutrition.carbs.toFixed(1)}g</span>
          </div>
          <div className="nutrition-stat">
            <span className="stat-label">Yağ:</span>
            <span className="stat-value">{totalNutrition.fat.toFixed(1)}g</span>
          </div>
        </div>
        
        {maxCalories && (
          <div className="calorie-progress">
            <div className="progress-label">
              <span>Kalori Limiti: {Math.round(totalNutrition.calories)} / {maxCalories} kcal</span>
              <span>{caloriePercentage.toFixed(0)}%</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${caloriePercentage}%`,
                  backgroundColor: caloriePercentage > 100 ? '#e74c3c' : caloriePercentage > 80 ? '#f39c12' : '#27ae60'
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      {foods.length > 0 ? (
        <div className="foods-container">
          <h4>Eklenen Yiyecekler</h4>
          <ul className="selected-foods-list">
            {foods.map((food, index) => (
              <li key={`${food.id}-${index}`} className="selected-food-item">
                <div className="selected-food-info">
                  <div className="food-name">{food.name}</div>
                  <div className="food-details-small">
                    <span className="food-quantity">{food.quantity || 100}g</span>
                    <span className="food-calories">{Math.round(food.nutrition.calories)} kcal</span>
                  </div>
                </div>
                <button
                  className="btn-sm btn-danger remove-food-btn"
                  onClick={() => onRemove(index)}
                >
                  Kaldır
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="no-foods">Henüz yiyecek eklenmedi</p>
      )}
    </div>
  );
};

export default MealFoodList;