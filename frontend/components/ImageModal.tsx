"use client";

type Props = {
  image: string | null;
  onClose: () => void;
};

export default function ImageModal({ image, onClose }: Props) {
  if (!image) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <img
        src={image}
        className="max-w-[85%] max-h-[85%] rounded-3xl shadow-2xl"
      />
    </div>
  );
}