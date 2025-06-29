import { PracticeTopicModel, PracticeType } from '../../types';
import { Card } from '@/shared/components/ui/cards/Card';
import { Button } from '@/shared/components/ui/buttons/Button';
import Link from 'next/link';

interface TopicCardProps {
  topic: PracticeTopicModel;
  practiceType: PracticeType;
}

export function TopicCard({ topic, practiceType }: TopicCardProps) {
  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-text-primary">
              {topic.title}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyStyle(topic.difficulty || 'easy')}`}>
              {topic.difficulty || 'easy'}
            </span>
          </div>
          
          <p className="text-text-secondary mb-4">
            {topic.description}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <div className="flex items-center gap-1">
              📚 <span>{topic.questionCount} questions</span>
            </div>
            <div className="flex items-center gap-1">
              ⏱️ <span>{topic.estimatedTime} minutes</span>
            </div>
          </div>
        </div>
        
        <div className="ml-6">
          <Link href={`/practice/${practiceType}/test/${topic.id}`}>
            <Button className="flex items-center gap-2">
              ▶️ Start Test
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
} 