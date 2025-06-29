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
  return (
    <div className="h-full">
      <SessionHeader
        selectedTopic={selectedTopic}
        userName={userName}
        onToggleFullScreen={onToggleFullScreen}
        onDisconnect={onDisconnect}
      />
      
      <LiveKitRoom
        key={generateRoomKey(token, selectedTopic.topicId)} // Force remount when token or topic changes
        serverUrl={getLiveKitServerUrl()}
        token={token}
        connect={!!token && !!selectedTopic}
        video={false}
        audio={true}
        onDisconnected={onDisconnect}
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