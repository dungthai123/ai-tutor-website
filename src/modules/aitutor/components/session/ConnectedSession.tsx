import React from 'react';
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { SelectedTopic } from '../../types';
import { VoiceAssistant } from '../voice/VoiceAssistant';
import { SessionHeader } from './SessionHeader';
import { generateRoomKey, getLiveKitServerUrl } from '../../utils';

interface ConnectedSessionProps {
  selectedTopic: SelectedTopic;
  userName: string;
  token: string;
  onStartCall: () => void;
  onDisconnect: () => void;
  onToggleFullScreen: () => void;
}

export function ConnectedSession({
  selectedTopic,
  userName,
  token,
  onStartCall,
  onDisconnect,
  onToggleFullScreen
}: ConnectedSessionProps) {
  // Handle disconnection with error handling
  const handleDisconnect = React.useCallback(() => {
    console.log('🔄 ConnectedSession - handleDisconnect called');
    try {
      onDisconnect();
    } catch (error) {
      console.error('Error during disconnection:', error);
    }
  }, [onDisconnect]);

  // Don't render if token is missing
  if (!token || !selectedTopic) {
    return null;
  }

  return (
    <div className="h-full">
      <SessionHeader
        selectedTopic={selectedTopic}
        userName={userName}
        onToggleFullScreen={onToggleFullScreen}
        onDisconnect={handleDisconnect}
      />
      
      <LiveKitRoom
        key={generateRoomKey(token, selectedTopic.topicId)} // Force remount when token or topic changes
        serverUrl={getLiveKitServerUrl()}
        token={token}
        connect={!!token && !!selectedTopic}
        video={false}
        audio={true}
        onDisconnected={handleDisconnect}
        onError={(error) => {
          console.error('LiveKit connection error:', error);
          // Don't call onDisconnect on connection errors to avoid recursive calls
        }}
        className="h-[calc(100%-5rem)]"
      >
        <RoomAudioRenderer />
        <VoiceAssistant 
          selectedTopic={selectedTopic} 
          onStartCall={onStartCall} 
          isConnecting={false} 
          isConnected={true} 
        />
      </LiveKitRoom>
    </div>
  );
} 