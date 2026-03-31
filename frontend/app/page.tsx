"use client";

import { useState } from "react";
import UploadZone from "../components/UploadZone";
import JsonViewer from "../components/JsonViewer";
import ImageGrid from "../components/ImageGrid";
import ImageModal from "../components/ImageModal";
import Loader from "../components/Loader";

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [json, setJson] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleGenerate = async (file: File) => {
    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    setImages([]);
    setJson(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      setImages(data.images || []);
      setJson(data.json || data.variations || null);
    } catch (error) {
      console.error("Error generating images:", error);
      // You could add error state here
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Upload Section */}
        <UploadZone onGenerate={handleGenerate} loading={loading} />

        {/* Loading State */}
        {loading && <Loader />}

        {/* Results Section */}
        {!loading && (images.length > 0 || json) && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-medium text-gray-800">
                Your Generated Images
              </h2>
              <p className="text-gray-500 mt-2">
                {images.length} unique variations created from your image
              </p>
            </div>

            {/* Images Display - Horizontal Gallery */}
            {images.length > 0 && (
              <div className="mb-16">
                <ImageGrid images={images} onSelect={setSelectedImage} />
              </div>
            )}

            {/* JSON Analysis */}
            {json && (
              <div className="mb-16">
                <JsonViewer data={json} />
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && images.length === 0 && !json && (
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-8">
                <span className="text-4xl text-gray-300">🎨</span>
              </div>
              <h3 className="text-2xl font-medium text-gray-700 mb-4">
                Ready to Create Something Amazing?
              </h3>
              <p className="text-gray-500">
                Upload an image above to generate AI-powered variations.
                We'll analyze your image and create unique artistic interpretations.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal for Fullscreen View */}
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        images={images}
        currentIndex={images.findIndex(img => img === selectedImage)}
        onNavigate={(index) => setSelectedImage(images[index])}
      />
    </main>
  );
}