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

  const handleUpload = async (file: File) => {
    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    setImages([]);
    setJson(null);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    setImages(data.images);
    setJson(data.variations);
    setLoading(false);
  };

  return (
    <main className="min-h-screen px-6 pb-20">
      {/* Header */}
      <div className="text-center mt-16">
        <h1 className="text-4xl font-semibold tracking-tight">
          AI Image Studio
        </h1>
        <p className="text-gray-500 mt-2">
          Generate variations from a single image
        </p>
      </div>

      {/* Upload */}
      <UploadZone onFileSelect={handleUpload} />

      {/* Loading */}
      {loading && <Loader />}

      {/* JSON */}
      {!loading && json && <JsonViewer data={json} />}

      {/* Images */}
      {!loading && images.length > 0 && (
        <ImageGrid images={images} onSelect={setSelectedImage} />
      )}

      {/* Modal */}
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </main>
  );
}