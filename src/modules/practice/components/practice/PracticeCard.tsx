import Link from 'next/link';
import { PracticeCardProps, PRACTICE_TYPE_INFO } from '../../types';
import { Card } from '@/shared/components/ui/cards/Card';
import { Button } from '@/shared/components/ui/buttons/Button';
import { cn } from '@/utils/helpers';

export function PracticeCard({ 
  practiceType, 
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
        <Link href={`/practice/${practiceType}?level=${selectedLevel}`}>
          <Button className={cn('w-full', info.color, info.hoverColor)}>
            Start {info.title}
          </Button>
        </Link>
      </div>
    </Card>
  );
} 