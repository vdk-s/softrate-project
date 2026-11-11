const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

let mongod = null;

const connectDB = async () => {
  // If MONGO_URI is explicitly provided in env, connect to it
  if (process.env.MONGO_URI && process.env.MONGO_URI !== 'mongodb://127.0.0.1:27017/softrate') {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(`[MongoDB] Connected to external MongoDB at ${process.env.MONGO_URI}`);
      return;
    } catch (err) {
      console.log('[MongoDB] External URI failed, falling back to embedded database...');
    }
  }

  // Fast embedded MongoDB engine with local persistence
  try {
    const dataDir = path.join(__dirname, '../.data/mongodb');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'softrate',
        dbPath: dataDir,
        storageEngine: 'wiredTiger',
        launchTimeout: 30000,
      },
    });

    const memoryUri = mongod.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[MongoDB] Connected to embedded persistent MongoDB at ${memoryUri}`);

    // Auto-seed if empty
    const Post = require('../models/Post');
    const count = await Post.countDocuments();
    if (count === 0) {
      console.log('[MongoDB] Empty database detected. Auto-seeding initial data...');
      const { seedData } = require('../seed');
      await seedData();
    } else {
      console.log(`[MongoDB] Initialized with ${count} existing publications.`);
    }
  } catch (fallbackErr) {
    // Fallback to pure in-memory if directory lock occurs
    try {
      mongod = await MongoMemoryServer.create({
        instance: { dbName: 'softrate' },
      });
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Connected to in-memory fallback at ${memoryUri}`);
      const Post = require('../models/Post');
      const count = await Post.countDocuments();
      if (count === 0) {
        const { seedData } = require('../seed');
        await seedData();
      }
    } catch (innerErr) {
      console.error('[MongoDB] Fatal MongoDB initialization error:', innerErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
