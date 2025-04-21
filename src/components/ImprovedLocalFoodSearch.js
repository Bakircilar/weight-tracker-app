// src/components/ImprovedLocalFoodSearch.js
import React, { useState, useEffect } from 'react';
import extendedFoodDatabase, { searchFood, getAllCategories, filterByCategory } from '../utils/extendedFoodDatabase';
import ImprovedFoodQuantityModal from './ImprovedFoodQuantityModal';

const ImprovedLocalFoodSearch = ({ onFoodSelect, maxCalories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [remainingCalories, setRemainingCalories] = useState(maxCalories || 0);
  const [searching, setSearching] = useState(false);
  
  // Kategorileri yükle
  useEffect(() => {
    setCategories(getAllCategories());
    // Başlangıçta tüm yiyecekleri göster
    setResults(extendedFoodDatabase);
  }, []);

  // Arama veya kategori değiştiğinde sonuçları güncelle
  useEffect(() => {
    let filteredResults = [];
    
    if (searchTerm.trim()) {
      // Arama terimine göre filtrele
      filteredResults = searchFood(searchTerm);
      
      if (category) {
        // Hem arama terimi hem de kategoriye göre filtrele
        filteredResults = filteredResults.filter(food => food.category === category);
      }
    } else if (category) {
      // Sadece kategoriye göre filtrele
      filteredResults = filterByCategory(category);
    } else {
      // Filtre yoksa tüm veritabanını göster
      filteredResults = extendedFoodDatabase;
    }
    
    setResults(filteredResults);
  }, [searchTerm, category]);
  
  // Kalan kalori miktarını güncelle
  useEffect(() => {
    setRemainingCalories(maxCalories || 0);
  }, [maxCalories]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setSearching(true);
    
    // Form gönderildiğinde mevcut arama terimine göre sonuçları güncelle
    const filteredResults = searchTerm.trim() 
      ? searchFood(searchTerm) 
      : extendedFoodDatabase;
      
    setResults(category 
      ? filteredResults.filter(food => food.category === category) 
      : filteredResults
    );
    
    setTimeout(() => setSearching(false), 300);
  };
  
  // Yiyecek seçildiğinde miktar modalını göster
  const selectFood = (food) => {
    setSelectedFood(food);
  };
  
  // Miktar seçimi onaylandığında
  const handleConfirmQuantity = (updatedFood) => {
    onFoodSelect(updatedFood);
    setSelectedFood(null); // Modal'ı kapat
  };
  
  // Miktar seçimi iptal edildiğinde
  const handleCancelQuantity = () => {
    setSelectedFood(null);
  };
  
  return (
    <div className="food-search local improved">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Yiyecek ara... (örn. elma, ekmek, tavuk)"
            className="search-input"
          />
          <button type="submit" className="btn-primary search-button" disabled={searching}>
            {searching ? 'Aranıyor...' : 'Ara'}
          </button>
        </div>
        
        <div className="category-filter">
          <label htmlFor="category">Kategori:</label>
          <select 
            id="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </form>
      
      {maxCalories > 0 && (
        <div className="calorie-info">
          <div className="calorie-badge">
            <span className="calorie-label">Kalan Kalori:</span>
            <span className="calorie-value">{remainingCalories} kcal</span>
          </div>
          <p className="calorie-tip">Yüksek kalorili yiyecekler için daha düşük miktar seçebilirsiniz.</p>
        </div>
      )}
      
      <div className="search-results">
        <h4>Yiyecekler ({results.length})</h4>
        
        {results.length === 0 ? (
          <p className="no-results">Arama kriterlerinize uygun yiyecek bulunamadı.</p>
        ) : (
          <ul className="food-list">
            {results.map(food => (
              <li key={food.id} className="food-item">
                <div className="food-info">
                  <div className="food-image">
                    {food.image ? (
                      <img src={food.image} alt={food.name} />
                    ) : (
                      <div className="no-image">Görsel Yok</div>
                    )}
                  </div>
                  <div className="food-details">
                    <h5>{food.name}</h5>
                    <p className="food-category">{food.category}</p>
                    <p className="food-nutrition">
                      <span>{Math.round(food.nutrition.calories)} kcal</span>
                      <span>{food.nutrition.protein.toFixed(1)}g protein</span>
                      <span>{food.nutrition.carbs.toFixed(1)}g karb</span>
                      <span>{food.nutrition.fat.toFixed(1)}g yağ</span>
                    </p>
                    <p className="food-quantity-note">* 100g için değerler</p>
                  </div>
                </div>
                <button 
                  className="btn-sm btn-primary add-food-btn"
                  onClick={() => selectFood(food)}
                >
                  Ekle
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Geliştirilmiş Miktar Seçim Modalı */}
      {selectedFood && (
        <ImprovedFoodQuantityModal 
          food={selectedFood}
          onConfirm={handleConfirmQuantity}
          onCancel={handleCancelQuantity}
          maxCalories={maxCalories}
        />
      )}
    </div>
  );
};

export default ImprovedLocalFoodSearch;