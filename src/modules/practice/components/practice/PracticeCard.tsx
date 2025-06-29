import Link from 'next/link';
import { PracticeCardProps, PRACTICE_TYPE_INFO } from '../../types';
import { Card } from '@/shared/components/ui/cards/Card';
import { Button } from '@/shared/components/ui/buttons/Button';
import { cn } from '@/utils/helpers';

export function PracticeCard({ 
  practiceType, 
  topicCount, 
  selectedLevel,
  className 
}: PracticeCardProps) {
  const info = PRACTICE_TYPE_INFO[practiceType as keyof typeof PRACTICE_TYPE_INFO];

  if (!info) {
    return null; // Handle unsupported practice types
  }

  return (
    <Card className={cn('p-8 hover:shadow-lg transition-shadow', className)}>
      <div className="text-center">
        <div className="text-6xl mb-4">{info.icon}</div>
        <h3 className="text-2xl font-semibold text-text-primary mb-4">
          {info.title}
        </h3>
        <p className="text-text-secondary mb-6">
          {info.description}
        </p>
        <div className="space-y-3 mb-6">
          {info.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {feature}
            </div>
          ))}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            {topicCount} available tests
          </div>
        </div>
        <Link href={`/practice/${practiceType}?level=${selectedLevel}`}>
          <Button className={cn('w-full', info.color, info.hoverColor)}>
            Start {info.title}
          </Button>
        </Link>
      </div>
    </Card>
  );
} 