const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const PG = require('../models/PG');

const sampleUsers = [
  {
    name: "John Owner",
    email: "owner1@example.com",
    password: "password123",
    role: "owner",
    phone: "9876543210"
  },
  {
    name: "Jane Owner",
    email: "owner2@example.com",
    password: "password123",
    role: "owner",
    phone: "9876543211"
  }
];

const samplePGs = [
  {
    name: "Sunshine PG",
    description: "A comfortable and well-maintained PG with all modern amenities. Located in a safe neighborhood with easy access to public transport.",
    location: {
      address: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    },
    price: 12000,
    gender: "boys",
    amenities: ["wifi", "ac", "meals", "security", "parking"],
    contact: {
      phone: "9876543210",
      email: "owner1@example.com"
    },
    totalRooms: 10,
    availableRooms: 3,
    rules: [
      "No smoking inside the premises",
      "Guests allowed only till 10 PM",
      "Keep common areas clean"
    ]
  },
  {
    name: "Green Valley PG",
    description: "Spacious rooms with attached bathrooms in a peaceful environment. Perfect for working professionals and students.",
    location: {
      address: "456 Park Avenue",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001"
    },
    price: 10000,
    gender: "girls",
    amenities: ["wifi", "tv", "fridge", "washing_machine", "cleaning"],
    contact: {
      phone: "9876543211",
      email: "owner2@example.com"
    },
    totalRooms: 8,
    availableRooms: 2,
    rules: [
      "No loud music after 10 PM",
      "Monthly maintenance is mandatory",
      "Prior notice required for guests"
    ]
  },
  {
    name: "City Center PG",
    description: "Conveniently located PG in the heart of the city with excellent connectivity to IT parks and colleges.",
    location: {
      address: "789 Business District",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001"
    },
    price: 15000,
    gender: "both",
    amenities: ["wifi", "ac", "gym", "meals", "security", "parking"],
    contact: {
      phone: "9876543210",
      email: "owner1@example.com"
    },
    totalRooms: 15,
    availableRooms: 5,
    rules: [
      "ID proof mandatory for visitors",
      "Advance rent payment required",
      "No pets allowed"
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pg-search');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await PG.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
    }
    console.log('Created sample users');

    // Create PGs
    for (let i = 0; i < samplePGs.length; i++) {
      const pgData = {
        ...samplePGs[i],
        owner: createdUsers[i % createdUsers.length]._id,
        images: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540518614846-7eded47c0419?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      };
      
      const pg = new PG(pgData);
      await pg.save();
    }
    console.log('Created sample PGs');

    console.log('Database seeded successfully!');
    console.log('Sample login credentials:');
    console.log('Email: owner1@example.com, Password: password123 (Owner)');
    console.log('Email: owner2@example.com, Password: password123 (Owner)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();