// src/components/EnhancedProfile.js
import React, { useState, useEffect } from 'react';
import MetabolicRateCalculator from './MetabolicRateCalculator';
import NutritionSettings from './NutritionSettings';
import ChallengeModes from './ChallengeModes';
import CustomFoodEditor from './CustomFoodEditor';
import ProgressPhotos from './ProgressPhotos';

const EnhancedProfile = ({ supabase, session }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    height: '',
    start_weight: '',
    target_weight: '',
    target_date: '',
    activity_level: 'sedentary',
    daily_calorie_target: 0,
    meal_calorie_distribution: null,
    macro_targets: null
  });
  const [activeSection, setActiveSection] = useState('basic-info');
  const [addingCustomFood, setAddingCustomFood] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('female');
  const [birthdate, setBirthdate] = useState('');

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Kullanıcı bilgilerini al
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      setUser(userData.user);
      
      // Profil bilgilerini al
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      if (profileData) {
        setUserProfile({
          height: profileData.height || '',
          start_weight: profileData.start_weight || '',
          target_weight: profileData.target_weight || '',
          target_date: profileData.target_date || '',
          activity_level: profileData.activity_level || 'sedentary',
          daily_calorie_target: profileData.daily_calorie_target || 0,
          meal_calorie_distribution: profileData.meal_calorie_distribution || {
            breakfast: 25,
            lunch: 30,
            dinner: 35,
            snacks: 10
          },
          macro_targets: profileData.macro_targets || {
            protein: 30,
            carbs: 40,
            fat: 30
          },
          birthdate: profileData.birthdate || '',
          gender: profileData.gender || 'female'
        });
        
        if (profileData.birthdate) {
          setBirthdate(profileData.birthdate);
          // Yaşı hesapla
          const birthDate = new Date(profileData.birthdate);
          const today = new Date();
          let calculatedAge = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
          }
          setAge(calculatedAge.toString());
        }
        
        if (profileData.gender) {
          setGender(profileData.gender);
        }
      }
    } catch (error) {
      console.error('Profil bilgisi çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const updates = {
        user_id: user.id,
        height: parseFloat(userProfile.height),
        start_weight: parseFloat(userProfile.start_weight),
        target_weight: parseFloat(userProfile.target_weight),
        target_date: userProfile.target_date,
        activity_level: userProfile.activity_level,
        birthdate: birthdate || null,
        gender: gender,
        updated_at: new Date()
      };
      
      // Profil var mı kontrol et
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      let result;
      
      if (existingProfile) {
        // Profili güncelle
        result = await supabase
          .from('profiles')
          .update(updates)
          .eq('user_id', user.id);
      } else {
        // Yeni profil oluştur
        result = await supabase
          .from('profiles')
          .insert([updates]);
      }
      
      if (result.error) throw result.error;
      
      // Yaş hesapla
      if (birthdate) {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        setAge(calculatedAge.toString());
      }
      
      alert('Profil başarıyla güncellendi!');
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      alert('Profil güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBirthdateChange = (e) => {
    setBirthdate(e.target.value);
  };
  
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      ...updatedProfile
    }));
  };

  const renderBasicInfo = () => {
    return (
      <>
        <h3>Kişisel Bilgiler</h3>
        <form onSubmit={updateProfile} className="profile-form">
          <div className="form-columns">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="gender">Cinsiyet:</label>
                <select
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={handleGenderChange}
                  required
                >
                  <option value="female">Kadın</option>
                  <option value="male">Erkek</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="birthdate">Doğum Tarihi:</label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={birthdate}
                  onChange={handleBirthdateChange}
                />
                {age && <span className="info-value">Yaş: {age}</span>}
              </div>
            
              <div className="form-group">
                <label htmlFor="height">Boy (cm):</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={userProfile.height}
                  onChange={handleChange}
                  min="100"
                  max="250"
                  step="0.1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="start_weight">Başlangıç Kilosu (kg):</label>
                <input
                  type="number"
                  id="start_weight"
                  name="start_weight"
                  value={userProfile.start_weight}
                  onChange={handleChange}
                  min="40"
                  max="250"
                  step="0.1"
                  required
                />
              </div>
            </div>
            
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="target_weight">Hedef Kilo (kg):</label>
                <input
                  type="number"
                  id="target_weight"
                  name="target_weight"
                  value={userProfile.target_weight}
                  onChange={handleChange}
                  min="40"
                  max="200"
                  step="0.1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="target_date">Hedef Tarih:</label>
                <input
                  type="date"
                  id="target_date"
                  name="target_date"
                  value={userProfile.target_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="activity_level">Aktivite Seviyesi:</label>
                <select
                  id="activity_level"
                  name="activity_level"
                  value={userProfile.activity_level}
                  onChange={handleChange}
                  required
                >
                  <option value="sedentary">Hareketsiz (Masa başı iş)</option>
                  <option value="light">Hafif Aktivite (Haftada 1-2 gün egzersiz)</option>
                  <option value="moderate">Orta Aktivite (Haftada 3-5 gün egzersiz)</option>
                  <option value="active">Aktif (Haftada 6-7 gün egzersiz)</option>
                  <option value="very_active">Çok Aktif (Günde iki kez egzersiz, ağır fiziksel iş)</option>
                </select>
              </div>
              
              {userProfile.daily_calorie_target > 0 && (
                <div className="calorie-info">
                  <span className="info-label">Günlük Kalori Hedefi:</span>
                  <span className="info-value">{userProfile.daily_calorie_target} kcal</span>
                </div>
              )}
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </>
    );
  };

  if (loading && !userProfile) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="enhanced-profile">
      <h2>Profil</h2>
      
      <div className="profile-info">
        <p>
          <strong>E-posta:</strong> {user?.email}
          {age && (
            <span className="profile-detail">
              <strong>Yaş:</strong> {age}
            </span>
          )}
          {userProfile.height && (
            <span className="profile-detail">
              <strong>Boy:</strong> {userProfile.height} cm
            </span>
          )}
        </p>
      </div>
      
      <div className="profile-navigation">
        <button 
          className={`nav-button ${activeSection === 'basic-info' ? 'active' : ''}`}
          onClick={() => setActiveSection('basic-info')}
        >
          Temel Bilgiler
        </button>
        <button 
          className={`nav-button ${activeSection === 'metabolism' ? 'active' : ''}`}
          onClick={() => setActiveSection('metabolism')}
        >
          Metabolizma ve Kalori
        </button>
        <button 
          className={`nav-button ${activeSection === 'nutrition' ? 'active' : ''}`}
          onClick={() => setActiveSection('nutrition')}
        >
          Beslenme Ayarları
        </button>
        <button 
          className={`nav-button ${activeSection === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveSection('challenges')}
        >
          Zorluk Modları
        </button>
        <button 
          className={`nav-button ${activeSection === 'custom-foods' ? 'active' : ''}`}
          onClick={() => setActiveSection('custom-foods')}
        >
          Özel Yiyecekler
        </button>
        <button 
          className={`nav-button ${activeSection === 'progress-photos' ? 'active' : ''}`}
          onClick={() => setActiveSection('progress-photos')}
        >
          İlerleme Fotoğrafları
        </button>
      </div>
      
      <div className="profile-section">
        {activeSection === 'basic-info' && renderBasicInfo()}
        
        {activeSection === 'metabolism' && (
          <MetabolicRateCalculator 
            supabase={supabase} 
            userProfile={userProfile}
            onUpdate={handleProfileUpdate}
          />
        )}
        
        {activeSection === 'nutrition' && (
          <NutritionSettings 
            supabase={supabase} 
            userProfile={userProfile}
            onUpdate={handleProfileUpdate}
          />
        )}
        
        {activeSection === 'challenges' && (
          <ChallengeModes supabase={supabase} />
        )}
        
        {activeSection === 'custom-foods' && (
          <div className="custom-foods-section">
            <div className="section-header">
              <h3>Özel Yiyecekler</h3>
              <button 
                className="btn-primary"
                onClick={() => setAddingCustomFood(!addingCustomFood)}
              >
                {addingCustomFood ? 'İptal' : 'Yeni Yiyecek Ekle'}
              </button>
            </div>
            
            {addingCustomFood ? (
              <CustomFoodEditor 
                supabase={supabase}
                onSave={() => {
                  setAddingCustomFood(false);
                  // Burada yiyecekleri yeniden yükleyebilirsiniz
                }}
                onCancel={() => setAddingCustomFood(false)}
              />
            ) : (
              <div className="custom-foods-info">
                <p>
                  Veritabanında bulamadığınız yiyecekleri kendiniz ekleyebilirsiniz.
                  Eklediğiniz özel yiyecekler beslenme planınızda kullanılabilir.
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeSection === 'progress-photos' && (
          <ProgressPhotos supabase={supabase} />
        )}
      </div>
    </div>
  );
};

export default EnhancedProfile;