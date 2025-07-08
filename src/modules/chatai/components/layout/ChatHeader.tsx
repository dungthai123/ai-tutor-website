import React from 'react';
import { ArrowLeft, Settings, Volume2, VolumeX } from 'lucide-react';
import { useSettingsStore, useBackgroundMusic } from '@/modules/chatai/hooks';
import { TopicDetail } from '@/modules/chatai/types';
import { cn } from '@/modules/chatai/utils';

interface ChatHeaderProps {
  topicDetail: TopicDetail | null;
  onBack: () => void;
  onSettingsToggle: () => void;
  showSettings: boolean;
}

export function ChatHeader({ 
  topicDetail, 
  onBack, 
  onSettingsToggle, 
  showSettings 
}: ChatHeaderProps) {
  const { isMusicBackgroundTurnOn, setMusicBackgroundTurnOn } = useSettingsStore();
  const { isPlaying, toggleBackgroundMusic } = useBackgroundMusic();

  return (
    <div className="relative h-20 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {topicDetail?.title || 'Chat AI'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Background Music Toggle */}
          <button
            onClick={() => {
              setMusicBackgroundTurnOn(!isMusicBackgroundTurnOn);
              toggleBackgroundMusic();
            }}
            className={cn(
              'p-2 rounded-full transition-colors',
              isMusicBackgroundTurnOn && isPlaying
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100 text-gray-600'
            )}
          >
            {isMusicBackgroundTurnOn && isPlaying ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </button>

          {/* Settings Toggle */}
          <button
            onClick={onSettingsToggle}
            className={cn(
              'p-2 rounded-full transition-colors',
              showSettings
                ? 'bg-gray-100 text-gray-900'
                : 'hover:bg-gray-100 text-gray-600'
            )}
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 