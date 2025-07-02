import { Button } from '@/shared/components/ui/buttons/Button';
import { usePracticeDetailStore, FontSize } from '@/lib/stores/practiceDetailStore';

interface Topic {
  title: string;
  level: string;
}

interface TestHeaderProps {
  topic: Topic;
  onBack: () => void;
}

export function TestHeader({ topic, onBack }: TestHeaderProps) {
  const { fontSize, setFontSize } = usePracticeDetailStore();

  const fontSizeButtons: { size: FontSize; label: string; icon: string }[] = [
    { size: 'small', label: 'Small', icon: '🔍' },
    { size: 'medium', label: 'Medium', icon: '📄' }, 
    { size: 'large', label: 'Large', icon: '🔍' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Back button and topic info */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            ← Back
          </Button>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">{topic.title}</span>
            <span className="ml-2">• {topic.level}</span>
          </div>
        </div>

        {/* Right side - Font size controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 mr-2">Font Size:</span>
          {fontSizeButtons.map(({ size, label, icon }) => (
            <Button
              key={size}
              variant={fontSize === size ? "primary" : "secondary"}
              onClick={() => setFontSize(size)}
              className={`text-xs px-3 py-1 flex items-center gap-1 ${
                fontSize === size 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
} 