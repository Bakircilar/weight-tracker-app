// src/components/FoodSearch.js - Geliştirilmiş Arama
import React, { useState } from 'react';

const FoodSearch = ({ onFoodSelect, maxCalories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Global Open Food Facts API kullan (daha fazla veri)
      // Türkçe sonuçları önceliklendir ve sayfa boyutunu artır
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&search_simple=1&action=process&lc=tr&page_size=50&json=1&fields=code,product_name,product_name_tr,brands,image_url,nutriments,serving_size`
      );
      
      if (!response.ok) {
        throw new Error('Yiyecek verileri alınamadı');
      }
      
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        // Verileri dönüştür ve sadece gerekli alanları al
        const formattedResults = data.products.map(product => {
          // Kalori değerini farklı kaynaklardan al (API tutarsız olabiliyor)
          const calories = 
            product.nutriments?.energy_value || 
            product.nutriments?.energy || 
            product.nutriments['energy-kcal'] ||
            product.nutriments['energy-kcal_100g'] || 
            product.nutriments?.calories || 
            0;
            
          return {
            id: product.code,
            // Türkçe ismi varsa kullan, yoksa normal isim
            name: product.product_name_tr || product.product_name || 'İsimsiz Ürün',
            brand: product.brands || '',
            image: product.image_url || '',
            nutrition: {
              calories: parseFloat(calories),
              protein: parseFloat(product.nutriments?.proteins || product.nutriments?.proteins_100g || 0),
              carbs: parseFloat(product.nutriments?.carbohydrates || product.nutriments?.carbohydrates_100g || 0),
              fat: parseFloat(product.nutriments?.fat || product.nutriments?.fat_100g || 0),
              servingSize: product.serving_size || '100g'
            }
          };
        });
        
        // Kalori değeri doğru olanları filtrele (0 veya NaN değil)
        const validResults = formattedResults.filter(
          item => item.nutrition.calories && !isNaN(item.nutrition.calories) && item.nutrition.calories > 0
        );
        
        if (validResults.length > 0) {
          setResults(validResults);
        } else {
          setResults([]);
          setError('Kalori bilgisi olan sonuç bulunamadı. Lütfen başka bir arama terimi deneyin.');
        }
      } else {
        setResults([]);
        setError('Aramanızla eşleşen sonuç bulunamadı');
      }
    } catch (error) {
      console.error('Yiyecek arama hatası:', error);
      setError('Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  const addFood = (food) => {
    onFoodSelect(food);
  };
  
  return (
    <div className="food-search">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Yiyecek ara... (örn. elma, ekmek, süt, banana, chocolate)"
            className="search-input"
          />
          <button type="submit" className="btn-primary search-button" disabled={loading}>
            {loading ? 'Aranıyor...' : 'Ara'}
          </button>
        </div>
      </form>
      
      {error && <p className="error-message">{error}</p>}
      
      {results.length > 0 && (
        <div className="search-results">
          <h4>Arama Sonuçları ({results.length})</h4>
          <p className="search-tip">Not: Hem Türkçe hem de uluslararası veritabanında arama yapılıyor.</p>
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
                    {food.brand && <p className="food-brand">{food.brand}</p>}
                    <p className="food-nutrition">
                      <span>{Math.round(food.nutrition.calories)} kcal</span>
                      <span>{food.nutrition.protein.toFixed(1)}g protein</span>
                      <span>{food.nutrition.carbs.toFixed(1)}g karb</span>
                      <span>{food.nutrition.fat.toFixed(1)}g yağ</span>
                    </p>
                  </div>
                </div>
                <button 
                  className="btn-sm btn-primary add-food-btn"
                  onClick={() => addFood(food)}
                  disabled={maxCalories && food.nutrition.calories > maxCalories}
                >
                  {maxCalories && food.nutrition.calories > maxCalories 
                    ? 'Kalori Limiti Aşılıyor'
                    : 'Ekle'
                  }
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FoodSearch;