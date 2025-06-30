import { Button } from '@/shared/components/ui/buttons/Button';

interface Topic {
  title: string;
  level: string;
}

interface TestHeaderProps {
  topic: Topic;
  onBack: () => void;
}

export function TestHeader({ topic, onBack }: TestHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          ← Back
        </Button>
        
        <div className="text-sm text-gray-600">
          <span className="font-medium">{topic.title}</span>
          <span className="ml-2">• {topic.level}</span>
        </div>
      </div>
    </div>
  );
} 