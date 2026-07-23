import React, { useState } from 'react';
import { FileText, UploadCloud, Download, Trash2, Tag, Search, File, Image as ImageIcon, Eye, X, ExternalLink } from 'lucide-react';

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
    <div className="dashboard-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-[#37352F] dark:text-[#E3E3E0] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#787774]" />
            Exam Notes & File Vault
          </h3>
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B]">
            Upload, store, organize, and view PDFs, lecture notes, and formula sheets
          </p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <form onSubmit={handleUploadSubmit} className="space-y-3">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border border-dashed border-[#E9E9E7] dark:border-[#2E2E2E] hover:border-[#A4A4A0] dark:hover:border-[#666666] rounded-lg p-5 text-center bg-[#F7F7F5] dark:bg-[#202020] transition-colors cursor-pointer"
        >
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
          />
          <label htmlFor="fileInput" className="cursor-pointer block space-y-1.5">
            <UploadCloud className="w-7 h-7 mx-auto text-[#787774]" />
            <p className="text-xs font-medium text-[#37352F] dark:text-[#E3E3E0]">
              {selectedFile ? (
                <span className="font-semibold">{selectedFile.name}</span>
              ) : (
                'Drag & drop exam notes here, or click to browse files'
              )}
            </p>
            <p className="text-[11px] text-[#787774] dark:text-[#9B9B9B]">
              Supports PDF, DOCX, Images (PNG, JPG), TXT
            </p>
          </label>
        </div>

        {selectedFile && (
          <div className="flex items-center gap-3 bg-[#F7F7F5] dark:bg-[#202020] p-2.5 rounded border border-[#E9E9E7] dark:border-[#2E2E2E]">
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#787774] dark:text-[#9B9B9B] mb-1">Tag with Subject:</label>
              <select
                value={subjectTag}
                onChange={(e) => setSubjectTag(e.target.value)}
                className="notion-input w-full text-xs"
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
              className="notion-btn text-xs mt-4 py-1.5 px-4 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Save File'}
            </button>
          </div>
        )}
      </form>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#787774] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="notion-input w-full pl-8 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Tag className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#787774] pointer-events-none" />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="notion-input text-xs font-medium pl-8 pr-7 w-full sm:w-auto"
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              {subjects.map(s => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-1.5">
        {filteredNotes.length === 0 ? (
          <p className="text-xs text-[#787774] dark:text-[#9B9B9B] italic py-4 text-center">No notes uploaded matching criteria.</p>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note._id}
              className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E] hover:bg-[#EFEFED] dark:hover:bg-[#2C2C2C] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="p-1.5 rounded bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#787774] shrink-0">
                  {isImageFile(note) ? (
                    <ImageIcon className="w-3.5 h-3.5" />
                  ) : (
                    <File className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-medium text-[#37352F] dark:text-[#E3E3E0] truncate">
                    {note.originalName}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-[#787774] dark:text-[#9B9B9B] mt-0.5">
                    <span className="px-1.5 py-0.2 rounded bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#787774] dark:text-[#9B9B9B]">
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
                  className="p-1 rounded text-[#787774] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors"
                  title="View / Preview File"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`/api/notes/${note._id}/download`}
                  download
                  className="p-1 rounded text-[#787774] hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onDeleteNote(note._id)}
                  className="p-1 rounded text-[#787774] hover:text-red-500 hover:bg-[#EFEFED] dark:hover:bg-[#333333] transition-colors"
                  title="Delete Note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inline File Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191919]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#202020] border border-[#E9E9E7] dark:border-[#2E2E2E] rounded-lg p-5 max-w-4xl w-full shadow-lg space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E9E9E7] dark:border-[#2E2E2E] pb-2.5 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#F1F1EF] dark:bg-[#2D2D2D] text-[#787774] dark:text-[#9B9B9B] shrink-0">
                  {previewNote.subjectTag}
                </span>
                <h4 className="text-xs font-semibold text-[#37352F] dark:text-[#E3E3E0] truncate">
                  {previewNote.originalName}
                </h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewNote.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="notion-btn text-xs py-1 px-2.5 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </a>

                <a
                  href={`/api/notes/${previewNote._id}/download`}
                  download
                  className="notion-btn text-xs py-1 px-2.5 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>

                <button
                  onClick={() => setPreviewNote(null)}
                  className="p-1 rounded text-[#787774] hover:bg-[#EFEFED] dark:hover:bg-[#333333]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-2 rounded bg-[#F7F7F5] dark:bg-[#191919] border border-[#E9E9E7] dark:border-[#2E2E2E]">
              {isImageFile(previewNote) ? (
                <img
                  src={previewNote.publicUrl}
                  alt={previewNote.originalName}
                  className="max-h-[70vh] w-auto max-w-full rounded object-contain"
                />
              ) : isPdfFile(previewNote) ? (
                <iframe
                  src={previewNote.publicUrl}
                  className="w-full h-[70vh] rounded border-0"
                  title={previewNote.originalName}
                />
              ) : (
                <div className="text-center py-10 space-y-3">
                  <File className="w-10 h-10 mx-auto text-[#787774]" />
                  <p className="text-xs font-medium text-[#37352F] dark:text-[#E3E3E0]">
                    Preview not available directly for this file format ({previewNote.originalName})
                  </p>
                  <div className="flex justify-center gap-2 pt-1">
                    <a
                      href={previewNote.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="notion-btn text-xs"
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
