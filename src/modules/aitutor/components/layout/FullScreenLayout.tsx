'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import NoSSR from '@/shared/components/common/NoSSR';
import { PhoneChatPanel } from '../voice/PhoneChatPanel';
import { VoiceAssistant } from '../voice/VoiceAssistant';
import { SelectedTopic } from '../../types';

interface FullScreenLayoutProps {
  selectedTopic: SelectedTopic;
  userName: string;
  token: string;
  onMinimize: () => void;
  onEndSession: () => void;
}

export const FullScreenLayout: React.FC<FullScreenLayoutProps> = ({
  selectedTopic,
  userName,
  token,
  onMinimize,
  onEndSession
}) => {
  return (
    <NoSSR>
      <div className="fixed inset-0 bg-background-primary z-50 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-screen flex items-start justify-start p-6"
        >
          {/* Phone-Style Chat Panel */}
          <PhoneChatPanel
            selectedTopic={selectedTopic}
            userName={userName}
            onMinimize={onMinimize}
            onEndSession={onEndSession}
          >
            <LiveKitRoom
              key={`${token}-${selectedTopic.topicId}`} // Force remount when token or topic changes
              serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://localhost:7880'}
              token={token}
              connect={!!token}
              video={false}
              audio={true}
              onDisconnected={onEndSession}
              className="flex-1"
            >
              <RoomAudioRenderer />
              <VoiceAssistant 
                selectedTopic={selectedTopic} 
                onStartCall={() => {}} 
                isConnecting={false} 
                isConnected={true}
                isFullScreenMode={true}
              />
            </LiveKitRoom>
          </PhoneChatPanel>
        </motion.div>
      </div>
    </NoSSR>
  );
};

export default FullScreenLayout; 