'use client';

import { useRef, useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { Spinner } from '../ui/Spinner';
import { FileText, Upload, Trash2, BookOpen, CheckCircle2 } from 'lucide-react';

export function DocumentPanel() {
  const { documents, isLoading, upload, remove, isUploading } = useDocuments();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFile = async (file: File) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await upload(file);
      setSuccessMsg(`"${file.name}" added to knowledge base`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.error || 'Upload failed');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete "${name}" from knowledge base?`)) return;
    await remove(name);
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 ? `${bytes}B` : `${(bytes / 1024).toFixed(1)}KB`;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-purple-600" />
        <h3 className="text-sm font-semibold text-gray-800">Knowledge Base</h3>
        <span className="ml-auto text-xs text-gray-400">{documents.length} docs</span>
      </div>

      {/* Upload Zone */}
      <div
        className={`mx-3 my-3 border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/40'
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.txt"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {isUploading ? (
          <div className="flex items-center justify-center gap-2 text-purple-600 text-xs">
            <Spinner className="w-4 h-4" /> Uploading...
          </div>
        ) : (
          <>
            <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Drop .md or .txt file</p>
            <p className="text-[10px] text-gray-400">or click to browse</p>
          </>
        )}
      </div>

      {/* Feedback */}
      {successMsg && (
        <div className="mx-3 mb-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mx-3 mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Document List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
        {isLoading && (
          <div className="flex justify-center py-6">
            <Spinner className="w-4 h-4 text-gray-300" />
          </div>
        )}

        {!isLoading && documents.length === 0 && (
          <div className="text-center py-6 text-xs text-gray-400">
            No documents yet. Upload a .md or .txt file to add knowledge.
          </div>
        )}

        {documents.map(doc => (
          <div
            key={doc.name}
            className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg group"
          >
            <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 truncate">{doc.name}</p>
              <p className="text-[10px] text-gray-400">{formatSize(doc.size)}</p>
            </div>
            <button
              onClick={() => handleDelete(doc.name)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1 rounded"
              title="Delete document"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
