import React from 'react';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  return (
    <div className="p-4 bg-accent-error/10 border border-accent-error/20 rounded-lg">
      <p className="text-accent-error mb-2">Lỗi: {error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-accent-primary hover:text-accent-primary/80 underline"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}; 