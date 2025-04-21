// src/components/BodyMeasurements.js
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FilterPanel from './FilterPanel';

const BodyMeasurements = ({ supabase }) => {
  const [measurements, setMeasurements] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    neck: '',
    chest: '',
    waist: '',
    hips: '',
    leftArm: '',
    rightArm: '',
    leftThigh: '',
    rightThigh: '',
    leftCalf: '',
    rightCalf: ''
  });
  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [chartFilter, setChartFilter] = useState('month');
  const [selectedMeasure, setSelectedMeasure] = useState('waist');

  useEffect(() => {
    fetchMeasurementHistory();
  }, []);

  const fetchMeasurementHistory = async () => {
    try {
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('body_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
  
      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeasurements(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!measurements.date) return;
    
    setSubmitting(true);
    
    try {
      // Aynı tarih için giriş var mı kontrol et
      const { data: existingEntry } = await supabase
        .from('body_measurements')
        .select('id')
        .eq('date', measurements.date)
        .single();
      
      let result;
      
      // Boş olmayan değerleri filtreleme
      const measurementData = {};
      Object.entries(measurements).forEach(([key, value]) => {
        if (value !== '' && key !== 'date') {
          measurementData[key] = parseFloat(value);
        }
      });
      
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      if (existingEntry) {
        // Varolan girişi güncelle
        result = await supabase
          .from('body_measurements')
          .update({ ...measurementData })
          .eq('id', existingEntry.id);
      } else {
        // Yeni giriş ekle
        result = await supabase
          .from('body_measurements')
          .insert([{ 
            date: measurements.date, 
            ...measurementData,
            user_id: user.id
          }]);
      }
      
      if (result.error) throw result.error;
      
      // Form alanlarını sıfırla ve verileri yeniden yükle
      setMeasurements({
        date: format(new Date(), 'yyyy-MM-dd'),
        neck: '',
        chest: '',
        waist: '',
        hips: '',
        leftArm: '',
        rightArm: '',
        leftThigh: '',
        rightThigh: '',
        leftCalf: '',
        rightCalf: ''
      });
      
      fetchMeasurementHistory();
    } catch (error) {
      console.error('Ölçü kaydı hatası:', error);
      alert('Ölçüler kaydedilirken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  // Grafikte gösterilecek verileri hazırla
  const prepareChartData = () => {
    if (!history || history.length === 0) return [];
    
    // Tarihe göre sırala (eskiden yeniye)
    const sortedData = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Seçilen zaman aralığına göre filtrele
    const now = new Date();
    const filteredData = sortedData.filter(entry => {
      const entryDate = new Date(entry.date);
      
      if (chartFilter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return entryDate >= weekAgo;
      } else if (chartFilter === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return entryDate >= monthAgo;
      }
      
      return true; // 'all' filtresi için tüm verileri göster
    });
    
    return filteredData;
  };

  // Son kaydedilen değer ile ilk değer arasındaki farkı hesapla
  const calculateChange = (measureType) => {
    if (history.length < 2) return { value: 0, percent: 0 };
    
    const sortedData = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstValue = sortedData[0][measureType];
    const lastValue = sortedData[sortedData.length - 1][measureType];
    
    if (!firstValue || !lastValue) return { value: 0, percent: 0 };
    
    const change = lastValue - firstValue;
    const percentChange = ((change / firstValue) * 100).toFixed(1);
    
    return { 
      value: change.toFixed(1), 
      percent: percentChange,
      improved: change < 0 // Ölçülerde azalma olması iyidir
    };
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Bu ölçü kaydını silmek istediğinize emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('body_measurements')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      fetchMeasurementHistory();
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Kayıt silinirken bir hata oluştu.');
    }
  };

  const measureLabels = {
    neck: 'Boyun (cm)',
    chest: 'Göğüs (cm)',
    waist: 'Bel (cm)',
    hips: 'Kalça (cm)',
    leftArm: 'Sol Kol (cm)',
    rightArm: 'Sağ Kol (cm)',
    leftThigh: 'Sol Uyluk (cm)',
    rightThigh: 'Sağ Uyluk (cm)',
    leftCalf: 'Sol Baldır (cm)',
    rightCalf: 'Sağ Baldır (cm)'
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="body-measurements">
      <h2>Vücut Ölçüleri Takibi</h2>
      
      <div className="chart-container">
        <div className="chart-header">
          <div className="measure-selector">
            <label htmlFor="measureSelect">Görüntülenen Ölçü:</label>
            <select 
              id="measureSelect" 
              value={selectedMeasure}
              onChange={(e) => setSelectedMeasure(e.target.value)}
            >
              {Object.entries(measureLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          
          <FilterPanel 
            currentFilter={chartFilter}
            onFilterChange={setChartFilter}
          />
        </div>
        
        {history.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'd MMM', { locale: tr })} 
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} cm`, measureLabels[selectedMeasure]]}
                  labelFormatter={(date) => format(new Date(date), 'd MMMM yyyy', { locale: tr })}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={selectedMeasure} 
                  stroke="#8884d8" 
                  name={measureLabels[selectedMeasure]} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="stats-grid measurement-stats">
              {Object.entries(measureLabels).map(([key, label]) => {
                const change = calculateChange(key);
                if (!change.value) return null;
                
                return (
                  <div 
                    key={key} 
                    className={`stat-card ${change.improved ? 'success' : 'danger'}`}
                  >
                    <h3>{label}</h3>
                    <p>{change.value} cm</p>
                    <span className="change-percent">
                      {change.improved ? '▼' : '▲'} {Math.abs(change.percent)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p>Henüz ölçü kaydı bulunmuyor.</p>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="measurements-form">
        <h3>Yeni Ölçü Ekle</h3>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="date">Tarih:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={measurements.date}
              onChange={handleInputChange}
              max={format(new Date(), 'yyyy-MM-dd')}
              required
            />
          </div>
          
          {Object.entries(measureLabels).map(([key, label]) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{label}:</label>
              <input
                type="number"
                id={key}
                name={key}
                value={measurements[key]}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="300"
                placeholder={`Örn: 85.5`}
              />
            </div>
          ))}
        </div>
        
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
      
      <div className="measurement-history">
        <h3>Ölçü Geçmişi</h3>
        
        {history.length === 0 ? (
          <p>Henüz ölçü kaydı bulunmuyor.</p>
        ) : (
          <div className="history-table-wrapper">
            <table className="measurement-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  {Object.values(measureLabels).map((label, index) => (
                    <th key={index}>{label}</th>
                  ))}
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id}>
                    <td>{format(new Date(entry.date), 'd MMMM yyyy', { locale: tr })}</td>
                    {Object.keys(measureLabels).map((key) => (
                      <td key={key}>{entry[key] ? `${entry[key]} cm` : '-'}</td>
                    ))}
                    <td>
                      <button 
                        onClick={() => deleteEntry(entry.id)} 
                        className="btn-danger btn-sm">
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyMeasurements;