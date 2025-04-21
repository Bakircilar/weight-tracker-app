// src/components/ChallengeModes.js
import React, { useState, useEffect } from 'react';
import { format, addDays, isAfter, isBefore, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

const ChallengeModes = ({ supabase }) => {
  const [challengeModes, setChallengeModes] = useState([]);
  const [specialDays, setSpecialDays] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('challenges');
  const [activeChallengeProgress, setActiveChallengeProgress] = useState({ 
    daysCompleted: 0, 
    totalDays: 0, 
    startDate: null,
    endDate: null 
  });
  const [newSpecialDay, setNewSpecialDay] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    planType: 'low_calorie',
    calorieLimit: 800,
    note: ''
  });
  const [savingSpecialDay, setSavingSpecialDay] = useState(false);
  const [challengeStarting, setChallengeStarting] = useState(false);
  const [challengeEnding, setChallengeEnding] = useState(false);

  // Zorluk modlarını ve aktif zorluk modunu yükle
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Kullanıcı bilgilerini al
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
        
        // Zorluk modlarını yükle
        const { data: modes, error: modesError } = await supabase
          .from('challenge_modes')
          .select('*')
          .order('duration_days', { ascending: true });
          
        if (modesError) throw modesError;
        setChallengeModes(modes || []);
        
        // Kullanıcı profilini kontrol et - aktif zorluk modu var mı?
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('challenge_mode, challenge_start_date')
          .eq('user_id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        
        if (profile?.challenge_mode) {
          // Aktif zorluk modu varsa, detaylarını al
          const { data: challenge } = await supabase
            .from('challenge_modes')
            .select('*')
            .eq('name', profile.challenge_mode)
            .single();
            
          if (challenge) {
            setActiveChallenge(challenge);
            
            // İlerleme hesapla
            if (profile.challenge_start_date) {
              const startDate = new Date(profile.challenge_start_date);
              const endDate = addDays(startDate, challenge.duration_days);
              const today = new Date();
              
              // Tamamlanan gün sayısı
              const daysCompleted = Math.min(
                Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1,
                challenge.duration_days
              );
              
              setActiveChallengeProgress({
                daysCompleted: Math.max(0, daysCompleted),
                totalDays: challenge.duration_days,
                startDate: profile.challenge_start_date,
                endDate: format(endDate, 'yyyy-MM-dd')
              });
            }
          }
        }
        
        // Özel günleri yükle
        await loadSpecialDays(user.id);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [supabase]);

  // Özel günleri yükle
  const loadSpecialDays = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('special_day_plans')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });
        
      if (error) throw error;
      
      // Bugünden sonraki veya bugünkü özel günleri filtrele
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingDays = data.filter(day => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate >= today;
      });
      
      setSpecialDays(upcomingDays || []);
    } catch (error) {
      console.error('Özel günleri yükleme hatası:', error);
    }
  };

  // Yeni özel gün ekle
  const handleAddSpecialDay = async (e) => {
    e.preventDefault();
    
    if (!newSpecialDay.date) {
      alert('Lütfen bir tarih seçin');
      return;
    }
    
    setSavingSpecialDay(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
      
      // Aynı tarih için zaten kayıt var mı kontrol et
      const { data, error: checkError } = await supabase
        .from('special_day_plans')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', newSpecialDay.date);
        
      if (checkError) throw checkError;
      
      if (data && data.length > 0) {
        if (!window.confirm('Bu tarih için zaten bir plan mevcut. Üzerine yazmak istiyor musunuz?')) {
          return;
        }
        
        // Mevcut kaydı güncelle
        const { error: updateError } = await supabase
          .from('special_day_plans')
          .update({
            plan_type: newSpecialDay.planType,
            calorie_limit: parseInt(newSpecialDay.calorieLimit) || 0,
            note: newSpecialDay.note
          })
          .eq('id', data[0].id);
          
        if (updateError) throw updateError;
      } else {
        // Yeni kayıt ekle
        const { error: insertError } = await supabase
          .from('special_day_plans')
          .insert([{
            user_id: user.id,
            date: newSpecialDay.date,
            plan_type: newSpecialDay.planType,
            calorie_limit: parseInt(newSpecialDay.calorieLimit) || 0,
            note: newSpecialDay.note || null
          }]);
          
        if (insertError) throw insertError;
      }
      
      // Temizle ve yeniden yükle
      setNewSpecialDay({
        date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        planType: 'low_calorie',
        calorieLimit: 800,
        note: ''
      });
      
      await loadSpecialDays(user.id);
      alert('Özel gün başarıyla eklendi!');
    } catch (error) {
      console.error('Özel gün ekleme hatası:', error);
      alert('Özel gün eklenirken bir hata oluştu.');
    } finally {
      setSavingSpecialDay(false);
    }
  };

  // Özel günü sil
  const handleDeleteSpecialDay = async (id) => {
    if (!window.confirm('Bu özel günü silmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('special_day_plans')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Yerel state güncelle
      setSpecialDays(prev => prev.filter(day => day.id !== id));
      
      alert('Özel gün başarıyla silindi!');
    } catch (error) {
      console.error('Özel gün silme hatası:', error);
      alert('Özel gün silinirken bir hata oluştu.');
    }
  };

  // Zorluk modunu başlat
  const startChallenge = async (challengeId) => {
    if (activeChallenge) {
      if (!window.confirm('Zaten aktif bir zorluğunuz var. Mevcut zorluğu sonlandırıp yeni bir tane başlatmak istiyor musunuz?')) {
        return;
      }
    }
    
    setChallengeStarting(true);
    
    try {
      // Seçilen zorluğu bul
      const challenge = challengeModes.find(c => c.id === challengeId);
      if (!challenge) throw new Error('Zorluk modu bulunamadı');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
      
      // Başlangıç tarihi bugün
      const startDate = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(addDays(new Date(), challenge.duration_days), 'yyyy-MM-dd');
      
      // Profili güncelle
      const { error } = await supabase
        .from('profiles')
        .update({
          challenge_mode: challenge.name,
          challenge_start_date: startDate
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // State güncelle
      setActiveChallenge(challenge);
      setActiveChallengeProgress({
        daysCompleted: 1, // Bugün 1. gün
        totalDays: challenge.duration_days,
        startDate,
        endDate
      });
      
      alert(`"${challenge.name}" zorluğu başarıyla başlatıldı!`);
    } catch (error) {
      console.error('Zorluk başlatma hatası:', error);
      alert('Zorluk başlatılırken bir hata oluştu.');
    } finally {
      setChallengeStarting(false);
    }
  };

  // Zorluk modunu sonlandır
  const endChallenge = async () => {
    if (!window.confirm('Mevcut zorluğu sonlandırmak istediğinize emin misiniz?')) {
      return;
    }
    
    setChallengeEnding(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
      
      // Profili güncelle
      const { error } = await supabase
        .from('profiles')
        .update({
          challenge_mode: null,
          challenge_start_date: null
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // State güncelle
      setActiveChallenge(null);
      setActiveChallengeProgress({ 
        daysCompleted: 0, 
        totalDays: 0, 
        startDate: null,
        endDate: null 
      });
      
      alert('Zorluk başarıyla sonlandırıldı!');
    } catch (error) {
      console.error('Zorluk sonlandırma hatası:', error);
      alert('Zorluk sonlandırılırken bir hata oluştu.');
    } finally {
      setChallengeEnding(false);
    }
  };

  // Plan tipine göre açıklama getir
  const getPlanTypeLabel = (type) => {
    switch (type) {
      case 'fasting':
        return 'Oruç Günü';
      case 'low_calorie':
        return 'Düşük Kalorili Gün';
      case 'cheat_day':
        return 'Serbest Gün';
      case 'protein_only':
        return 'Sadece Protein Günü';
      case 'detox':
        return 'Detoks Günü';
      default:
        return type;
    }
  };

  // Plan tipine göre renk getir
  const getPlanTypeColor = (type) => {
    switch (type) {
      case 'fasting':
        return '#e74c3c';
      case 'low_calorie':
        return '#3498db';
      case 'cheat_day':
        return '#e67e22';
      case 'protein_only':
        return '#9b59b6';
      case 'detox':
        return '#2ecc71';
      default:
        return '#95a5a6';
    }
  };

  // Zorluk modları sekmesini render et
  const renderChallengesTab = () => {
    return (
      <div className="challenges-tab">
        {activeChallenge ? (
          <div className="active-challenge">
            <div className="challenge-header">
              <h3>Aktif Zorluk: {activeChallenge.name}</h3>
              <button 
                className="btn-danger"
                onClick={endChallenge}
                disabled={challengeEnding}
              >
                {challengeEnding ? 'Sonlandırılıyor...' : 'Zorluğu Sonlandır'}
              </button>
            </div>
            
            <div className="challenge-info">
              <p className="challenge-description">{activeChallenge.description}</p>
              
              <div className="challenge-dates">
                <div className="date-item">
                  <span className="date-label">Başlangıç:</span>
                  <span className="date-value">{format(new Date(activeChallengeProgress.startDate), 'd MMMM yyyy', { locale: tr })}</span>
                </div>
                <div className="date-item">
                  <span className="date-label">Bitiş:</span>
                  <span className="date-value">{format(new Date(activeChallengeProgress.endDate), 'd MMMM yyyy', { locale: tr })}</span>
                </div>
              </div>
              
              <div className="challenge-progress">
                <div className="progress-header">
                  <span>İlerleme: {activeChallengeProgress.daysCompleted} / {activeChallengeProgress.totalDays} gün</span>
                  <span className="progress-percentage">
                    {Math.round((activeChallengeProgress.daysCompleted / activeChallengeProgress.totalDays) * 100)}%
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${(activeChallengeProgress.daysCompleted / activeChallengeProgress.totalDays) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {activeChallenge.details && (
                <div className="challenge-details">
                  <h4>Zorluk Detayları</h4>
                  
                  {activeChallenge.details.rules && (
                    <div className="challenge-rules">
                      <h5>Kurallar:</h5>
                      <ul>
                        {activeChallenge.details.rules.map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {activeChallenge.details.expectedLoss && (
                    <div className="expected-loss">
                      <h5>Beklenen Kilo Kaybı:</h5>
                      <p>{activeChallenge.details.expectedLoss}</p>
                    </div>
                  )}
                  
                  {activeChallenge.details.macros && (
                    <div className="challenge-macros">
                      <h5>Makro Dağılımı:</h5>
                      <div className="macro-distribution">
                        <div className="macro-item">
                          <span className="macro-label">Protein:</span>
                          <span className="macro-value">{activeChallenge.details.macros.protein}%</span>
                        </div>
                        <div className="macro-item">
                          <span className="macro-label">Karbonhidrat:</span>
                          <span className="macro-value">{activeChallenge.details.macros.carbs}%</span>
                        </div>
                        <div className="macro-item">
                          <span className="macro-label">Yağ:</span>
                          <span className="macro-value">{activeChallenge.details.macros.fat}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeChallenge.details.fastingHours && (
                    <div className="fasting-info">
                      <h5>Açlık Penceresi:</h5>
                      <p>{activeChallenge.details.fastingHours} saat açlık, {activeChallenge.details.eatingHours} saat beslenme</p>
                      {activeChallenge.details.eatingWindow && (
                        <p>Beslenme saatleri: {activeChallenge.details.eatingWindow}</p>
                      )}
                    </div>
                  )}
                  
                  {activeChallenge.details.restricted && (
                    <div className="restricted-foods">
                      <h5>Kısıtlanan Gıdalar:</h5>
                      <ul>
                        {activeChallenge.details.restricted.map((food, index) => (
                          <li key={index}>{food}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="calorie-limit">
              <h4>Günlük Kalori Limiti</h4>
              <div className="calorie-value">
                <span>{activeChallenge.daily_calorie_limit}</span>
                <span className="unit">kcal</span>
              </div>
              <p className="calorie-note">Bu zorluk süresince günlük kalori hedefiniz bu değere ayarlanmıştır.</p>
            </div>
          </div>
        ) : (
          <div className="available-challenges">
            <h3>Mevcut Zorluk Modları</h3>
            <p className="intro-text">
              Zorluk modları, belirli bir süre boyunca özel beslenme planları ve kurallar uygulayarak
              kilo vermenizi hızlandırmanıza yardımcı olur. Aşağıdan bir zorluk seçin ve hemen başlayın!
            </p>
            
            <div className="challenge-cards">
              {challengeModes.map(challenge => (
                <div key={challenge.id} className="challenge-card">
                  <div className="challenge-card-header">
                    <h4>{challenge.name}</h4>
                    <span className="duration">{challenge.duration_days} gün</span>
                  </div>
                  
                  <p className="challenge-description">{challenge.description}</p>
                  
                  <div className="challenge-highlights">
                    <div className="highlight-item">
                      <span className="highlight-label">Kalori Limiti:</span>
                      <span className="highlight-value">{challenge.daily_calorie_limit} kcal</span>
                    </div>
                    
                    {challenge.details?.expectedLoss && (
                      <div className="highlight-item">
                        <span className="highlight-label">Beklenen Kayıp:</span>
                        <span className="highlight-value">{challenge.details.expectedLoss}</span>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="btn-primary start-challenge-btn"
                    onClick={() => startChallenge(challenge.id)}
                    disabled={challengeStarting}
                  >
                    {challengeStarting ? 'Başlatılıyor...' : 'Zorluğu Başlat'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Özel günler sekmesini render et
  const renderSpecialDaysTab = () => {
    return (
      <div className="special-days-tab">
        <div className="add-special-day">
          <h3>Yeni Özel Gün Ekle</h3>
          <form onSubmit={handleAddSpecialDay} className="special-day-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Tarih:</label>
                <input 
                  type="date" 
                  id="date" 
                  value={newSpecialDay.date}
                  onChange={(e) => setNewSpecialDay(prev => ({ ...prev, date: e.target.value }))}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="planType">Plan Türü:</label>
                <select 
                  id="planType" 
                  value={newSpecialDay.planType}
                  onChange={(e) => setNewSpecialDay(prev => ({ ...prev, planType: e.target.value }))}
                >
                  <option value="low_calorie">Düşük Kalorili Gün</option>
                  <option value="fasting">Oruç Günü</option>
                  <option value="cheat_day">Serbest Gün</option>
                  <option value="protein_only">Sadece Protein Günü</option>
                  <option value="detox">Detoks Günü</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="calorieLimit">Kalori Limiti:</label>
                <input 
                  type="number" 
                  id="calorieLimit" 
                  value={newSpecialDay.calorieLimit}
                  onChange={(e) => setNewSpecialDay(prev => ({ ...prev, calorieLimit: e.target.value }))}
                  min="0"
                  max="3000"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="note">Not (İsteğe Bağlı):</label>
                <input 
                  type="text" 
                  id="note" 
                  value={newSpecialDay.note}
                  onChange={(e) => setNewSpecialDay(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Örn: Sadece sebze ve protein"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary"
              disabled={savingSpecialDay}
            >
              {savingSpecialDay ? 'Ekleniyor...' : 'Özel Günü Ekle'}
            </button>
          </form>
        </div>
        
        <div className="special-days-list">
          <h3>Planlanan Özel Günler</h3>
          
          {specialDays.length === 0 ? (
            <div className="empty-state">
              <p>Henüz planlanmış özel gün bulunmuyor.</p>
              <p className="hint-text">Hızlı kilo kaybı için düşük kalorili veya oruç günleri planlayabilirsiniz.</p>
            </div>
          ) : (
            <div className="days-timeline">
              {specialDays.map(day => {
                const dayDate = new Date(day.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isToday = dayDate.getTime() === today.getTime();
                
                return (
                  <div 
                    key={day.id} 
                    className={`timeline-item ${isToday ? 'today' : ''}`}
                  >
                    <div className="timeline-date">
                      <span className="day">{format(dayDate, 'd', { locale: tr })}</span>
                      <span className="month">{format(dayDate, 'MMM', { locale: tr })}</span>
                    </div>
                    
                    <div 
                      className="timeline-content"
                      style={{ borderLeftColor: getPlanTypeColor(day.plan_type) }}
                    >
                      <div className="plan-header">
                        <h4>{getPlanTypeLabel(day.plan_type)}</h4>
                        <span className="calorie-limit">{day.calorie_limit} kcal</span>
                      </div>
                      
                      {day.note && <p className="plan-note">{day.note}</p>}
                      
                      <div className="plan-actions">
                        <button 
                          className="btn-danger btn-sm"
                          onClick={() => handleDeleteSpecialDay(day.id)}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="challenge-modes-container">
      <h2>Zorluk Modları ve Özel Günler</h2>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          Zorluk Modları
        </button>
        <button 
          className={`tab ${activeTab === 'special-days' ? 'active' : ''}`}
          onClick={() => setActiveTab('special-days')}
        >
          Özel Günler
        </button>
      </div>
      
      <div className="tab-content">
        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : (
          <>
            {activeTab === 'challenges' && renderChallengesTab()}
            {activeTab === 'special-days' && renderSpecialDaysTab()}
          </>
        )}
      </div>
    </div>
  );
};

export default ChallengeModes;