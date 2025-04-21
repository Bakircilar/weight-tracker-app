// src/components/FavoritesAndSearchHistory.js
import React, { useState, useEffect } from 'react';

const FavoritesAndSearchHistory = ({ supabase, onFoodSelect }) => {
  const [favorites, setFavorites] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [customFoods, setCustomFoods] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');
  const [loading, setLoading] = useState(true);

  // Verileri yükle
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
      
      // Sık kullanılanları yükle
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorite_foods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (favoritesError) throw favoritesError;
      
      setFavorites(favoritesData || []);
      
      // Arama geçmişini yükle
      const { data: historyData, error: historyError } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('search_count', { ascending: false })
        .limit(10);
        
      if (historyError) throw historyError;
      
      setSearchHistory(historyData || []);
      
      // Özel yiyecekleri yükle
      const { data: customFoodsData, error: customFoodsError } = await supabase
        .from('custom_foods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (customFoodsError) throw customFoodsError;
      
      setCustomFoods(customFoodsData || []);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sık kullanılanlara ekle
  const addToFavorites = async (food) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
      
      // Aynı yiyecek zaten favorilerde mi kontrol et
      const existingFavorite = favorites.find(fav => 
        fav.food_name.toLowerCase() === food.food_name.toLowerCase()
      );
      
      if (existingFavorite) {
        alert('Bu yiyecek zaten favorilerinizde bulunuyor!');
        return;
      }
      
      // Favorilere ekle
      const { error } = await supabase
        .from('favorite_foods')
        .insert([{
          user_id: user.id,
          food_name: food.food_name,
          category: food.category || null,
          image: food.image || null,
          calories: food.calories || 0,
          protein: food.protein || 0,
          carbs: food.carbs || 0,
          fat: food.fat || 0
        }]);
        
      if (error) throw error;
      
      // Yeniden yükle
      loadData();
      alert('Yiyecek favorilere eklendi!');
    } catch (error) {
      console.error('Favorilere ekleme hatası:', error);
      alert('Yiyecek favorilere eklenirken bir hata oluştu.');
    }
  };

  // Favorilerden çıkar
  const removeFromFavorites = async (id) => {
    if (!window.confirm('Bu yiyeceği favorilerinizden çıkarmak istiyor musunuz?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('favorite_foods')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Yerel state güncelle
      setFavorites(prev => prev.filter(item => item.id !== id));
      
      alert('Yiyecek favorilerden çıkarıldı!');
    } catch (error) {
      console.error('Favorilerden çıkarma hatası:', error);
      alert('Yiyecek favorilerden çıkarılırken bir hata oluştu.');
    }
  };

  // Yiyecek seç
  const selectFood = (food) => {
    if (onFoodSelect) {
      // nutrition alanı oluştur
      const nutrition = {
        calories: food.calories || 0,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0
      };
      
      onFoodSelect({
        ...food,
        name: food.food_name,
        nutrition
      });
    }
  };

  // Arama terimine tıkla
  const handleSearchTermClick = (term) => {
    // Burada arama fonksiyonunu çağırabiliriz
    console.log(`Arama terimi tıklandı: ${term}`);
    // Gerçek uygulamada bu terimi kullanarak arama yapmak isteyeceksiniz
  };

  // Arama geçmişinden terim sil
  const removeSearchTerm = async (id) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Yerel state güncelle
      setSearchHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Arama geçmişi silme hatası:', error);
    }
  };

  // Özel yiyeceği sil
  const deleteCustomFood = async (id) => {
    if (!window.confirm('Bu özel yiyeceği silmek istiyor musunuz?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('custom_foods')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Yerel state güncelle
      setCustomFoods(prev => prev.filter(item => item.id !== id));
      
      alert('Özel yiyecek silindi!');
    } catch (error) {
      console.error('Özel yiyecek silme hatası:', error);
      alert('Özel yiyecek silinirken bir hata oluştu.');
    }
  };

  // Favori yiyecekleri render et
  const renderFavorites = () => {
    if (favorites.length === 0) {
      return (
        <div className="empty-state">
          <p>Henüz favori yiyecek eklenmemiş.</p>
          <p className="hint-text">Yiyecek ararken beğendiklerinizi favorilere ekleyebilirsiniz.</p>
        </div>
      );
    }
    
    return (
      <div className="favorites-grid">
        {favorites.map(food => (
          <div key={food.id} className="favorite-card">
            <div className="favorite-image">
              {food.image ? (
                <img src={food.image} alt={food.food_name} />
              ) : (
                <div className="no-image">{food.food_name.charAt(0)}</div>
              )}
            </div>
            <div className="favorite-info">
              <h4>{food.food_name}</h4>
              {food.category && <span className="favorite-category">{food.category}</span>}
              <div className="favorite-nutrition">
                <span className="calories">{food.calories} kcal</span>
                <span className="macros">
                  P: {food.protein}g | K: {food.carbs}g | Y: {food.fat}g
                </span>
              </div>
            </div>
            <div className="favorite-actions">
              <button 
                className="btn-primary btn-sm"
                onClick={() => selectFood(food)}
              >
                Ekle
              </button>
              <button 
                className="btn-danger btn-sm"
                onClick={() => removeFromFavorites(food.id)}
              >
                Çıkar
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Arama geçmişini render et
  const renderSearchHistory = () => {
    if (searchHistory.length === 0) {
      return (
        <div className="empty-state">
          <p>Henüz arama geçmişi bulunmuyor.</p>
          <p className="hint-text">Yaptığınız aramalar burada kaydedilecektir.</p>
        </div>
      );
    }
    
    return (
      <div className="search-history-list">
        {searchHistory.map(item => (
          <div key={item.id} className="search-term-item">
            <div 
              className="search-term" 
              onClick={() => handleSearchTermClick(item.search_term)}
            >
              <span className="term-text">{item.search_term}</span>
              <span className="search-count">{item.search_count}x</span>
            </div>
            <button 
              className="remove-term"
              onClick={() => removeSearchTerm(item.id)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Özel yiyecekleri render et
  const renderCustomFoods = () => {
    if (customFoods.length === 0) {
      return (
        <div className="empty-state">
          <p>Henüz özel yiyecek eklenmemiş.</p>
          <p className="hint-text">Kendi özel yiyeceklerinizi ekleyerek beslenme planınızı kişiselleştirebilirsiniz.</p>
        </div>
      );
    }
    
    return (
      <div className="custom-foods-grid">
        {customFoods.map(food => (
          <div key={food.id} className="custom-food-card">
            <div className="custom-food-image">
              {food.image ? (
                <img src={food.image} alt={food.food_name} />
              ) : (
                <div className="no-image">{food.food_name.charAt(0)}</div>
              )}
            </div>
            <div className="custom-food-info">
              <h4>{food.food_name}</h4>
              {food.category && <span className="custom-food-category">{food.category}</span>}
              <div className="custom-food-nutrition">
                <span className="calories">{food.calories} kcal</span>
                <span className="macros">
                  P: {food.protein}g | K: {food.carbs}g | Y: {food.fat}g
                </span>
              </div>
            </div>
            <div className="custom-food-actions">
              <button 
                className="btn-primary btn-sm"
                onClick={() => selectFood(food)}
              >
                Ekle
              </button>
              <button 
                className="btn-secondary btn-sm"
                onClick={() => addToFavorites(food)}
              >
                Favorilere Ekle
              </button>
              <button 
                className="btn-danger btn-sm"
                onClick={() => deleteCustomFood(food.id)}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="favorites-search-history">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favoriler
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Arama Geçmişi
        </button>
        <button 
          className={`tab ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          Özel Yiyecekler
        </button>
      </div>
      
      <div className="tab-content">
        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : (
          <>
            {activeTab === 'favorites' && renderFavorites()}
            {activeTab === 'history' && renderSearchHistory()}
            {activeTab === 'custom' && renderCustomFoods()}
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesAndSearchHistory;