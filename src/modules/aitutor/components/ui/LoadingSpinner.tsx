import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 border-accent-primary ${sizeClasses[size]}`}></div>
      <span className="ml-2 text-text-secondary">{message}</span>
    </div>
  );
}; 