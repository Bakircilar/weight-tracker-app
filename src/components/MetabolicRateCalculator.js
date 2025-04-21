// src/components/MetabolicRateCalculator.js
import React, { useState, useEffect } from 'react';

const MetabolicRateCalculator = ({ supabase, userProfile, onUpdate }) => {
  const [gender, setGender] = useState('female');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState(userProfile?.height || '');
  const [weight, setWeight] = useState(userProfile?.start_weight || '');
  const [activityLevel, setActivityLevel] = useState(userProfile?.activity_level || 'sedentary');
  const [goal, setGoal] = useState('lose');
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [targetCalories, setTargetCalories] = useState(0);
  const [customTarget, setCustomTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [useCustomTarget, setUseCustomTarget] = useState(false);
  const [estimatedWeeklyLoss, setEstimatedWeeklyLoss] = useState(0);
  const [estimatedTargetDate, setEstimatedTargetDate] = useState(null);

  // Kullanıcı profilinden yaş için doğum tarihi eklemek gerekecek.
  // Şimdilik varsayılan bir yaş kullanabiliriz.
  useEffect(() => {
    if (userProfile) {
      // Hesaplamaları yap
      calculateAll();
    }
  }, [userProfile, gender, age, height, weight, activityLevel, goal]);

  // Tüm hesaplamaları yap
  const calculateAll = () => {
    if (!height || !weight || !age) return;

    // BMR (Bazal Metabolik Hız) Hesaplama - Harris-Benedict Formülü
    let bmrValue = 0;
    if (gender === 'male') {
      bmrValue = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmrValue = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    bmrValue = Math.round(bmrValue);
    setBmr(bmrValue);

    // TDEE (Toplam Günlük Enerji Harcaması) Hesaplama
    let tdeeMultiplier = 1.2; // Sedentary default
    switch (activityLevel) {
      case 'sedentary':
        tdeeMultiplier = 1.2;
        break;
      case 'light':
        tdeeMultiplier = 1.375;
        break;
      case 'moderate':
        tdeeMultiplier = 1.55;
        break;
      case 'active':
        tdeeMultiplier = 1.725;
        break;
      case 'very_active':
        tdeeMultiplier = 1.9;
        break;
      default:
        tdeeMultiplier = 1.2;
    }
    
    const tdeeValue = Math.round(bmrValue * tdeeMultiplier);
    setTdee(tdeeValue);

    // Hedef kalori hesaplama
    let target = 0;
    switch (goal) {
      case 'lose_fast':
        target = tdeeValue - 1000; // Haftada ~1kg kayıp
        break;
      case 'lose':
        target = tdeeValue - 500; // Haftada ~0.5kg kayıp
        break;
      case 'maintain':
        target = tdeeValue;
        break;
      case 'gain':
        target = tdeeValue + 500; // Haftada ~0.5kg alım
        break;
      default:
        target = tdeeValue - 500;
    }

    // Aşırı düşük kaloriyi önle
    target = Math.max(1200, target);
    
    setTargetCalories(target);
    
    // Haftalık kilo kaybı tahmini (kalori açığı / 7700 = kilo kaybı)
    const calorieDeficit = tdeeValue - (useCustomTarget ? parseInt(customTarget) : target);
    const weeklyLoss = (calorieDeficit * 7) / 7700; // kg/hafta
    setEstimatedWeeklyLoss(weeklyLoss);
    
    // Hedef kiloya ulaşma tahmini
    if (userProfile?.target_weight && weeklyLoss > 0) {
      const kgToLose = weight - userProfile.target_weight;
      const weeksNeeded = kgToLose / weeklyLoss;
      const daysNeeded = Math.ceil(weeksNeeded * 7);
      
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysNeeded);
      
      setEstimatedTargetDate(targetDate);
    } else {
      setEstimatedTargetDate(null);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
      
      // profil tablosunu güncelle
      const updates = {
        base_metabolic_rate: bmr,
        tdee: tdee,
        daily_calorie_target: useCustomTarget ? parseInt(customTarget) : targetCalories
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (onUpdate) {
        onUpdate({
          ...userProfile,
          ...updates
        });
      }
      
      alert('Metabolik bilgiler ve kalori hedefi kaydedildi');
    } catch (error) {
      console.error('Kalori hedefi kaydetme hatası:', error.message);
      alert('Kaydetme işlemi sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="metabolic-calculator">
      <h3>Metabolik Hız ve Kalori İhtiyacı Hesaplayıcı</h3>
      
      <div className="calculator-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gender">Cinsiyet:</label>
            <select 
              id="gender" 
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="female">Kadın</option>
              <option value="male">Erkek</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Yaş:</label>
            <input 
              type="number" 
              id="age" 
              value={age} 
              onChange={(e) => setAge(e.target.value)}
              min="18"
              max="100"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="height">Boy (cm):</label>
            <input 
              type="number" 
              id="height" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)}
              min="100"
              max="250"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="weight">Kilo (kg):</label>
            <input 
              type="number" 
              id="weight" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)}
              min="30"
              max="300"
              step="0.1"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="activityLevel">Aktivite Seviyesi:</label>
          <select 
            id="activityLevel" 
            value={activityLevel} 
            onChange={(e) => setActivityLevel(e.target.value)}
          >
            <option value="sedentary">Hareketsiz (Masa başı iş)</option>
            <option value="light">Hafif Aktivite (Haftada 1-2 gün egzersiz)</option>
            <option value="moderate">Orta Aktivite (Haftada 3-5 gün egzersiz)</option>
            <option value="active">Aktif (Haftada 6-7 gün egzersiz)</option>
            <option value="very_active">Çok Aktif (Günde iki kez egzersiz, ağır fiziksel iş)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="goal">Hedef:</label>
          <select 
            id="goal" 
            value={goal} 
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="lose_fast">Hızlı Kilo Kaybı (Haftalık ~1kg)</option>
            <option value="lose">Kilo Kaybı (Haftalık ~0.5kg)</option>
            <option value="maintain">Kilo Koruma</option>
            <option value="gain">Kilo Alma (Haftalık ~0.5kg)</option>
          </select>
        </div>
      </div>
      
      <div className="calculator-results">
        <div className="result-card">
          <h4>Bazal Metabolik Hız (BMR)</h4>
          <p className="result-value">{bmr} kcal/gün</p>
          <p className="result-desc">Hiçbir şey yapmadan vücudunuzun harcadığı kalori miktarı</p>
        </div>
        
        <div className="result-card">
          <h4>Toplam Günlük Enerji Harcaması (TDEE)</h4>
          <p className="result-value">{tdee} kcal/gün</p>
          <p className="result-desc">Günlük aktivitelerinizle birlikte harcadığınız toplam kalori</p>
        </div>
        
        <div className="result-card highlight">
          <h4>Önerilen Günlük Kalori Alımı</h4>
          {useCustomTarget ? (
            <div className="custom-target-input">
              <input 
                type="number" 
                value={customTarget} 
                onChange={(e) => setCustomTarget(e.target.value)}
                min="800"
                max="4000"
                placeholder="Kalori girin..."
              />
              <button onClick={() => setUseCustomTarget(false)}>Otomatik</button>
            </div>
          ) : (
            <>
              <p className="result-value">{targetCalories} kcal/gün</p>
              <button onClick={() => {
                setCustomTarget(targetCalories);
                setUseCustomTarget(true);
              }}>Manuel Giriş</button>
            </>
          )}
        </div>
      </div>
      
      <div className="calculator-projections">
        <h4>İlerleme Tahminleri</h4>
        
        <div className="projection-item">
          <span className="projection-label">Tahmini Haftalık Kilo Kaybı:</span>
          <span className="projection-value">
            {estimatedWeeklyLoss > 0 
              ? `${estimatedWeeklyLoss.toFixed(1)} kg/hafta` 
              : "Kilo kaybı beklenmemektedir"}
          </span>
        </div>
        
        {estimatedTargetDate && (
          <div className="projection-item">
            <span className="projection-label">Tahmini Hedef Tarihi:</span>
            <span className="projection-value">
              {estimatedTargetDate.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        )}
        
        <div className="calorie-distribution">
          <h5>Önerilen Öğün Dağılımı</h5>
          <div className="distribution-bars">
            <div className="meal-distrib">
              <span className="meal-name">Kahvaltı</span>
              <div className="distrib-bar">
                <div className="distrib-fill" style={{ width: '25%' }}></div>
                <span className="distrib-value">{Math.round(targetCalories * 0.25)} kcal</span>
              </div>
            </div>
            <div className="meal-distrib">
              <span className="meal-name">Öğle</span>
              <div className="distrib-bar">
                <div className="distrib-fill" style={{ width: '30%' }}></div>
                <span className="distrib-value">{Math.round(targetCalories * 0.3)} kcal</span>
              </div>
            </div>
            <div className="meal-distrib">
              <span className="meal-name">Akşam</span>
              <div className="distrib-bar">
                <div className="distrib-fill" style={{ width: '35%' }}></div>
                <span className="distrib-value">{Math.round(targetCalories * 0.35)} kcal</span>
              </div>
            </div>
            <div className="meal-distrib">
              <span className="meal-name">Ara Öğün</span>
              <div className="distrib-bar">
                <div className="distrib-fill" style={{ width: '10%' }}></div>
                <span className="distrib-value">{Math.round(targetCalories * 0.1)} kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="calculator-actions">
        <button 
          className="btn-primary" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : 'Kalori Hedefimi Kaydet'}
        </button>
      </div>
    </div>
  );
};

export default MetabolicRateCalculator;