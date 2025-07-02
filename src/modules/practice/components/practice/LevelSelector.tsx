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
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Select Your HSK Level
      </h2>
      <div className="flex flex-wrap justify-center gap-3">
        {HSK_LEVELS.map((hskLevel) => (
          <button
            key={hskLevel.level}
            onClick={() => onLevelChange(hskLevel.level)}
            disabled={loading}
            className={cn(
              'px-6 py-3 rounded-full font-medium transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
              selectedLevel === hskLevel.level
                ? 'bg-gray-800 text-white shadow-lg focus:ring-gray-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'
            )}
          >
            <span className="text-sm font-semibold">
              Đề {hskLevel.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 