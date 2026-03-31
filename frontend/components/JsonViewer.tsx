"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

type Props = {
  data: any;
};

export default function JsonViewer({ data }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const formattedJson = JSON.stringify(data, null, 2);
  const lines = formattedJson.split('\n').length;
  const shouldTruncate = lines > 20 && !isExpanded;
  const displayJson = shouldTruncate
    ? formattedJson.split('\n').slice(0, 20).join('\n') + '\n  ...'
    : formattedJson;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass shadow-apple rounded-3xl p-0 overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-gray-800">AI Analysis</h2>
            <p className="text-gray-500 text-sm mt-1">
              Detailed breakdown of your image analysis
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
              aria-label={copied ? "Copied!" : "Copy JSON"}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>

            {lines > 20 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                aria-label={isExpanded ? "Show less" : "Show more"}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show More
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* JSON Content */}
        <div className="p-8 bg-gray-50/50">
          <div className="relative">
            <pre className="text-sm text-gray-700 font-mono bg-white rounded-xl p-8 overflow-x-auto shadow-inner">
              <code>{displayJson}</code>
            </pre>

            {/* Line numbers */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 border-r border-gray-200 rounded-l-xl flex flex-col items-center pt-8 text-xs text-gray-400 select-none">
              {Array.from({ length: displayJson.split('\n').length }).map((_, i) => (
                <div key={i} className="py-0.5">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>{lines} lines</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>{JSON.stringify(data).length} characters</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>{Object.keys(data).length} properties</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50/80 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            This JSON contains the AI's analysis of your uploaded image, including detected elements,
            suggested variations, and creative interpretations.
          </p>
        </div>
      </div>
    </div>
  );
}