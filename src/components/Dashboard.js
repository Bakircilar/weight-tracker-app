// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import ProgressBar from './ProgressBar';
import ProgressChart from './ProgressChart';
import FilterPanel from './FilterPanel';

const Dashboard = ({ supabase }) => {
  const [weightData, setWeightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    startWeight: 0,
    currentWeight: 0,
    totalLoss: 0,
    daysLeft: 0,
    dailyTarget: 0,
    targetWeight: 99,
    startDate: null,
    targetDate: null,
    progressPercentage: 0
  });
  const [chartFilter, setChartFilter] = useState('month'); // 'week', 'month', 'all'

  useEffect(() => {
    // Tüm verileri sırayla yükle
    async function loadAllData() {
      setLoading(true);
      
      try {
        // Kullanıcı kimliğini al
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('Kullanıcı bilgisi alınamadı');
          setLoading(false);
          return;
        }
        
        // 1. Profil bilgilerini çek
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profil bilgisi çekme hatası:', profileError);
        }

        // 2. Kilo verilerini çek
        const { data: weightEntries, error: weightError } = await supabase
          .from('weight_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });
          
        if (weightError) {
          console.error('Kilo verisi çekme hatası:', weightError);
        }

        // 3. Tüm verileri alınca hesaplamaları yap
        if (profileData && weightEntries && weightEntries.length > 0) {
          // Hedef tarihe kalan gün sayısını hesapla
          const today = new Date();
          const targetDate = new Date(profileData.target_date);
          const startDate = new Date(weightEntries[0].date);
          const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
          const totalDays = Math.ceil((targetDate - startDate) / (1000 * 60 * 60 * 24));
          
          // Kilo bilgilerini al
          const startWeight = weightEntries[0].weight;
          const currentWeight = weightEntries[weightEntries.length - 1].weight;
          const totalLoss = startWeight - currentWeight;
          
          // Hedef kilo değerini al
          const targetWeight = profileData.target_weight || 99;
          
          // Günlük hedef kaybı hesapla
          const remainingToLose = currentWeight - targetWeight;
          const dailyTarget = (daysLeft > 0 && remainingToLose > 0) 
            ? (remainingToLose / daysLeft).toFixed(2) 
            : 0;
          
          // İlerleme yüzdesini hesapla
          const totalWeightToLose = startWeight - targetWeight;
          const progressPercentage = Math.min(
            100, 
            Math.max(
              0,
              Math.round((totalLoss / totalWeightToLose) * 100)
            )
          );
          
          // Verileri güncelle
          setWeightData(weightEntries);
          setStats({
            startWeight,
            currentWeight,
            totalLoss,
            daysLeft: Math.max(0, daysLeft),
            dailyTarget,
            targetWeight,
            startDate: weightEntries[0].date,
            targetDate: profileData.target_date,
            progressPercentage
          });
        } else if (weightEntries && weightEntries.length > 0) {
          // Sadece kilo verisi varsa
          const startWeight = weightEntries[0].weight;
          const currentWeight = weightEntries[weightEntries.length - 1].weight;
          const totalLoss = startWeight - currentWeight;
          
          setWeightData(weightEntries);
          setStats(prev => ({
            ...prev,
            startWeight,
            currentWeight,
            totalLoss,
            startDate: weightEntries[0].date
          }));
        } else if (profileData) {
          // Sadece profil verisi varsa
          const today = new Date();
          const targetDate = new Date(profileData.target_date);
          const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
          
          setStats(prev => ({
            ...prev,
            daysLeft: Math.max(0, daysLeft),
            targetWeight: profileData.target_weight || 99,
            targetDate: profileData.target_date
          }));
        }
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadAllData();
  }, [supabase]);

  // Son 30 günün verisini gösterir (eski fonksiyon, referans için tutuldu)
  const getChartData = () => {
    if (weightData.length === 0) return [];
    
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const entry = weightData.find(item => item.date === date);
      
      last30Days.push({
        date,
        weight: entry ? entry.weight : null
      });
    }
    
    return last30Days.filter(item => item.weight !== null);
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Gösterge Paneli</h2>
      
      {/* İlerleme Çubuğu */}
      <div className="progress-section">
        <h3>Hedefe İlerleme</h3>
        <ProgressBar 
          percentage={stats.progressPercentage} 
          label="Toplam İlerleme" 
          color="#27ae60"
        />
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Başlangıç Kilosu</h3>
          <p>{stats.startWeight} kg</p>
        </div>
        <div className="stat-card">
          <h3>Şu Anki Kilo</h3>
          <p>{stats.currentWeight} kg</p>
        </div>
        <div className="stat-card">
          <h3>Toplam Kayıp</h3>
          <p>{stats.totalLoss} kg</p>
        </div>
        <div className="stat-card">
          <h3>Hedef Tarihine Kalan</h3>
          <p>{stats.daysLeft} gün</p>
        </div>
        <div className="stat-card">
          <h3>Günlük Hedef Kayıp</h3>
          <p>{stats.dailyTarget} kg/gün</p>
        </div>
        <div className="stat-card highlight">
          <h3>Hedefe Kalan</h3>
          <p>{Math.max(0, stats.currentWeight - stats.targetWeight)} kg</p>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Kilo Takibi</h3>
          <FilterPanel 
            currentFilter={chartFilter}
            onFilterChange={setChartFilter}
          />
        </div>
        
        {weightData.length > 0 ? (
          <ProgressChart 
            weightData={weightData}
            targetWeight={stats.targetWeight}
            startDate={stats.startDate}
            targetDate={stats.targetDate}
            startWeight={stats.startWeight}
            filterPeriod={chartFilter}
          />
        ) : (
          <p>Henüz kilo kaydı bulunmuyor. Kilo kaydı eklemek için "Kilo Takibi" sayfasını ziyaret edin.</p>
        )}
      </div>

      <div className="motivation">
        <h3>Motivasyon</h3>
        {stats.progressPercentage > 0 ? (
          <p>
            Tebrikler! Hedefinize ulaşmak için %{stats.progressPercentage} yol kat ettiniz.
            {stats.daysLeft > 0 && parseFloat(stats.dailyTarget) > 0 ? 
              ` Hedefe ulaşmak için her gün yaklaşık ${stats.dailyTarget} kg vermelisiniz.` : 
              ''
            } Harika gidiyorsunuz!
          </p>
        ) : (
          <p>Hedefe ulaşmak için profil sayfasında hedef tarih ve kilo bilgilerini güncelleyebilirsiniz.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;