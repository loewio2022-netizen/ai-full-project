"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  onSelect: (img: string) => void;
};

export default function ImageGrid({ images, onSelect }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(4);

  // Update visible count based on container width
  useEffect(() => {
    const updateVisibleCount = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width < 640) setVisibleCount(1);
        else if (width < 1024) setVisibleCount(2);
        else if (width < 1280) setVisibleCount(3);
        else setVisibleCount(4);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, images.length - visibleCount);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  // Note: We use CSS transform to show the correct images

  return (
    <div className="relative max-w-6xl mx-auto" ref={containerRef}>
      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all hover:scale-110"
          aria-label="Previous images"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {currentIndex < maxIndex && (
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all hover:scale-110"
          aria-label="Next images"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Images Container */}
      <div className="overflow-hidden rounded-3xl">
        <div
          className="flex gap-8 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
          }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <div
                onClick={() => onSelect(img)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-apple hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="aspect-[1476/1181] relative">
                  <img
                    src={img}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={`Generated image ${index + 1}`}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                    #{index + 1}
                  </div>

                  {/* View button */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <button className="bg-white/90 backdrop-blur-sm text-gray-800 font-medium px-4 py-2 rounded-full hover:bg-white transition-colors">
                      View Fullscreen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {images.length > visibleCount && (
        <div className="flex justify-center items-center mt-8 gap-2">
          {Array.from({ length: Math.ceil(images.length / visibleCount) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i * visibleCount)}
              className={`w-2 h-2 rounded-full transition-all ${
                Math.floor(currentIndex / visibleCount) === i
                  ? 'bg-gray-800 w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}