import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Restaurant } from '../models/Restaurant.js';
import { Dish } from '../models/Dish.js';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();
dotenv.config({ path: './server/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pshreyambbk_db_user:QrUNQ0LW9tuVFsE7@cluster0.jjzssos.mongodb.net/?appName=Cluster0';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Restaurant.deleteMany({});
    await Dish.deleteMany({});

    // Seed Restaurant Owner user if not exists
    let owner = await User.findOne({ email: 'partner@burgerjoint.com' });
    if (!owner) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash('partner123', salt);
      owner = new User({
        name: 'Burger Joint Partner',
        email: 'partner@burgerjoint.com',
        passwordHash,
        phone: '555-0199',
        role: 'restaurant'
      });
      await owner.save();
    }

    // Seed Restaurants
    const restaurantsData = [
      {
        name: 'The Burger Joint',
        cuisine: ['Burgers', 'American'],
        coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewsCount: 210,
        avgPrepTime: '15-25 MIN',
        priceRange: '₹₹',
        isOpen: true,
        address: '124 Kitchen St, Terminal 4',
        bestsellerTag: 'BESTSELLER',
        ownerId: owner._id
      },
      {
        name: "Luigi's Trattoria",
        cuisine: ['Italian', 'Pizza', 'Pasta'],
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
        name: 'Neon Sushi',
        cuisine: ['Japanese', 'Sushi'],
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
        name: 'Terminal Spice',
        cuisine: ['Indian', 'Curry'],
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
        name: 'Brutal Burgers',
        cuisine: ['American', 'Burgers'],
        coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        reviewsCount: 120,
        avgPrepTime: '15-20 MIN',
        priceRange: '₹',
        isOpen: true,
        address: '77 Heavy Metal Ave',
        bestsellerTag: 'HEAVY'
      }
    ];

    const insertedRestaurants = await Restaurant.insertMany(restaurantsData);
    console.log(`Inserted ${insertedRestaurants.length} restaurants.`);

    // Assign restaurantId to owner
    const burgerJoint = insertedRestaurants[0];
    owner.restaurantId = burgerJoint._id;
    await owner.save();

    // Seed Dishes for The Burger Joint
    const burgerJointDishes = [
      {
        restaurantId: burgerJoint._id,
        name: 'Classic Cheeseburger',
        description: 'Double smashed beef patty, aged cheddar, special house sauce, butter toasted bun',
        price: 450,
        category: 'MAINS',
        isVeg: false,
        spiceLevel: 2,
        addOns: [
          { name: 'Extra Cheddar Cheese', price: 50 },
          { name: 'Crispy Bacon Strip', price: 80 },
          { name: 'Caramelized Onions', price: 40 }
        ],
        isAvailable: true
      },
      {
        restaurantId: burgerJoint._id,
        name: 'Truffle Fries',
        description: 'Thick cut fries, white truffle oil, shaved parmesan, sea salt',
        price: 220,
        category: 'STARTERS',
        isVeg: true,
        spiceLevel: 0,
        addOns: [
          { name: 'Garlic Aioli Dip', price: 30 },
          { name: 'Melted Cheese Dip', price: 60 }
        ],
        isAvailable: true
      },
      {
        restaurantId: burgerJoint._id,
        name: 'Spicy Fried Chicken Burger',
        description: 'Nashville style hot honey fried chicken, pickled jalapenos, spicy slaw',
        price: 480,
        category: 'MAINS',
        isVeg: false,
        spiceLevel: 3,
        addOns: [
          { name: 'Extra Jalapeno', price: 30 },
          { name: 'Ranch Dip', price: 40 }
        ],
        isAvailable: true
      },
      {
        restaurantId: burgerJoint._id,
        name: 'Smash Avocado Veggie Burger',
        description: 'House bean patty, smashed avocado, vine tomato, smoked mayo',
        price: 410,
        category: 'MAINS',
        isVeg: true,
        spiceLevel: 0,
        addOns: [
          { name: 'Vegan Cheese', price: 60 }
        ],
        isAvailable: true
      },
      {
        restaurantId: burgerJoint._id,
        name: 'Salted Caramel Milkshake',
        description: 'Thick churned vanilla ice cream, sea salt caramel drizzle',
        price: 190,
        category: 'DRINKS',
        isVeg: true,
        spiceLevel: 0,
        addOns: [],
        isAvailable: true
      }
    ];

    // Seed Dishes for Luigi's Trattoria
    const luigi = insertedRestaurants[1];
    const luigiDishes = [
      {
        restaurantId: luigi._id,
        name: 'Margherita Wood-Fired Pizza',
        description: 'San Marzano tomatoes, fresh fior di latte mozzarella, basil leaves, extra virgin olive oil',
        price: 380,
        category: 'MAINS',
        isVeg: true,
        spiceLevel: 0,
        addOns: [
          { name: 'Extra Mozzarella', price: 70 },
          { name: 'Burrata Top', price: 120 }
        ],
        isAvailable: true
      },
      {
        restaurantId: luigi._id,
        name: 'Pepperoni Feast Pizza',
        description: 'Spicy artisan pepperoni, chili flakes, tomato sauce, mozzarella',
        price: 490,
        category: 'MAINS',
        isVeg: false,
        spiceLevel: 1,
        addOns: [
          { name: 'Honey Drizzle', price: 40 }
        ],
        isAvailable: true
      },
      {
        restaurantId: luigi._id,
        name: 'Tiramisu Ticket',
        description: 'Classic espresso soaked ladyfingers, whipped mascarpone cream, cocoa powder',
        price: 250,
        category: 'DESSERTS',
        isVeg: true,
        spiceLevel: 0,
        addOns: [],
        isAvailable: true
      }
    ];

    // Seed Dishes for Terminal Spice
    const spice = insertedRestaurants[3];
    const spiceDishes = [
      {
        restaurantId: spice._id,
        name: 'Butter Chicken Special',
        description: 'Tender tandoori chicken cooked in rich tomato cashew gravy with butter cream',
        price: 460,
        category: 'MAINS',
        isVeg: false,
        spiceLevel: 1,
        addOns: [
          { name: 'Extra Gravy', price: 80 }
        ],
        isAvailable: true
      },
      {
        restaurantId: spice._id,
        name: 'Paneer Tikka Masala',
        description: 'Chargrilled cottage cheese cubes in spicy onion tomato gravy',
        price: 390,
        category: 'MAINS',
        isVeg: true,
        spiceLevel: 2,
        addOns: [],
        isAvailable: true
      }
    ];

    const allDishes = [...burgerJointDishes, ...luigiDishes, ...spiceDishes];
    const insertedDishes = await Dish.insertMany(allDishes);
    console.log(`Inserted ${insertedDishes.length} dishes.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
