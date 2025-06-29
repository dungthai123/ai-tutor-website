import React from 'react';
import { SessionHeaderProps } from '../../types';

export function SessionHeader({ 
  selectedTopic, 
  userName, 
  onToggleFullScreen, 
  onDisconnect 
}: SessionHeaderProps) {
  return (
    <div className="bg-background-hover p-4 border-b border-border-subtle">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-text-primary">
            🎤 {selectedTopic.topicName}
          </h3>
          <p className="text-sm text-text-secondary">
            {selectedTopic.categoryName} • {userName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFullScreen}
            className="bg-accent-primary text-text-primary px-3 py-1 rounded-lg text-sm font-medium hover:opacity-80 transition-colors"
          >
            🔍 Full Screen
          </button>
          <button
            onClick={onDisconnect}
            className="bg-accent-error text-text-primary px-3 py-1 rounded-lg text-sm font-medium hover:opacity-80 transition-colors"
          >
            Kết thúc
          </button>
        </div>
      </div>
    </div>
  );
} 