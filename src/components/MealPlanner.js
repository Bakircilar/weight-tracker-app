// src/components/MealPlanner.js
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import MealFoodManager from './MealFoodManager';

const MealPlanner = ({ supabase }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [mealPlan, setMealPlan] = useState({});
  const [loading, setLoading] = useState(true);
  const [completedMeals, setCompletedMeals] = useState({});
  const [foodData, setFoodData] = useState({});
  const [editingMeal, setEditingMeal] = useState(null);

  // Haftanın günleri
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  
  // Öğün tipleri
  const mealTypes = ['Kahvaltı', 'Öğle Yemeği', 'Akşam Yemeği', 'Ara Öğün'];

  useEffect(() => {
    generateWeekDays(currentDate);
    fetchMealPlan();
    fetchCompletedMeals();
    fetchFoodData();
  }, [currentDate]);

  // Haftanın günlerini oluştur
  const generateWeekDays = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Pazartesi'den başla
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }
    
    setWeekDays(days);
  };

  // Beslenme planını getir
  const fetchMealPlan = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*');
        
      if (error) throw error;
      
      // Verileri gün bazında düzenle
      const planByDay = {};
      
      data.forEach(meal => {
        if (!planByDay[meal.day]) {
          planByDay[meal.day] = {};
        }
        
        planByDay[meal.day][meal.meal_type] = {
          id: meal.id,
          title: meal.title,
          description: meal.description,
          calories: meal.calories
        };
      });
      
      setMealPlan(planByDay);
    } catch (error) {
      console.error('Beslenme planı çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tamamlanan öğünleri getir
  const fetchCompletedMeals = async () => {
    try {
      const { data, error } = await supabase
        .from('completed_meals')
        .select('*');
        
      if (error) throw error;
      
      // Verileri gün ve öğün bazında düzenle
      const completed = {};
      
      data.forEach(item => {
        const dateKey = format(new Date(item.date), 'yyyy-MM-dd');
        
        if (!completed[dateKey]) {
          completed[dateKey] = {};
        }
        
        completed[dateKey][item.meal_type] = true;
      });
      
      setCompletedMeals(completed);
    } catch (error) {
      console.error('Tamamlanan öğünleri çekme hatası:', error);
    }
  };

  // Öğünlere ait yiyecek verilerini getir
  const fetchFoodData = async () => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*');
        
      if (error) throw error;
      
      // Verileri öğün kimliğine göre düzenle
      const foodsByMeal = {};
      
      data.forEach(item => {
        if (!foodsByMeal[item.meal_plan_id]) {
          foodsByMeal[item.meal_plan_id] = [];
        }
        
        foodsByMeal[item.meal_plan_id].push(item);
      });
      
      setFoodData(foodsByMeal);
    } catch (error) {
      console.error('Yiyecek verisi çekme hatası:', error);
    }
  };

  // Öğünü tamamlandı/tamamlanmadı olarak işaretle
  const toggleMealCompletion = async (date, mealType, isCompleted) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    try {
      if (isCompleted) {
        // Tamamlanan öğünü kaldır
        const { error } = await supabase
          .from('completed_meals')
          .delete()
          .match({ date: dateStr, meal_type: mealType });
          
        if (error) throw error;
      } else {
        // Yeni tamamlanan öğün ekle
        const { error } = await supabase
          .from('completed_meals')
          .insert([{ date: dateStr, meal_type: mealType }]);
          
        if (error) throw error;
      }
      
      // State'i güncelle
      setCompletedMeals(prev => {
        const updated = { ...prev };
        
        if (!updated[dateStr]) {
          updated[dateStr] = {};
        }
        
        if (isCompleted) {
          delete updated[dateStr][mealType];
        } else {
          updated[dateStr][mealType] = true;
        }
        
        return updated;
      });
    } catch (error) {
      console.error('Öğün tamamlama hatası:', error);
    }
  };

  const isMealCompleted = (date, mealType) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return completedMeals[dateStr] && completedMeals[dateStr][mealType];
  };

  // Bir önceki haftaya git
  const previousWeek = () => {
    setCurrentDate(prev => addDays(prev, -7));
  };

  // Bir sonraki haftaya git
  const nextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };

  // Bugüne git
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Yiyecek editörünü aç
  const openFoodEditor = (mealId) => {
    setEditingMeal(mealId);
  };

  // Yiyecek düzenleme işlemini tamamla
  const handleFoodSave = async (mealId, data) => {
    try {
      // Öğünün toplam kalorisini güncelle
      await supabase
        .from('meal_plans')
        .update({ 
          calories: data.totalCalories,
          description: `${data.foodCount} yiyecek (${data.totalCalories} kcal)`
        })
        .eq('id', mealId);
        
      // Verileri yeniden yükle
      fetchMealPlan();
      fetchFoodData();
      
      // Düzenleme modunu kapat
      setEditingMeal(null);
    } catch (error) {
      console.error('Öğün güncelleme hatası:', error);
    }
  };

  // Öğünün yiyeceklerini görüntüle
  const renderFoodItems = (mealId) => {
    const foods = foodData[mealId] || [];
    
    if (foods.length === 0) {
      return <p className="no-foods">Yiyecek eklenmemiş</p>;
    }
    
    return (
      <div className="food-items-list">
        <h5>Yiyecekler:</h5>
        <ul>
          {foods.map(food => (
            <li key={food.id} className="food-item-small">
              <span className="food-name">{food.food_name}</span>
              <span className="food-calories">{food.calories} kcal</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="meal-planner">
      <h2>Beslenme Planı</h2>
      
      <div className="week-navigation">
        <button onClick={previousWeek}>&lt; Önceki Hafta</button>
        <button onClick={goToToday}>Bugün</button>
        <button onClick={nextWeek}>Sonraki Hafta &gt;</button>
      </div>
      
      {editingMeal ? (
        <div className="meal-editor-overlay">
          <div className="meal-editor-container">
            <MealFoodManager 
              supabase={supabase} 
              mealPlanId={editingMeal} 
              maxCalories={mealPlan[days[0]]?.Kahvaltı?.calories || 500}
              onSave={(data) => handleFoodSave(editingMeal, data)}
              onCancel={() => setEditingMeal(null)}
            />
          </div>
        </div>
      ) : (
        <div className="week-view">
          {weekDays.map((date, index) => (
            <div 
              key={index} 
              className={`day-card ${format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'today' : ''}`}
            >
              <div className="day-header">
                <h3>{days[index]}</h3>
                <span>{format(date, 'd MMMM', { locale: tr })}</span>
              </div>
              
              <div className="meals">
                {mealTypes.map(mealType => {
                  const dayName = days[index];
                  const meal = mealPlan[dayName] && mealPlan[dayName][mealType];
                  const completed = isMealCompleted(date, mealType);
                  
                  return (
                    <div key={mealType} className={`meal ${completed ? 'completed' : ''}`}>
                      <div className="meal-header">
                        <h4>{mealType}</h4>
                        {meal && <span>{meal.calories} kcal</span>}
                      </div>
                      
                      {meal ? (
                        <>
                          <p className="meal-title">{meal.title}</p>
                          <p className="meal-description">{meal.description}</p>
                          
                          {/* Yiyecek listesi */}
                          {renderFoodItems(meal.id)}
                          
                          <div className="meal-actions">
                            <button 
                              className="btn-sm btn-primary edit-foods-btn"
                              onClick={() => openFoodEditor(meal.id)}
                            >
                              Yiyecekleri Düzenle
                            </button>
                            
                            <label className="checkbox-container">
                              <input 
                                type="checkbox" 
                                checked={completed}
                                onChange={() => toggleMealCompletion(date, mealType, completed)}
                              />
                              <span className="checkmark"></span>
                              Tamamlandı
                            </label>
                          </div>
                        </>
                      ) : (
                        <p className="no-meal">Bu gün için öğün tanımlanmamış.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealPlanner;