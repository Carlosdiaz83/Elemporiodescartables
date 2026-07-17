"use client";

import { useState, useRef, useCallback } from "react";

interface ImageDropzoneProps {
  currentImage: string | null;
  onImageUploaded: (url: string) => void;
  compact?: boolean;
}

export default function ImageDropzone({
  currentImage,
  onImageUploaded,
  compact = false,
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setError(null);

    try {
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al subir");
      }

      setPreview(data.url);
      onImageUploaded(data.url);
    } catch (err: any) {
      setError(err.message);
      setPreview(currentImage);
    } finally {
      setIsUploading(false);
    }
  }

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        uploadFile(file);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  if (compact) {
    return (
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`w-full h-full rounded-lg overflow-hidden cursor-pointer border-2 border-dashed transition-all ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
        } ${isUploading ? "pointer-events-none opacity-70" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onFileSelect}
          className="hidden"
        />
        {preview ? (
          <div className="relative w-full h-full">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Foto del producto
      </label>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? "pointer-events-none opacity-70" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onFileSelect}
          className="hidden"
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center">
            {isUploading ? (
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
            ) : (
              <>
                <svg
                  className="w-10 h-10 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  Arrastrá una imagen o hacé click
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WebP o GIF (max 5MB)
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {preview && !isUploading && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPreview(null);
            onImageUploaded("");
          }}
          className="text-sm text-red-500 hover:text-red-600"
        >
          Eliminar imagen
        </button>
      )}
    </div>
  );
}
