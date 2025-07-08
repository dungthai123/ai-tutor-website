import { Button } from '@/shared/components/ui/buttons/Button';
import { usePracticeDetailStore, FontSize } from '@/lib/stores/practiceDetailStore';
import { useState, useEffect } from 'react';


export function TestHeader() {
  const { fontSize, setFontSize, isTextSegmentEnabled, toggleTextSegment } = usePracticeDetailStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const fontSizeButtons: { size: FontSize; label: string; icon: string }[] = [
    { size: 'small', label: 'Small', icon: '🔍' },
    { size: 'medium', label: 'Medium', icon: '📄' }, 
    { size: 'large', label: 'Large', icon: '🔍' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">

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
          <Button
            variant={isTextSegmentEnabled ? "primary" : "secondary"}
            onClick={toggleTextSegment}
            className={`text-xs px-3 py-1 flex items-center gap-1 ${
              isTextSegmentEnabled 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>🀄</span>
            <span>{isTextSegmentEnabled ? 'Hide Pinyin' : 'Show Pinyin'}</span>
          </Button>
          <Button
            variant={isFullscreen ? "primary" : "secondary"}
            onClick={toggleFullscreen}
            className={`text-xs px-3 py-1 flex items-center gap-1 ${
              isFullscreen 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{isFullscreen ? '🗗' : '🖥️'}</span>
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 