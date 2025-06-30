import { Button } from '@/shared/components/ui/buttons/Button';
import { Card } from '@/shared/components/ui/cards/Card';
import { TestScore, PracticeType, HSKLevel } from '../../types';

interface TestResultsProps {
  score: TestScore;
  testType: PracticeType;
  level: HSKLevel;
  testTitle: string;
  onRetakeTest: () => void;
  onBackToTopics: () => void;
  onViewAnswers: () => void;
}

export function TestResults({
  score,
  testType,
  level,
  testTitle,
  onRetakeTest,
  onBackToTopics,
  onViewAnswers
}: TestResultsProps) {
  // Determine performance level and styling
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50', stars: 3 };
    if (percentage >= 80) return { level: 'Very Good', color: 'text-blue-600', bgColor: 'bg-blue-50', stars: 3 };
    if (percentage >= 70) return { level: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-50', stars: 2 };
    if (percentage >= 60) return { level: 'Pass', color: 'text-orange-600', bgColor: 'bg-orange-50', stars: 2 };
    return { level: 'Need Improvement', color: 'text-red-600', bgColor: 'bg-red-50', stars: 1 };
  };

  const performance = getPerformanceLevel(score.percentage);

  // Render stars
  const renderStars = (count: number) => {
    return Array.from({ length: 3 }, (_, index) => (
      <span key={index} className={`text-4xl ${index < count ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <span className="text-sm text-gray-600">Test Completed</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        </div>

        {/* Main Results Card */}
        <Card className="max-w-2xl mx-auto p-8 text-center shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          {/* Character and Stars */}
          <div className="mb-6">
            <div className="text-8xl mb-4">🐼</div>
            <div className="flex justify-center gap-1 mb-4">
              {renderStars(performance.stars)}
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hoàn thành bài kiểm tra!
          </h1>
          
          <p className="text-gray-600 mb-2">
            Chúc mừng bạn đã vượt qua bài kiểm tra.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Để biết đáp án chi tiết, hãy bấm vào Xem đáp án nhé.
          </p>

          {/* Score Display */}
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${performance.bgColor} mb-8`}>
            <span className={`text-2xl font-bold ${performance.color}`}>
              {score.percentage}%
            </span>
            <span className={`text-lg font-medium ${performance.color}`}>
              {performance.level}
            </span>
          </div>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                         {/* Listening Score */}
             <div className="text-center">
               <div className="text-sm text-gray-600 mb-1">
                 {testType === PracticeType.LISTENING ? 'Nghe' : 'Đọc'}
               </div>
               <div className="text-2xl font-bold text-gray-900 mb-1">
                 {score.correct} / {score.total}
               </div>
               <Button
                 variant="secondary"
                 onClick={onViewAnswers}
                 className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1"
               >
                 Xem đáp án
               </Button>
             </div>

            {/* Reading Score (if applicable) */}
            {testType === PracticeType.READING && (
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Đọc</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {score.correct} / {score.total}
                </div>
                <div className="text-lg text-gray-600">
                  {Math.round((score.correct / score.total) * 100)} / 100
                </div>
              </div>
            )}

            {/* Writing Score (placeholder) */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Viết</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Math.floor(score.percentage * 0.16)} / 100
              </div>
                             <Button
                 variant="secondary"
                 onClick={onViewAnswers}
                 className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1"
               >
                 Xem đáp án
               </Button>
             </div>
          </div>

          {/* Performance Message */}
          <div className={`p-4 rounded-lg ${performance.bgColor} mb-8`}>
            <p className={`font-medium ${performance.color}`}>
              {score.percentage >= 80 
                ? "Xuất sắc! Bạn đã thể hiện rất tốt trong bài kiểm tra này."
                : score.percentage >= 60
                ? "Tốt! Bạn đã vượt qua bài kiểm tra. Hãy tiếp tục luyện tập để cải thiện."
                : "Cần cải thiện! Hãy xem lại đáp án và luyện tập thêm."
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={onRetakeTest}
              className="px-6 py-3"
            >
              🔄 Làm lại
            </Button>
            
            <Button
              variant="secondary"
              onClick={onViewAnswers}
              className="px-6 py-3"
            >
              📝 Xem đáp án
            </Button>
            
            <Button
              variant="secondary"
              onClick={onBackToTopics}
              className="px-6 py-3"
            >
              📚 Chọn bài khác
            </Button>
          </div>

          {/* Test Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{testTitle}</span>
              <span className="mx-2">•</span>
              <span>{level}</span>
              <span className="mx-2">•</span>
              <span>{testType === PracticeType.LISTENING ? 'Listening' : 'Reading'} Test</span>
            </div>
          </div>
        </Card>

        {/* Additional Stats Card */}
        <Card className="max-w-md mx-auto mt-6 p-4 bg-white/80 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{score.correct}</div>
              <div className="text-xs text-gray-600">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{score.wrong}</div>
              <div className="text-xs text-gray-600">Wrong</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{score.skip}</div>
              <div className="text-xs text-gray-600">Skipped</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 