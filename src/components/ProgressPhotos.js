// src/components/ProgressPhotos.js
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const ProgressPhotos = ({ supabase }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [note, setNote] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [weightData, setWeightData] = useState({});

  useEffect(() => {
    fetchPhotos();
    fetchWeightData();
  }, []);

  // Fotoğrafları getir
  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
      
      const { data, error } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      setPhotos(data || []);
    } catch (error) {
      console.error('İlerleme fotoğrafları çekme hatası:', error.message);
      alert('Fotoğraflar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Kilo verilerini getir
  const fetchWeightData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('weight_entries')
        .select('date, weight')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Tarih bazlı kilo verileri
      const weightByDate = {};
      data.forEach(entry => {
        weightByDate[entry.date] = entry.weight;
      });
      
      setWeightData(weightByDate);
    } catch (error) {
      console.error('Kilo verileri çekme hatası:', error.message);
    }
  };

  // Dosya seçildiğinde
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }
    
    // Sadece resim dosyalarını kabul et
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin (JPG, PNG, vb.).');
      return;
    }
    
    setSelectedFile(file);
    
    // Dosya önizlemesi oluştur
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Fotoğraf yükle
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Lütfen bir fotoğraf seçin.');
      return;
    }
    
    setUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
      
      // Dosya adını oluştur (tarih + rastgele)
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `progress-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/progress/${fileName}`;
      
      // Storage'a dosyayı yükle
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, selectedFile);
        
      if (uploadError) throw uploadError;
      
      // Yüklenen dosyanın public URL'sini al
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);
      
      // Veritabanına kaydet
      const { error: dbError } = await supabase
        .from('progress_photos')
        .insert([{
          user_id: user.id,
          photo_url: publicUrl,
          date,
          note: note || null
        }]);
        
      if (dbError) throw dbError;
      
      // Başarılı mesajı
      alert('Fotoğraf başarıyla yüklendi!');
      
      // Formları sıfırla
      setSelectedFile(null);
      setFilePreview(null);
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setNote('');
      
      // Fotoğrafları yeniden yükle
      fetchPhotos();
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error.message);
      alert('Fotoğraf yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  // Fotoğrafı sil
  const handleDelete = async (id, photoUrl) => {
    if (!window.confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) return;
    
    try {
      // URL'den dosya yolunu al
      const filePathMatch = photoUrl.match(/photos\/([^?]+)/);
      if (filePathMatch && filePathMatch[1]) {
        const filePath = filePathMatch[1];
        
        // Önce veritabanından sil
        const { error: dbError } = await supabase
          .from('progress_photos')
          .delete()
          .eq('id', id);
          
        if (dbError) throw dbError;
        
        // Sonra storage'dan sil
        const { error: storageError } = await supabase.storage
          .from('photos')
          .remove([filePath]);
          
        if (storageError) {
          console.error('Storage silme hatası:', storageError);
          // Storage hatası olsa bile veritabanından silindi, devam edebiliriz
        }
        
        // Fotoğrafları yeniden yükle
        fetchPhotos();
        alert('Fotoğraf başarıyla silindi.');
      } else {
        throw new Error('Dosya yolu bulunamadı');
      }
    } catch (error) {
      console.error('Fotoğraf silme hatası:', error.message);
      alert('Fotoğraf silinirken bir hata oluştu.');
    }
  };

  // Fotoğrafı karşılaştırma için seç/iptal et
  const togglePhotoSelection = (photoId) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        if (prev.length < 2) {
          return [...prev, photoId];
        } else {
          // En fazla 2 fotoğraf seçilebilir
          return [prev[1], photoId];
        }
      }
    });
  };

  // Fotoğrafları karşılaştır
  const handleCompare = () => {
    if (selectedPhotos.length !== 2) {
      alert('Lütfen karşılaştırmak için tam olarak 2 fotoğraf seçin.');
      return;
    }
    
    setCompareMode(true);
  };

  // Karşılaştırma modundan çık
  const exitCompareMode = () => {
    setCompareMode(false);
    setSelectedPhotos([]);
  };

  // Karşılaştırma görünümü
  const renderCompareView = () => {
    const photo1 = photos.find(p => p.id === selectedPhotos[0]);
    const photo2 = photos.find(p => p.id === selectedPhotos[1]);
    
    if (!photo1 || !photo2) return null;
    
    // Tarihlere göre sırala (eskiden yeniye)
    const [olderPhoto, newerPhoto] = [photo1, photo2].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    // Kilo değişimini hesapla
    const olderWeight = weightData[olderPhoto.date];
    const newerWeight = weightData[newerPhoto.date];
    const weightChange = olderWeight && newerWeight 
      ? (newerWeight - olderWeight).toFixed(1) 
      : null;
    
    // Tarihler arası gün farkını hesapla
    const daysDiff = Math.floor(
      (new Date(newerPhoto.date) - new Date(olderPhoto.date)) / (1000 * 60 * 60 * 24)
    );
    
    return (
      <div className="photo-compare-view">
        <div className="compare-header">
          <h4>Fotoğraf Karşılaştırması</h4>
          <button onClick={exitCompareMode} className="btn-secondary">Karşılaştırmadan Çık</button>
        </div>
        
        <div className="comparison-info">
          <div className="comparison-dates">
            <div className="date-tag older">
              {format(new Date(olderPhoto.date), 'd MMMM yyyy', { locale: tr })}
              {olderWeight && <span className="weight-tag">{olderWeight} kg</span>}
            </div>
            <div className="comparison-progress">
              <span>{daysDiff} gün</span>
              {weightChange && (
                <span className={`weight-change ${parseFloat(weightChange) < 0 ? 'positive' : 'negative'}`}>
                  {weightChange > 0 ? '+' : ''}{weightChange} kg
                </span>
              )}
            </div>
            <div className="date-tag newer">
              {format(new Date(newerPhoto.date), 'd MMMM yyyy', { locale: tr })}
              {newerWeight && <span className="weight-tag">{newerWeight} kg</span>}
            </div>
          </div>
        </div>
        
        <div className="comparison-photos">
          <div className="comparison-photo">
            <img src={olderPhoto.photo_url} alt="Önceki" />
            <p className="photo-note">{olderPhoto.note || 'Not yok'}</p>
          </div>
          <div className="comparison-photo">
            <img src={newerPhoto.photo_url} alt="Sonraki" />
            <p className="photo-note">{newerPhoto.note || 'Not yok'}</p>
          </div>
        </div>
      </div>
    );
  };

  // Ana görünüm
  return (
    <div className="progress-photos-container">
      <h2>İlerleme Fotoğrafları</h2>
      
      {compareMode ? (
        renderCompareView()
      ) : (
        <>
          <div className="photo-upload-section">
            <h3>Yeni Fotoğraf Ekle</h3>
            <div className="upload-form">
              <div className="form-left">
                <div className="form-group">
                  <label htmlFor="photo">Fotoğraf Seç:</label>
                  <input 
                    type="file" 
                    id="photo" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="date">Tarih:</label>
                  <input 
                    type="date" 
                    id="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    max={format(new Date(), 'yyyy-MM-dd')}
                    disabled={uploading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="note">Not (isteğe bağlı):</label>
                  <textarea 
                    id="note" 
                    value={note} 
                    onChange={(e) => setNote(e.target.value)}
                    rows="3"
                    placeholder="Fotoğrafla ilgili notlar..."
                    disabled={uploading}
                  />
                </div>
                
                <button 
                  className="btn-primary" 
                  onClick={handleUpload} 
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? 'Yükleniyor...' : 'Fotoğrafı Yükle'}
                </button>
              </div>
              
              <div className="form-right">
                {filePreview ? (
                  <div className="photo-preview">
                    <img src={filePreview} alt="Önizleme" />
                  </div>
                ) : (
                  <div className="no-preview">
                    <p>Önizleme için fotoğraf seçin</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="photos-gallery-section">
            <div className="gallery-header">
              <h3>Fotoğraf Galerisi</h3>
              
              {selectedPhotos.length > 0 && (
                <div className="selection-actions">
                  <span>{selectedPhotos.length} fotoğraf seçildi</span>
                  <button 
                    className="btn-primary" 
                    onClick={handleCompare}
                    disabled={selectedPhotos.length !== 2}
                  >
                    Karşılaştır
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={() => setSelectedPhotos([])}
                  >
                    Seçimi İptal Et
                  </button>
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="loading">Fotoğraflar yükleniyor...</div>
            ) : photos.length === 0 ? (
              <div className="no-photos">
                <p>Henüz fotoğraf yüklenmemiş.</p>
              </div>
            ) : (
              <div className="photos-grid">
                {photos.map(photo => (
                  <div 
                    key={photo.id} 
                    className={`photo-card ${selectedPhotos.includes(photo.id) ? 'selected' : ''}`}
                    onClick={() => togglePhotoSelection(photo.id)}
                  >
                    <div className="photo-card-image">
                      <img src={photo.photo_url} alt={`İlerleme fotoğrafı - ${photo.date}`} />
                      {selectedPhotos.includes(photo.id) && (
                        <div className="selection-indicator">✓</div>
                      )}
                    </div>
                    <div className="photo-card-footer">
                      <div className="photo-date">
                        {format(new Date(photo.date), 'd MMMM yyyy', { locale: tr })}
                        {weightData[photo.date] && (
                          <span className="photo-weight">{weightData[photo.date]} kg</span>
                        )}
                      </div>
                      <button 
                        className="btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(photo.id, photo.photo_url);
                        }}
                      >
                        Sil
                      </button>
                    </div>
                    {photo.note && (
                      <div className="photo-note">
                        {photo.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressPhotos;