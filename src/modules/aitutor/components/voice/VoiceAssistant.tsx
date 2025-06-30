'use client';

import React, { useState } from 'react';
import { useVoiceAssistant } from "@livekit/components-react";
import { AnimatePresence } from "framer-motion";
import { AgentTile } from './AgentTile';
import { ChatMessageView } from './ChatMessageView';
import { ChatEntry } from './ChatEntry';
import { PhoneCallScreen } from '../voice/PhoneCallScreen';
import { ChatEmptyState } from './ChatEmptyState';
import { ControlBar } from './ControlBar';
import { ConnectingState } from '../voice/ConnectingState';
import { useChatAndTranscription } from '@/modules/aitutor/hooks/useChatAndTranscription';
import { VoiceAssistantProps } from '../../types';

// Full-Screen Voice Assistant Component (inside LiveKit Room)
function FullScreenVoiceAssistant({ selectedTopic }: { selectedTopic: VoiceAssistantProps['selectedTopic'] }) {
  const { state, audioTrack } = useVoiceAssistant();
  const { messages, send, isSending } = useChatAndTranscription();
  const [chatOpen, setChatOpen] = useState(false);

  const handleSendMessage = async (message: string) => {
    try {
      await send(message);
      console.log('🔍 FullScreenVoiceAssistant - Message sent:', message);
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

// Connected Voice Assistant (inside LiveKit Room)
function ConnectedVoiceAssistant({ selectedTopic }: { selectedTopic: VoiceAssistantProps['selectedTopic'] }) {
  const { state, audioTrack } = useVoiceAssistant();
  const { messages, send, isSending } = useChatAndTranscription();
  const [chatOpen, setChatOpen] = useState(false);

  const handleSendMessage = async (message: string) => {
    try {
      console.log('🔍 ConnectedVoiceAssistant - Sending message:', message);
      await send(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Main SphereVisualizer - Center positioned, 1/3 height */}
      <div className="h-1/3 flex items-center justify-center">
        {audioTrack && (
          <AgentTile
            state={state}
            audioTrack={audioTrack}
            size={240}
            className=""
          />
        )}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ChatMessageView 
          className="flex-1 px-6 py-4 min-h-[400px] max-h-[600px]"
          chatOpen={chatOpen}
        >
          {messages.length === 0 ? (
            <ChatEmptyState selectedTopic={selectedTopic} />
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatEntry 
                  key={msg.id} 
                  message={msg}
                />
              ))}
            </AnimatePresence>
          )}
        </ChatMessageView>
      </div>

      {/* Enhanced Control Bar */}
      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <ControlBar
          chatOpen={chatOpen}
          onChatToggle={handleChatToggle}
          onSendMessage={handleSendMessage}
          disabled={isSending}
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
  isConnected = false,
  isFullScreenMode = false
}: VoiceAssistantProps) {
  const [showPhoneCall, setShowPhoneCall] = useState(true);
  const [callAccepted, setCallAccepted] = useState(false);

  // Reset phone call state when topic changes
  React.useEffect(() => {
    if (selectedTopic) {
      setShowPhoneCall(true);
      setCallAccepted(false);
    }
  }, [selectedTopic]);

  // Cleanup effect to prevent memory leaks
  React.useEffect(() => {
    return () => {
      console.log('🧹 VoiceAssistant component unmounting - cleaning up');
    };
  }, []);

  const handleAcceptCall = () => {
    console.log('🎯 Accept button clicked!');
    setCallAccepted(true);
    setShowPhoneCall(false);
    if (onStartCall) {
      console.log('🚀 Calling onStartCall...');
      onStartCall();
    } else {
      console.log('❌ onStartCall is not provided');
    }
  };

  const handleDeclineCall = () => {
    console.log('❌ Decline button clicked!');
    setShowPhoneCall(false);
    if (onDeclineCall) {
      console.log('🚀 Calling onDeclineCall...');
      onDeclineCall();
    } else {
      console.log('❌ onDeclineCall is not provided');
    }
  };

  // If we're connected (inside LiveKitRoom), always show the chat interface
  if (isConnected) {
    console.log('✅ Connected to agent - showing chat interface');
    
    // Full-screen mode rendering (only when connected)
    if (isFullScreenMode) {
      return <FullScreenVoiceAssistant selectedTopic={selectedTopic} />;
    }
    
    return <ConnectedVoiceAssistant selectedTopic={selectedTopic} />;
  }

  // Show phone call screen first (when not connected)
  if (showPhoneCall && !callAccepted) {
    console.log('📞 Showing phone call screen');
    return (
      <PhoneCallScreen
        selectedTopic={selectedTopic}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />
    );
  }

  // Show connecting state after call accepted but before token is ready
  if (callAccepted && isConnecting) {
    console.log('🔄 Showing connecting screen');
    return <ConnectingState selectedTopic={selectedTopic} />;
  }

  // Fallback - should not reach here normally
  console.log('🔄 Fallback - showing connected voice assistant');
  return <ConnectedVoiceAssistant selectedTopic={selectedTopic} />;
}

export default VoiceAssistant; 