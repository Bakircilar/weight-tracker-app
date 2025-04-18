# Sağlıklı Yaşam Takip Uygulaması

Bu uygulama, kilo verme hedeflerinizi takip etmenize ve beslenme planınızı yönetmenize yardımcı olan bir web uygulamasıdır.

## Özellikler

- Kilo verme takibi ve grafiklerle gösterim
- 7 günlük beslenme planı
- Günlük kilo takibi
- Profil yönetimi
- Güvenli kimlik doğrulama

## Teknolojiler

- React
- Supabase (Veritabanı ve Kimlik Doğrulama)
- Date-fns (Tarih işlemleri)
- Recharts (Grafikler)
- React Router (Sayfa yönlendirme)

## Kurulum

1. Projeyi klonlayın:
```
git clone https://github.com/kullaniciadi/weight-tracker-app.git
cd weight-tracker-app
```

2. Bağımlılıkları yükleyin:
```
npm install
```

3. Supabase projesini oluşturun ve veritabanı tablolarınızı ayarlayın.

4. `.env` dosyası oluşturun ve Supabase bilgilerinizi ekleyin:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Uygulamayı başlatın:
```
npm start
```

## Supabase Veritabanı Yapısı

Uygulamayı çalıştırmak için aşağıdaki tabloları oluşturmanız gerekir:

### profiles

- user_id (uuid, primary key)
- height (float)
- start_weight (float)
- target_weight (float)
- target_date (date)
- activity_level (varchar)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

### weight_entries

- id (uuid, primary key)
- user_id (uuid, foreign key)
- date (date)
- weight (float)
- created_at (timestamp with time zone)

### meal_plans

- id (uuid, primary key)
- day (varchar) - Pazartesi, Salı, vb.
- meal_type (varchar) - Kahvaltı, Öğle Yemeği, Akşam Yemeği, Ara Öğün
- title (varchar)
- description (text)
- calories (integer)
- created_at (timestamp with time zone)

### completed_meals

- id (uuid, primary key)
- user_id (uuid, foreign key)
- date (date)
- meal_type (varchar)
- created_at (timestamp with time zone)

## Netlify Dağıtımı

1. GitHub'a projenizi push edin
2. Netlify'da yeni site oluşturun ve GitHub reponuzu seçin
3. Build komutları:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Environment variables'a Supabase bilgilerinizi ekleyin
5. Deploy edin!

## Lisans

MIT