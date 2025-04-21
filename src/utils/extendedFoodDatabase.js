// src/utils/extendedFoodDatabase.js - Genişletilmiş yiyecek veritabanı
// Mevcut veritabanına 100'den fazla yeni yiyecek eklendi

import foodDatabase from './foodDatabase';

const additionalFoods = [
  // MEYVELER - YENİ EKLEMELER
  {
    id: "fruit-11",
    name: "Ananas",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2015/12/30/11/57/fruit-1115475_960_720.jpg",
    nutrition: {
      calories: 50,
      protein: 0.5,
      carbs: 13.1,
      fat: 0.1
    }
  },
  {
    id: "fruit-12",
    name: "Avokado",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2017/05/11/19/49/avocado-2305212_960_720.jpg",
    nutrition: {
      calories: 160,
      protein: 2,
      carbs: 8.5,
      fat: 14.7
    }
  },
  {
    id: "fruit-13",
    name: "Nar",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2018/05/07/14/38/pomegranate-3380631_960_720.jpg",
    nutrition: {
      calories: 83,
      protein: 1.7,
      carbs: 18.7,
      fat: 1.2
    }
  },
  {
    id: "fruit-14",
    name: "Mango",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2017/05/31/14/31/mango-2360551_960_720.jpg",
    nutrition: {
      calories: 60,
      protein: 0.8,
      carbs: 15,
      fat: 0.4
    }
  },
  {
    id: "fruit-15",
    name: "Böğürtlen",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2015/03/26/09/40/blackberries-690112_960_720.jpg",
    nutrition: {
      calories: 43,
      protein: 1.4,
      carbs: 9.6,
      fat: 0.5
    }
  },
  {
    id: "fruit-16",
    name: "Ahududu",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2010/12/13/10/05/raspberry-2275_960_720.jpg",
    nutrition: {
      calories: 52,
      protein: 1.2,
      carbs: 11.9,
      fat: 0.7
    }
  },
  {
    id: "fruit-17",
    name: "İncir",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2017/08/17/18/30/figs-2652559_960_720.jpg",
    nutrition: {
      calories: 74,
      protein: 0.8,
      carbs: 19.2,
      fat: 0.3
    }
  },
  {
    id: "fruit-18",
    name: "Kivi",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2016/02/25/17/08/kiwi-1222756_960_720.jpg",
    nutrition: {
      calories: 61,
      protein: 1.1,
      carbs: 14.7,
      fat: 0.5
    }
  },
  {
    id: "fruit-19",
    name: "Greyfurt",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2016/03/05/19/39/grapefruit-1238255_960_720.jpg",
    nutrition: {
      calories: 42,
      protein: 0.8,
      carbs: 10.7,
      fat: 0.1
    }
  },
  {
    id: "fruit-20",
    name: "Çilek",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2017/01/27/22/32/strawberries-2015238_960_720.jpg",
    nutrition: {
      calories: 32,
      protein: 0.7,
      carbs: 7.7,
      fat: 0.3
    }
  },
  
  // SEBZELER - YENİ EKLEMELER
  {
    id: "vegetable-11",
    name: "Kırmızı Lahana",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2018/10/03/22/08/red-cabbage-3722518_960_720.jpg",
    nutrition: {
      calories: 31,
      protein: 1.4,
      carbs: 7.4,
      fat: 0.2
    }
  },
  {
    id: "vegetable-12",
    name: "Kuru Fasulye",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2015/04/10/00/22/beans-715542_960_720.jpg",
    nutrition: {
      calories: 337,
      protein: 21,
      carbs: 63,
      fat: 1.2
    }
  },
  {
    id: "vegetable-13",
    name: "Enginar",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/artichoke-1238253_960_720.jpg",
    nutrition: {
      calories: 47,
      protein: 3.3,
      carbs: 10.5,
      fat: 0.2
    }
  },
  {
    id: "vegetable-14",
    name: "Taze Fasulye",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2016/08/31/16/01/green-beans-1634665_960_720.jpg",
    nutrition: {
      calories: 31,
      protein: 1.8,
      carbs: 7,
      fat: 0.1
    }
  },
  {
    id: "vegetable-15",
    name: "Kuşkonmaz",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2015/04/27/22/21/asparagus-742942_960_720.jpg",
    nutrition: {
      calories: 20,
      protein: 2.2,
      carbs: 3.9,
      fat: 0.1
    }
  },
  {
    id: "vegetable-16",
    name: "Bezelye",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2016/05/27/08/51/mobile-phone-1419275_960_720.jpg",
    nutrition: {
      calories: 81,
      protein: 5.4,
      carbs: 14.5,
      fat: 0.4
    }
  },
  {
    id: "vegetable-17",
    name: "Turp",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2017/06/09/16/39/radishes-2387394_960_720.jpg",
    nutrition: {
      calories: 16,
      protein: 0.7,
      carbs: 3.4,
      fat: 0.1
    }
  },
  {
    id: "vegetable-18",
    name: "Kereviz",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2016/03/05/22/59/celeriac-1239424_960_720.jpg",
    nutrition: {
      calories: 42,
      protein: 1.5,
      carbs: 9.2,
      fat: 0.3
    }
  },
  {
    id: "vegetable-19",
    name: "Mantar",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2016/01/10/19/14/mushrooms-1132068_960_720.jpg",
    nutrition: {
      calories: 22,
      protein: 3.1,
      carbs: 3.3,
      fat: 0.3
    }
  },
  {
    id: "vegetable-20",
    name: "Karnabahar",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/cauliflower-1238252_960_720.jpg",
    nutrition: {
      calories: 25,
      protein: 1.9,
      carbs: 5,
      fat: 0.3
    }
  },
  
  // ET VE BALIK - YENİ EKLEMELER
  {
    id: "meat-8",
    name: "Karaciğer",
    category: "Et",
    image: "https://cdn.pixabay.com/photo/2017/07/16/22/22/liver-2510771_960_720.jpg",
    nutrition: {
      calories: 175,
      protein: 26.5,
      carbs: 3.8,
      fat: 4.9
    }
  },
  {
    id: "meat-9",
    name: "Bonfile",
    category: "Et",
    image: "https://cdn.pixabay.com/photo/2018/01/31/08/57/meat-3120334_960_720.jpg",
    nutrition: {
      calories: 202,
      protein: 25.9,
      carbs: 0,
      fat: 11.3
    }
  },
  {
    id: "meat-10",
    name: "Biftek",
    category: "Et",
    image: "https://cdn.pixabay.com/photo/2016/11/18/14/16/steak-1834653_960_720.jpg",
    nutrition: {
      calories: 252,
      protein: 26,
      carbs: 0,
      fat: 17
    }
  },
  {
    id: "meat-11",
    name: "Kuzu Şiş",
    category: "Et",
    image: "https://cdn.pixabay.com/photo/2017/08/10/08/42/meat-2620507_960_720.jpg",
    nutrition: {
      calories: 231,
      protein: 28,
      carbs: 0,
      fat: 14
    }
  },
  {
    id: "meat-12",
    name: "Levrek",
    category: "Balık",
    image: "https://cdn.pixabay.com/photo/2019/07/16/05/08/sea-bream-4340684_960_720.jpg",
    nutrition: {
      calories: 97,
      protein: 19.3,
      carbs: 0,
      fat: 2.5
    }
  },
  {
    id: "meat-13",
    name: "Çipura",
    category: "Balık",
    image: "https://cdn.pixabay.com/photo/2016/06/30/18/53/fish-1489743_960_720.jpg",
    nutrition: {
      calories: 100,
      protein: 20.5,
      carbs: 0,
      fat: 2.3
    }
  },
  {
    id: "meat-14",
    name: "Hamsi",
    category: "Balık",
    image: "https://cdn.pixabay.com/photo/2017/01/11/14/56/anchovy-1971667_960_720.jpg",
    nutrition: {
      calories: 131,
      protein: 20.3,
      carbs: 0,
      fat: 4.8
    }
  },
  {
    id: "meat-15",
    name: "Karides",
    category: "Deniz Ürünü",
    image: "https://cdn.pixabay.com/photo/2015/04/10/16/06/shrimp-717222_960_720.jpg",
    nutrition: {
      calories: 99,
      protein: 24,
      carbs: 0.2,
      fat: 0.3
    }
  },
  {
    id: "meat-16",
    name: "Kalamar",
    category: "Deniz Ürünü",
    image: "https://cdn.pixabay.com/photo/2018/01/18/19/07/calamari-3091203_960_720.jpg",
    nutrition: {
      calories: 92,
      protein: 15.6,
      carbs: 3.1,
      fat: 1.4
    }
  },
  {
    id: "meat-17",
    name: "Ahtapot",
    category: "Deniz Ürünü",
    image: "https://cdn.pixabay.com/photo/2018/01/30/17/11/grilled-octopus-3119938_960_720.jpg",
    nutrition: {
      calories: 82,
      protein: 14.9,
      carbs: 2,
      fat: 1.2
    }
  },
  
  // SÜT ÜRÜNLERİ - YENİ EKLEMELER
  {
    id: "dairy-6",
    name: "Labne Peyniri",
    category: "Süt Ürünü",
    image: "https://cdn.pixabay.com/photo/2019/11/09/07/56/cream-cheese-4612329_960_720.jpg",
    nutrition: {
      calories: 294,
      protein: 6.2,
      carbs: 3.1,
      fat: 29
    }
  },
  {
    id: "dairy-7",
    name: "Tulum Peyniri",
    category: "Süt Ürünü",
    image: "https://cdn.pixabay.com/photo/2015/01/23/17/45/cheese-610559_960_720.jpg",
    nutrition: {
      calories: 363,
      protein: 22.3,
      carbs: 1.8,
      fat: 29.5
    }
  },
  {
    id: "dairy-8",
    name: "Lor Peyniri",
    category: "Süt Ürünü",
    image: "https://cdn.pixabay.com/photo/2020/05/10/20/57/cottage-cheese-5155630_960_720.jpg",
    nutrition: {
      calories: 98,
      protein: 11.1,
      carbs: 3.4,
      fat: 4.3
    }
  },
  {
    id: "dairy-9",
    name: "Kefir",
    category: "Süt Ürünü",
    image: "https://cdn.pixabay.com/photo/2014/05/17/18/26/kefir-347404_960_720.jpg",
    nutrition: {
      calories: 55,
      protein: 3.3,
      carbs: 4.1,
      fat: 2.2
    }
  },
  {
    id: "dairy-10",
    name: "Ayran",
    category: "Süt Ürünü",
    image: "https://cdn.pixabay.com/photo/2016/07/01/19/43/ayran-1492140_960_720.jpg",
    nutrition: {
      calories: 37,
      protein: 1.7,
      carbs: 2.9,
      fat: 1.5
    }
  },
  {
    id: "dairy-11",
    name: "Süzme Yoğurt",
    category: "Süt Ürünü",
    image: "https://cdn.pixabay.com/photo/2015/07/02/19/52/greek-yogurt-829432_960_720.jpg",
    nutrition: {
      calories: 94,
      protein: 10,
      carbs: 3.6,
      fat: 5
    }
  },
  {
    id: "dairy-12",
    name: "Cacık",
    category: "Süt Ürünü",
    image: "https://cdn.pixabay.com/photo/2017/08/25/15/10/eat-2680461_960_720.jpg",
    nutrition: {
      calories: 52,
      protein: 2.8,
      carbs: 4.2,
      fat: 2.5
    }
  },
  
  // TAHILLAR VE EKMEKLER - YENİ EKLEMELER
  {
    id: "grain-7",
    name: "Çavdar Ekmeği",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2017/08/25/19/36/bread-2681208_960_720.jpg",
    nutrition: {
      calories: 259,
      protein: 8.5,
      carbs: 48,
      fat: 3.3
    }
  },
  {
    id: "grain-8",
    name: "Simit",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2016/03/05/20/07/bagel-1238949_960_720.jpg",
    nutrition: {
      calories: 322,
      protein: 10.4,
      carbs: 64,
      fat: 5
    }
  },
  {
    id: "grain-9",
    name: "Pide",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2017/11/22/09/17/bread-2969571_960_720.jpg",
    nutrition: {
      calories: 275,
      protein: 8.2,
      carbs: 53,
      fat: 3.5
    }
  },
  {
    id: "grain-10",
    name: "Kepekli Ekmek",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2017/08/14/13/19/bread-2640510_960_720.jpg",
    nutrition: {
      calories: 233,
      protein: 11,
      carbs: 41,
      fat: 3
    }
  },
  {
    id: "grain-11",
    name: "Kraker",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2015/10/05/16/25/crackers-973634_960_720.jpg",
    nutrition: {
      calories: 502,
      protein: 10,
      carbs: 67,
      fat: 20
    }
  },
  {
    id: "grain-12",
    name: "Grissini",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2016/06/20/12/36/bread-stick-1468883_960_720.jpg",
    nutrition: {
      calories: 412,
      protein: 11.3,
      carbs: 73,
      fat: 8.4
    }
  },
  {
    id: "grain-13",
    name: "Kinoa",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2015/05/15/14/18/quinoa-768560_960_720.jpg",
    nutrition: {
      calories: 120,
      protein: 4.4,
      carbs: 21.3,
      fat: 1.9
    }
  },
  {
    id: "grain-14",
    name: "Kuskus",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2020/10/04/18/10/couscous-5628289_960_720.jpg",
    nutrition: {
      calories: 112,
      protein: 3.8,
      carbs: 23,
      fat: 0.2
    }
  },
  
  // KURUYEMİŞLER - YENİ EKLEMELER
  {
    id: "nut-5",
    name: "Kaju",
    category: "Kuruyemiş",
    image: "https://cdn.pixabay.com/photo/2018/01/06/11/08/cashew-nuts-3065068_960_720.jpg",
    nutrition: {
      calories: 553,
      protein: 18,
      carbs: 30,
      fat: 44
    }
  },
  {
    id: "nut-6",
    name: "Kabak Çekirdeği",
    category: "Kuruyemiş",
    image: "https://cdn.pixabay.com/photo/2018/05/03/08/59/pumpkin-3371344_960_720.jpg",
    nutrition: {
      calories: 559,
      protein: 30,
      carbs: 10.7,
      fat: 49
    }
  },
  {
    id: "nut-7",
    name: "Ay Çekirdeği",
    category: "Kuruyemiş",
    image: "https://cdn.pixabay.com/photo/2017/05/02/14/55/sunflower-seeds-2278975_960_720.jpg",
    nutrition: {
      calories: 584,
      protein: 21,
      carbs: 20,
      fat: 51
    }
  },
  {
    id: "nut-8",
    name: "Çam Fıstığı",
    category: "Kuruyemiş",
    image: "https://cdn.pixabay.com/photo/2015/04/30/13/33/pine-nuts-746258_960_720.jpg",
    nutrition: {
      calories: 673,
      protein: 14,
      carbs: 13,
      fat: 68
    }
  },
  {
    id: "nut-9",
    name: "Kuru Üzüm",
    category: "Kuruyemiş",
    image: "https://cdn.pixabay.com/photo/2016/11/20/08/05/sultanas-1842222_960_720.jpg",
    nutrition: {
      calories: 299,
      protein: 3.1,
      carbs: 79,
      fat: 0.5
    }
  },
  {
    id: "nut-10",
    name: "Kuru Kayısı",
    category: "Kuruyemiş",
    image: "https://cdn.pixabay.com/photo/2016/11/17/22/53/apricot-1832964_960_720.jpg",
    nutrition: {
      calories: 241,
      protein: 3.4,
      carbs: 63,
      fat: 0.5
    }
  },
  
  // BAKLAGILLER - YENİ EKLEMELER
  {
    id: "legume-4",
    name: "Börülce",
    category: "Baklagil",
    image: "https://cdn.pixabay.com/photo/2014/05/05/18/58/bean-338886_960_720.jpg",
    nutrition: {
      calories: 116,
      protein: 7.7,
      carbs: 20.8,
      fat: 0.6
    }
  },
  {
    id: "legume-5",
    name: "Bakla",
    category: "Baklagil",
    image: "https://cdn.pixabay.com/photo/2017/03/08/13/54/bean-2126573_960_720.jpg",
    nutrition: {
      calories: 110,
      protein: 7.6,
      carbs: 19.7,
      fat: 0.4
    }
  },
  {
    id: "legume-6",
    name: "Soya Fasulyesi",
    category: "Baklagil",
    image: "https://cdn.pixabay.com/photo/2015/02/07/20/58/soy-627262_960_720.jpg",
    nutrition: {
      calories: 147,
      protein: 12.4,
      carbs: 11.1,
      fat: 6.8
    }
  },
  {
    id: "legume-7",
    name: "Meksika Fasulyesi",
    category: "Baklagil",
    image: "https://cdn.pixabay.com/photo/2016/01/19/18/59/beans-1150080_960_720.jpg",
    nutrition: {
      calories: 142,
      protein: 9.7,
      carbs: 26,
      fat: 0.5
    }
  },
  
  // YAĞLAR - YENİ EKLEMELER
  {
    id: "oil-3",
    name: "Mısır Yağı",
    category: "Yağ",
    image: "https://cdn.pixabay.com/photo/2011/10/21/18/30/vegetable-oil-10874_960_720.jpg",
    nutrition: {
      calories: 884,
      protein: 0,
      carbs: 0,
      fat: 100
    }
  },
  {
    id: "oil-4",
    name: "Soya Yağı",
    category: "Yağ",
    image: "https://cdn.pixabay.com/photo/2015/03/17/14/54/oil-677576_960_720.jpg",
    nutrition: {
      calories: 884,
      protein: 0,
      carbs: 0,
      fat: 100
    }
  },
  {
    id: "oil-5",
    name: "Fındık Yağı",
    category: "Yağ",
    image: "https://cdn.pixabay.com/photo/2020/01/24/02/32/hazelnut-oil-4789739_960_720.jpg",
    nutrition: {
      calories: 884,
      protein: 0,
      carbs: 0,
      fat: 100
    }
  },
  
  // HAZIR YEMEKLER - YENİ EKLEMELER
  {
    id: "meal-10",
    name: "Nohut Yemeği",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2021/02/02/16/34/hummus-5974628_960_720.jpg",
    nutrition: {
      calories: 190,
      protein: 10,
      carbs: 30,
      fat: 5
    }
  },
  {
    id: "meal-11",
    name: "Dolma",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2021/05/31/15/18/dolmas-6298267_960_720.jpg",
    nutrition: {
      calories: 180,
      protein: 4,
      carbs: 18,
      fat: 10
    }
  },
  {
    id: "meal-12",
    name: "Köfte",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2015/04/10/00/22/meatballs-715385_960_720.jpg",
    nutrition: {
      calories: 230,
      protein: 22,
      carbs: 8,
      fat: 12
    }
  },
  {
    id: "meal-13",
    name: "Patlıcan Musakka",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2017/02/16/11/05/moussaka-2071235_960_720.jpg",
    nutrition: {
      calories: 135,
      protein: 7,
      carbs: 10,
      fat: 7
    }
  },
  {
    id: "meal-14",
    name: "Yaprak Sarma",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2017/04/15/13/06/dolmades-2232703_960_720.jpg",
    nutrition: {
      calories: 120,
      protein: 3,
      carbs: 15,
      fat: 5
    }
  },
  {
    id: "meal-15",
    name: "Çiğ Köfte",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2018/06/27/18/15/meatball-3502125_960_720.jpg",
    nutrition: {
      calories: 175,
      protein: 8,
      carbs: 30,
      fat: 3
    }
  },
  
  // TATLILAR - YENİ EKLEMELER
  {
    id: "sweet-5",
    name: "Kazandibi",
    category: "Tatlı",
    image: "https://cdn.pixabay.com/photo/2019/01/25/18/38/pudding-3954450_960_720.jpg",
    nutrition: {
      calories: 220,
      protein: 5,
      carbs: 40,
      fat: 4
    }
  },
  {
    id: "sweet-6",
    name: "Tulumba",
    category: "Tatlı",
    image: "https://cdn.pixabay.com/photo/2019/01/13/12/12/baklava-3930778_960_720.jpg",
    nutrition: {
      calories: 350,
      protein: 3,
      carbs: 50,
      fat: 15
    }
  },
  {
    id: "sweet-7",
    name: "Revani",
    category: "Tatlı",
    image: "https://cdn.pixabay.com/photo/2019/11/29/09/25/cake-4660178_960_720.jpg",
    nutrition: {
      calories: 370,
      protein: 5,
      carbs: 65,
      fat: 10
    }
  },
  {
    id: "sweet-8",
    name: "Şekerpare",
    category: "Tatlı",
    image: "https://cdn.pixabay.com/photo/2019/03/08/20/12/dessert-4043023_960_720.jpg",
    nutrition: {
      calories: 420,
      protein: 4,
      carbs: 70,
      fat: 14
    }
  },
  {
    id: "sweet-9",
    name: "Kadayıf",
    category: "Tatlı",
    image: "https://cdn.pixabay.com/photo/2018/02/24/10/08/desert-3177755_960_720.jpg",
    nutrition: {
      calories: 390,
      protein: 6,
      carbs: 64,
      fat: 12
    }
  },
  {
    id: "sweet-10",
    name: "Aşure",
    category: "Tatlı",
    image: "https://cdn.pixabay.com/photo/2020/05/11/15/06/ashura-5158618_960_720.jpg",
    nutrition: {
      calories: 235,
      protein: 4,
      carbs: 52,
      fat: 1.5
    }
  },
  
  // İÇECEKLER - YENİ EKLEMELER
  {
    id: "drink-6",
    name: "Portakal Suyu",
    category: "İçecek",
    image: "https://cdn.pixabay.com/photo/2016/09/08/19/01/juice-1655731_960_720.jpg",
    nutrition: {
      calories: 45,
      protein: 0.7,
      carbs: 10.4,
      fat: 0.2
    }
  },
  {
    id: "drink-7",
    name: "Elma Suyu",
    category: "İçecek",
    image: "https://cdn.pixabay.com/photo/2016/11/28/22/07/beverage-1866075_960_720.jpg",
    nutrition: {
      calories: 46,
      protein: 0.1,
      carbs: 11.3,
      fat: 0.1
    }
  },
  {
    id: "drink-8",
    name: "Vişne Suyu",
    category: "İçecek",
    image: "https://cdn.pixabay.com/photo/2021/01/16/09/35/morello-5921752_960_720.jpg",
    nutrition: {
      calories: 50,
      protein: 0.5,
      carbs: 12.2,
      fat: 0.1
    }
  },
  {
    id: "drink-9",
    name: "Soda",
    category: "İçecek",
    image: "https://cdn.pixabay.com/photo/2017/12/27/04/53/water-3041659_960_720.jpg",
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  },
  {
    id: "drink-10",
    name: "Boza",
    category: "İçecek",
    image: "https://cdn.pixabay.com/photo/2020/05/07/08/59/food-5140271_960_720.jpg",
    nutrition: {
      calories: 110,
      protein: 1.5,
      carbs: 25,
      fat: 0.6
    }
  },
  
  // FAST FOOD - YENİ EKLEMELER
  {
    id: "fastfood-5",
    name: "Dürüm",
    category: "Fast Food",
    image: "https://cdn.pixabay.com/photo/2018/12/19/13/51/durum-3883784_960_720.jpg",
    nutrition: {
      calories: 490,
      protein: 25,
      carbs: 45,
      fat: 23
    }
  },
  {
    id: "fastfood-6",
    name: "Tavuk Doner",
    category: "Fast Food",
    image: "https://cdn.pixabay.com/photo/2018/08/17/10/32/doner-3612135_960_720.jpg",
    nutrition: {
      calories: 350,
      protein: 35,
      carbs: 25,
      fat: 10
    }
  },
  {
    id: "fastfood-7",
    name: "Et Doner",
    category: "Fast Food",
    image: "https://cdn.pixabay.com/photo/2014/01/22/19/10/doner-250581_960_720.jpg",
    nutrition: {
      calories: 400,
      protein: 30,
      carbs: 20,
      fat: 20
    }
  },
  {
    id: "fastfood-8",
    name: "Çiğ Köfte Dürüm",
    category: "Fast Food",
    image: "https://cdn.pixabay.com/photo/2016/03/26/23/10/bread-1281597_960_720.jpg",
    nutrition: {
      calories: 330,
      protein: 12,
      carbs: 60,
      fat: 5
    }
  },
  {
    id: "fastfood-9",
    name: "Patates Kızartması",
    category: "Fast Food",
    image: "https://cdn.pixabay.com/photo/2016/11/21/16/02/french-fries-1846083_960_720.jpg",
    nutrition: {
      calories: 312,
      protein: 3.4,
      carbs: 41,
      fat: 15
    }
  },
  {
    id: "fastfood-10",
    name: "Soğan Halkası",
    category: "Fast Food",
    image: "https://cdn.pixabay.com/photo/2015/02/06/20/13/onion-rings-626648_960_720.jpg",
    nutrition: {
      calories: 410,
      protein: 6,
      carbs: 48,
      fat: 22
    }
  },
  
  // DİĞER GIDALAR - YENİ EKLEMELER
  {
    id: "other-5",
    name: "Pekmez",
    category: "Diğer",
    image: "https://cdn.pixabay.com/photo/2017/02/26/11/37/honey-2099942_960_720.jpg",
    nutrition: {
      calories: 290,
      protein: 0.4,
      carbs: 72,
      fat: 0.1
    }
  },
  {
    id: "other-6",
    name: "Tahin",
    category: "Diğer",
    image: "https://cdn.pixabay.com/photo/2018/08/01/22/37/tahini-3578198_960_720.jpg",
    nutrition: {
      calories: 595,
      protein: 17,
      carbs: 23,
      fat: 53
    }
  },
  {
    id: "other-7",
    name: "Tahin Helvası",
    category: "Diğer",
    image: "https://cdn.pixabay.com/photo/2018/06/14/08/36/halva-3474069_960_720.jpg",
    nutrition: {
      calories: 507,
      protein: 12,
      carbs: 53,
      fat: 29
    }
  },
  {
    id: "other-8",
    name: "Çikolata",
    category: "Diğer",
    image: "https://cdn.pixabay.com/photo/2018/05/16/15/05/chocolates-3406190_960_720.jpg",
    nutrition: {
      calories: 546,
      protein: 5.5,
      carbs: 58,
      fat: 31
    }
  },
  {
    id: "other-9",
    name: "Süt Çikolatası",
    category: "Diğer",
    image: "https://cdn.pixabay.com/photo/2013/09/18/18/24/chocolate-183543_960_720.jpg",
    nutrition: {
      calories: 535,
      protein: 7.6,
      carbs: 59,
      fat: 29.7
    }
  },
  {
    id: "other-10",
    name: "Bitter Çikolata",
    category: "Diğer",
    image: "https://cdn.pixabay.com/photo/2021/02/01/16/48/dark-chocolate-5971871_960_720.jpg",
    nutrition: {
      calories: 599,
      protein: 7.8,
      carbs: 45.9,
      fat: 42.6
    }
  },
  
  // YENİ KATEGORI: ŞARKÜTERI ÜRÜNLERİ
  {
    id: "deli-1",
    name: "Salam",
    category: "Şarküteri",
    image: "https://cdn.pixabay.com/photo/2018/01/11/08/31/food-3074288_960_720.jpg",
    nutrition: {
      calories: 336,
      protein: 12,
      carbs: 2.5,
      fat: 31
    }
  },
  {
    id: "deli-2",
    name: "Sucuk",
    category: "Şarküteri",
    image: "https://cdn.pixabay.com/photo/2019/07/17/07/55/sausage-4343871_960_720.jpg",
    nutrition: {
      calories: 452,
      protein: 18.2,
      carbs: 1.3,
      fat: 39.5
    }
  },
  {
    id: "deli-3",
    name: "Sosis",
    category: "Şarküteri",
    image: "https://cdn.pixabay.com/photo/2015/07/02/12/34/sausage-829062_960_720.jpg",
    nutrition: {
      calories: 325,
      protein: 13,
      carbs: 2.3,
      fat: 29
    }
  },
  {
    id: "deli-4",
    name: "Pastırma",
    category: "Şarküteri",
    image: "https://cdn.pixabay.com/photo/2016/06/30/18/50/meat-1489711_960_720.jpg",
    nutrition: {
      calories: 277,
      protein: 36,
      carbs: 0.5,
      fat: 14
    }
  },
  {
    id: "deli-5",
    name: "Jambon",
    category: "Şarküteri",
    image: "https://cdn.pixabay.com/photo/2016/06/07/17/15/ham-1442305_960_720.jpg",
    nutrition: {
      calories: 107,
      protein: 17.9,
      carbs: 1.5,
      fat: 3.5
    }
  },
  
  // YENİ KATEGORI: DİYET ÜRÜNLER
  {
    id: "diet-1",
    name: "Diyet Ekmek",
    category: "Diyet Ürün",
    image: "https://cdn.pixabay.com/photo/2020/01/10/20/56/bread-4756260_960_720.jpg",
    nutrition: {
      calories: 190,
      protein: 9,
      carbs: 35,
      fat: 2
    }
  },
  {
    id: "diet-2",
    name: "Diyet Bisküvi",
    category: "Diyet Ürün",
    image: "https://cdn.pixabay.com/photo/2021/01/06/03/35/biscuit-5893834_960_720.jpg",
    nutrition: {
      calories: 110,
      protein: 3,
      carbs: 22,
      fat: 2
    }
  },
  {
    id: "diet-3",
    name: "Protein Bar",
    category: "Diyet Ürün",
    image: "https://cdn.pixabay.com/photo/2018/11/28/13/31/protein-bar-3843253_960_720.jpg",
    nutrition: {
      calories: 180,
      protein: 20,
      carbs: 15,
      fat: 5
    }
  },
  {
    id: "diet-4",
    name: "Yulaf Ezmesi",
    category: "Diyet Ürün",
    image: "https://cdn.pixabay.com/photo/2016/11/15/17/36/porridge-1826977_960_720.jpg",
    nutrition: {
      calories: 389,
      protein: 16.9,
      carbs: 66.3,
      fat: 6.9
    }
  },
  {
    id: "diet-5",
    name: "Musli",
    category: "Diyet Ürün",
    image: "https://cdn.pixabay.com/photo/2017/05/17/17/10/granola-2321507_960_720.jpg",
    nutrition: {
      calories: 347,
      protein: 8,
      carbs: 75,
      fat: 5
    }
  }
];

// Tüm veritabanını birleştir
const extendedFoodDatabase = [...foodDatabase, ...additionalFoods];

// Kategoriye göre filtreleme fonksiyonu
export const filterByCategory = (category) => {
  if (!category) return extendedFoodDatabase;
  return extendedFoodDatabase.filter(food => food.category === category);
};

// İsim veya açıklamaya göre arama fonksiyonu
export const searchFood = (query) => {
  if (!query) return extendedFoodDatabase;
  
  const lowercaseQuery = query.toLowerCase().trim();
  
  return extendedFoodDatabase.filter(food => 
    food.name.toLowerCase().includes(lowercaseQuery) ||
    food.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Tüm kategorileri getir
export const getAllCategories = () => {
  const categories = new Set();
  
  extendedFoodDatabase.forEach(food => {
    categories.add(food.category);
  });
  
  return Array.from(categories);
};

export default extendedFoodDatabase;