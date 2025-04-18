// src/components/MealFoodManager.js - API yerine yerel veritabanı kullanan güncellenmiş versiyon
import React, { useState, useEffect } from 'react';
import LocalFoodSearch from './LocalFoodSearch';
import MealFoodList from './MealFoodList';

const MealFoodManager = ({ supabase, mealPlanId, maxCalories, onSave, onCancel }) => {
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Mevcut öğünün yiyeceklerini yükle
    const loadFoods = async () => {
      if (!mealPlanId) return;
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('food_items')
          .select('*')
          .eq('meal_plan_id', mealPlanId);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Verilerden yiyecek nesneleri oluştur
          const foods = data.map(item => ({
            id: item.id,
            name: item.food_name,
            category: item.category || '',
            image: item.image || '',
            nutrition: {
              calories: item.calories,
              protein: item.protein,
              carbs: item.carbs,
              fat: item.fat
            }
          }));
          
          setSelectedFoods(foods);
        }
      } catch (error) {
        console.error('Yiyecekleri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFoods();
  }, [mealPlanId, supabase]);
  
  const handleAddFood = (food) => {
    setSelectedFoods(prev => [...prev, food]);
  };
  
  const handleRemoveFood = (index) => {
    setSelectedFoods(prev => prev.filter((_, i) => i !== index));
  };
  
  const calculateTotalCalories = () => {
    return selectedFoods.reduce((total, food) => total + (food.nutrition.calories || 0), 0);
  };
  
  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Önce bu öğün planına ait tüm yiyecekleri sil
      if (mealPlanId) {
        await supabase
          .from('food_items')
          .delete()
          .eq('meal_plan_id', mealPlanId);
      }
      
      // Yeni yiyecekleri ekle
      if (selectedFoods.length > 0) {
        const foodItems = selectedFoods.map(food => ({
          meal_plan_id: mealPlanId,
          food_name: food.name,
          category: food.category || null,
          image: food.image || null,
          quantity: 1,
          unit: 'portion',
          calories: Math.round(food.nutrition.calories),
          protein: food.nutrition.protein,
          carbs: food.nutrition.carbs,
          fat: food.nutrition.fat
        }));
        
        const { error } = await supabase
          .from('food_items')
          .insert(foodItems);
          
        if (error) throw error;
      }
      
      // Toplam kaloriyi ve yiyecek sayısını döndür
      onSave({
        totalCalories: calculateTotalCalories(),
        foodCount: selectedFoods.length
      });
    } catch (error) {
      console.error('Yiyecek kaydetme hatası:', error);
      alert('Yiyecekler kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="meal-food-manager">
      <div className="manager-header">
        <h3>Öğün Yiyecekleri</h3>
        {maxCalories && (
          <div className="calorie-limit">
            <span>Kalori Limiti: {maxCalories} kcal</span>
          </div>
        )}
      </div>
      
      <div className="manager-content">
        <div className="search-section">
          <h4>Yiyecek Ara ve Ekle</h4>
          <LocalFoodSearch 
            onFoodSelect={handleAddFood} 
            maxCalories={maxCalories && (maxCalories - calculateTotalCalories())}
          />
        </div>
        
        <div className="selected-foods-section">
          <MealFoodList 
            foods={selectedFoods} 
            totalCalories={calculateTotalCalories()}
            maxCalories={maxCalories}
            onRemove={handleRemoveFood}
          />
        </div>
      </div>
      
      <div className="manager-footer">
        <button 
          className="btn-primary save-btn" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        <button 
          className="btn-secondary cancel-btn" 
          onClick={onCancel}
          disabled={loading}
        >
          İptal
        </button>
      </div>
    </div>
  );
};

export default MealFoodManager;