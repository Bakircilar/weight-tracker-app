// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';

const Dashboard = ({ supabase }) => {
  const [weightData, setWeightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    startWeight: 0,
    currentWeight: 0,
    totalLoss: 0,
    daysLeft: 0,
    dailyTarget: 0,
    targetWeight: 99 // Varsayılan hedef kilo
  });

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
          const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
          
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
            
          // Verileri güncelle
          setWeightData(weightEntries);
          setStats({
            startWeight,
            currentWeight,
            totalLoss,
            daysLeft: Math.max(0, daysLeft),
            dailyTarget,
            targetWeight
          });
          
          console.log("Hesaplanan değerler:", {
            startWeight,
            currentWeight,
            totalLoss,
            daysLeft: Math.max(0, daysLeft),
            remainingToLose,
            dailyTarget,
            targetWeight
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
            totalLoss
          }));
        } else if (profileData) {
          // Sadece profil verisi varsa
          const today = new Date();
          const targetDate = new Date(profileData.target_date);
          const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
          
          setStats(prev => ({
            ...prev,
            daysLeft: Math.max(0, daysLeft),
            targetWeight: profileData.target_weight || 99
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

  // Son 30 günün verisini gösterir
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
        <h3>Kilo Takibi</h3>
        {weightData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'd MMM', { locale: tr })} 
              />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip 
                formatter={(value) => [`${value} kg`, 'Kilo']}
                labelFormatter={(date) => format(new Date(date), 'd MMMM yyyy', { locale: tr })}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#8884d8" 
                name="Kilo" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>Henüz kilo kaydı bulunmuyor. Kilo kaydı eklemek için "Kilo Takibi" sayfasını ziyaret edin.</p>
        )}
      </div>

      <div className="motivation">
        <h3>Motivasyon</h3>
        {stats.daysLeft > 0 && parseFloat(stats.dailyTarget) > 0 ? (
          <p>Hedefine ulaşmak için her gün yaklaşık {stats.dailyTarget} kg vermelisin. Sen yapabilirsin!</p>
        ) : (
          <p>Hedefe ulaşmak için profil sayfasında hedef tarih ve kilo bilgilerini güncelleyebilirsin.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;