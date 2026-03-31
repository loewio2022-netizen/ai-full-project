"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

type Props = {
  onGenerate: (file: File) => void;
  loading?: boolean;
};

export default function UploadZone({ onGenerate, loading }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = () => {
    if (selectedFile) {
      onGenerate(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-semibold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          AI Image Studio
        </h1>
        <p className="text-gray-500 mt-4 text-lg">
          Upload an image to generate creative variations with AI
        </p>
      </div>

      {/* Upload Area */}
      <div className="glass shadow-apple rounded-3xl p-16 border border-gray-100">
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300
            ${isDragging
              ? "border-black scale-[1.02] bg-gray-50"
              : "border-gray-300 hover:border-gray-400"
            }
            ${!preview ? "p-20 cursor-pointer" : "p-8"}
          `}
        >
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />

          {!preview ? (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <p className="text-2xl font-medium text-gray-800 mb-2">
                Drop your image here
              </p>
              <p className="text-gray-500 mb-6">
                or click to browse files
              </p>
              <p className="text-sm text-gray-400">
                Supports JPG, PNG, WebP up to 10MB
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Preview */}
              <div className="flex-1">
                <div className="relative">
                  <img
                    src={preview}
                    className="w-full max-w-md h-auto rounded-2xl shadow-lg"
                    alt="Upload preview"
                  />
                  <div className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info & Action */}
              <div className="flex-1">
                <h3 className="text-2xl font-medium text-gray-800 mb-4">
                  Ready to Create
                </h3>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">File:</span> {selectedFile?.name}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Size:</span> {(selectedFile?.size! / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-gray-600 mb-8">
                  <span className="font-medium">Type:</span> {selectedFile?.type.split('/')[1].toUpperCase()}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setPreview(null);
                      setSelectedFile(null);
                    }}
                    className="px-8 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    disabled={loading}
                  >
                    Change Image
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Images...
                      </>
                    ) : (
                      <>
                        <span>Create Images</span>
                        <span className="text-lg">→</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {!preview && (
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Drag & drop or click to upload. We'll analyze your image and generate unique variations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}