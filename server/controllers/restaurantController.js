import mongoose from 'mongoose';
import { Restaurant } from '../models/Restaurant.js';
import { Dish } from '../models/Dish.js';

const DEFAULT_FOOD_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

// Fallback seed data in case database is unreachable
const MOCK_RESTAURANTS = [
  {
    _id: 'rest_007',
    name: 'The Green Leaf Vegan Bistro',
    cuisine: ['Vegan', 'Healthy', 'Plant-Based'],
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 310,
    avgPrepTime: '15-20 MIN',
    priceRange: '₹₹',
    isOpen: true,
    address: '108 Eco Garden, Station 1',
    bestsellerTag: '100% VEGAN'
  },
  {
    _id: 'rest_001',
    name: 'The Burger Joint',
    cuisine: ['Burgers', 'American', 'Vegan Options'],
    coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 210,
    avgPrepTime: '15-25 MIN',
    priceRange: '₹₹',
    isOpen: true,
    address: '124 Kitchen St, Terminal 4',
    bestsellerTag: 'BESTSELLER'
  },
  {
    _id: 'rest_002',
    name: "Luigi's Trattoria",
    cuisine: ['Italian', 'Pizza', 'Pasta', 'Vegan Options'],
    coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 340,
    avgPrepTime: '25-30 MIN',
    priceRange: '₹₹',
    isOpen: true,
    address: '88 Trattoria Way, Station 2',
    bestsellerTag: 'POPULAR'
  },
  {
    _id: 'rest_003',
    name: 'Neon Sushi & Ramen',
    cuisine: ['Japanese', 'Sushi', 'Ramen'],
    coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 185,
    avgPrepTime: '35-45 MIN',
    priceRange: '₹₹₹',
    isOpen: true,
    address: '12 Tokyo Boulevard',
    bestsellerTag: 'FRESH'
  },
  {
    _id: 'rest_004',
    name: 'Terminal Spice & Curry',
    cuisine: ['Indian', 'Curry', 'Biryani', 'Vegan Options'],
    coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 290,
    avgPrepTime: '20-30 MIN',
    priceRange: '₹₹',
    isOpen: true,
    address: '45 Spice Route, Concourse B',
    bestsellerTag: 'SPICY'
  },
  {
    _id: 'rest_005',
    name: 'Brutal Tacos & Cantina',
    cuisine: ['Mexican', 'Tacos', 'Burritos', 'Vegan Options'],
    coverImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 175,
    avgPrepTime: '15-20 MIN',
    priceRange: '₹₹',
    isOpen: true,
    address: '77 Heavy Metal Cantina Ave',
    bestsellerTag: 'HOT'
  },
  {
    _id: 'rest_006',
    name: 'Wok & Fire Express',
    cuisine: ['Asian', 'Noodles', 'Dim Sum', 'Vegan Options'],
    coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewsCount: 145,
    avgPrepTime: '15-25 MIN',
    priceRange: '₹₹',
    isOpen: true,
    address: '99 Wok Station, Concourse C',
    bestsellerTag: 'SIZZLING'
  }
];

const MOCK_DISHES = {
  rest_007: [
    {
      _id: 'dish_701',
      restaurantId: 'rest_007',
      name: 'Beyond Plant-Based Smashburger',
      description: '100% plant-based Beyond patty, vegan cheddar, garlic aioli, butter lettuce, brioche bun',
      price: 460,
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: true,
      spiceLevel: 1,
      addOns: [{ _id: 'v1', name: 'Extra Vegan Cheese', price: 60 }],
      isAvailable: true
    },
    {
      _id: 'dish_702',
      restaurantId: 'rest_007',
      name: 'Avocado Tartine & Microgreens',
      description: 'Smashed Hass avocado, toasted sourdough, chili flakes, pomegranate seeds, extra virgin olive oil',
      price: 320,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      category: 'STARTERS',
      isVeg: true,
      spiceLevel: 1,
      addOns: [],
      isAvailable: true
    },
    {
      _id: 'dish_703',
      restaurantId: 'rest_007',
      name: 'Rainbow Vegan Buddha Bowl',
      description: 'Quinoa, roasted chickpeas, purple cabbage, edamame, tahini lemon dressing',
      price: 390,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: true,
      spiceLevel: 0,
      addOns: [],
      isAvailable: true
    },
    {
      _id: 'dish_704',
      restaurantId: 'rest_007',
      name: 'Organic Acai Berry Power Bowl',
      description: 'Amazonian acai blend, chia seeds, sliced banana, roasted almond flakes, dark chocolate chunks',
      price: 340,
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
      category: 'DESSERTS',
      isVeg: true,
      spiceLevel: 0,
      addOns: [],
      isAvailable: true
    },
    {
      _id: 'dish_705',
      restaurantId: 'rest_007',
      name: 'Iced Oat Milk Matcha Latte',
      description: 'Ceremonial grade Uji matcha, organic oat milk, agave syrup',
      price: 240,
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
      category: 'DRINKS',
      isVeg: true,
      spiceLevel: 0,
      addOns: [],
      isAvailable: true
    }
  ],
  rest_001: [
    {
      _id: 'dish_101',
      restaurantId: 'rest_001',
      name: 'Classic Cheeseburger',
      description: 'Double smashed beef patty, aged cheddar, special house sauce, butter toasted bun',
      price: 450,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: false,
      spiceLevel: 1,
      addOns: [
        { _id: 'a1', name: 'Extra Cheddar Cheese', price: 50 },
        { _id: 'a2', name: 'Crispy Bacon Strip', price: 80 },
        { _id: 'a3', name: 'Caramelized Onions', price: 40 }
      ],
      isAvailable: true
    },
    {
      _id: 'dish_102',
      restaurantId: 'rest_001',
      name: 'Truffle Fries',
      description: 'Thick cut fries, white truffle oil, shaved parmesan, sea salt',
      price: 220,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
      category: 'STARTERS',
      isVeg: true,
      spiceLevel: 0,
      addOns: [
        { _id: 'a4', name: 'Garlic Aioli Dip', price: 30 },
        { _id: 'a5', name: 'Melted Cheese Dip', price: 60 }
      ],
      isAvailable: true
    },
    {
      _id: 'dish_103',
      restaurantId: 'rest_001',
      name: 'Spicy Fried Chicken Burger',
      description: 'Nashville style hot honey fried chicken, pickled jalapenos, spicy slaw',
      price: 480,
      image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: false,
      spiceLevel: 3,
      addOns: [{ _id: 'a6', name: 'Extra Jalapeno', price: 30 }],
      isAvailable: true
    },
    {
      _id: 'dish_104',
      restaurantId: 'rest_001',
      name: 'Salted Caramel Milkshake',
      description: 'Thick churned vanilla ice cream, sea salt caramel drizzle',
      price: 190,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
      category: 'DESSERTS',
      isVeg: true,
      spiceLevel: 0,
      addOns: [],
      isAvailable: true
    },
    {
      _id: 'dish_105',
      restaurantId: 'rest_001',
      name: 'Smoky Bacon BBQ Burger',
      description: 'Smoky maple BBQ glaze, crispy bacon, onion rings, smoked gouda',
      price: 520,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: false,
      spiceLevel: 2,
      addOns: [{ _id: 'a7', name: 'Extra BBQ Sauce', price: 20 }],
      isAvailable: true
    },
    {
      _id: 'dish_106',
      restaurantId: 'rest_001',
      name: 'Loaded Cheese Nachos',
      description: 'Tortilla chips, warm cheese sauce, pico de gallo, jalapenos, sour cream',
      price: 290,
      image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80',
      category: 'STARTERS',
      isVeg: true,
      spiceLevel: 1,
      addOns: [{ _id: 'a8', name: 'Guacamole scoop', price: 70 }],
      isAvailable: true
    }
  ],
  rest_002: [
    {
      _id: 'dish_201',
      restaurantId: 'rest_002',
      name: 'Margherita Wood-Fired Pizza',
      description: 'San Marzano tomatoes, fresh fior di latte mozzarella, basil leaves',
      price: 380,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: true,
      spiceLevel: 0,
      addOns: [{ _id: 'b1', name: 'Extra Mozzarella', price: 70 }],
      isAvailable: true
    },
    {
      _id: 'dish_202',
      restaurantId: 'rest_002',
      name: 'Tiramisu Ticket',
      description: 'Espresso soaked ladyfingers, whipped mascarpone cream, cocoa powder',
      price: 250,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
      category: 'DESSERTS',
      isVeg: true,
      spiceLevel: 0,
      addOns: [],
      isAvailable: true
    },
    {
      _id: 'dish_203',
      restaurantId: 'rest_002',
      name: 'Pepperoni Feast Pizza',
      description: 'Crispy pepperoni slices, mozzarella, chili flakes, oregano',
      price: 490,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: false,
      spiceLevel: 1,
      addOns: [{ _id: 'b2', name: 'Garlic Butter Crust Dip', price: 40 }],
      isAvailable: true
    },
    {
      _id: 'dish_204',
      restaurantId: 'rest_002',
      name: 'Truffle Mushroom Fettuccine',
      description: 'Handmade fettuccine, wild mushrooms, parmesan cream sauce',
      price: 440,
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281270?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: true,
      spiceLevel: 0,
      addOns: [],
      isAvailable: true
    },
    {
      _id: 'dish_205',
      restaurantId: 'rest_002',
      name: 'Garlic Knots with Marinara',
      description: 'Oven baked dough knots, garlic butter, fresh parsley, marinara dip',
      price: 180,
      image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
      category: 'STARTERS',
      isVeg: true,
      spiceLevel: 0,
      addOns: [],
      isAvailable: true
    }
  ],
  rest_003: [
    {
      _id: 'dish_301',
      restaurantId: 'rest_003',
      name: 'Salmon Avocado Roll',
      description: 'Fresh Norwegian salmon, creamy avocado, sushi rice, toasted sesame',
      price: 520,
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: false,
      spiceLevel: 0,
      addOns: [{ _id: 'c1', name: 'Pickled Ginger', price: 20 }],
      isAvailable: true
    },
    {
      _id: 'dish_302',
      restaurantId: 'rest_003',
      name: 'Tonkotsu Pork Ramen',
      description: 'Rich pork bone broth, tender chashu pork, soft boiled egg, nori',
      price: 580,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: false,
      spiceLevel: 2,
      addOns: [{ _id: 'c2', name: 'Extra Chashu Pork', price: 90 }],
      isAvailable: true
    },
    {
      _id: 'dish_303',
      restaurantId: 'rest_003',
      name: 'Crispy Shrimp Tempura',
      description: 'Lightly battered prawns, tentsuyu dipping sauce, grated radish',
      price: 420,
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      category: 'STARTERS',
      isVeg: false,
      spiceLevel: 0,
      addOns: [],
      isAvailable: true
    },
    {
      _id: 'dish_304',
      restaurantId: 'rest_003',
      name: 'Matcha Green Tea Ice Cream',
      description: 'Authentic Kyoto matcha ice cream, red bean paste garnish',
      price: 210,
      image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=800&q=80',
      category: 'DESSERTS',
      isVeg: true,
      spiceLevel: 0,
      addOns: [],
      isAvailable: true
    }
  ],
  rest_004: [
    {
      _id: 'dish_401',
      restaurantId: 'rest_004',
      name: 'Butter Chicken Special',
      description: 'Tender chicken tikka, rich tomato butter gravy, fenugreek leaves',
      price: 450,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: false,
      spiceLevel: 2,
      addOns: [{ _id: 'd1', name: 'Extra Butter Naan', price: 40 }],
      isAvailable: true
    },
    {
      _id: 'dish_402',
      restaurantId: 'rest_004',
      name: 'Hyderabadi Dum Biryani',
      description: 'Fragrant basmati rice, aromatic spices, saffron, mint raita',
      price: 480,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: false,
      spiceLevel: 3,
      addOns: [{ _id: 'd2', name: 'Salalan Curry Gravy', price: 50 }],
      isAvailable: true
    },
    {
      _id: 'dish_403',
      restaurantId: 'rest_004',
      name: 'Paneer Tikka Masala',
      description: 'Char-grilled cottage cheese cubes, spiced onion-tomato gravy',
      price: 410,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: true,
      spiceLevel: 2,
      addOns: [],
      isAvailable: true
    },
    {
      _id: 'dish_404',
      restaurantId: 'rest_004',
      name: 'Samosa Chat Platter',
      description: 'Crispy potato samosas topped with chickpeas, yogurt, sweet chutney',
      price: 190,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      category: 'STARTERS',
      isVeg: true,
      spiceLevel: 1,
      addOns: [],
      isAvailable: true
    },
    {
      _id: 'dish_405',
      restaurantId: 'rest_004',
      name: 'Gulab Jamun with Rabri',
      description: 'Warm milk dumplings soaked in cardamom sugar syrup, thickened milk',
      price: 160,
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
      category: 'DESSERTS',
      isVeg: true,
      spiceLevel: 0,
      addOns: [],
      isAvailable: true
    }
  ],
  rest_005: [
    {
      _id: 'dish_501',
      restaurantId: 'rest_005',
      name: 'Birria Beef Tacos',
      description: 'Slow-cooked braised beef, melted cheese, cilantro, consommé dip',
      price: 440,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: false,
      spiceLevel: 2,
      addOns: [{ _id: 'e1', name: 'Extra Consommé Dip', price: 40 }],
      isAvailable: true
    },
    {
      _id: 'dish_502',
      restaurantId: 'rest_005',
      name: 'Chipotle Chicken Burrito',
      description: 'Grilled chicken, cilantro lime rice, black beans, salsa verde',
      price: 390,
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: false,
      spiceLevel: 2,
      addOns: [],
      isAvailable: true
    },
    {
      _id: 'dish_503',
      restaurantId: 'rest_005',
      name: 'Churros with Cinnamon Sugar',
      description: 'Crispy fried dough pastry, cinnamon sugar, warm dulce de leche',
      price: 220,
      image: 'https://images.unsplash.com/photo-1624371414361-e670edf4898d?auto=format&fit=crop&w=800&q=80',
      category: 'DESSERTS',
      isVeg: true,
      spiceLevel: 0,
      addOns: [],
      isAvailable: true
    }
  ],
  rest_006: [
    {
      _id: 'dish_601',
      restaurantId: 'rest_006',
      name: 'Schezwan Chicken Hakka Noodles',
      description: 'Wok tossed noodles, tender chicken, peppers, fiery schezwan sauce',
      price: 360,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      category: 'MAINS',
      isVeg: false,
      spiceLevel: 3,
      addOns: [],
      isAvailable: true
    },
    {
      _id: 'dish_602',
      restaurantId: 'rest_006',
      name: 'Steamed Crystal Pork Dumplings',
      description: 'Handmade dim sum dumplings, seasoned minced pork, chili oil dip',
      price: 320,
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
      category: 'STARTERS',
      isVeg: false,
      spiceLevel: 1,
      addOns: [],
      isAvailable: true
    }
  ]
};

export const getRestaurants = async (req, res) => {
  try {
    const { query, cuisine, priceRange, minRating } = req.query;

    const filter = {};
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { cuisine: { $regex: query, $options: 'i' } }
      ];
    }
    if (cuisine) {
      filter.cuisine = { $in: cuisine.split(',').map((c) => new RegExp(`^${c.trim()}$`, 'i')) };
    }
    if (priceRange) filter.priceRange = priceRange;
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };

    let restaurants = [];
    if (mongoose.connection.readyState === 1) {
      try {
        restaurants = await Restaurant.find(filter).sort({ rating: -1 }).maxTimeMS(800).lean();
      } catch (e) {
        console.warn('MongoDB query timed out/failed, using fallback mock data');
      }
    }

    if (!restaurants || restaurants.length === 0) {
      // Filter mock data
      restaurants = MOCK_RESTAURANTS.filter((r) => {
        if (query && !r.name.toLowerCase().includes(query.toLowerCase()) && !r.cuisine.some(c => c.toLowerCase().includes(query.toLowerCase()))) {
          return false;
        }
        if (cuisine && !r.cuisine.some(c => c.toLowerCase().includes(cuisine.toLowerCase()) || cuisine.toLowerCase().includes(c.toLowerCase()))) {
          return false;
        }
        if (priceRange && r.priceRange !== priceRange) return false;
        if (minRating && r.rating < parseFloat(minRating)) return false;
        return true;
      });
    }

    res.json({ restaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    let restaurant = null;
    let dishes = [];

    if (mongoose.connection.readyState === 1 && !id.startsWith('rest_')) {
      try {
        restaurant = await Restaurant.findById(id).maxTimeMS(800).lean();
        if (restaurant) {
          dishes = await Dish.find({ restaurantId: id, isAvailable: true }).maxTimeMS(800).lean();
        }
      } catch (e) {
        console.warn('MongoDB query timed out/failed, checking fallback mock data');
      }
    }

    if (!restaurant) {
      restaurant = MOCK_RESTAURANTS.find((r) => r._id === id) || MOCK_RESTAURANTS[0];
      dishes = MOCK_DISHES[restaurant._id] || MOCK_DISHES['rest_001'];
    }

    // Group dishes by category
    const categoriesMap = {};
    dishes.forEach((dish) => {
      const cat = dish.category || 'MAINS';
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = [];
      }
      categoriesMap[cat].push(dish);
    });

    const categories = Object.keys(categoriesMap).map((catName) => ({
      name: catName,
      dishes: categoriesMap[catName]
    }));

    res.json({
      restaurant,
      categories,
      dishes
    });
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    res.status(500).json({ message: 'Error fetching restaurant details', error: error.message });
  }
};

export const getRestaurantMenu = async (req, res) => {
  try {
    const { id } = req.params;
    let dishes = [];

    if (mongoose.connection.readyState === 1 && !id.startsWith('rest_')) {
      try {
        dishes = await Dish.find({ restaurantId: id }).maxTimeMS(800).lean();
      } catch (e) {}
    }

    if (!dishes || dishes.length === 0) {
      dishes = MOCK_DISHES[id] || MOCK_DISHES['rest_001'];
    }

    res.json({ dishes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant menu', error: error.message });
  }
};
