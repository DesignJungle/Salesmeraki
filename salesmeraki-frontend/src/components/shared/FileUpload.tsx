'use client';

import { useState, useRef } from 'react';
import { api } from '@/utils/api';

interface FileUploadProps {
  onUploadComplete: (fileUrl: string) => void;
  acceptedTypes?: string;
  maxSize?: number; // in bytes
}

export default function FileUpload({
  onUploadComplete,
  acceptedTypes = "image/*,.pdf,.doc,.docx",
  maxSize = 5 * 1024 * 1024 // 5MB default
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (file.size > maxSize) {
      setError('File size exceeds limit');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 100)
          );
          setProgress(percentCompleted);
        },
      });

      onUploadComplete(response.data.fileUrl);
      setProgress(0);
      setError(null);
    } catch (err) {
      setError('Upload failed. Please try again.');
      setProgress(0);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={acceptedTypes}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Select File
      </button>
      <p className="mt-2 text-sm text-gray-600">
        or drag and drop your file here
      </p>
      {progress > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}