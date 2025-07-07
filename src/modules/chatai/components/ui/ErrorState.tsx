import React from 'react';

interface ErrorStateProps {
  error: string;
  onBack: () => void;
}

export function ErrorState({ error, onBack }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
        <div className="text-red-600 text-lg font-medium mb-2">Error</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Topics
        </button>
      </div>
    </div>
  );
} 