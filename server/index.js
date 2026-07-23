const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.json({ status: 'ok', message: 'CFTRI & CUET Exam Prep API is running (Supabase)' });
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
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Seed default data then start server
const seedDefaultData = require('./utils/seedData');

seedDefaultData().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 CFTRI & CUET Server running on port ${PORT} (Supabase backend)`);
  });
}).catch(err => {
  console.error('❌ Failed during seed/startup:', err.message);
  // Start anyway even if seed fails
  app.listen(PORT, () => {
    console.log(`🚀 CFTRI & CUET Server running on port ${PORT} (Supabase backend)`);
  });
});
