import { Card } from '@/shared/components/ui/cards/Card';
import { Button } from '@/shared/components/ui/buttons/Button';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function EmptyState({ 
  title = "Test Not Found",
  description = "The test you are looking for does not exist.",
  showRetry = false,
  onRetry
}: EmptyStateProps) {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="p-8 text-center">
        <div className="text-4xl mb-4">❌</div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">{title}</h2>
        <p className="text-text-secondary mb-4">{description}</p>
        <div className="flex gap-3 justify-center">
          {showRetry && onRetry && (
            <Button onClick={onRetry} variant="secondary">
              Try Again
            </Button>
          )}
          <Link href="/practice">
            <Button>Back to Practice</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
} 