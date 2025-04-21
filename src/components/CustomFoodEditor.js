// src/components/CustomFoodEditor.js
import React, { useState, useEffect } from 'react';

const CustomFoodEditor = ({ supabase, editMode = false, foodData = null, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [food, setFood] = useState({
    food_name: '',
    category: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    image: null
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({});

  // Kategorileri yükle
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Mevcut yiyecek kategorilerini getir
        const { data, error } = await supabase
          .from('custom_foods')
          .select('category')
          .not('category', 'is', null);
          
        if (error) throw error;
        
        // Benzersiz kategorileri bul
        const uniqueCategories = [...new Set(data.map(item => item.category))].filter(Boolean);
        setCategories([...uniqueCategories, 'Diğer']);
      } catch (error) {
        console.error('Kategori yükleme hatası:', error);
      }
    };
    
    loadCategories();
  }, [supabase]);

  // Düzenleme modu ise mevcut veriyi yükle
  useEffect(() => {
    if (editMode && foodData) {
      setFood({
        food_name: foodData.food_name || '',
        category: foodData.category || '',
        calories: foodData.calories || '',
        protein: foodData.protein || '',
        carbs: foodData.carbs || '',
        fat: foodData.fat || ''
      });
      
      if (foodData.image) {
        setImageUrl(foodData.image);
      }
    }
  }, [editMode, foodData]);

  // Dosya seçildiğinde
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFood(prev => ({ ...prev, image: null }));
      setFilePreview(null);
      return;
    }
    
    // Sadece görsel dosyalarını kabul et
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir görsel dosyası yükleyin (JPG, PNG, GIF).');
      return;
    }
    
    setFood(prev => ({ ...prev, image: file }));
    
    // Görsel önizlemesi oluştur
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Input değişikliklerini takip et
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Sayısal değerler için geçerlilik kontrolü
    if (['calories', 'protein', 'carbs', 'fat'].includes(name)) {
      // Sayısal ve nokta karakterlerine izin ver
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFood(prev => ({ ...prev, [name]: value }));
        
        // Hata durumu güncelleme
        if (value === '') {
          setErrors(prev => ({ ...prev, [name]: 'Bu alan zorunludur' }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      }
    } else {
      setFood(prev => ({ ...prev, [name]: value }));
      
      // İsim alanı kontrolü
      if (name === 'food_name') {
        if (!value.trim()) {
          setErrors(prev => ({ ...prev, food_name: 'Yiyecek adı zorunludur' }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.food_name;
            return newErrors;
          });
        }
      }
    }
  };

  // Yeni kategori girişi
  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  // Kategori değişimi
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'yeni') {
      setShowNewCategory(true);
    } else {
      setFood(prev => ({ ...prev, category: value }));
      setShowNewCategory(false);
    }
  };

  // Yeni kategori ekleme
  const addNewCategory = () => {
    if (newCategory.trim()) {
      setCategories(prev => [...prev, newCategory]);
      setFood(prev => ({ ...prev, category: newCategory }));
      setNewCategory('');
      setShowNewCategory(false);
    }
  };

  // Form doğrulama
  const validateForm = () => {
    const newErrors = {};
    
    if (!food.food_name.trim()) {
      newErrors.food_name = 'Yiyecek adı zorunludur';
    }
    
    if (!food.calories) {
      newErrors.calories = 'Kalori değeri zorunludur';
    }
    
    if (!food.protein) {
      newErrors.protein = 'Protein değeri zorunludur';
    }
    
    if (!food.carbs) {
      newErrors.carbs = 'Karbonhidrat değeri zorunludur';
    }
    
    if (!food.fat) {
      newErrors.fat = 'Yağ değeri zorunludur';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formu gönder
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
      
      let finalImageUrl = imageUrl;
      
      // Yeni görsel yüklendiyse
      if (food.image && food.image instanceof File) {
        // Dosya adını oluştur
        const fileExt = food.image.name.split('.').pop();
        const fileName = `food-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/foods/${fileName}`;
        
        // Görsel yükle
        const { error: uploadError } = await supabase.storage
          .from('food_images')
          .upload(filePath, food.image);
          
        if (uploadError) throw uploadError;
        
        // Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('food_images')
          .getPublicUrl(filePath);
          
        finalImageUrl = publicUrl;
      }
      
      // Yiyecek verisi
      const foodData = {
        user_id: user.id,
        food_name: food.food_name,
        category: food.category || 'Diğer',
        image: finalImageUrl,
        calories: parseFloat(food.calories) || 0,
        protein: parseFloat(food.protein) || 0,
        carbs: parseFloat(food.carbs) || 0,
        fat: parseFloat(food.fat) || 0
      };
      
      let result;
      
      // Düzenleme veya yeni ekleme
      if (editMode && foodData.id) {
        // Düzenleme
        const { id, created_at, ...updateData } = foodData;
        result = await supabase
          .from('custom_foods')
          .update(updateData)
          .eq('id', foodData.id)
          .eq('user_id', user.id);
      } else {
        // Yeni ekleme
        result = await supabase
          .from('custom_foods')
          .insert([foodData]);
      }
      
      if (result.error) throw result.error;
      
      // Başarı mesajı
      alert(editMode ? 'Yiyecek başarıyla güncellendi!' : 'Yeni yiyecek başarıyla eklendi!');
      
      // onSave callback'i çağır
      if (onSave) {
        onSave({
          ...foodData,
          id: editMode ? foodData.id : result.data[0]?.id
        });
      }
    } catch (error) {
      console.error('Yiyecek kaydetme hatası:', error);
      alert('Yiyecek kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-food-editor">
      <h3>{editMode ? 'Yiyecek Düzenle' : 'Yeni Yiyecek Ekle'}</h3>
      
      <form onSubmit={handleSubmit} className="food-form">
        <div className="form-columns">
          <div className="form-left">
            <div className="form-group">
              <label htmlFor="food_name">Yiyecek Adı:</label>
              <input
                type="text"
                id="food_name"
                name="food_name"
                value={food.food_name}
                onChange={handleInputChange}
                className={errors.food_name ? 'error' : ''}
              />
              {errors.food_name && <div className="error-message">{errors.food_name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Kategori:</label>
              <select
                id="category"
                name="category"
                value={food.category}
                onChange={handleCategoryChange}
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
                <option value="yeni">+ Yeni Kategori</option>
              </select>
              
              {showNewCategory && (
                <div className="new-category-input">
                  <input
                    type="text"
                    placeholder="Yeni kategori adı"
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                  />
                  <button type="button" onClick={addNewCategory}>Ekle</button>
                </div>
              )}
            </div>
            
            <div className="nutrition-values">
              <h4>Besin Değerleri (100g için)</h4>
              
              <div className="form-group">
                <label htmlFor="calories">Kalori (kcal):</label>
                <input
                  type="text"
                  id="calories"
                  name="calories"
                  value={food.calories}
                  onChange={handleInputChange}
                  className={errors.calories ? 'error' : ''}
                  placeholder="0"
                />
                {errors.calories && <div className="error-message">{errors.calories}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="protein">Protein (g):</label>
                <input
                  type="text"
                  id="protein"
                  name="protein"
                  value={food.protein}
                  onChange={handleInputChange}
                  className={errors.protein ? 'error' : ''}
                  placeholder="0"
                />
                {errors.protein && <div className="error-message">{errors.protein}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="carbs">Karbonhidrat (g):</label>
                <input
                  type="text"
                  id="carbs"
                  name="carbs"
                  value={food.carbs}
                  onChange={handleInputChange}
                  className={errors.carbs ? 'error' : ''}
                  placeholder="0"
                />
                {errors.carbs && <div className="error-message">{errors.carbs}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="fat">Yağ (g):</label>
                <input
                  type="text"
                  id="fat"
                  name="fat"
                  value={food.fat}
                  onChange={handleInputChange}
                  className={errors.fat ? 'error' : ''}
                  placeholder="0"
                />
                {errors.fat && <div className="error-message">{errors.fat}</div>}
              </div>
            </div>
          </div>
          
          <div className="form-right">
            <div className="form-group">
              <label htmlFor="image">Görsel (isteğe bağlı):</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="help-text">Yiyecek için bir görsel ekleyebilirsiniz.</p>
            </div>
            
            <div className="image-preview">
              {filePreview ? (
                <img src={filePreview} alt="Önizleme" />
              ) : imageUrl ? (
                <img src={imageUrl} alt="Mevcut görsel" />
              ) : (
                <div className="no-image">
                  <p>Görsel Yok</p>
                </div>
              )}
            </div>
            
            <div className="nutrition-summary">
              <h4>Besin Özeti</h4>
              <div className="nutrition-chart">
                <div className="nutrition-bar">
                  <div 
                    className="protein-bar" 
                    style={{ 
                      width: `${food.protein ? (parseFloat(food.protein) * 4 / parseFloat(food.calories) * 100) : 0}%` 
                    }}
                  ></div>
                  <div 
                    className="carbs-bar" 
                    style={{ 
                      width: `${food.carbs ? (parseFloat(food.carbs) * 4 / parseFloat(food.calories) * 100) : 0}%` 
                    }}
                  ></div>
                  <div 
                    className="fat-bar" 
                    style={{ 
                      width: `${food.fat ? (parseFloat(food.fat) * 9 / parseFloat(food.calories) * 100) : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="nutrition-legend">
                  <div className="legend-item">
                    <span className="legend-color protein"></span>
                    <span>Protein: {food.protein ? `${food.protein}g` : '-'}</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color carbs"></span>
                    <span>Karbonhidrat: {food.carbs ? `${food.carbs}g` : '-'}</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color fat"></span>
                    <span>Yağ: {food.fat ? `${food.fat}g` : '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : editMode ? 'Güncelle' : 'Kaydet'}
          </button>
          
          {onCancel && (
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              İptal
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CustomFoodEditor;