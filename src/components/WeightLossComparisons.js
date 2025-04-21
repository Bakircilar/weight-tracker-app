// src/components/WeightLossComparisons.js
import React, { useState, useEffect } from 'react';

const WeightLossComparisons = ({ weightLoss }) => {
  const [comparisons, setComparisons] = useState([]);
  const [randomMotivation, setRandomMotivation] = useState('');
  
  // Motivasyon mesajları
  const motivationMessages = [
    "Her adım sizi hedefinize bir adım daha yaklaştırır!",
    "Bugün yaptığınız seçimler, yarın kim olacağınızı belirler.",
    "Başarı bir günde gelmez, ama her gün biraz ilerleme kaydedebilirsiniz.",
    "Mükemmel olmaya gerek yok, tutarlı olmak önemli.",
    "Kendinize inanın, başarınızın anahtarı bu!",
    "Sizi hedefinizden ayıran şey, bugün yapacağınız seçimlerdir.",
    "En iyi yatırım, kendi sağlığınıza yaptığınız yatırımdır.",
    "Zorluklar sizi güçlendirir, pes etmeyin!",
    "Hedefinize ulaşmak bir maraton, sprint değil.",
    "Sağlıklı alışkanlıklar, sağlıklı bir yaşam sunar.",
    "Vücudunuza bir konuk gibi değil, bir ev sahibi gibi davranın.",
    "Bugün atılan küçük adımlar, yarın büyük değişimlere yol açar.",
    "Başkalarının başarısını değil, kendi ilerleyişinizi takip edin.",
    "Zorlandığınızda, neden başladığınızı hatırlayın.",
    "Değişim kolay değildir, ama değer!",
    "Önünüzde uzun bir yol var, ama her kilometre sizi güçlendirir.",
    "Her gün kendini biraz daha iyi hissetmek için bir fırsat.",
    "Beden ve zihin bir bütündür, her ikisine de iyi bakın.",
    "Hazır hissetmediğinizde bile devam edin, motivasyon hareketle gelir.",
    "Bu yolculukta yavaşlayabilirsiniz, ama asla durmayın!"
  ];
  
  // Kilo kaybı karşılaştırmaları
  const weightComparisons = [
    { amount: 0.5, object: "standart bir şişe su", image: "water_bottle.png" },
    { amount: 1, object: "1 kilogram pirinç paketi", image: "rice.png" },
    { amount: 1.5, object: "ortalama bir laptop bilgisayar", image: "laptop.png" },
    { amount: 2, object: "2 litrelik bir kola şişesi", image: "soda.png" },
    { amount: 2.5, object: "ortalama bir ev kedisi", image: "cat.png" },
    { amount: 3, object: "standart bir karpuz", image: "watermelon.png" },
    { amount: 4, object: "ortalama bir ütü", image: "iron.png" },
    { amount: 5, object: "5 kilogramlık un çuvalı", image: "flour.png" },
    { amount: 6, object: "ortalama bir bowling topu", image: "bowling.png" },
    { amount: 7, object: "küçük bir mikrodalga fırın", image: "microwave.png" },
    { amount: 8, object: "standart bir elektrikli süpürge", image: "vacuum.png" },
    { amount: 9, object: "ortalama bir yeni doğan bebek", image: "baby.png" },
    { amount: 10, object: "standart bir ofis koltuğu", image: "office_chair.png" },
    { amount: 15, object: "ortalama bir lastik tekerlek", image: "tire.png" },
    { amount: 20, object: "yaz tatili valizi", image: "luggage.png" },
    { amount: 25, object: "iki adet tam dolu market poşeti", image: "groceries.png" },
    { amount: 30, object: "ortalama bir 5 yaşındaki çocuk", image: "child.png" },
    { amount: 40, object: "bir büyük su damacanası (19L)", image: "water_jug.png" },
    { amount: 50, object: "ortalama bir çimento torbası", image: "cement.png" }
  ];

  // Random motivasyon mesajı seç
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationMessages.length);
    setRandomMotivation(motivationMessages[randomIndex]);
  }, []);

  // Kilo kaybına göre karşılaştırmaları seç
  useEffect(() => {
    if (weightLoss <= 0) {
      setComparisons([]);
      return;
    }
    
    // En uygun karşılaştırmaları bul
    const relevantComparisons = [];
    
    // Tam eşleşenler
    const exactMatches = weightComparisons.filter(c => c.amount === Math.floor(weightLoss));
    if (exactMatches.length > 0) {
      relevantComparisons.push({
        ...exactMatches[0],
        count: 1,
        totalWeight: exactMatches[0].amount
      });
    }
    
    // Tek bir objeden birden fazla
    const possibleMultiples = weightComparisons.filter(c => c.amount <= weightLoss / 2);
    if (possibleMultiples.length > 0) {
      // En büyük uygun nesneyi seç
      const largest = possibleMultiples[possibleMultiples.length - 1];
      const count = Math.floor(weightLoss / largest.amount);
      if (count >= 2 && count <= 10) { // Makul bir sayıda nesne
        relevantComparisons.push({
          ...largest,
          count,
          totalWeight: count * largest.amount
        });
      }
    }
    
    // Farklı nesnelerin kombinasyonu
    if (weightLoss >= 5) {
      const smallItems = weightComparisons.filter(c => c.amount <= 3);
      const largeItems = weightComparisons.filter(c => c.amount >= weightLoss - 3 && c.amount <= weightLoss - 1);
      
      if (smallItems.length > 0 && largeItems.length > 0) {
        // Rastgele bir küçük ve büyük nesne seç
        const small = smallItems[Math.floor(Math.random() * smallItems.length)];
        const large = largeItems[Math.floor(Math.random() * largeItems.length)];
        
        relevantComparisons.push({
          type: 'combo',
          item1: small,
          item2: large,
          totalWeight: small.amount + large.amount
        });
      }
    }
    
    // Karşılaştırmaları dağınık sırayla göster
    setComparisons(relevantComparisons.sort(() => Math.random() - 0.5));
  }, [weightLoss]);

  // Kilo değeri eksi veya sıfırsa
  if (weightLoss <= 0) {
    return (
      <div className="weight-loss-comparisons empty">
        <p className="motivation-message">{randomMotivation}</p>
        <p className="start-message">Kilo kaybınızı görmek için uygulamayı kullanmaya devam edin!</p>
      </div>
    );
  }

  return (
    <div className="weight-loss-comparisons">
      <h3>İlerlemeni Hisset!</h3>
      
      <div className="total-weight-lost">
        <span className="weight-value">{weightLoss.toFixed(1)} kg</span>
        <span className="weight-label">Toplam Kilo Kaybı</span>
      </div>
      
      <div className="motivation-section">
        <p className="motivation-message">{randomMotivation}</p>
      </div>
      
      {comparisons.length > 0 && (
        <div className="comparisons-container">
          <h4>Kaybettiğin kilolar...</h4>
          
          <div className="comparison-cards">
            {comparisons.map((comparison, index) => (
              <div key={index} className="comparison-card">
                {comparison.type === 'combo' ? (
                  <div className="combo-comparison">
                    <p className="comparison-text">
                      <span className="highlight">{comparison.item1.amount} kg</span> ağırlığındaki 
                      <strong> {comparison.item1.object}</strong> ve 
                      <span className="highlight"> {comparison.item2.amount} kg</span> ağırlığındaki 
                      <strong> {comparison.item2.object}</strong>'ye eşit!
                    </p>
                    <p className="total-text">
                      Toplam: <span className="highlight">{comparison.totalWeight} kg</span>
                    </p>
                  </div>
                ) : (
                  <div className="single-comparison">
                    <p className="comparison-text">
                      {comparison.count > 1 ? (
                        <>
                          <span className="highlight">{comparison.count} adet</span>
                          <strong> {comparison.object}</strong>'ye eşit!
                        </>
                      ) : (
                        <>
                          <span className="highlight">{comparison.amount} kg</span> ağırlığındaki 
                          <strong> {comparison.object}</strong>'ye eşit!
                        </>
                      )}
                    </p>
                    {comparison.count > 1 && (
                      <p className="total-text">
                        Toplam: <span className="highlight">{comparison.totalWeight} kg</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="calorie-facts">
        <h4>Kalori Gerçekleri</h4>
        <ul className="fact-list">
          <li>
            <span className="fact-number">{Math.round(weightLoss * 7700)}</span>
            <span className="fact-text">Harcadığın fazladan kalori</span>
          </li>
          <li>
            <span className="fact-number">{Math.round(weightLoss * 7700 / 300)}</span>
            <span className="fact-text">Koşulan 5 km koşu</span>
          </li>
          <li>
            <span className="fact-number">{Math.round(weightLoss * 0.146 * 100) / 100}</span>
            <span className="fact-text">BMI puanı düşüşü</span>
          </li>
        </ul>
      </div>
      
      <div className="health-benefits">
        <h4>Sağlık Faydaları</h4>
        <div className="benefits-list">
          {weightLoss >= 2.5 && (
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <span className="benefit-text">Kan basıncında düşüş</span>
            </div>
          )}
          {weightLoss >= 5 && (
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <span className="benefit-text">Kolesterol seviyelerinde iyileşme</span>
            </div>
          )}
          {weightLoss >= 7 && (
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <span className="benefit-text">Uyku kalitesinde artış</span>
            </div>
          )}
          {weightLoss >= 10 && (
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <span className="benefit-text">Tip 2 diyabet riski azalması</span>
            </div>
          )}
          {weightLoss >= 15 && (
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <span className="benefit-text">Eklem ağrılarında belirgin azalma</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightLossComparisons;