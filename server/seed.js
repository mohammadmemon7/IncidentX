const dotenv = require('dotenv');
dotenv.config();

const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Incident = require('./src/models/Incident');
const Monitor = require('./src/models/Monitor');
const connectToDb = require('./src/config/database');

const seedData = async () => {
  try {
    await connectToDb();
    console.log('Connected to DB. Starting seed...');

    // --- Upsert Users (preserves _id so JWT tokens stay valid across re-seeds) ---
    const adminPassword = await bcrypt.hash('admin123', 10);
    const responderPassword = await bcrypt.hash('responder123', 10);
    const viewerPassword = await bcrypt.hash('viewer123', 10);

    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@demo.com' },
      { name: 'Admin User', email: 'admin@demo.com', password: adminPassword, role: 'admin' },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    const responderUser = await User.findOneAndUpdate(
      { email: 'responder@demo.com' },
      { name: 'John Responder', email: 'responder@demo.com', password: responderPassword, role: 'responder' },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    const viewerUser = await User.findOneAndUpdate(
      { email: 'viewer@demo.com' },
      { name: 'Alice Viewer', email: 'viewer@demo.com', password: viewerPassword, role: 'viewer' },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    const users = [adminUser, responderUser, viewerUser];
    console.log('Users upserted (IDs preserved)');
    users.forEach(u => console.log(`  ${u.email} -> ${u._id} [${u.role}]`));

    // --- Only seed incidents if collection is empty ---
    const incidentCount = await Incident.countDocuments();
    if (incidentCount === 0) {
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
          resolvedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 - 3600000)
        },
        {
          title: 'DB Connection Pool Exhausted',
          service: 'payment-gateway',
          severity: 'high',
          status: 'resolved',
          createdBy: users[0]._id,
          responders: [{ user: users[1]._id }],
          updates: [
            { message: 'Database connections reaching max limit.', status: 'investigating', createdBy: users[0]._id },
            { message: 'Increased MAX_POOL_SIZE in db config.', status: 'resolved', createdBy: users[1]._id }
          ],
          resolvedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000 - 1800000)
        },
        {
          title: 'API Gateway High Latency',
          service: 'api-gateway',
          severity: 'medium',
          status: 'investigating',
          createdBy: users[0]._id,
          updates: [
            { message: 'Latency spike detected in US-EAST region.', status: 'investigating', createdBy: users[0]._id }
          ],
          createdAt: new Date()
        }
      ];
      await Incident.insertMany(pastIncidents);
      console.log(`Incidents seeded: ${pastIncidents.length} records`);
    } else {
      console.log(`Skipping incidents — ${incidentCount} already exist.`);
    }

    // --- Only seed monitors if collection is empty ---
    const monitorCount = await Monitor.countDocuments();
    if (monitorCount === 0) {
      await Monitor.create({
        name: 'Google Main',
        url: 'https://www.google.com',
        interval: 60,
        createdBy: users[0]._id
      });
      console.log('Sample monitor seeded');
    } else {
      console.log(`Skipping monitors — ${monitorCount} already exist.`);
    }

    console.log('\n✅ Seeding completed successfully!');
    console.log('  Credentials:');
    console.log('    admin@demo.com    / admin123');
    console.log('    responder@demo.com / responder123');
    console.log('    viewer@demo.com   / viewer123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
