// src/components/Profile.js
import React, { useState, useEffect } from 'react';

const Profile = ({ supabase, session }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    height: '',
    start_weight: '',
    target_weight: '',
    target_date: '',
    activity_level: 'sedentary'
  });

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
          activity_level: profileData.activity_level || 'sedentary'
        });
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

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="profile">
      <h2>Profil</h2>
      
      <div className="profile-info">
        <p><strong>E-posta:</strong> {user?.email}</p>
      </div>
      
      <form onSubmit={updateProfile} className="profile-form">
        <h3>Kişisel Bilgiler</h3>
        
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
        
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </div>
  );
};

export default Profile;