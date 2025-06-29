'use client';

import React from 'react';
import { SelectedTopic } from '../../types';

interface ConnectingStateProps {
  selectedTopic: SelectedTopic;
}

export function ConnectingState({ selectedTopic }: ConnectingStateProps) {
  return (
    <div className="h-full flex items-center justify-center p-8 bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Connecting to AI Tutor...
        </h3>
        <p className="text-gray-300">
          Preparing your practice session: {selectedTopic.topicName}
        </p>
      </div>
    </div>
  );
} 