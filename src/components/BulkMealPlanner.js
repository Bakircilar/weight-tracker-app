// src/components/BulkMealPlanner.js
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';

const BulkMealPlanner = ({ supabase, onComplete }) => {
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const mealTypes = ['Kahvaltı', 'Öğle Yemeği', 'Akşam Yemeği', 'Ara Öğün'];
  
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [planMode, setPlanMode] = useState('template'); // 'template' or 'manual'
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateData, setTemplateData] = useState(null);
  const [applyDays, setApplyDays] = useState(days.reduce((acc, day) => ({ ...acc, [day]: true }), {}));
  const [mealMatrix, setMealMatrix] = useState({});
  const [calorieDistribution, setCalorieDistribution] = useState({
    breakfast: 25,
    lunch: 30,
    dinner: 35,
    snacks: 10
  });
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(1800);
  const [userProfile, setUserProfile] = useState(null);
  
  // Kullanıcı profili ve şablonları yükle
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
        
        // Profil bilgilerini al
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        if (profileData) {
          setUserProfile(profileData);
          
          // Kalori hedefi
          if (profileData.daily_calorie_target) {
            setDailyCalorieTarget(profileData.daily_calorie_target);
          }
          
          // Kalori dağılımı
          if (profileData.meal_calorie_distribution) {
            setCalorieDistribution(profileData.meal_calorie_distribution);
          }
        }
        
        // Şablonları al
        const { data: templateData, error: templateError } = await supabase
          .from('meal_templates')
          .select('*')
          .eq('user_id', user.id);
          
        if (templateError) throw templateError;
        
        setTemplates(templateData || []);
      } catch (error) {
        console.error('Veri yükleme hatası:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [supabase]);
  
  // Öğün matrisini başlat
  useEffect(() => {
    const matrix = {};
    
    days.forEach(day => {
      matrix[day] = {};
      mealTypes.forEach(type => {
        matrix[day][type] = {
          enabled: true,
          template: ''
        };
      });
    });
    
    setMealMatrix(matrix);
  }, []);
  
  // Şablon değiştiğinde templateData'yı güncelle
  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === parseInt(selectedTemplate));
      if (template) {
        setTemplateData(JSON.parse(template.template_data));
      }
    } else {
      setTemplateData(null);
    }
  }, [selectedTemplate, templates]);
  
  // Gün seçimini değiştir
  const toggleDay = (day) => {
    setApplyDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  // Tüm günleri seç/kaldır
  const toggleAllDays = (selectAll) => {
    const newApplyDays = {};
    days.forEach(day => {
      newApplyDays[day] = selectAll;
    });
    setApplyDays(newApplyDays);
  };
  
  // Öğün matrisini güncelle
  const updateMealMatrix = (day, mealType, field, value) => {
    setMealMatrix(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: {
          ...prev[day][mealType],
          [field]: value
        }
      }
    }));
  };
  
  // Şablona göre öğün matrisini doldur
  const populateFromTemplate = () => {
    if (!templateData) return;
    
    const newMatrix = { ...mealMatrix };
    
    days.forEach(day => {
      if (applyDays[day]) {
        Object.entries(templateData).forEach(([mealType, mealData]) => {
          if (newMatrix[day][mealType]) {
            newMatrix[day][mealType] = {
              enabled: true,
              template: selectedTemplate,
              title: mealData.title,
              calories: mealData.calories
            };
          }
        });
      }
    });
    
    setMealMatrix(newMatrix);
  };
  
  // Manuel olarak öğün planlarını oluştur
  const populateManually = () => {
    const newMatrix = { ...mealMatrix };
    
    days.forEach(day => {
      if (applyDays[day]) {
        mealTypes.forEach((mealType, index) => {
          // Öğün tipine göre kalori dağılımını belirle
          let caloriePercentage = 25; // varsayılan
          
          if (mealType === 'Kahvaltı') caloriePercentage = calorieDistribution.breakfast;
          else if (mealType === 'Öğle Yemeği') caloriePercentage = calorieDistribution.lunch;
          else if (mealType === 'Akşam Yemeği') caloriePercentage = calorieDistribution.dinner;
          else if (mealType === 'Ara Öğün') caloriePercentage = calorieDistribution.snacks;
          
          const mealCalories = Math.round((dailyCalorieTarget * caloriePercentage) / 100);
          
          newMatrix[day][mealType] = {
            enabled: true,
            template: '',
            title: `${mealType}`,
            calories: mealCalories
          };
        });
      }
    });
    
    setMealMatrix(newMatrix);
  };
  
  // Şablona veya manuel seçime göre doldurma işlemini yap
  useEffect(() => {
    if (planMode === 'template' && selectedTemplate) {
      populateFromTemplate();
    } else if (planMode === 'manual') {
      populateManually();
    }
  }, [planMode, selectedTemplate, templateData, applyDays, calorieDistribution, dailyCalorieTarget]);
  
  // Toplu öğün planını kaydet
  const handleSave = async () => {
    if (!startDate) {
      alert('Lütfen başlangıç tarihi seçin');
      return;
    }
    
    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
      
      // Seçilen her gün için plan oluştur
      let startDateObj = new Date(startDate);
      const plansToInsert = [];
      
      days.forEach((day, dayIndex) => {
        if (!applyDays[day]) return;
        
        const currentDate = addDays(startDateObj, dayIndex);
        const currentDateStr = format(currentDate, 'yyyy-MM-dd');
        
        mealTypes.forEach(mealType => {
          const mealSetting = mealMatrix[day][mealType];
          
          if (mealSetting.enabled) {
            plansToInsert.push({
              user_id: user.id,
              day,
              meal_type: mealType,
              date: currentDateStr,
              title: mealSetting.title || mealType,
              description: `${mealSetting.calories || 0} kcal`,
              calories: mealSetting.calories || 0,
              template_id: mealSetting.template || null
            });
          }
        });
      });
      
      // Veritabanına ekle
      if (plansToInsert.length > 0) {
        const { error } = await supabase
          .from('meal_plans')
          .insert(plansToInsert);
          
        if (error) throw error;
        
        alert(`${plansToInsert.length} öğün başarıyla planlandı!`);
        
        if (onComplete) {
          onComplete();
        }
      } else {
        alert('Eklenecek öğün bulunamadı. Lütfen en az bir gün ve öğün seçin.');
      }
    } catch (error) {
      console.error('Toplu öğün planlama hatası:', error.message);
      alert('Planlar kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="bulk-meal-planner">
      <h3>Toplu Öğün Planlama</h3>
      
      <div className="planner-options">
        <div className="form-group">
          <label htmlFor="startDate">Başlangıç Tarihi:</label>
          <input 
            type="date" 
            id="startDate" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            min={format(new Date(), 'yyyy-MM-dd')}
          />
          <p className="hint-text">Seçilen tarih haftanın Pazartesi günü olarak kabul edilecektir.</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="planMode">Planlama Modu:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                name="planMode" 
                value="template" 
                checked={planMode === 'template'} 
                onChange={() => setPlanMode('template')} 
              />
              Şablon Kullan
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="planMode" 
                value="manual" 
                checked={planMode === 'manual'} 
                onChange={() => setPlanMode('manual')} 
              />
              Manuel Oluştur
            </label>
          </div>
        </div>
        
        {planMode === 'template' && (
          <div className="form-group">
            <label htmlFor="template">Öğün Şablonu:</label>
            <select 
              id="template" 
              value={selectedTemplate} 
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">Şablon Seçin</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.total_calories} kcal)
                </option>
              ))}
            </select>
            {!templates.length && (
              <p className="hint-text">
                Henüz kaydedilmiş şablon bulunmuyor. Önce beslenme planından bir şablon oluşturun.
              </p>
            )}
          </div>
        )}
        
        {planMode === 'manual' && (
          <div className="calorie-settings">
            <div className="form-group">
              <label htmlFor="dailyCalories">Günlük Kalori Hedefi:</label>
              <input 
                type="number" 
                id="dailyCalories" 
                value={dailyCalorieTarget} 
                onChange={(e) => setDailyCalorieTarget(parseInt(e.target.value) || 0)}
                min="800"
                max="4000"
              />
            </div>
            
            <div className="calorie-distribution">
              <h4>Öğün Bazında Kalori Dağılımı:</h4>
              <div className="distribution-preview">
                <div className="preview-bar">
                  <div className="segment breakfast" style={{ width: `${calorieDistribution.breakfast}%` }}>
                    {calorieDistribution.breakfast}%
                  </div>
                  <div className="segment lunch" style={{ width: `${calorieDistribution.lunch}%` }}>
                    {calorieDistribution.lunch}%
                  </div>
                  <div className="segment dinner" style={{ width: `${calorieDistribution.dinner}%` }}>
                    {calorieDistribution.dinner}%
                  </div>
                  <div className="segment snacks" style={{ width: `${calorieDistribution.snacks}%` }}>
                    {calorieDistribution.snacks}%
                  </div>
                </div>
                <div className="preview-labels">
                  <span>Kahvaltı: {Math.round(dailyCalorieTarget * calorieDistribution.breakfast / 100)} kcal</span>
                  <span>Öğle: {Math.round(dailyCalorieTarget * calorieDistribution.lunch / 100)} kcal</span>
                  <span>Akşam: {Math.round(dailyCalorieTarget * calorieDistribution.dinner / 100)} kcal</span>
                  <span>Ara Öğün: {Math.round(dailyCalorieTarget * calorieDistribution.snacks / 100)} kcal</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="day-selection">
        <h4>Uygulanacak Günler:</h4>
        <div className="day-toggles">
          {days.map(day => (
            <label key={day} className={`day-toggle ${applyDays[day] ? 'active' : ''}`}>
              <input 
                type="checkbox" 
                checked={applyDays[day]} 
                onChange={() => toggleDay(day)}
              />
              <span className="day-name">{day}</span>
            </label>
          ))}
        </div>
        <div className="day-select-actions">
          <button type="button" onClick={() => toggleAllDays(true)}>Tümünü Seç</button>
          <button type="button" onClick={() => toggleAllDays(false)}>Tümünü Kaldır</button>
        </div>
      </div>
      
      <div className="meal-matrix">
        <h4>Planlanacak Öğünler:</h4>
        <div className="matrix-container">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Gün</th>
                {mealTypes.map(type => (
                  <th key={type}>{type}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day} className={applyDays[day] ? '' : 'disabled'}>
                  <td className="day-cell">{day}</td>
                  {mealTypes.map(type => (
                    <td key={`${day}-${type}`} className="meal-cell">
                      <div className="meal-toggle">
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={mealMatrix[day]?.[type]?.enabled} 
                            onChange={(e) => updateMealMatrix(day, type, 'enabled', e.target.checked)}
                            disabled={!applyDays[day]}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                      <div className="meal-info">
                        {mealMatrix[day]?.[type]?.calories && (
                          <span className="meal-calories">
                            {mealMatrix[day][type].calories} kcal
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="summary">
        <h4>Özet:</h4>
        <div className="summary-content">
          <p>
            <strong>Başlangıç Tarihi:</strong> {format(new Date(startDate), 'dd/MM/yyyy')}
          </p>
          <p>
            <strong>Planlama Modu:</strong> {planMode === 'template' ? 'Şablon Kullanarak' : 'Manuel'}
          </p>
          {planMode === 'template' && selectedTemplate && (
            <p>
              <strong>Seçilen Şablon:</strong> {templates.find(t => t.id === parseInt(selectedTemplate))?.name}
            </p>
          )}
          <p>
            <strong>Seçilen Günler:</strong> {days.filter(day => applyDays[day]).join(', ')}
          </p>
        </div>
      </div>
      
      <div className="planner-actions">
        <button 
          className="btn-primary" 
          onClick={handleSave}
          disabled={saving || (planMode === 'template' && !selectedTemplate)}
        >
          {saving ? 'Planlanıyor...' : 'Öğünleri Planla'}
        </button>
      </div>
    </div>
  );
};

export default BulkMealPlanner;