// src/utils/foodDatabase.js
// Temel yiyeceklerin veritabanı (100 gram başına değerler)

const foodDatabase = [
  // MEYVELER
  {
    id: "fruit-1",
    name: "Elma",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2016/02/23/17/42/apple-1218166_960_720.png",
    nutrition: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2
    }
  },
  {
    id: "fruit-2",
    name: "Muz",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2016/09/01/08/15/bananas-1635449_960_720.jpg",
    nutrition: {
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3
    }
  },
  {
    id: "fruit-3",
    name: "Portakal",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2017/01/20/15/06/oranges-1995056_960_720.jpg",
    nutrition: {
      calories: 47,
      protein: 0.9,
      carbs: 12,
      fat: 0.1
    }
  },
  {
    id: "fruit-4",
    name: "Çilek",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2018/04/29/11/54/strawberries-3359755_960_720.jpg",
    nutrition: {
      calories: 33,
      protein: 0.7,
      carbs: 8,
      fat: 0.3
    }
  },
  {
    id: "fruit-5",
    name: "Karpuz",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2015/06/19/16/48/watermelon-815072_960_720.jpg",
    nutrition: {
      calories: 30,
      protein: 0.6,
      carbs: 8,
      fat: 0.2
    }
  },
  {
    id: "fruit-6",
    name: "Üzüm",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2016/03/05/22/09/food-1239160_960_720.jpg",
    nutrition: {
      calories: 69,
      protein: 0.7,
      carbs: 18,
      fat: 0.2
    }
  },
  {
    id: "fruit-7",
    name: "Kiraz",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2017/06/02/18/24/cherries-2367456_960_720.jpg",
    nutrition: {
      calories: 63,
      protein: 1.1,
      carbs: 16,
      fat: 0.2
    }
  },
  {
    id: "fruit-8",
    name: "Kayısı",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2018/06/28/15/53/apricots-3504098_960_720.jpg",
    nutrition: {
      calories: 48,
      protein: 1.4,
      carbs: 11,
      fat: 0.4
    }
  },
  {
    id: "fruit-9",
    name: "Şeftali",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2017/08/11/17/41/peach-2632182_960_720.jpg",
    nutrition: {
      calories: 39,
      protein: 0.9,
      carbs: 10,
      fat: 0.3
    }
  },
  {
    id: "fruit-10",
    name: "Armut",
    category: "Meyve",
    image: "https://cdn.pixabay.com/photo/2018/09/24/20/12/pears-3700200_960_720.jpg",
    nutrition: {
      calories: 57,
      protein: 0.4,
      carbs: 15,
      fat: 0.1
    }
  },
  
  // SEBZELER
  {
    id: "vegetable-1",
    name: "Domates",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2018/07/06/08/49/tomatoes-3520004_960_720.jpg",
    nutrition: {
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2
    }
  },
  {
    id: "vegetable-2",
    name: "Salatalık",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2015/07/17/13/44/cucumbers-849269_960_720.jpg",
    nutrition: {
      calories: 15,
      protein: 0.7,
      carbs: 3.6,
      fat: 0.1
    }
  },
  {
    id: "vegetable-3",
    name: "Havuç",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2016/07/11/00/18/carrots-1508847_960_720.jpg",
    nutrition: {
      calories: 41,
      protein: 0.9,
      carbs: 10,
      fat: 0.2
    }
  },
  {
    id: "vegetable-4",
    name: "Soğan",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2016/05/16/22/47/onions-1397037_960_720.jpg",
    nutrition: {
      calories: 40,
      protein: 1.1,
      carbs: 9.3,
      fat: 0.1
    }
  },
  {
    id: "vegetable-5",
    name: "Patates",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2014/08/06/20/32/potatoes-411975_960_720.jpg",
    nutrition: {
      calories: 77,
      protein: 2,
      carbs: 17,
      fat: 0.1
    }
  },
  {
    id: "vegetable-6",
    name: "Ispanak",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2016/09/10/17/47/spinach-1659690_960_720.jpg",
    nutrition: {
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4
    }
  },
  {
    id: "vegetable-7",
    name: "Biber",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2017/06/09/16/39/red-pepper-2387394_960_720.jpg",
    nutrition: {
      calories: 31,
      protein: 1,
      carbs: 6,
      fat: 0.3
    }
  },
  {
    id: "vegetable-8",
    name: "Brokoli",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/broccoli-1238250_960_720.jpg",
    nutrition: {
      calories: 34,
      protein: 2.8,
      carbs: 7,
      fat: 0.4
    }
  },
  {
    id: "vegetable-9",
    name: "Patlıcan",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2016/09/10/17/30/eggplant-1659784_960_720.jpg",
    nutrition: {
      calories: 25,
      protein: 1,
      carbs: 6,
      fat: 0.2
    }
  },
  {
    id: "vegetable-10",
    name: "Kabak",
    category: "Sebze",
    image: "https://cdn.pixabay.com/photo/2018/10/03/22/08/vegetables-3722517_960_720.jpg",
    nutrition: {
      calories: 17,
      protein: 1.2,
      carbs: 3.1,
      fat: 0.3
    }
  },
  
  // ET VE BALıK
  {
    id: "meat-1",
    name: "Dana Kıyma",
    category: "Et",
    image: "https://cdn.pixabay.com/photo/2021/01/10/04/37/meat-5904684_960_720.jpg",
    nutrition: {
      calories: 250,
      protein: 26,
      carbs: 0,
      fat: 17
    }
  },
  {
    id: "meat-2",
    name: "Tavuk Göğsü",
    category: "Et",
    image: "https://cdn.pixabay.com/photo/2016/05/10/15/28/chicken-1383277_960_720.jpg",
    nutrition: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6
    }
  },
  {
    id: "meat-3",
    name: "Tavuk But",
    category: "Et",
    image: "https://cdn.pixabay.com/photo/2015/03/26/09/39/fried-chicken-690039_960_720.jpg",
    nutrition: {
      calories: 209,
      protein: 26,
      carbs: 0,
      fat: 11
    }
  },
  {
    id: "meat-4",
    name: "Kuzu Pirzola",
    category: "Et",
    image: "https://cdn.pixabay.com/photo/2019/03/09/01/14/meat-4043625_960_720.jpg",
    nutrition: {
      calories: 294,
      protein: 25,
      carbs: 0,
      fat: 21
    }
  },
  {
    id: "meat-5",
    name: "Somon",
    category: "Balık",
    image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/salmon-1238248_960_720.jpg",
    nutrition: {
      calories: 208,
      protein: 20,
      carbs: 0,
      fat: 13
    }
  },
  {
    id: "meat-6",
    name: "Alabalık",
    category: "Balık",
    image: "https://cdn.pixabay.com/photo/2016/06/30/18/53/trout-1489741_960_720.jpg",
    nutrition: {
      calories: 141,
      protein: 20,
      carbs: 0,
      fat: 6.2
    }
  },
  {
    id: "meat-7",
    name: "Hindi Göğsü",
    category: "Et",
    image: "https://cdn.pixabay.com/photo/2017/11/03/05/07/turkey-2913957_960_720.jpg",
    nutrition: {
      calories: 135,
      protein: 30,
      carbs: 0,
      fat: 1.5
    }
  },
  
  // SÜT ÜRÜNLERİ
  {
    id: "dairy-1",
    name: "Tam Yağlı Süt",
    category: "Süt Ürünü",
    image: "https://cdn.pixabay.com/photo/2017/07/05/15/41/milk-2474993_960_720.jpg",
    nutrition: {
      calories: 61,
      protein: 3.2,
      carbs: 4.8,
      fat: 3.2
    }
  },
  {
    id: "dairy-2",
    name: "Yoğurt",
    category: "Süt Ürünü",
    image: "https://cdn.pixabay.com/photo/2015/12/09/14/10/yogurt-1084745_960_720.jpg",
    nutrition: {
      calories: 63,
      protein: 5.7,
      carbs: 7.8,
      fat: 1.2
    }
  },
  {
    id: "dairy-3",
    name: "Peynir (Beyaz)",
    category: "Süt Ürünü",
    image: "https://cdn.pixabay.com/photo/2018/10/08/09/45/cheese-3732516_960_720.jpg",
    nutrition: {
      calories: 264,
      protein: 14,
      carbs: 3.5,
      fat: 21
    }
  },
  {
    id: "dairy-4",
    name: "Kaşar Peyniri",
    category: "Süt Ürünü",
    image: "https://cdn.pixabay.com/photo/2017/01/07/20/39/cheese-1961530_960_720.jpg",
    nutrition: {
      calories: 380,
      protein: 25,
      carbs: 1.3,
      fat: 30
    }
  },
  {
    id: "dairy-5",
    name: "Tereyağı",
    category: "Süt Ürünü",
    image: "https://cdn.pixabay.com/photo/2018/04/16/11/43/butter-3325106_960_720.jpg",
    nutrition: {
      calories: 717,
      protein: 0.9,
      carbs: 0.1,
      fat: 81
    }
  },
  
  // TAHILLAR VE EKMEKLER
  {
    id: "grain-1",
    name: "Beyaz Ekmek",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2016/03/27/21/59/bread-1284438_960_720.jpg",
    nutrition: {
      calories: 265,
      protein: 9,
      carbs: 49,
      fat: 3.2
    }
  },
  {
    id: "grain-2",
    name: "Tam Buğday Ekmeği",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2015/05/04/10/22/whole-wheat-752297_960_720.jpg",
    nutrition: {
      calories: 247,
      protein: 13,
      carbs: 41,
      fat: 3.4
    }
  },
  {
    id: "grain-3",
    name: "Bulgur",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2016/02/17/19/26/bulgur-1205547_960_720.jpg",
    nutrition: {
      calories: 342,
      protein: 12.3,
      carbs: 76,
      fat: 1.3
    }
  },
  {
    id: "grain-4",
    name: "Pirinç",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2014/10/22/21/54/white-rice-499439_960_720.jpg",
    nutrition: {
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3
    }
  },
  {
    id: "grain-5",
    name: "Makarna",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg",
    nutrition: {
      calories: 158,
      protein: 5.8,
      carbs: 31,
      fat: 0.9
    }
  },
  {
    id: "grain-6",
    name: "Yulaf",
    category: "Tahıl",
    image: "https://cdn.pixabay.com/photo/2018/02/26/15/56/oatmeal-3183686_960_720.jpg",
    nutrition: {
      calories: 389,
      protein: 16.9,
      carbs: 66,
      fat: 6.9
    }
  },
  
  // KURUYEMİŞLER
  {
    id: "nut-1",
    name: "Fındık",
    category: "Kuruyemiş",
    image: "https://cdn.pixabay.com/photo/2017/07/10/04/48/hazelnuts-2489178_960_720.jpg",
    nutrition: {
      calories: 628,
      protein: 15,
      carbs: 17,
      fat: 61
    }
  },
  {
    id: "nut-2",
    name: "Ceviz",
    category: "Kuruyemiş",
    image: "https://cdn.pixabay.com/photo/2016/06/30/10/20/walnut-1488841_960_720.jpg",
    nutrition: {
      calories: 654,
      protein: 15,
      carbs: 14,
      fat: 65
    }
  },
  {
    id: "nut-3",
    name: "Badem",
    category: "Kuruyemiş",
    image: "https://cdn.pixabay.com/photo/2017/05/31/18/38/almonds-2361836_960_720.jpg",
    nutrition: {
      calories: 579,
      protein: 21,
      carbs: 22,
      fat: 49
    }
  },
  {
    id: "nut-4",
    name: "Antep Fıstığı",
    category: "Kuruyemiş",
    image: "https://cdn.pixabay.com/photo/2016/10/19/12/32/nuts-1752620_960_720.jpg",
    nutrition: {
      calories: 562,
      protein: 20,
      carbs: 28,
      fat: 45
    }
  },
  
  // BAKLAGILLER
  {
    id: "legume-1",
    name: "Mercimek",
    category: "Baklagil",
    image: "https://cdn.pixabay.com/photo/2016/08/20/03/15/lentils-1606822_960_720.jpg",
    nutrition: {
      calories: 116,
      protein: 9,
      carbs: 20,
      fat: 0.4
    }
  },
  {
    id: "legume-2",
    name: "Nohut",
    category: "Baklagil",
    image: "https://cdn.pixabay.com/photo/2010/12/01/hermans-chickpeas-563_960_720.jpg",
    nutrition: {
      calories: 364,
      protein: 19,
      carbs: 61,
      fat: 6
    }
  },
  {
    id: "legume-3",
    name: "Fasulye",
    category: "Baklagil",
    image: "https://cdn.pixabay.com/photo/2016/02/17/19/14/beans-1205337_960_720.jpg",
    nutrition: {
      calories: 337,
      protein: 21,
      carbs: 63,
      fat: 1.2
    }
  },
  
  // YAĞLAR
  {
    id: "oil-1",
    name: "Zeytinyağı",
    category: "Yağ",
    image: "https://cdn.pixabay.com/photo/2016/05/24/13/29/olive-oil-1412361_960_720.jpg",
    nutrition: {
      calories: 884,
      protein: 0,
      carbs: 0,
      fat: 100
    }
  },
  {
    id: "oil-2",
    name: "Ayçiçek Yağı",
    category: "Yağ",
    image: "https://cdn.pixabay.com/photo/2017/02/20/10/09/sunflower-oil-2082195_960_720.jpg",
    nutrition: {
      calories: 884,
      protein: 0,
      carbs: 0,
      fat: 100
    }
  },
  
  // HAZIR YEMEKLER
  {
    id: "meal-1",
    name: "Mercimek Çorbası",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2019/03/28/15/25/soup-4087022_960_720.jpg",
    nutrition: {
      calories: 140,
      protein: 8,
      carbs: 20,
      fat: 3.5
    }
  },
  {
    id: "meal-2",
    name: "Kuru Fasulye",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2021/02/08/12/40/beans-5994649_960_720.jpg",
    nutrition: {
      calories: 155,
      protein: 9,
      carbs: 27,
      fat: 1.5
    }
  },
  {
    id: "meal-3",
    name: "Tavuk Döner",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2018/08/17/10/32/doner-3612135_960_720.jpg",
    nutrition: {
      calories: 226,
      protein: 21,
      carbs: 11,
      fat: 11
    }
  },
  {
    id: "meal-4",
    name: "Et Döner",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2014/01/22/19/10/doner-250581_960_720.jpg",
    nutrition: {
      calories: 252,
      protein: 19,
      carbs: 8,
      fat: 16
    }
  },
  {
    id: "meal-5",
    name: "Lahmacun",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2020/03/08/19/07/lahmacun-4913703_960_720.jpg",
    nutrition: {
      calories: 230,
      protein: 10,
      carbs: 34,
      fat: 7
    }
  },
  {
    id: "meal-6",
    name: "Pide (Kaşarlı)",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2017/11/22/09/17/bread-2969571_960_720.jpg",
    nutrition: {
      calories: 292,
      protein: 12,
      carbs: 43,
      fat: 10
    }
  },
  {
    id: "meal-7",
    name: "Kebap",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2016/07/31/17/51/chicken-1559548_960_720.jpg",
    nutrition: {
      calories: 215,
      protein: 26,
      carbs: 1,
      fat: 12
    }
  },
  {
    id: "meal-8",
    name: "İmam Bayıldı",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2019/09/16/14/25/food-4481344_960_720.jpg",
    nutrition: {
      calories: 152,
      protein: 2.5,
      carbs: 14,
      fat: 10
    }
  },
  {
    id: "meal-9",
    name: "Mantı",
    category: "Hazır Yemek",
    image: "https://cdn.pixabay.com/photo/2020/11/08/01/28/manti-5722996_960_720.jpg",
    nutrition: {
      calories: 215,
      protein: 10,
      carbs: 32,
      fat: 5
    }
  },
  
  // TATLILAR
  {
    id: "sweet-1",
    name: "Baklava",
    category: "Tatlı",
    image: "https://cdn.pixabay.com/photo/2014/07/08/12/15/baklava-386521_960_720.jpg",
    nutrition: {
      calories: 368,
      protein: 6,
      carbs: 44,
      fat: 20
    }
  },
  {
    id: "sweet-2",
    name: "Sütlaç",
    category: "Tatlı",
    image: "https://cdn.pixabay.com/photo/2020/07/02/14/59/rice-pudding-5363812_960_720.jpg",
    nutrition: {
      calories: 143,
      protein: 3.4,
      carbs: 27,
      fat: 2.5
    }
  },
  {
    id: "sweet-3",
    name: "Künefe",
    category: "Tatlı",
    image: "https://cdn.pixabay.com/photo/2017/02/02/10/11/kunafa-2032925_960_720.jpg",
    nutrition: {
      calories: 410,
      protein: 7,
      carbs: 48,
      fat: 22
    }
  },
  {
    id: "sweet-4",
    name: "Lokum",
    category: "Tatlı",
    image: "https://cdn.pixabay.com/photo/2017/05/15/05/53/turkish-delight-2313904_960_720.jpg",
    nutrition: {
      calories: 329,
      protein: 0,
      carbs: 82,
      fat: 0.2
    }
  },
  
  // İÇECEKLER
  {
    id: "drink-1",
    name: "Çay",
    category: "İçecek",
    image: "https://cdn.pixabay.com/photo/2016/01/19/17/53/tea-1149894_960_720.jpg",
    nutrition: {
      calories: 1,
      protein: 0,
      carbs: 0.2,
      fat: 0
    }
  },
  {
    id: "drink-2",
    name: "Türk Kahvesi",
    category: "İçecek",
    image: "https://cdn.pixabay.com/photo/2017/08/27/17/12/turkish-coffee-2686849_960_720.jpg",
    nutrition: {
      calories: 2,
      protein: 0.1,
      carbs: 0.4,
      fat: 0
    }
  },
  {
    id: "drink-3",
    name: "Ayran",
    category: "İçecek",
    image: "https://cdn.pixabay.com/photo/2020/06/03/18/56/ayran-5256837_960_720.jpg",
    nutrition: {
      calories: 37,
      protein: 1.7,
      carbs: 2.9,
      fat: 1.5
    }
  },
  {
    id: "drink-4",
    name: "Limonata",
    category: "İçecek",
    image: "https://cdn.pixabay.com/photo/2016/07/21/11/17/drink-1532300_960_720.jpg",
    nutrition: {
      calories: 40,
      protein: 0.2,
      carbs: 10.6,
      fat: 0.1
    }
  },
  {
    id: "drink-5",
    name: "Kola",
    category: "İçecek",
    image: "https://cdn.pixabay.com/photo/2019/11/25/09/10/coca-cola-4651331_960_720.jpg",
    nutrition: {
      calories: 42,
      protein: 0,
      carbs: 10.6,
      fat: 0
    }
  },
  
  // FAST FOOD
  {
    id: "fastfood-1",
    name: "Hamburger",
    category: "Fast Food",
    image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_960_720.jpg",
    nutrition: {
      calories: 295,
      protein: 15,
      carbs: 30,
      fat: 14
    }
  },
  {
    id: "fastfood-2",
    name: "Pizza",
    category: "Fast Food",
    image: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg",
    nutrition: {
      calories: 285,
      protein: 12,
      carbs: 36,
      fat: 10
    }
  },
  {
    id: "fastfood-3",
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
    id: "fastfood-4",
    name: "Tavuk Nugget",
    category: "Fast Food",
    image: "https://cdn.pixabay.com/photo/2016/10/28/12/37/chicken-nuggets-1777610_960_720.jpg",
    nutrition: {
      calories: 297,
      protein: 17,
      carbs: 17,
      fat: 18
    }
  },
  
  // DİĞER GIDALAR
  {
    id: "other-1",
    name: "Bal",
    category: "Diğer",
    image: "https://cdn.pixabay.com/photo/2015/11/07/11/16/golden-syrup-1031013_960_720.jpg",
    nutrition: {
      calories: 304,
      protein: 0.3,
      carbs: 82,
      fat: 0
    }
  },
  {
    id: "other-2",
    name: "Reçel",
    category: "Diğer",
    image: "https://cdn.pixabay.com/photo/2016/01/11/06/58/jam-1133100_960_720.jpg",
    nutrition: {
      calories: 250,
      protein: 0.5,
      carbs: 65,
      fat: 0.1
    }
  },
  {
    id: "other-3",
    name: "Zeytin",
    category: "Diğer",
    image: "https://cdn.pixabay.com/photo/2014/06/16/13/10/black-olives-369858_960_720.jpg",
    nutrition: {
      calories: 115,
      protein: 0.8,
      carbs: 6,
      fat: 11
    }
  },
  {
    id: "other-4",
    name: "Yumurta",
    category: "Diğer",
    image: "https://cdn.pixabay.com/photo/2015/09/17/17/19/eggs-944495_960_720.jpg",
    nutrition: {
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11
    }
  }
];

// Kategoriye göre filtreleme fonksiyonu
export const filterByCategory = (category) => {
  if (!category) return foodDatabase;
  return foodDatabase.filter(food => food.category === category);
};

// İsim veya açıklamaya göre arama fonksiyonu
export const searchFood = (query) => {
  if (!query) return foodDatabase;
  
  const lowercaseQuery = query.toLowerCase().trim();
  
  return foodDatabase.filter(food => 
    food.name.toLowerCase().includes(lowercaseQuery) ||
    food.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Tüm kategorileri getir
export const getAllCategories = () => {
  const categories = new Set();
  
  foodDatabase.forEach(food => {
    categories.add(food.category);
  });
  
  return Array.from(categories);
};

export default foodDatabase;