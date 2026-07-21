const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Note = require('../models/Note');

// Configure disk storage for Multer
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// GET /api/notes
router.get('/', async (req, res) => {
  try {
    const { subjectTag, search } = req.query;
    let query = {};
    if (subjectTag && subjectTag !== 'All') {
      query.subjectTag = subjectTag;
    }
    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }
    const notes = await Note.find(query).sort({ uploadDate: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notes/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { subjectTag } = req.body;
    const note = await Note.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      subjectTag: subjectTag || 'General',
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      filePath: req.file.path
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/notes/:id/download
router.get('/:id/download', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'File metadata not found' });
    if (!fs.existsSync(note.filePath)) {
      return res.status(404).json({ error: 'File not found on server disk' });
    }
    res.download(note.filePath, note.originalName);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    // Delete file from disk if exists
    if (fs.existsSync(note.filePath)) {
      fs.unlinkSync(note.filePath);
    }
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
