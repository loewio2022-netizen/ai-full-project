"use client";

type Props = {
  images: string[];
  onSelect: (img: string) => void;
};

export default function ImageGrid({ images, onSelect }: Props) {
  return (
    <div className="max-w-6xl mx-auto mt-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => onSelect(img)}
            className="group cursor-pointer"
          >
            <img
              src={img}
              className="w-full h-56 object-cover rounded-2xl shadow-apple group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}