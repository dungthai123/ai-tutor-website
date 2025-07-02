import { PracticeTopicModel, PracticeType } from '../../types';
import { Card } from '@/shared/components/ui/cards/Card';
import { Button } from '@/shared/components/ui/buttons/Button';
import Link from 'next/link';

interface TopicCardProps {
  topic: PracticeTopicModel;
  practiceType: PracticeType;
}

export function TopicCard({ topic, practiceType }: TopicCardProps) {
  const getHSKLevel = () => {
    return topic.level || 'HSK1';
  };

  const getTestNumber = () => {
    // Extract test number from title or use displayOrder
    const match = topic.title.match(/Test (\d+)/i);
    return match ? match[1] : topic.displayOrder?.toString() || '1';
  };

  const getQuestionCount = () => {
    return topic.questionCount || topic.totalQuestions || 30;
  };

  const getEstimatedTime = () => {
    return topic.estimatedTime || 85;
  };

  return (
    <Card className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* HSK Level Badge */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-lg">
          {getHSKLevel()}
        </span>
      </div>

      {/* Test Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        {getHSKLevel()} Test {getTestNumber()}
      </h3>

      {/* Stats Grid */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600">
          <div className="w-6 h-6 mr-3 flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm">{getEstimatedTime()} phút</span>
        </div>

        <div className="flex items-center text-gray-600">
          <div className="w-6 h-6 mr-3 flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm">{getQuestionCount()} câu hỏi</span>
        </div>

        <div className="flex items-center text-gray-600">
          <div className="w-6 h-6 mr-3 flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm">3 phần thi</span>
        </div>

        <div className="flex items-center text-gray-600">
          <div className="w-6 h-6 mr-3 flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm">100 lượt đã thi</span>
        </div>
      </div>

      {/* Action Button */}
      <Link href={`/practice/${practiceType}/test/${topic.id}`} className="block">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          Xem chi tiết
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </Link>
    </Card>
  );
} 