import { LevelSelectorProps, HSK_LEVELS } from '../../types';
import { cn } from '@/utils/helpers';

export function LevelSelector({ 
  selectedLevel, 
  onLevelChange, 
  loading = false,
  className 
}: LevelSelectorProps) {
  return (
    <div className={cn('mb-12', className)}>
      <h2 className="text-2xl font-semibold text-text-primary mb-6 text-center">
        Select Your HSK Level
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {HSK_LEVELS.map((hskLevel) => (
          <button
            key={hskLevel.level}
            onClick={() => onLevelChange(hskLevel.level)}
            disabled={loading}
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              selectedLevel === hskLevel.level
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mx-auto',
              hskLevel.color
            )}>
              {hskLevel.level.slice(-1)}
            </div>
            <h3 className="font-semibold text-text-primary mb-1">
              {hskLevel.name}
            </h3>
            <p className="text-sm text-text-secondary">
              {hskLevel.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
} 