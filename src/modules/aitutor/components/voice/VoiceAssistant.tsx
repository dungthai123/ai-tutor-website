'use client';

import React, { useState, useRef } from 'react';
import {
  useVoiceAssistant,
  VoiceAssistantControlBar,
  type ReceivedChatMessage,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { AgentTile } from './AgentTile';
import { ChatMessageView } from './ChatMessageView';
import { useChatAndTranscription } from '@/modules/aitutor/hooks/useChatAndTranscription';
import { cn } from '@/utils/helpers';
import { SelectedTopic } from '../../types';

interface VoiceAssistantProps {
  selectedTopic: SelectedTopic;
  onStartCall?: () => void;
  onDeclineCall?: () => void;
  isConnecting?: boolean;
  isConnected?: boolean;
  isFullScreenMode?: boolean; // New prop for full-screen mode
}

// Chat Input Component for Full-Screen Mode
const FullScreenChatInput = ({ onSend, disabled }: { onSend: (message: string) => void; disabled?: boolean }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const isDisabled = disabled || message.trim().length === 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-2xl bg-gray-800 px-4 py-3 border border-gray-600"
    >
      <input
        ref={inputRef}
        type="text"
        className="flex-1 focus:outline-none placeholder-gray-400 bg-transparent text-white text-sm"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={isDisabled}
        className={cn(
          'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
          isDisabled 
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
            : 'bg-accent-primary text-text-primary hover:opacity-80'
        )}
      >
        Send
      </button>
    </form>
  );
};

// Chat Entry Component for Full-Screen Mode
const FullScreenChatEntry = ({ message }: { message: ReceivedChatMessage }) => {
  const time = new Date(message.timestamp);
  const isUser = message.from?.isLocal ?? false;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('flex mb-4', isUser ? 'justify-end' : 'justify-start')}
    >
      <div className="flex flex-col gap-1 max-w-[85%]">
        <div className="flex items-center gap-2 px-2">
          <span className="text-sm font-medium text-gray-300">
            {isUser ? '👤 You' : '🤖 AI Tutor'}
          </span>
          <span className="text-xs text-gray-500">
            {time.toLocaleTimeString([], { timeStyle: 'short' })}
          </span>
        </div>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm shadow-lg',
            isUser
              ? 'bg-accent-primary text-text-primary ml-auto'
              : 'bg-gray-700 text-white mr-auto border border-gray-600'
          )}
        >
          {message.message}
        </div>
      </div>
    </motion.div>
  );
};

// Full-Screen Voice Assistant Component (inside LiveKit Room)
const FullScreenVoiceAssistant: React.FC<{
  selectedTopic: SelectedTopic;
}> = ({ selectedTopic }) => {
  // These hooks are safe here because this component is only rendered inside LiveKitRoom
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
      <div className="h-32 flex items-center justify-center border-b border-gray-700">
        {audioTrack && (
          <AgentTile
            state={state}
            audioTrack={audioTrack}
            size={120}
            className=""
          />
        )}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col min-h-0 px-4">
        <div className="flex-1 overflow-y-auto py-4">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center py-8"
            >
              <div className="text-4xl mb-4">🎤</div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Ready to practice!
              </h4>
              <p className="text-gray-300 text-sm max-w-xs mx-auto">
                Start speaking or type a message to begin your conversation.
              </p>
              
              {/* Quick Start Tasks */}
              <div className="mt-6 space-y-2">
                <h5 className="text-white font-medium text-sm mb-3">Quick Start:</h5>
                {selectedTopic.tasks.slice(0, 2).map((task, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                    <span className="w-2 h-2 bg-accent-primary rounded-full"></span>
                    <span className="max-w-[250px] truncate">{task}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <FullScreenChatEntry 
                  key={msg.id} 
                  message={msg}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Chat Input Area */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-2"
          >
            <FullScreenChatInput onSend={handleSendMessage} disabled={isSending} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bar */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-between gap-4">
          {/* Chat Toggle */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={cn(
              'p-3 rounded-xl transition-all duration-200',
              chatOpen 
                ? 'bg-accent-primary text-text-primary' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            )}
            aria-label="Toggle chat"
          >
            <span className="text-lg">💬</span>
          </button>

          {/* Voice Assistant Control Bar */}
          <div className="flex-1 max-w-sm">
            <VoiceAssistantControlBar />
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-success rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-300">Connected</span>
          </div>
        </div>


      </div>
    </div>
  );
};

// Chat Input Component (Original)
const ChatInput = ({ onSend, disabled }: { onSend: (message: string) => void; disabled?: boolean }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const isDisabled = disabled || message.trim().length === 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-4 rounded-2xl bg-gray-700 px-6 py-4 text-base shadow-lg"
    >
      <input
        ref={inputRef}
        type="text"
        className="flex-1 focus:outline-none placeholder-gray-300 bg-transparent text-white text-xl font-medium"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={isDisabled}
        className={cn(
          'px-8 py-3 rounded-2xl text-base font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105',
          isDisabled 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-primary-green to-green-500 text-white hover:shadow-lg'
        )}
      >
        Send
      </button>
    </form>
  );
};

// Chat Entry Component
const ChatEntry = ({ message }: { message: ReceivedChatMessage }) => {
  const time = new Date(message.timestamp);
  const isUser = message.from?.isLocal ?? false;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('flex group', isUser ? 'justify-end' : 'justify-start')}
    >
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div className="flex items-center gap-3 px-3">
          <span className="text-xl font-bold text-white drop-shadow-lg">
            {isUser ? '👤 You' : '🤖 AI Tutor'}
          </span>
          <span className="text-base text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
            {time.toLocaleTimeString([], { timeStyle: 'short' })}
          </span>
        </div>
        <div
          className={cn(
            'rounded-[20px] px-8 py-5 text-xl font-semibold shadow-2xl',
            isUser
              ? 'bg-gradient-to-r from-primary-green to-green-500 text-white ml-auto'
              : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white mr-auto'
          )}
        >
          {message.message}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Control Bar Component
const EnhancedControlBar = ({ 
  chatOpen, 
  onChatToggle, 
  onSendMessage, 
  disabled 
}: {
  chatOpen: boolean;
  onChatToggle: () => void;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}) => {
  return (
    <div>
      {/* Chat Input - Collapsible */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5">
              <ChatInput onSend={onSendMessage} disabled={disabled} />
            </div>
            <hr className="border-gray-600 mb-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Chat Toggle */}
          <button
            onClick={onChatToggle}
            className={cn(
              'p-4 rounded-2xl transition-all duration-300 transform hover:scale-105',
              chatOpen 
                ? 'bg-gradient-to-r from-primary-green to-green-500 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            )}
            aria-label="Toggle chat"
          >
            <span className="text-xl">💬</span>
          </button>
        </div>

        {/* Voice Assistant Control Bar - Clean without extra borders */}
        <div className="flex-1 max-w-md">
          <VoiceAssistantControlBar />
        </div>
      </div>
    </div>
  );
};

// Phone Call Confirmation Screen Component
const PhoneCallScreen: React.FC<{
  selectedTopic: SelectedTopic;
  onAccept: () => void;
  onDecline: () => void;
}> = ({ selectedTopic, onAccept, onDecline }) => {
  const [isRinging, setIsRinging] = useState(true);

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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-gray-300 text-lg mb-2">Incoming Practice Session</p>
          <h2 className="text-3xl font-bold text-white mb-2">AI English Tutor</h2>
          <p className="text-primary-green text-lg font-medium">
            {selectedTopic.topicName}
          </p>
        </motion.div>

        {/* Avatar with Pulsing Ring */}
        <div className="relative mb-12">
          <motion.div
            animate={isRinging ? {
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-primary-green rounded-full blur-md"
            style={{ transform: 'scale(1.5)' }}
          />
          <div className="relative w-32 h-32 bg-gradient-to-br from-primary-green to-green-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-5xl">🤖</span>
          </div>
        </div>

        {/* Topic Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8 max-w-md"
        >
          <h3 className="text-xl font-semibold text-white mb-3">Ready to Practice?</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {selectedTopic.description}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>📚 {selectedTopic.categoryName}</span>
            <span>•</span>
            <span>🎯 {selectedTopic.tasks.length} tasks</span>
          </div>
        </motion.div>

        {/* Ringing Animation */}
        {isRinging && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 text-primary-green">
              <span className="text-2xl">📞</span>
              <span className="text-lg font-medium">Ringing...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-8 relative z-10">
        <div className="flex items-center justify-center gap-12">
          {/* Decline Button */}
          <button
            onClick={() => {
              console.log('📞 Decline button in PhoneCallScreen clicked');
              onDecline();
            }}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer relative z-20"
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-2xl text-white pointer-events-none">📞</span>
          </button>

          {/* Accept Button */}
          <button
            onClick={() => {
              console.log('📞 Accept button in PhoneCallScreen clicked');
              setIsRinging(false);
              setTimeout(() => {
                console.log('📞 Calling onAccept after timeout');
                onAccept();
              }, 500);
            }}
            className="w-20 h-20 bg-primary-green hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer relative z-20"
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
};

// Connected Voice Assistant (inside LiveKit Room)
const ConnectedVoiceAssistant: React.FC<{
  selectedTopic: SelectedTopic;
}> = ({ selectedTopic }) => {
  const { state, audioTrack } = useVoiceAssistant();
  const { messages, send, isSending } = useChatAndTranscription();
  const [chatOpen, setChatOpen] = useState(false);

  // Add logging to debug messages in component
  React.useEffect(() => {
    console.log('🔍 ConnectedVoiceAssistant - Messages changed:', messages.length);
    console.log('🔍 ConnectedVoiceAssistant - Raw messages:', JSON.stringify(messages, null, 2));
    
    // Log each message individually
    messages.forEach((msg, index) => {
      console.log(`🔍 Message #${index}:`, {
        id: msg.id,
        message: msg.message,
        timestamp: msg.timestamp,
        from: msg.from,
        isLocal: msg.from?.isLocal
      });
      
      if (!msg.from?.isLocal) {
        console.log(`🤖 AGENT MESSAGE #${index}:`, JSON.stringify(msg, null, 2));
      }
    });
  }, [messages]);

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
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center py-12 flex-shrink-0"
            >
              <div className="text-9xl mb-8">🎤</div>
              <h4 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
                Ready to practice!
              </h4>
              <p className="text-white max-w-lg mx-auto text-xl font-medium drop-shadow-md">
                Start speaking or type a message to begin your English conversation practice with AI tutor.
              </p>
              <div className="mt-10 p-8 bg-gray-800 rounded-xl max-w-lg mx-auto border border-gray-700">
                <h5 className="font-bold text-white mb-4 text-xl">Practice Tasks:</h5>
                <div className="space-y-4">
                  {selectedTopic.tasks.slice(0, 3).map((task, index) => (
                    <div key={index} className="flex items-start gap-4 text-lg text-white">
                      <span className="w-3 h-3 bg-primary-green rounded-full mt-2 flex-shrink-0"></span>
                      <span className="font-medium">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
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
        <EnhancedControlBar
          chatOpen={chatOpen}
          onChatToggle={handleChatToggle}
          onSendMessage={handleSendMessage}
          disabled={isSending}
        />


      </div>
    </div>
  );
};

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ 
  selectedTopic, 
  onStartCall, 
  onDeclineCall, 
  isConnecting = false,
  isConnected = false,
  isFullScreenMode = false
}) => {
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
      // Cleanup any pending timeouts or connections
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

  // Full-screen mode rendering (only when connected)
  if (isFullScreenMode && isConnected) {
    return <FullScreenVoiceAssistant selectedTopic={selectedTopic} />;
  }

  // Fallback - should not reach here normally
  console.log('🔄 Fallback - showing connected voice assistant');
  return <ConnectedVoiceAssistant selectedTopic={selectedTopic} />;
};

export default VoiceAssistant; 