import { PracticeType } from '../../types';

interface PracticeTipsProps {
  practiceType: PracticeType;
}

export function PracticeTips({ practiceType }: PracticeTipsProps) {
  const getTips = () => {
    if (practiceType === PracticeType.LISTENING) {
      return [
        {
          icon: '🎧',
          text: 'Listen to each audio clip carefully. You can replay it multiple times.',
          color: 'text-blue-500'
        },
        {
          icon: '📝',
          text: 'Use the transcript feature to check your understanding after answering.',
          color: 'text-blue-500'
        }
      ];
    } else {
      return [
        {
          icon: '📖',
          text: 'Read the passage carefully before looking at the questions.',
          color: 'text-green-500'
        },
        {
          icon: '🔍',
          text: 'Use the translation feature if you encounter difficult words.',
          color: 'text-green-500'
        }
      ];
    }
  };

  const tips = getTips();

  return (
    <div className="mt-12 bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        💡 Practice Tips
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex gap-3">
            <span className={tip.color}>{tip.icon}</span>
            <p className="text-sm text-text-secondary">
              {tip.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 