// src/components/ImprovedMealPlanner.js
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import MealFoodManager from './MealFoodManager';

const ImprovedMealPlanner = ({ supabase }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [mealPlan, setMealPlan] = useState({});
  const [loading, setLoading] = useState(true);
  const [completedMeals, setCompletedMeals] = useState({});
  const [foodData, setFoodData] = useState({});
  const [editingMeal, setEditingMeal] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0); // 0 = Pazartesi, 6 = Pazar
  const [calorieSummary, setCalorieSummary] = useState({
    totalDailyCalories: 0,
    mealCalories: {}
  });

  // Haftanın günleri
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  
  // Öğün tipleri
  const mealTypes = ['Kahvaltı', 'Öğle Yemeği', 'Akşam Yemeği', 'Ara Öğün'];

  useEffect(() => {
    generateWeekDays(currentDate);
    fetchMealPlan();
    fetchCompletedMeals();
    fetchFoodData();
    fetchTemplates();
  }, [currentDate]);

  useEffect(() => {
    calculateCalorieSummary();
  }, [mealPlan, foodData]);

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
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id);
        
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
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('completed_meals')
        .select('*')
        .eq('user_id', user.id);
        
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

  // Öğün şablonlarını getir
  const fetchTemplates = async () => {
    try {
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('meal_templates')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setTemplates(data || []);
    } catch (error) {
      console.error('Şablonları çekme hatası:', error);
    }
  };

  // Öğünlere ait yiyecek verilerini getir
  const fetchFoodData = async () => {
    try {
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('user_id', user.id);
        
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
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      if (isCompleted) {
        // Tamamlanan öğünü kaldır
        const { error } = await supabase
          .from('completed_meals')
          .delete()
          .match({ date: dateStr, meal_type: mealType, user_id: user.id });
          
        if (error) throw error;
      } else {
        // Yeni tamamlanan öğün ekle
        const { error } = await supabase
          .from('completed_meals')
          .insert([{ date: dateStr, meal_type: mealType, user_id: user.id }]);
          
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
    
    // Bugünün haftanın hangi günü olduğunu bul ve aktif gün olarak ayarla
    const today = new Date();
    const dayIndex = today.getDay();
    // getDay() 0 (Pazar) - 6 (Cumartesi) döner, biz 0 (Pazartesi) - 6 (Pazar) kullanıyoruz
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    setActiveDayIndex(adjustedIndex);
  };

  // Yiyecek editörünü aç
  const openFoodEditor = (mealId) => {
    setEditingMeal(mealId);
  };

  // Yiyecek düzenleme işlemini tamamla
  const handleFoodSave = async (mealId, data) => {
    try {
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      // Öğünün toplam kalorisini güncelle
      await supabase
        .from('meal_plans')
        .update({ 
          calories: data.totalCalories,
          description: `${data.foodCount} yiyecek (${data.totalCalories} kcal)`
        })
        .eq('id', mealId)
        .eq('user_id', user.id);
        
      // Verileri yeniden yükle
      fetchMealPlan();
      fetchFoodData();
      calculateCalorieSummary();
      
      // Düzenleme modunu kapat
      setEditingMeal(null);
    } catch (error) {
      console.error('Öğün güncelleme hatası:', error);
    }
  };

  // Yeni öğün oluştur
  const createMeal = async (day, mealType) => {
    try {
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('meal_plans')
        .insert([{
          day,
          meal_type: mealType,
          title: `${mealType}`,
          description: '0 yiyecek (0 kcal)',
          calories: 0,
          user_id: user.id
        }])
        .select();
        
      if (error) throw error;
      
      // Plan state'ini güncelle
      setMealPlan(prev => {
        const updated = { ...prev };
        
        if (!updated[day]) {
          updated[day] = {};
        }
        
        updated[day][mealType] = {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description,
          calories: data[0].calories
        };
        
        return updated;
      });
      
      // Yeni oluşturulan öğünü düzenleme modunda aç
      setEditingMeal(data[0].id);
    } catch (error) {
      console.error('Öğün oluşturma hatası:', error);
    }
  };

  // Öğünü sil
  const deleteMeal = async (mealId, day, mealType) => {
    if (!window.confirm('Bu öğünü silmek istediğinize emin misiniz?')) return;
    
    try {
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      // Önce öğüne ait tüm yiyecekleri sil
      await supabase
        .from('food_items')
        .delete()
        .eq('meal_plan_id', mealId)
        .eq('user_id', user.id);
      
      // Sonra öğünü sil
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', mealId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Plan state'ini güncelle
      setMealPlan(prev => {
        const updated = { ...prev };
        
        if (updated[day] && updated[day][mealType]) {
          delete updated[day][mealType];
        }
        
        return updated;
      });
      
      // Yiyecek verilerini güncelle
      setFoodData(prev => {
        const updated = { ...prev };
        delete updated[mealId];
        return updated;
      });
      
      calculateCalorieSummary();
    } catch (error) {
      console.error('Öğün silme hatası:', error);
    }
  };

  // Günlük kalori toplamını hesapla
  const calculateCalorieSummary = () => {
    const summary = {
      totalDailyCalories: 0,
      mealCalories: {}
    };
    
    // Her gün için özetleme
    days.forEach(day => {
      summary.mealCalories[day] = {
        total: 0,
        meals: {}
      };
      
      // Her öğün için kalorileri hesapla
      if (mealPlan[day]) {
        Object.entries(mealPlan[day]).forEach(([mealType, meal]) => {
          summary.mealCalories[day].meals[mealType] = meal.calories || 0;
          summary.mealCalories[day].total += meal.calories || 0;
        });
      }
    });
    
    // Aktif gün için toplam kalori
    if (days[activeDayIndex] && summary.mealCalories[days[activeDayIndex]]) {
      summary.totalDailyCalories = summary.mealCalories[days[activeDayIndex]].total;
    }
    
    setCalorieSummary(summary);
  };

  // Öğün şablonunu kaydet
  const saveAsTemplate = async () => {
    if (!templateName.trim()) {
      alert('Lütfen şablon için bir isim girin');
      return;
    }
    
    setSavingTemplate(true);
    
    try {
      // Aktif günün şablonunu oluştur
      const dayName = days[activeDayIndex];
      const dayMeals = mealPlan[dayName] || {};
      
      // Şablon verisini oluştur
      const templateData = {};
      
      Object.entries(dayMeals).forEach(([mealType, meal]) => {
        templateData[mealType] = {
          title: meal.title,
          calories: meal.calories,
          foods: foodData[meal.id] || []
        };
      });
      
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      // Şablonu kaydet
      const { error } = await supabase
        .from('meal_templates')
        .insert([{
          name: templateName,
          template_data: JSON.stringify(templateData),
          total_calories: calorieSummary.mealCalories[dayName]?.total || 0,
          user_id: user.id
        }]);
        
      if (error) throw error;
      
      // Şablonları yeniden yükle
      fetchTemplates();
      
      // Formu temizle
      setTemplateName('');
      setShowTemplateForm(false);
    } catch (error) {
      console.error('Şablon kaydetme hatası:', error);
      alert('Şablon kaydedilirken bir hata oluştu');
    } finally {
      setSavingTemplate(false);
    }
  };

  // Şablonu uygula
  const applyTemplate = async (templateId) => {
    try {
      // Şablonu al
      const template = templates.find(t => t.id === templateId);
      if (!template) return;
      
      const dayName = days[activeDayIndex];
      const selectedDate = weekDays[activeDayIndex];
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      // Şablon verisini ayrıştır
      const templateData = JSON.parse(template.template_data);
      
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      // Mevcut öğünleri sil
      if (mealPlan[dayName]) {
        const mealIds = Object.values(mealPlan[dayName]).map(meal => meal.id);
        
        // Önce yiyecekleri sil
        if (mealIds.length > 0) {
          await supabase
            .from('food_items')
            .delete()
            .in('meal_plan_id', mealIds)
            .eq('user_id', user.id);
          
          // Sonra öğünleri sil
          await supabase
            .from('meal_plans')
            .delete()
            .in('id', mealIds)
            .eq('user_id', user.id);
        }
      }
      
      // Şablondaki öğünleri ekle
      for (const [mealType, mealData] of Object.entries(templateData)) {
        // Öğünü ekle
        const { data: newMeal, error: mealError } = await supabase
          .from('meal_plans')
          .insert([{
            day: dayName,
            meal_type: mealType,
            title: mealData.title,
            description: `${mealData.foods.length} yiyecek (${mealData.calories} kcal)`,
            calories: mealData.calories,
            user_id: user.id
          }])
          .select();
          
        if (mealError) throw mealError;
        
        // Yiyecekleri ekle
        if (mealData.foods.length > 0) {
          const foodItems = mealData.foods.map(food => ({
            meal_plan_id: newMeal[0].id,
            food_name: food.food_name,
            category: food.category,
            image: food.image,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            quantity: food.quantity || 100,
            unit: food.unit || 'gram',
            user_id: user.id
          }));
          
          const { error: foodError } = await supabase
            .from('food_items')
            .insert(foodItems);
            
          if (foodError) throw foodError;
        }
      }
      
      // Verileri yeniden yükle
      fetchMealPlan();
      fetchFoodData();
      calculateCalorieSummary();
      alert('Şablon başarıyla uygulandı!');
    } catch (error) {
      console.error('Şablon uygulama hatası:', error);
      alert('Şablon uygulanırken bir hata oluştu');
    }
  };

  // Şablonu sil
  const deleteTemplate = async (templateId) => {
    if (!window.confirm('Bu şablonu silmek istediğinize emin misiniz?')) return;
    
    try {
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('meal_templates')
        .delete()
        .eq('id', templateId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Şablonları yeniden yükle
      fetchTemplates();
    } catch (error) {
      console.error('Şablon silme hatası:', error);
      alert('Şablon silinirken bir hata oluştu');
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
              <span className="food-quantity">{food.quantity || 100}g</span>
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
    <div className="improved-meal-planner">
      <h2>Beslenme Planı</h2>
      
      <div className="planner-header">
        <div className="week-navigation">
          <button className="btn-secondary" onClick={previousWeek}>&lt; Önceki Hafta</button>
          <button className="btn-primary" onClick={goToToday}>Bugün</button>
          <button className="btn-secondary" onClick={nextWeek}>Sonraki Hafta &gt;</button>
        </div>
        
        <div className="calorie-summary">
          <span className="summary-label">Günlük Kalori Toplamı:</span>
          <span className="summary-value">{calorieSummary.totalDailyCalories} kcal</span>
        </div>
      </div>
      
      <div className="day-tabs">
        {weekDays.map((date, index) => (
          <button 
            key={index}
            className={`day-tab ${index === activeDayIndex ? 'active' : ''} ${isSameDay(date, new Date()) ? 'today' : ''}`}
            onClick={() => setActiveDayIndex(index)}
          >
            <span className="day-name">{days[index]}</span>
            <span className="day-date">{format(date, 'd MMM', { locale: tr })}</span>
          </button>
        ))}
      </div>
      
      {editingMeal ? (
        <div className="meal-editor-overlay">
          <div className="meal-editor-container">
            <MealFoodManager 
              supabase={supabase} 
              mealPlanId={editingMeal} 
              maxCalories={2500}
              onSave={(data) => handleFoodSave(editingMeal, data)}
              onCancel={() => setEditingMeal(null)}
            />
          </div>
        </div>
      ) : (
        <div className="meal-day-view">
          <div className="meal-day-header">
            <h3>{days[activeDayIndex]} - {format(weekDays[activeDayIndex], 'd MMMM yyyy', { locale: tr })}</h3>
            
            <div className="template-actions">
              <button 
                className="btn-secondary btn-sm"
                onClick={() => setShowTemplateForm(!showTemplateForm)}
              >
                {showTemplateForm ? 'İptal' : 'Şablon Olarak Kaydet'}
              </button>
              
              <select 
                className="template-select"
                onChange={(e) => {
                  if (e.target.value) {
                    applyTemplate(parseInt(e.target.value));
                    e.target.value = '';
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Şablon Uygula</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.total_calories} kcal)
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {showTemplateForm && (
            <div className="template-form">
              <div className="form-group">
                <label htmlFor="templateName">Şablon Adı:</label>
                <div className="template-input-group">
                  <input
                    type="text"
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Örn: Hafta İçi Planım"
                    required
                  />
                  <button 
                    className="btn-primary"
                    onClick={saveAsTemplate}
                    disabled={savingTemplate || !templateName.trim()}
                  >
                    {savingTemplate ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </div>
              
              <div className="template-list">
                <h4>Kayıtlı Şablonlar</h4>
                {templates.length === 0 ? (
                  <p>Henüz kaydedilmiş şablon bulunmuyor.</p>
                ) : (
                  <ul className="templates">
                    {templates.map(template => (
                      <li key={template.id} className="template-item">
                        <div className="template-info">
                          <span className="template-name">{template.name}</span>
                          <span className="template-calories">{template.total_calories} kcal</span>
                        </div>
                        <div className="template-actions">
                          <button 
                            className="btn-secondary btn-sm"
                            onClick={() => applyTemplate(template.id)}
                          >
                            Uygula
                          </button>
                          <button 
                            className="btn-danger btn-sm"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            Sil
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          
          <div className="meals-container">
            {mealTypes.map(mealType => {
              const dayName = days[activeDayIndex];
              const meal = mealPlan[dayName] && mealPlan[dayName][mealType];
              const completed = isMealCompleted(weekDays[activeDayIndex], mealType);
              
              return (
                <div key={mealType} className={`meal-card ${completed ? 'completed' : ''}`}>
                  <div className="meal-header">
                    <h4>{mealType}</h4>
                    {meal && <span className="meal-calories">{meal.calories} kcal</span>}
                  </div>
                  
                  {meal ? (
                    <div className="meal-content">
                      <div className="meal-info">
                        <p className="meal-title">{meal.title}</p>
                        <p className="meal-description">{meal.description}</p>
                      </div>
                      
                      {/* Yiyecek listesi */}
                      {renderFoodItems(meal.id)}
                      
                      <div className="meal-actions">
                        <div className="action-buttons">
                          <button 
                            className="btn-primary btn-sm edit-foods-btn"
                            onClick={() => openFoodEditor(meal.id)}
                          >
                            Yiyecekleri Düzenle
                          </button>
                          
                          <button 
                            className="btn-danger btn-sm"
                            onClick={() => deleteMeal(meal.id, dayName, mealType)}
                          >
                            Öğünü Sil
                          </button>
                        </div>
                        
                        <label className="checkbox-container">
                          <input 
                            type="checkbox" 
                            checked={completed}
                            onChange={() => toggleMealCompletion(weekDays[activeDayIndex], mealType, completed)}
                          />
                          <span className="checkmark"></span>
                          Tamamlandı
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-meal">
                      <p className="no-meal">Bu gün için öğün tanımlanmamış.</p>
                      <button 
                        className="btn-primary btn-sm add-meal-btn"
                        onClick={() => createMeal(dayName, mealType)}
                      >
                        Öğün Ekle
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedMealPlanner;