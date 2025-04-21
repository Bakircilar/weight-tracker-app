// src/components/NutritionSettings.js
import React, { useState, useEffect } from 'react';

const NutritionSettings = ({ supabase, userProfile, onUpdate }) => {
  const [calorieDistribution, setCalorieDistribution] = useState({
    breakfast: 25,
    lunch: 30,
    dinner: 35,
    snacks: 10
  });
  
  const [macroTargets, setMacroTargets] = useState({
    protein: 30,
    carbs: 40,
    fat: 30
  });
  
  const [advancedMode, setAdvancedMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalMacros, setTotalMacros] = useState(0);
  const [distributionValid, setDistributionValid] = useState(true);
  const [macrosValid, setMacrosValid] = useState(true);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  
  useEffect(() => {
    if (userProfile) {
      // Mevcut öğün dağılımını ve makro hedeflerini yükle
      if (userProfile.meal_calorie_distribution) {
        setCalorieDistribution(userProfile.meal_calorie_distribution);
      }
      
      if (userProfile.macro_targets) {
        setMacroTargets(userProfile.macro_targets);
      }
      
      // Kalori hedefi
      if (userProfile.daily_calorie_target) {
        setCalorieGoal(userProfile.daily_calorie_target);
      }
    }
  }, [userProfile]);
  
  // Kalori dağılımı ve makro hedeflerinin toplamını kontrol et
  useEffect(() => {
    // Kalori dağılımı toplamı
    const totalDist = Object.values(calorieDistribution).reduce((sum, val) => sum + val, 0);
    setTotalCalories(totalDist);
    setDistributionValid(totalDist === 100);
    
    // Makro hedefleri toplamı
    const totalMacro = Object.values(macroTargets).reduce((sum, val) => sum + val, 0);
    setTotalMacros(totalMacro);
    setMacrosValid(totalMacro === 100);
  }, [calorieDistribution, macroTargets]);
  
  // Kalori dağılımını güncelle
  const handleDistributionChange = (meal, value) => {
    const numValue = parseInt(value) || 0;
    setCalorieDistribution(prev => ({
      ...prev,
      [meal]: numValue
    }));
  };
  
  // Makro hedeflerini güncelle
  const handleMacroChange = (macro, value) => {
    const numValue = parseInt(value) || 0;
    setMacroTargets(prev => ({
      ...prev,
      [macro]: numValue
    }));
  };
  
  // Dağılımları otomatik dengele
  const balanceDistribution = () => {
    const total = Object.values(calorieDistribution).reduce((sum, val) => sum + val, 0);
    if (total === 0) return;
    
    const factor = 100 / total;
    const balanced = {};
    
    // Tüm değerleri orantılı olarak ayarla
    let runningTotal = 0;
    Object.entries(calorieDistribution).forEach(([meal, value], index, array) => {
      if (index === array.length - 1) {
        // Son elemana kalan miktarı ver (yuvarlama hatalarını önler)
        balanced[meal] = 100 - runningTotal;
      } else {
        // Diğer değerleri orantılı olarak hesapla
        const adjustedValue = Math.round(value * factor);
        balanced[meal] = adjustedValue;
        runningTotal += adjustedValue;
      }
    });
    
    setCalorieDistribution(balanced);
  };
  
  // Makroları otomatik dengele
  const balanceMacros = () => {
    const total = Object.values(macroTargets).reduce((sum, val) => sum + val, 0);
    if (total === 0) return;
    
    const factor = 100 / total;
    const balanced = {};
    
    // Tüm değerleri orantılı olarak ayarla
    let runningTotal = 0;
    Object.entries(macroTargets).forEach(([macro, value], index, array) => {
      if (index === array.length - 1) {
        // Son elemana kalan miktarı ver (yuvarlama hatalarını önler)
        balanced[macro] = 100 - runningTotal;
      } else {
        // Diğer değerleri orantılı olarak hesapla
        const adjustedValue = Math.round(value * factor);
        balanced[macro] = adjustedValue;
        runningTotal += adjustedValue;
      }
    });
    
    setMacroTargets(balanced);
  };
  
  // Ayarları kaydet
  const handleSave = async () => {
    // Dağılımların %100 toplamı verdiğinden emin ol
    if (!distributionValid || !macrosValid) {
      alert('Lütfen değerlerin toplamının %100 olduğundan emin olun.');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
      
      // Profil güncellemesi
      const { error } = await supabase
        .from('profiles')
        .update({
          meal_calorie_distribution: calorieDistribution,
          macro_targets: macroTargets
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (onUpdate) {
        onUpdate({
          ...userProfile,
          meal_calorie_distribution: calorieDistribution,
          macro_targets: macroTargets
        });
      }
      
      alert('Beslenme ayarları başarıyla kaydedildi!');
    } catch (error) {
      console.error('Beslenme ayarları kaydetme hatası:', error.message);
      alert('Kaydetme işlemi sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  // Gram cinsinden makroları hesapla
  const calculateMacrosInGrams = () => {
    // 1g protein = 4 kcal, 1g carbs = 4 kcal, 1g fat = 9 kcal
    const proteinPercentage = macroTargets.protein / 100;
    const carbsPercentage = macroTargets.carbs / 100;
    const fatPercentage = macroTargets.fat / 100;
    
    const proteinCalories = calorieGoal * proteinPercentage;
    const carbsCalories = calorieGoal * carbsPercentage;
    const fatCalories = calorieGoal * fatPercentage;
    
    const proteinGrams = Math.round(proteinCalories / 4);
    const carbsGrams = Math.round(carbsCalories / 4);
    const fatGrams = Math.round(fatCalories / 9);
    
    return { proteinGrams, carbsGrams, fatGrams };
  };
  
  const { proteinGrams, carbsGrams, fatGrams } = calculateMacrosInGrams();
  
  return (
    <div className="nutrition-settings">
      <h3>Beslenme Ayarları</h3>
      
      <div className="settings-tabs">
        <button 
          className={!advancedMode ? 'active' : ''} 
          onClick={() => setAdvancedMode(false)}
        >
          Kalori Dağılımı
        </button>
        <button 
          className={advancedMode ? 'active' : ''} 
          onClick={() => setAdvancedMode(true)}
        >
          Makro Besin Hedefleri
        </button>
      </div>
      
      {!advancedMode ? (
        <div className="calorie-distribution-settings">
          <h4>Günlük Kalori Dağılımı</h4>
          <p className="settings-desc">
            Günlük kalori hedefinizin öğünlere nasıl dağıtılacağını ayarlayın.
            Tüm değerlerin toplamı %100 olmalıdır.
          </p>
          
          <div className="calorie-distribution-preview">
            <div className="calorie-preview-bar">
              {Object.entries(calorieDistribution).map(([meal, percentage]) => (
                <div 
                  key={meal} 
                  className={`meal-segment meal-${meal}`} 
                  style={{ width: `${percentage}%` }}
                  title={`${meal}: ${percentage}%`}
                >
                  {percentage > 10 ? `${percentage}%` : ''}
                </div>
              ))}
            </div>
            <div className="calorie-preview-values">
              <span>Kahvaltı: {Math.round(calorieGoal * calorieDistribution.breakfast / 100)} kcal</span>
              <span>Öğle: {Math.round(calorieGoal * calorieDistribution.lunch / 100)} kcal</span>
              <span>Akşam: {Math.round(calorieGoal * calorieDistribution.dinner / 100)} kcal</span>
              <span>Ara Öğün: {Math.round(calorieGoal * calorieDistribution.snacks / 100)} kcal</span>
            </div>
          </div>
          
          <div className="distribution-form">
            <div className="distribution-inputs">
              <div className="form-group">
                <label htmlFor="breakfast">Kahvaltı (%):</label>
                <input
                  type="number"
                  id="breakfast"
                  value={calorieDistribution.breakfast}
                  onChange={(e) => handleDistributionChange('breakfast', e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lunch">Öğle Yemeği (%):</label>
                <input
                  type="number"
                  id="lunch"
                  value={calorieDistribution.lunch}
                  onChange={(e) => handleDistributionChange('lunch', e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dinner">Akşam Yemeği (%):</label>
                <input
                  type="number"
                  id="dinner"
                  value={calorieDistribution.dinner}
                  onChange={(e) => handleDistributionChange('dinner', e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="snacks">Ara Öğün (%):</label>
                <input
                  type="number"
                  id="snacks"
                  value={calorieDistribution.snacks}
                  onChange={(e) => handleDistributionChange('snacks', e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <div className="distribution-total">
              <span className={`total-value ${distributionValid ? 'valid' : 'invalid'}`}>
                Toplam: {totalCalories}% {distributionValid ? '✓' : '✗'}
              </span>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={balanceDistribution}
              >
                Otomatik Dengele
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="macro-targets-settings">
          <h4>Makro Besin Hedefleri</h4>
          <p className="settings-desc">
            Kalori hedefinizin hangi besin gruplarından geleceğini ayarlayın.
            Tüm değerlerin toplamı %100 olmalıdır.
          </p>
          
          <div className="macro-targets-preview">
            <div className="macro-preview-bar">
              <div className="macro-segment protein" style={{ width: `${macroTargets.protein}%` }} title={`Protein: ${macroTargets.protein}%`}>
                {macroTargets.protein > 10 ? `${macroTargets.protein}%` : ''}
              </div>
              <div className="macro-segment carbs" style={{ width: `${macroTargets.carbs}%` }} title={`Karbonhidrat: ${macroTargets.carbs}%`}>
                {macroTargets.carbs > 10 ? `${macroTargets.carbs}%` : ''}
              </div>
              <div className="macro-segment fat" style={{ width: `${macroTargets.fat}%` }} title={`Yağ: ${macroTargets.fat}%`}>
                {macroTargets.fat > 10 ? `${macroTargets.fat}%` : ''}
              </div>
            </div>
            
            <div className="macro-daily-values">
              <div className="macro-value">
                <span className="macro-label">Protein:</span>
                <span className="macro-amount">{proteinGrams}g</span>
                <span className="macro-calories">({Math.round(calorieGoal * macroTargets.protein / 100)} kcal)</span>
              </div>
              <div className="macro-value">
                <span className="macro-label">Karbonhidrat:</span>
                <span className="macro-amount">{carbsGrams}g</span>
                <span className="macro-calories">({Math.round(calorieGoal * macroTargets.carbs / 100)} kcal)</span>
              </div>
              <div className="macro-value">
                <span className="macro-label">Yağ:</span>
                <span className="macro-amount">{fatGrams}g</span>
                <span className="macro-calories">({Math.round(calorieGoal * macroTargets.fat / 100)} kcal)</span>
              </div>
            </div>
          </div>
          
          <div className="macro-form">
            <div className="macro-inputs">
              <div className="form-group">
                <label htmlFor="protein">Protein (%):</label>
                <input
                  type="number"
                  id="protein"
                  value={macroTargets.protein}
                  onChange={(e) => handleMacroChange('protein', e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="carbs">Karbonhidrat (%):</label>
                <input
                  type="number"
                  id="carbs"
                  value={macroTargets.carbs}
                  onChange={(e) => handleMacroChange('carbs', e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fat">Yağ (%):</label>
                <input
                  type="number"
                  id="fat"
                  value={macroTargets.fat}
                  onChange={(e) => handleMacroChange('fat', e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <div className="macro-total">
              <span className={`total-value ${macrosValid ? 'valid' : 'invalid'}`}>
                Toplam: {totalMacros}% {macrosValid ? '✓' : '✗'}
              </span>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={balanceMacros}
              >
                Otomatik Dengele
              </button>
            </div>
            
            <div className="macro-presets">
              <button 
                type="button" 
                onClick={() => setMacroTargets({ protein: 30, carbs: 40, fat: 30 })}
              >
                Dengeli
              </button>
              <button 
                type="button" 
                onClick={() => setMacroTargets({ protein: 40, carbs: 30, fat: 30 })}
              >
                Yüksek Protein
              </button>
              <button 
                type="button" 
                onClick={() => setMacroTargets({ protein: 20, carbs: 5, fat: 75 })}
              >
                Ketojenik
              </button>
              <button 
                type="button" 
                onClick={() => setMacroTargets({ protein: 25, carbs: 55, fat: 20 })}
              >
                Yüksek Karbonhidrat
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="settings-actions">
        <button 
          className="btn-primary" 
          onClick={handleSave}
          disabled={loading || !distributionValid || !macrosValid}
        >
          {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </button>
      </div>
    </div>
  );
};

export default NutritionSettings;