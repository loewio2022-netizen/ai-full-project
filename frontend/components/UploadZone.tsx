"use client";

import { useRef, useState } from "react";

type Props = {
  onFileSelect: (file: File) => void;
};

export default function UploadZone({ onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    onFileSelect(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
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

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFileSelect(file);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`glass shadow-apple rounded-3xl p-12 text-center cursor-pointer border
        ${isDragging ? "border-black scale-105" : "border-gray-200"}`}
      >
        <p className="text-xl font-medium mb-2">
          Drop your image here
        </p>
        <p className="text-gray-500 text-sm">
          or click to upload
        </p>
      </div>

      {preview && (
        <div className="mt-6 flex justify-center">
          <img
            src={preview}
            className="w-48 h-48 object-cover rounded-2xl shadow-apple"
          />
        </div>
      )}
    </div>
  );
}