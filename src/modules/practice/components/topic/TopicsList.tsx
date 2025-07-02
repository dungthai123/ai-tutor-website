import { PracticeTopicModel, PracticeType, HSKLevel } from '../../types';
import { Card } from '@/shared/components/ui/cards/Card';
import { Button } from '@/shared/components/ui/buttons/Button';
import { TopicCard } from './TopicCard';
import Link from 'next/link';

interface TopicsListProps {
  topics: PracticeTopicModel[];
  practiceType: PracticeType;
  level: HSKLevel;
}

export function TopicsList({ topics, practiceType, level }: TopicsListProps) {
  if (topics.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          No tests available
        </h3>
        <p className="text-text-secondary mb-4">
          Tests for {level} {practiceType} are coming soon.
        </p>
        <Link href="/practice">
          <Button>Try Another Level</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <TopicCard 
          key={topic.id} 
          topic={topic} 
          practiceType={practiceType} 
        />
      ))}
    </div>
  );
} 