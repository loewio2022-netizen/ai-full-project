"use client";

type Props = {
  data: any;
};

export default function JsonViewer({ data }: Props) {
  if (!data) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="glass shadow-apple rounded-2xl p-6">
        <h2 className="text-sm text-gray-500 mb-2">Analysis</h2>

        <pre className="text-xs text-gray-800 overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}