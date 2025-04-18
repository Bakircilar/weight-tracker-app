// src/components/MealPlanner.js
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';

const MealPlanner = ({ supabase }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [mealPlan, setMealPlan] = useState({});
  const [loading, setLoading] = useState(true);
  const [completedMeals, setCompletedMeals] = useState({});

  // Haftanın günleri
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  
  // Öğün tipleri
  const mealTypes = ['Kahvaltı', 'Öğle Yemeği', 'Akşam Yemeği', 'Ara Öğün'];

  useEffect(() => {
    generateWeekDays(currentDate);
    fetchMealPlan();
    fetchCompletedMeals();
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
                        
                        <label className="checkbox-container">
                          <input 
                            type="checkbox" 
                            checked={completed}
                            onChange={() => toggleMealCompletion(date, mealType, completed)}
                          />
                          <span className="checkmark"></span>
                          Tamamlandı
                        </label>
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
    </div>
  );
};

export default MealPlanner;