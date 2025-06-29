import { PracticeType, HSKLevel } from '../../types';
import { Button } from '@/shared/components/ui/buttons/Button';
import Link from 'next/link';

interface PracticeTypeInfo {
  title: string;
  icon: string;
  description: string;
  color: string;
}

interface PracticeTypeHeaderProps {
  practiceType: PracticeType;
  level: HSKLevel;
}

export function PracticeTypeHeader({ practiceType, level }: PracticeTypeHeaderProps) {
  const getTypeInfo = (): PracticeTypeInfo => {
    if (practiceType === PracticeType.LISTENING) {
      return {
        title: 'Listening Practice',
        icon: '🎧',
        description: 'Practice listening comprehension with audio exercises',
        color: 'bg-blue-500'
      };
    } else {
      return {
        title: 'Reading Practice',
        icon: '📖',
        description: 'Improve reading comprehension with text exercises',
        color: 'bg-green-500'
      };
    }
  };

  const typeInfo = getTypeInfo();

  return (
    <div className="mb-8">
      <Link href="/practice">
        <Button variant="secondary" className="mb-4 flex items-center gap-2">
          ← Back to Practice
        </Button>
      </Link>
      
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-16 h-16 rounded-full ${typeInfo.color} flex items-center justify-center text-white text-2xl`}>
          {typeInfo.icon}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {typeInfo.title}
          </h1>
          <p className="text-text-secondary">
            {typeInfo.description} • {level}
          </p>
        </div>
      </div>
    </div>
  );
} 