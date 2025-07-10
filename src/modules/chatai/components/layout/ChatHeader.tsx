import React from 'react';
import { ArrowLeft, Settings, Volume2, VolumeX, LogOut } from 'lucide-react';
import { useSettingsStore, useBackgroundMusic } from '@/modules/chatai/hooks';
import { TopicDetail } from '@/modules/chatai/types';
import { cn } from '@/modules/chatai/utils';
import { Button } from '@/shared/components/ui/buttons/Button';

interface ChatHeaderProps {
  topicDetail: TopicDetail | null;
  onBack: () => void;
  onEndConversation: () => void;
  imageBackground?: string;
  showSettings: boolean;
  onSettingsToggle: () => void;
}

export function ChatHeader({ 
  topicDetail, 
  onBack, 
  onEndConversation, 
  imageBackground, 
  showSettings, 
  onSettingsToggle 
}: ChatHeaderProps) {
  const { isMusicBackgroundTurnOn, setMusicBackgroundTurnOn } = useSettingsStore();
  const { isPlaying, toggleBackgroundMusic } = useBackgroundMusic();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 px-4 py-3 transition-all',
        'bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-md shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side - Back Button */}
        <Button
          variant="secondary"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </Button>

        {/* Center - Topic Image */}
        {imageBackground && (
          <div className="flex-1 flex justify-center">
            <img
              src={imageBackground}
              alt="Topic background"
              className="h-10 w-auto object-contain"
            />
          </div>
        )}

        {/* Right Side - Controls */}
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
          <Button
            variant="secondary"
            onClick={onSettingsToggle}
            className="text-gray-600 hover:text-gray-900"
          >
            <Settings size={20} />
          </Button>

          {/* End Conversation */}
          <Button
            variant="secondary"
            onClick={onEndConversation}
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
} 