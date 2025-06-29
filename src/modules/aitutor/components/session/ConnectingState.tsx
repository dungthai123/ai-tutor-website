import React from 'react';
import { SelectedTopic } from '../../types';

interface ConnectingStateProps {
  selectedTopic: SelectedTopic;
}

export function ConnectingState({ selectedTopic }: ConnectingStateProps) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Đang kết nối với AI Tutor...
        </h3>
        <p className="text-text-secondary">
          Chuẩn bị phiên luyện tập: {selectedTopic.topicName}
        </p>
      </div>
    </div>
  );
} 