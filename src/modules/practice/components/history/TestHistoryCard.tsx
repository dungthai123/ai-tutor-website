import Link from 'next/link';
import { TestHistoryItem } from '../../types';
import { cn } from '@/utils/helpers';

interface TestHistoryCardProps {
  item: TestHistoryItem;
  className?: string;
  onDelete?: (historyId: string) => void;
}

export function TestHistoryCard({ item, className, onDelete }: TestHistoryCardProps) {
  const date = new Date(item.completedAt);
  const formattedDate = date.toLocaleDateString();

  const scoreColor = item.score.percentage >= 60 ? 'text-green-600' : 'text-red-600';

  return (
    <div className={cn(
      'relative block p-4 rounded-lg shadow hover:shadow-md transition-shadow bg-white border border-gray-200',
      className
    )}>
      <Link href={`/history/${item.historyId}`} className="block">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
{item.testType.charAt(0).toUpperCase() + item.testType.slice(1)}
        </h3>
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
          {item.topic.title}
        </div>
        <div className="text-sm text-gray-600 mb-1">
          {formattedDate}
        </div>
        <div className="text-sm font-medium">
          Score:{' '}
          <span className={scoreColor}>{item.score.percentage}%</span>
        </div>
      </Link>
      {onDelete && (
        <button
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs px-2 py-1 bg-red-50 rounded"
          onClick={() => onDelete(item.historyId)}
          title="Delete"
        >
          Delete
        </button>
      )}
    </div>
  );
} 