interface ProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
}

export function ProgressBar({ currentIndex, totalQuestions }: ProgressBarProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
} 