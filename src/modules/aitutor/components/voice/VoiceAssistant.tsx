'use client';

import React, { useState } from 'react';
import { useVoiceAssistant } from "@livekit/components-react";
import { AnimatePresence } from "framer-motion";
import { AgentTile } from './AgentTile';
import { ChatMessageView } from './ChatMessageView';
import { ChatEntry } from './ChatEntry';
import { ChatEmptyState } from './ChatEmptyState';
import { ControlBar } from './ControlBar';
import { ConnectingState } from '../voice/ConnectingState';
import { useChatAndTranscription } from '@/modules/aitutor/hooks/useChatAndTranscription';
import { VoiceAssistantProps } from '../../types';

// Call Interface Component (when connected to LiveKit)
function CallInterface({ selectedTopic }: { selectedTopic: VoiceAssistantProps['selectedTopic'] }) {
  const { state, audioTrack } = useVoiceAssistant();
  const { messages, send, isSending } = useChatAndTranscription();
  const [chatOpen, setChatOpen] = useState(false);

  const handleSendMessage = async (message: string) => {
    try {
      await send(message);
      console.log('🔍 CallInterface - Message sent:', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* Compact Voice Visualizer */}
      <div className="h-24 flex items-center justify-center border-b border-gray-700">
        {audioTrack && (
          <AgentTile
            state={state}
            audioTrack={audioTrack}
            size={80}
            className=""
          />
        )}
      </div>

      {/* Chat Messages Area - with proper height constraint */}
      <div className="flex-1 flex flex-col min-h-0">
        <ChatMessageView 
          className="flex-1 px-4 py-2 max-h-[calc(100vh-280px)]"
          chatOpen={chatOpen}
        >
          {messages.length === 0 ? (
            <ChatEmptyState selectedTopic={selectedTopic} variant="compact" />
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatEntry 
                  key={msg.id} 
                  message={msg}
                  variant="compact"
                />
              ))}
            </AnimatePresence>
          )}
        </ChatMessageView>
      </div>

      {/* Control Bar with integrated chat input */}
      <div className="bg-gray-800 border-t border-gray-700">
        <ControlBar
          chatOpen={chatOpen}
          onChatToggle={() => setChatOpen(!chatOpen)}
          onSendMessage={handleSendMessage}
          disabled={isSending}
          variant="compact"
        />
      </div>
    </div>
  );
}

export function VoiceAssistant({ 
  selectedTopic, 
  onStartCall, 
  onDeclineCall, 
  isConnecting = false,
  isConnected = false
}: VoiceAssistantProps) {
  // Cleanup effect to prevent memory leaks
  React.useEffect(() => {
    return () => {
      console.log('🧹 VoiceAssistant component unmounting - cleaning up');
    };
  }, []);

  // If we're connected (inside LiveKitRoom), show the call interface
  if (isConnected) {
    console.log('✅ Connected to agent - showing call interface');
    return <CallInterface selectedTopic={selectedTopic} />;
  }

  // Show connecting state when connecting
  if (isConnecting) {
    console.log('🔄 Showing connecting screen');
    return <ConnectingState selectedTopic={selectedTopic} />;
  }

  // Show phone call screen when topic is selected but not connected
  if (selectedTopic) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-40 h-40 bg-primary-green rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center p-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-green rounded-full"></div>
            <span>AI English Tutor</span>
          </div>
          <div className="flex items-center gap-1">
            <span>●●●●●</span>
            <span className="ml-2">📶</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Incoming Call Label */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">AI English Tutor</h2>
            <p className="text-primary-green text-lg font-medium">
              {selectedTopic.topicName}
            </p>
          </div>

          {/* Avatar with Pulsing Ring */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-primary-green rounded-full blur-md animate-pulse opacity-30" 
                 style={{ transform: 'scale(1.5)' }} />
            <div className="relative w-32 h-32 bg-gradient-to-br from-primary-green to-green-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-5xl">🤖</span>
            </div>
          </div>

          {/* Topic Details */}
          <div className="text-center mb-8 max-w-md">
            <h3 className="text-xl font-semibold text-white mb-3">Ready to Practice?</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {selectedTopic.description}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>📚 {selectedTopic.categoryName}</span>
              <span>•</span>
              <span>🎯 {selectedTopic.tasks.length} tasks</span>
            </div>
          </div>

          {/* Ringing Animation */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 text-primary-green animate-pulse">
              <span className="text-2xl">📞</span>
              <span className="text-lg font-medium">Ringing...</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 relative z-10">
          <div className="flex items-center justify-center gap-12">
            {/* Decline Button */}
            <button
              onClick={() => {
                console.log('❌ Decline button clicked!');
                if (onDeclineCall) onDeclineCall();
              }}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95"
              style={{ touchAction: 'manipulation' }}
            >
              <span className="text-2xl text-white pointer-events-none">📞</span>
            </button>

            {/* Accept Button */}
            <button
              onClick={() => {
    console.log('🎯 Accept button clicked!');
    if (onStartCall) {
      console.log('🚀 Calling onStartCall...');
      onStartCall();
    } else {
      console.log('❌ onStartCall is not provided');
    }
              }}
              className="w-20 h-20 bg-primary-green hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95"
              style={{ touchAction: 'manipulation' }}
            >
              <span className="text-3xl text-white pointer-events-none">📞</span>
            </button>
          </div>

          {/* Action Labels */}
          <div className="flex items-center justify-center gap-12 mt-4">
            <span className="text-red-400 text-sm">Decline</span>
            <span className="text-primary-green text-sm font-medium">Accept</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - no topic selected
  return null;
}

export default VoiceAssistant; 