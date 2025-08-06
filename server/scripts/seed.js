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
    name: "Sunshine Residency",
    description: "A comfortable and well-maintained PG with all modern amenities. Located in a safe neighborhood with easy access to public transport.",
    location: {
      address: "123 Main Street, Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    },
    price: 15000,
    gender: "both",
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
      address: "456 Park Avenue, Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001"
    },
    price: 12000,
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
    name: "Royal Comfort PG",
    description: "Premium PG accommodation with luxurious amenities and excellent service standards.",
    location: {
      address: "789 Business District, Kothrud",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001"
    },
    price: 18000,
    gender: "boys",
    amenities: ["wifi", "ac", "gym", "security", "parking", "meals"],
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
  },
  {
    name: "Elite Hostel",
    description: "Modern hostel with spacious triple sharing rooms and premium facilities for students and professionals.",
    location: {
      address: "101 University Road, Lajpat Nagar",
      city: "Delhi",
      state: "Delhi",
      pincode: "110024"
    },
    price: 22000,
    gender: "both",
    amenities: ["wifi", "ac", "tv", "fridge", "security", "cleaning"],
    contact: {
      phone: "9876543212",
      email: "owner1@example.com"
    },
    totalRooms: 20,
    availableRooms: 8,
    rules: [
      "No smoking in rooms",
      "Quiet hours after 11 PM",
      "Common kitchen available"
    ]
  },
  {
    name: "Metro Stay PG",
    description: "Convenient PG near metro station with all essential amenities and good connectivity to tech hubs.",
    location: {
      address: "202 Tech Park Road, Gachibowli", 
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500032"
    },
    price: 14000,
    gender: "girls",
    amenities: ["wifi", "tv", "washing_machine", "security", "parking"],
    contact: {
      phone: "9876543213",
      email: "owner2@example.com"
    },
    totalRooms: 12,
    availableRooms: 4,
    rules: [
      "No male visitors after 8 PM",
      "Weekly room cleaning mandatory",
      "Common room available"
    ]
  },
  {
    name: "Ocean View Residency", 
    description: "Beautiful PG with sea view and premium amenities. Perfect for professionals working in nearby IT companies.",
    location: {
      address: "303 Beach Road, Adyar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600020"
    },
    price: 16000,
    gender: "both",
    amenities: ["wifi", "ac", "meals", "gym", "security"],
    contact: {
      phone: "9876543214",
      email: "owner1@example.com"
    },
    totalRooms: 14,
    availableRooms: 6,
    rules: [
      "No loud music after 10 PM",
      "Gym timings: 6 AM - 11 PM",
      "Advance notice for guests"
    ]
  },
  {
    name: "Smart Living PG",
    description: "Tech-enabled PG with smart facilities and premium single rooms. Perfect for working professionals.",
    location: {
      address: "404 Hill Road, Bandra",
      city: "Mumbai", 
      state: "Maharashtra",
      pincode: "400050"
    },
    price: 20000,
    gender: "boys",
    amenities: ["wifi", "ac", "tv", "fridge", "gym", "parking"],
    contact: {
      phone: "9876543215",
      email: "owner2@example.com"
    },
    totalRooms: 18,
    availableRooms: 7,
    rules: [
      "Digital access cards required",
      "No smoking anywhere",
      "24/7 gym access"
    ]
  },
  {
    name: "Budget Friendly PG",
    description: "Affordable accommodation with basic amenities in a safe and clean environment.",
    location: {
      address: "505 Main Road, BTM Layout",
      city: "Bangalore",
      state: "Karnataka", 
      pincode: "560029"
    },
    price: 9000,
    gender: "both",
    amenities: ["wifi", "tv", "fridge", "security"],
    contact: {
      phone: "9876543216",
      email: "owner1@example.com"
    },
    totalRooms: 10,
    availableRooms: 1,
    rules: [
      "Rent payment by 5th of every month",
      "Visitors allowed till 9 PM",
      "Keep common areas clean"
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

    // Create PGs with varied images
    const imageVariations = [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded47c0419?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ];

    for (let i = 0; i < samplePGs.length; i++) {
      const pgData = {
        ...samplePGs[i],
        owner: createdUsers[i % createdUsers.length]._id,
        images: [
          imageVariations[i % imageVariations.length],
          imageVariations[(i + 1) % imageVariations.length]
        ]
      };
      
      const pg = new PG(pgData);
      await pg.save();
    }
    console.log(`Created ${samplePGs.length} sample PGs`);

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