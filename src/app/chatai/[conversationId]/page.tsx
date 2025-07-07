'use client';

import React from 'react';
import { 
  ChatHeader,
  ChatBackground,
} from '@/modules/chatai/components/layout';
import { 
  ChatMessages,
  ChatEndConversation,
} from '@/modules/chatai/components/messages';
import { 
  SettingsPanel,
} from '@/modules/chatai/components/settings';
import { 
  LoadingOverlay,
  ErrorState,
} from '@/modules/chatai/components/ui';
import { 
  NewChatInput
} from '@/modules/chatai/components/input';
import { useChatPage } from '@/modules/chatai/hooks';

interface ChatPageProps {
  params: Promise<{ conversationId: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const resolvedParams = React.use(params);
  const conversationId = resolvedParams.conversationId;
  
  const {
    topicDetail,
    loading,
    error,
    showSettings,
    isEndConversation,
    messages,
    imageBackground,
    handleBack,
    handleSettingsToggle,
    setShowSettings,
  } = useChatPage({ conversationId });

  // Loading state
  if (loading) {
    return <LoadingOverlay message="Initializing conversation..." />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onBack={handleBack} />;
  }

  return (
    <div className="h-screen w-full relative flex flex-col overflow-hidden">
      {/* Background Image - Absolute */}
      <ChatBackground imageBackground={imageBackground} />

      {/* Header - Fixed height */}
      <ChatHeader
        topicDetail={topicDetail}
        onBack={handleBack}
        onSettingsToggle={handleSettingsToggle}
        showSettings={showSettings}
      />

      {/* Messages Container - Flex-1 to take remaining space */}
      <ChatMessages messages={messages} />
      
      {/* End of conversation message */}
      <ChatEndConversation 
        isEndConversation={isEndConversation} 
        onBack={handleBack} 
      />

      {/* Chat Input - Fixed height */}
      {!isEndConversation && <NewChatInput />}

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
} 