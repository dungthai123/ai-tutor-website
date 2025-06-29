import React from 'react';

interface LessonCardProps {
  title: string;
  description: string;
  progress: number;
  isCompleted?: boolean;
  onToggleComplete?: (completed: boolean) => void;
  onClick?: () => void;
  isActive?: boolean;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  title,
  description,
  progress,
  isCompleted = false,
  onToggleComplete,
  onClick,
  isActive = false
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onToggleComplete?.(e.target.checked);
  };

  return (
    <div 
      className={`rounded-xl p-4 cursor-pointer transition-all duration-200 border ${
        isActive 
          ? 'border-accent-primary bg-background-hover shadow-glow' 
          : 'border-border-subtle bg-background-card hover:border-accent-primary hover:bg-background-hover'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-1">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-accent-success bg-background-card border-border-medium rounded focus:ring-accent-primary focus:ring-2"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium mb-1 line-clamp-1 ${
            isCompleted ? 'line-through text-text-muted' : 'text-text-primary'
          }`}>
            {title}
          </h3>
          
          <p className="text-xs text-text-secondary mb-3 line-clamp-2">
            {description}
          </p>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-muted">Tiến độ</span>
              <span className="text-xs font-medium text-accent-success">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-border-medium rounded-full h-1">
              <div 
                className="bg-accent-success h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 