"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Download, Maximize2 } from "lucide-react";

type Props = {
  image: string | null;
  onClose: () => void;
  images?: string[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
};

export default function ImageModal({
  image,
  onClose,
  images = [],
  currentIndex = 0,
  onNavigate
}: Props) {
  if (!image) return null;

  const hasNavigation = images.length > 1 && onNavigate;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasNavigation && currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasNavigation && currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-${currentIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasNavigation) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (currentIndex > 0) {
            e.preventDefault();
            onNavigate(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < images.length - 1) {
            e.preventDefault();
            onNavigate(currentIndex + 1);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hasNavigation, currentIndex, images.length, onNavigate, onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors z-20"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Navigation arrows */}
      {hasNavigation && currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 z-20"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      )}

      {hasNavigation && currentIndex < images.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 z-20"
          aria-label="Next image"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Image container */}
      <div className="relative max-w-full max-h-full flex items-center justify-center">
        <img
          src={image}
          className="max-w-[90vw] max-h-[85vh] rounded-2xl shadow-2xl object-contain"
          alt={`Generated image ${currentIndex + 1}`}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Image info overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-6">
          {hasNavigation && (
            <div className="text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 hover:text-gray-300 transition-colors"
            aria-label="Download image"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </button>
        </div>

        {/* Resolution badge */}
        <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-2 rounded-full">
          1476 × 1181 px
        </div>
      </div>

      {/* Thumbnail strip (if multiple images) */}
      {hasNavigation && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(index);
              }}
              className={`w-16 h-16 rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-white scale-110'
                  : 'opacity-60 hover:opacity-100'
              }`}
              aria-label={`Go to image ${index + 1}`}
            >
              <img
                src={img}
                className="w-full h-full object-cover"
                alt={`Thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}