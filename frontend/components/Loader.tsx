"use client";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        {/* Apple-style pulsing dots */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full animate-pulse delay-100"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full animate-pulse delay-200"></div>
        </div>

        {/* Subtle background effect */}
        <div className="absolute inset-0 -z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 blur-xl opacity-60"></div>
        </div>
      </div>

      <p className="mt-6 text-gray-500 font-medium tracking-wide">
        Generating your images...
      </p>
      <p className="mt-2 text-sm text-gray-400">
        This usually takes 10-20 seconds
      </p>
    </div>
  );
}