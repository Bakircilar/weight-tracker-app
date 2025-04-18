// src/components/WeightTracker.js
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const WeightTracker = ({ supabase }) => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [weightEntries, setWeightEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWeightEntries();
  }, []);

  const fetchWeightEntries = async () => {
    try {
      // Kullanıcı kimliğini al
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)  // Sadece mevcut kullanıcının verilerini çek
        .order('date', { ascending: false });
  
      if (error) throw error;
      setWeightEntries(data || []);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!weight || !date) return;
    
    setSubmitting(true);
    
    try {
      // Aynı tarih için giriş var mı kontrol et
      const { data: existingEntry } = await supabase
        .from('weight_entries')
        .select('id')
        .eq('date', date)
        .single();
      
      let result;
      
      if (existingEntry) {
        // Varolan girişi güncelle
result = await supabase
.from('weight_entries')
.update({ weight: parseFloat(weight) })
.eq('id', existingEntry.id);
      } else {
        // Kullanıcı kimliğini al
const { data: { user } } = await supabase.auth.getUser();

// Yeni giriş ekle
result = await supabase
  .from('weight_entries')
  .insert([{ 
    date, 
    weight: parseFloat(weight),
    user_id: user.id  // Kullanıcı kimliği eklendi
  }]);
      }
      
      if (result.error) throw result.error;
      
      // Form alanlarını sıfırla ve verileri yeniden yükle
      setWeight('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      fetchWeightEntries();
    } catch (error) {
      console.error('Kilo kaydı hatası:', error);
      alert('Kilo kaydedilirken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Bu kilo kaydını silmek istediğinize emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('weight_entries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      fetchWeightEntries();
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Kayıt silinirken bir hata oluştu.');
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="weight-tracker">
      <h2>Kilo Takibi</h2>
      
      <form onSubmit={handleSubmit} className="weight-form">
        <div className="form-group">
          <label htmlFor="date">Tarih:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={format(new Date(), 'yyyy-MM-dd')}
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
            step="0.1"
            min="40"
            max="250"
            placeholder="Örn: 85.5"
            required
          />
        </div>
        
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
      
      <div className="weight-history">
        <h3>Kilo Geçmişi</h3>
        
        {weightEntries.length === 0 ? (
          <p>Henüz kilo kaydı bulunmuyor.</p>
        ) : (
          <table className="weight-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Kilo (kg)</th>
                <th>Değişim</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {weightEntries.map((entry, index) => {
                const prevEntry = weightEntries[index + 1];
                const change = prevEntry 
                  ? (entry.weight - prevEntry.weight).toFixed(1) 
                  : 0;
                  
                return (
                  <tr key={entry.id}>
                    <td>{format(new Date(entry.date), 'd MMMM yyyy', { locale: tr })}</td>
                    <td>{entry.weight} kg</td>
                    <td className={change < 0 ? 'text-success' : change > 0 ? 'text-danger' : ''}>
                      {change !== 0 ? `${change > 0 ? '+' : ''}${change} kg` : '-'}
                    </td>
                    <td>
                      <button 
                        onClick={() => deleteEntry(entry.id)} 
                        className="btn-danger btn-sm">
                        Sil
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WeightTracker;