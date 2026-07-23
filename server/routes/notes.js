const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../lib/supabase');

// Map snake_case → camelCase + _id alias for frontend compatibility
const normalizeNote = (row) => {
  if (!row) return null;
  return {
    ...row,
    _id: row.id,
    originalName: row.original_name,
    subjectTag: row.subject_tag,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    storagePath: row.storage_path,
    publicUrl: row.public_url,
    uploadDate: row.upload_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};
const normalizeAll = (rows) => (rows || []).map(normalizeNote);

// Use memory storage — files go to Supabase Storage, not local disk
const upload = multer({ storage: multer.memoryStorage() });

const STORAGE_BUCKET = 'exam-notes';

// GET /api/notes
router.get('/', async (req, res) => {
  try {
    const { subjectTag, search } = req.query;
    let query = supabase
      .from('notes')
      .select('*')
      .order('upload_date', { ascending: false });

    if (subjectTag && subjectTag !== 'All') {
      query = query.eq('subject_tag', subjectTag);
    }
    if (search) {
      query = query.ilike('original_name', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(normalizeAll(data));
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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = req.file.originalname.split('.').pop();
    const storagePath = `${uniqueSuffix}.${ext}`;

    // Upload file buffer to Supabase Storage
    const { error: uploadErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadErr) throw uploadErr;

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = urlData?.publicUrl || '';

    // Store metadata in notes table
    const { data, error } = await supabase
      .from('notes')
      .insert({
        filename: storagePath,
        original_name: req.file.originalname,
        subject_tag: subjectTag || 'General',
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        storage_path: storagePath,
        public_url: publicUrl,
        upload_date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(normalizeNote(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/notes/:id/download — redirect to Supabase storage public URL
router.get('/:id/download', async (req, res) => {
  try {
    const { data: note, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !note) return res.status(404).json({ error: 'File metadata not found' });

    // Create a signed URL (valid for 60 seconds) for secure download
    const { data: signedData, error: signErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(note.storage_path, 60);

    if (signErr) throw signErr;

    // Redirect client to the signed download URL
    res.redirect(signedData.signedUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    const { data: note, error: fetchErr } = await supabase
      .from('notes')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchErr || !note) return res.status(404).json({ error: 'Note not found' });

    // Delete from Supabase Storage
    const { error: storageErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([note.storage_path]);

    if (storageErr) {
      console.warn('Warning: Could not delete file from storage:', storageErr.message);
    }

    // Delete metadata from DB
    const { error } = await supabase.from('notes').delete().eq('id', req.params.id);
    if (error) throw error;

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
