import { PracticeType } from '../../types';
import { Card } from '@/shared/components/ui/cards/Card';
import { Button } from '@/shared/components/ui/buttons/Button';
import Link from 'next/link';

interface TestScore {
  correct: number;
  total: number;
  percentage: number;
}

interface TestResultsProps {
  score: TestScore;
  testType: PracticeType;
  testId: string;
}

export function TestResults({ score, testType, testId }: TestResultsProps) {
  const getEmoji = () => {
    if (score.percentage >= 80) return '🎉';
    if (score.percentage >= 60) return '👍';
    return '📚';
  };

  const getMessage = () => {
    if (score.percentage >= 80) {
      return <p className="text-green-600 text-center">Excellent work! You have a strong understanding.</p>;
    }
    if (score.percentage >= 60) {
      return <p className="text-yellow-600 text-center">Good job! Keep practicing to improve further.</p>;
    }
    return <p className="text-red-600 text-center">Keep studying! Practice more to improve your skills.</p>;
  };

  return (
    <Card className="p-8">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{getEmoji()}</div>
        <h2 className="text-3xl font-bold text-text-primary mb-2">Test Complete!</h2>
        <p className="text-xl text-text-secondary">
          Your score: {score.correct}/{score.total} ({score.percentage}%)
        </p>
      </div>
      
      <div className="space-y-4 mb-6">
        {getMessage()}
      </div>

      <div className="flex gap-4">
        <Link href={`/practice/${testType}/test/${testId}`} className="flex-1">
          <Button variant="secondary" className="w-full">Retake Test</Button>
        </Link>
        <Link href="/practice" className="flex-1">
          <Button className="w-full">Back to Practice</Button>
        </Link>
      </div>
    </Card>
  );
} 