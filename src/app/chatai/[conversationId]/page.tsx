'use client';

import React from 'react';
import { 
  ChatHeader,
  ChatBackground,
  RightSidebar,
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
// TaskChecklistPanel is now included in RightSidebar
import { useChatPage, useTasks } from '@/modules/chatai/hooks';
import { SpeechToTextProvider, useSpeechToTextContext } from '@/modules/chatai/contexts/SpeechToTextContext';

interface ChatPageProps {
  params: Promise<{ conversationId: string }>;
}

function ChatPageContent({ conversationId }: { conversationId: string }) {
  const {
    topicDetail,
    loading,
    error,
    showSettings,
    isEndConversation,
    messages,
    imageBackground,
    handleBack,
    handleEndConversation,
    handleSettingsToggle,
    setShowSettings,
  } = useChatPage({ conversationId });

  // Task management
  const {
    taskCategories,
    isCheckingTasks,
    checkTaskCompletion,
  } = useTasks(topicDetail);

  // Speech-to-text tracking
  const { isSpeechToTextMessage } = useSpeechToTextContext();

  // Integrate task checking with chat messages (only for speech-to-text)
  React.useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    
    // Only check tasks for user messages that came from speech-to-text
    if (lastMessage && lastMessage.isUserMessage && topicDetail) {
      const messageContent = lastMessage.content.original;
      
      if (isSpeechToTextMessage(messageContent)) {
        console.log('🎯 Checking task completion for speech-to-text message:', messageContent);
        
        // Trigger task completion check
        checkTaskCompletion(messages, messageContent).catch(error => {
          console.error('Failed to check task completion:', error);
        });
      } else {
        console.log('⏭️ Skipping task check for text input message:', messageContent);
      }
    }
  }, [messages, topicDetail, isSpeechToTextMessage, checkTaskCompletion]);

  // Loading state
  if (loading) {
    return <LoadingOverlay message="Initializing conversation..." />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onBack={handleBack} />;
  }

  return (
    <div className="h-screen w-full relative flex overflow-hidden">
      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Background Image - Absolute */}
        <ChatBackground imageBackground={imageBackground} />

        {/* Header - Fixed height */}
        <ChatHeader
          topicDetail={topicDetail}
          onBack={handleBack}
          onEndConversation={handleEndConversation}
          imageBackground={imageBackground ?? undefined}
          showSettings={showSettings}
          onSettingsToggle={handleSettingsToggle}
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

      {/* Right Sidebar with Task Checklist and Speaking Helper */}
      <RightSidebar 
        taskCategories={taskCategories}
        isCheckingTasks={isCheckingTasks}
        topicDetail={topicDetail}
      />
    </div>
  );
}

export default function ChatPage({ params }: ChatPageProps) {
  const resolvedParams = React.use(params);
  const conversationId = resolvedParams.conversationId;
  
  return (
    <SpeechToTextProvider>
      <ChatPageContent conversationId={conversationId} />
    </SpeechToTextProvider>
  );
} 