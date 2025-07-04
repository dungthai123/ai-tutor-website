import { TestHistoryItem } from '../../types';
import { TestHistoryCard } from './TestHistoryCard';

interface TestHistoryListProps {
  items: TestHistoryItem[];
  onDelete?: (historyId: string) => void;
}

export function TestHistoryList({ items, onDelete }: TestHistoryListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        No test history yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <TestHistoryCard key={item.historyId} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
} 