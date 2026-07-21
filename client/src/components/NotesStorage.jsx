import React, { useState } from 'react';
import { FileText, UploadCloud, Download, Trash2, Tag, Search, File, Image as ImageIcon, Sparkles, Eye, X, ExternalLink } from 'lucide-react';

export default function NotesStorage({ notes = [], subjects = [], onUploadNote, onDeleteNote }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [subjectTag, setSubjectTag] = useState('General');
  const [isUploading, setIsUploading] = useState(false);
  const [filterTag, setFilterTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewNote, setPreviewNote] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('subjectTag', subjectTag);

    await onUploadNote(formData);
    setSelectedFile(null);
    setIsUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredNotes = notes.filter((n) => {
    const matchesTag = filterTag === 'All' || n.subjectTag === filterTag;
    const matchesSearch = n.originalName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const isImageFile = (note) => {
    return note?.mimeType?.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(note?.filename || '');
  };

  const isPdfFile = (note) => {
    return note?.mimeType?.includes('pdf') || /\.pdf$/i.test(note?.filename || '');
  };

  return (
    <div className="dashboard-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-pink-50 font-outfit flex items-center gap-2">
            <FileText className="w-4 h-4 text-pink-500" />
            Exam Notes & File Vault ✨
          </h3>
          <p className="text-xs text-slate-500 dark:text-pink-300/70">
            Upload, store, organize, and view PDFs, lecture notes, and formula sheets
          </p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <form onSubmit={handleUploadSubmit} className="space-y-3">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-pink-200 dark:border-pink-900/60 hover:border-pink-500 dark:hover:border-pink-500 rounded-3xl p-6 text-center bg-pink-50/40 dark:bg-plum-900/30 transition-all cursor-pointer"
        >
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
          />
          <label htmlFor="fileInput" className="cursor-pointer block space-y-2">
            <UploadCloud className="w-9 h-9 mx-auto text-pink-500 animate-bounce" />
            <p className="text-sm font-semibold text-slate-700 dark:text-pink-100">
              {selectedFile ? (
                <span className="font-bold text-pink-600 dark:text-pink-300">{selectedFile.name}</span>
              ) : (
                'Drag & drop exam notes here, or click to browse files 🌸'
              )}
            </p>
            <p className="text-xs text-pink-400 dark:text-pink-300/60">
              Supports PDF, DOCX, Images (PNG, JPG), TXT
            </p>
          </label>
        </div>

        {selectedFile && (
          <div className="flex items-center gap-3 bg-pink-50 dark:bg-plum-900 p-3 rounded-2xl">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-pink-600 dark:text-pink-300 mb-1">Tag with Subject:</label>
              <select
                value={subjectTag}
                onChange={(e) => setSubjectTag(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-plum-800 text-xs font-medium"
              >
                <option value="General">General</option>
                {subjects.map(s => (
                  <option key={s._id} value={s.name}>{s.name} ({s.category})</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 mt-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold hover:from-pink-600 hover:to-rose-600 transition-colors shadow-sm disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Save File ✨'}
            </button>
          </div>
        )}
      </form>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-pink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-plum-900 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Tag className="w-3.5 h-3.5 text-pink-400" />
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-plum-900 text-xs font-semibold"
          >
            <option value="All">All Categories</option>
            <option value="General">General</option>
            {subjects.map(s => (
              <option key={s._id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-2">
        {filteredNotes.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4 text-center">No notes uploaded matching criteria.</p>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note._id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-plum-900/40 border border-slate-200/80 dark:border-pink-950/60 hover:border-pink-300 dark:hover:border-pink-800 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-300 shrink-0">
                  {isImageFile(note) ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : (
                    <File className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-pink-50 truncate">
                    {note.originalName}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-pink-400 dark:text-pink-300/60 mt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 font-semibold">
                      {note.subjectTag}
                    </span>
                    <span>{formatFileSize(note.fileSize)}</span>
                    <span>• {new Date(note.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: View, Download, Delete */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setPreviewNote(note)}
                  className="p-1.5 rounded-lg text-pink-500 hover:text-pink-700 hover:bg-pink-100 dark:hover:bg-plum-800 transition-colors"
                  title="View / Preview File"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <a
                  href={`/api/notes/${note._id}/download`}
                  download
                  className="p-1.5 rounded-lg text-pink-400 hover:text-pink-600 hover:bg-pink-100 dark:hover:bg-plum-800 transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </a>

                <button
                  onClick={() => onDeleteNote(note._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inline File Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-plum-900 border border-pink-200 dark:border-pink-900/60 rounded-3xl p-5 max-w-4xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-950/80 pb-3 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 shrink-0">
                  {previewNote.subjectTag}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-pink-50 truncate">
                  {previewNote.originalName}
                </h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`/uploads/${previewNote.filename}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-plum-800 text-pink-600 dark:text-pink-300 text-xs font-semibold hover:bg-pink-100 dark:hover:bg-plum-700 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </a>

                <a
                  href={`/api/notes/${previewNote._id}/download`}
                  download
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-500 text-white text-xs font-semibold hover:bg-pink-600 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>

                <button
                  onClick={() => setPreviewNote(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-pink-200 hover:bg-pink-50 dark:hover:bg-plum-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Preview Content */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-2 rounded-2xl bg-slate-50 dark:bg-plum-950/60 border border-pink-100/50 dark:border-pink-950/60">
              {isImageFile(previewNote) ? (
                <img
                  src={`/uploads/${previewNote.filename}`}
                  alt={previewNote.originalName}
                  className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-md"
                />
              ) : isPdfFile(previewNote) ? (
                <iframe
                  src={`/uploads/${previewNote.filename}`}
                  className="w-full h-[70vh] rounded-2xl border-0"
                  title={previewNote.originalName}
                />
              ) : (
                <div className="text-center py-12 space-y-3">
                  <File className="w-12 h-12 mx-auto text-pink-400 animate-pulse" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-pink-200">
                    Preview not available directly for this file format ({previewNote.originalName})
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <a
                      href={`/uploads/${previewNote.filename}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-pink-500 text-white text-xs font-semibold hover:bg-pink-600"
                    >
                      Open in New Browser Tab
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
