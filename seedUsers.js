require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const User = require('./src/models/user');
const bcrypt = require('bcryptjs');

// Sample user data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    // Clear existing users
    await User.deleteMany({});
    console.log('Users collection cleared');
    
    // Hash passwords and create users
    const hashedUsers = [];
    
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      hashedUsers.push({
        ...user,
        password: hashedPassword
      });
    }
    
    // Insert users
    await User.insertMany(hashedUsers);
    console.log(`Database seeded with ${users.length} users`);
    
    // Disconnect from the database
    mongoose.disconnect();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding users: ${error.message}`);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();