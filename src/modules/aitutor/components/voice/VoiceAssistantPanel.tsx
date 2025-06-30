'use client';

import React from 'react';
import { VoiceAssistantPanelProps } from '../../types';
import { useVoiceAssistantPanel } from '../../hooks/useVoiceAssistantPanel';
import { EmptyState } from '../ui/EmptyState';
import { ConnectingState } from './ConnectingState';
import { ConnectedSession } from '../session/ConnectedSession';
import { VoiceAssistant } from './VoiceAssistant';

export function VoiceAssistantPanel({
  selectedTopic,
  userName,
  token,
  isConnecting,
  onStartCall,
  onDeclineCall,
  onDisconnect,
  onToggleFullScreen
}: VoiceAssistantPanelProps) {
  const { stateType, emptyStateConfig } = useVoiceAssistantPanel(
    selectedTopic,
    token,
    isConnecting
  );

  // Render based on state type
  const renderContent = () => {
    switch (stateType) {
      case 'empty':
      case 'error':
        return emptyStateConfig ? (
          <EmptyState {...emptyStateConfig} />
        ) : null;

      case 'connecting':
        return selectedTopic ? (
          <ConnectingState selectedTopic={selectedTopic} />
        ) : null;

      case 'connected':
        return selectedTopic && token ? (
          <ConnectedSession
            selectedTopic={selectedTopic}
            userName={userName}
            token={token}
            onStartCall={onStartCall} 
            onDisconnect={onDisconnect}
            onToggleFullScreen={onToggleFullScreen}
          />
        ) : null;

      case 'disconnected':
        // Topic selected but not connected - show VoiceAssistant for call flow
        return selectedTopic ? (
          <VoiceAssistant 
            selectedTopic={selectedTopic} 
            onStartCall={onStartCall}
            onDeclineCall={onDeclineCall}
            isConnecting={isConnecting}
          />
        ) : null;

      default:
        // Fallback to empty state
        return (
          <EmptyState
            title="AI English Tutor"
            message="Chọn một chủ đề từ danh sách bên trái để bắt đầu luyện tập"
            icon="🤖"
          />
        );
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {renderContent()}
    </div>
  );
}

export default VoiceAssistantPanel; 