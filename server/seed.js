const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Incident = require('./models/Incident');
const connectToDb = require('./src/config/database');
connectToDb();

dotenv.config();

const seedData = async () => {
  try {
    await connectToDb();

    // Clear existing data
    await User.deleteMany();
    await Incident.deleteMany();

    // Create users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const responderPassword = await bcrypt.hash('responder123', 10);
    const viewerPassword = await bcrypt.hash('viewer123', 10);

    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@demo.com',
        password: adminPassword,
        role: 'admin'
      },
      {
        name: 'John Responder',
        email: 'responder@demo.com',
        password: responderPassword,
        role: 'responder'
      },
      {
        name: 'Alice Viewer',
        email: 'viewer@demo.com',
        password: viewerPassword,
        role: 'viewer'
      }
    ]);

    console.log('Users seeded');

    // Create some past incidents for institutional memory demo
    const pastIncidents = [
      {
        title: 'Payment Gateway Timeout',
        service: 'payment-gateway',
        severity: 'critical',
        status: 'resolved',
        createdBy: users[0]._id,
        responders: [{ user: users[1]._id }],
        updates: [
          { message: 'Detected high latency in payment processing.', status: 'investigating', createdBy: users[0]._id },
          { message: 'Restarted payment-service pod, flush Redis cache.', status: 'resolved', createdBy: users[1]._id }
        ],
        resolvedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 - 3600000) // 1 hour duration
      },
      {
        title: 'DB Connection Pool Exhausted',
        service: 'payment-gateway',
        severity: 'major',
        status: 'resolved',
        createdBy: users[0]._id,
        responders: [{ user: users[1]._id }],
        updates: [
          { message: 'Database connections reaching max limit.', status: 'investigating', createdBy: users[0]._id },
          { message: 'Increased MAX_POOL_SIZE in db config.', status: 'resolved', createdBy: users[1]._id }
        ],
        resolvedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000 - 1800000) // 30 min duration
      }
    ];

    await Incident.insertMany(pastIncidents);
    console.log('Past incidents seeded');

    console.log('Seeding completed successfully');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
