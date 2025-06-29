import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

interface ProgressCardProps {
  title: string;
  description: string;
  progress: number;
  progressText?: string;
  onClick?: () => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  description,
  progress,
  progressText,
  onClick
}) => {
  return (
    <Card className={onClick ? 'cursor-pointer hover:bg-background-hover transition-colors duration-200' : ''} onClick={onClick}>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">{description}</p>
      
      <div className="w-full bg-border-medium rounded h-2 overflow-hidden mb-2">
        <div 
          className="h-full bg-accent-warning rounded transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {progressText && (
        <p className="text-sm font-medium text-accent-warning text-right">
          {progressText}
        </p>
      )}
    </Card>
  );
}; 