const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const seedDefaultData = require('./utils/seedData');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/exams', require('./routes/exams'));
app.use('/api/timeline', require('./routes/timeline'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/study-log', require('./routes/studyLog'));
app.use('/api/mock-tests', require('./routes/mockTests'));
app.use('/api/streak', require('./routes/streak'));
app.use('/api/revision-tasks', require('./routes/revision'));
app.use('/api/notes', require('./routes/notes'));

// Base health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CFTRI & CUET Exam Prep API is running' });
});

// Serve frontend static build in production with no-cache HTML headers
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Database Connection & Memory Server Fallback
async function connectDB() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cftri_cuet_prep';
  try {
    console.log(`Connecting to MongoDB at: ${mongoURI}...`);
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ Connected to MongoDB Database');
  } catch (err) {
    console.warn('⚠️ Local MongoDB connection failed or offline. Starting MongoMemoryServer fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`✅ Connected to MongoMemoryServer at: ${memoryUri}`);
    } catch (memErr) {
      console.error('❌ Failed to launch MongoMemoryServer:', memErr.message);
    }
  }

  // Seed default data after DB is connected
  await seedDefaultData();
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 CFTRI & CUET Server running on port ${PORT}`);
  });
});
