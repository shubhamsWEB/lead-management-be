require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Lead = require('./src/models/leads');

// Sample data extracted from the UI mockup
const leads = [
  {
    name: 'Emma Blake',
    email: 'emma.blake@flux.com',
    company: 'Flux Technologies Ltd.',
    stage: 'I',
    engaged: false,
    lastContacted: new Date('2025-01-23')
  },
  {
    name: 'Aria Frost',
    email: 'aria.frost@prism.com',
    company: 'Prism Tech Pvt. Ltd.',
    stage: 'I',
    engaged: false,
    lastContacted: new Date('2025-01-23')
  },
  {
    name: 'Noah Chen',
    email: 'noah.chen@apex.com',
    company: 'Apex Technologies',
    stage: 'III',
    engaged: false,
    lastContacted: null
  },
  {
    name: 'Zara West',
    email: 'zara.west@cube.com',
    company: 'Cube',
    stage: 'III',
    engaged: false,
    lastContacted: null
  },
  {
    name: 'Felix Gray',
    email: 'felix.gray@nova.com',
    company: 'Nova Corporation',
    stage: 'I',
    engaged: false,
    lastContacted: new Date('2025-01-16')
  },
  {
    name: 'Milo Park',
    email: 'milo.park@echo.com',
    company: 'Echo',
    stage: 'I',
    engaged: true,
    lastContacted: new Date('2025-01-16')
  },
  {
    name: 'Ruby Shaw',
    email: 'ruby.shaw@wave.com',
    company: 'Wave Technologies',
    stage: 'III',
    engaged: false,
    lastContacted: null
  },
  {
    name: 'Leo Walsh',
    email: 'leo.walsh@peak.com',
    company: 'Peak Systems',
    stage: 'I',
    engaged: true,
    lastContacted: new Date('2025-01-04')
  },
  {
    name: 'Iris Cole',
    email: 'iris.cole@drift.com',
    company: 'Drift Analytics',
    stage: 'IIII',
    engaged: true,
    lastContacted: new Date('2025-01-04')
  },
  {
    name: 'Finn Hayes',
    email: 'finn.hayes@core.com',
    company: 'Core Innovations',
    stage: 'III',
    engaged: true,
    lastContacted: new Date('2025-01-04')
  }
];

// Additional leads to reach the 85 leads mentioned in the UI
const generateAdditionalLeads = () => {
  const companies = [
    'TechSphere', 'Innovate Inc.', 'DigitalEdge', 'FutureSoft',
    'DataFlex', 'CloudNine', 'SiliconStack', 'Quantum Labs',
    'ByteWorks', 'CodeCraft', 'MetaMatrix', 'CyberSync',
    'VirtualVista', 'NetPrime', 'LogicLabs', 'Zenith Tech'
  ];
  
  const stages = ['I', 'II', 'III', 'IIII'];
  const engagementStatus = [true, false];
  
  const additionalLeads = [];
  
  for (let i = 1; i <= 75; i++) {
    const firstName = `Lead${i}`;
    const lastName = `Contact${i}`;
    const companyName = companies[Math.floor(Math.random() * companies.length)];
    const stageIndex = Math.floor(Math.random() * stages.length);
    const engagedIndex = Math.floor(Math.random() * engagementStatus.length);
    
    // Generate simplified company domain for email
    const companyDomain = companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    
    // Generate random date in 2025
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const lastContactedDate = engagementStatus[engagedIndex] ? new Date(`2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`) : null;
    
    additionalLeads.push({
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyDomain}`,
      company: companyName,
      stage: stages[stageIndex],
      engaged: engagementStatus[engagedIndex],
      lastContacted: lastContactedDate
    });
  }
  
  return additionalLeads;
};

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    // Clear existing data
    await Lead.deleteMany({});
    console.log('Leads collection cleared');
    
    // Combine actual leads with additional generated leads
    const allLeads = [...leads, ...generateAdditionalLeads()];
    
    // Insert new data
    await Lead.insertMany(allLeads);
    console.log(`Database seeded with ${allLeads.length} leads`);
    
    // Disconnect from the database
    mongoose.disconnect();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();