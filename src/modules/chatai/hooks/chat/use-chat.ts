'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useChatStore } from '../storage/chat-store';
import { chatApiService } from '../../services';
import { ChatMessage, TopicDetail } from '../../types';
import { chatUtils, storageUtils } from '../../utils';

export function useChat() {
  const chatStore = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const mainChat = useRef(true);
  
  // Initialize conversation
  const initializeConversation = useCallback(
    async (conversationId: string, topicDetail: TopicDetail) => {
      try {
        // Generate a new chat session ID for this conversation
        const newChatSessionId = storageUtils.generateChatSessionId();
        console.log('🆔 Generated new chat session ID:', newChatSessionId);
        
        chatStore.setConversationId(conversationId);
        chatStore.setTopicDetail(topicDetail);
        chatStore.setChatSessionId(newChatSessionId);
        chatStore.clearMessages();
        chatStore.setEndConversation(false);
        chatStore.setAwaitingResponse(true);

        const response = await chatApiService.initialMessage({
          conversationId,
          topicId: topicDetail.topicId,
          chatSessionId: newChatSessionId,
        });

        if (response.success && response.data) {
          console.log('🤖 Bot message created:', response.data);
          console.log('🔍 Response data type:', typeof response.data);
          
          // Transform API response to proper JiebaCollection format
          const messageData = chatUtils.transformApiResponseToJiebaCollection(response.data);
          console.log('🔍 Message data:', messageData);
          console.log('🔍 Message data original:', messageData.original);
          console.log('🔍 Message data original type:', typeof messageData.original);
          
          // Validate the response data structure
          if (!messageData.original || typeof messageData.original !== 'string') {
            console.error('❌ Invalid API response - missing original text:', messageData);
            console.error('❌ Full response object:', JSON.stringify(response, null, 2));
            throw new Error('Invalid API response structure');
          }
          
          const botMessage: ChatMessage = {
            id: chatUtils.generateMessageId(),
            content: messageData,
            isUserMessage: false,
            timestamp: Date.now(),
          };

          console.log('✅ Bot message structure validated:', botMessage);
          chatStore.addMessage(botMessage);

          // Check for conversation end - ensure we have valid content
          if (messageData?.original) {
            if (chatUtils.isEndConversation(messageData.original)) {
              chatStore.setEndConversation(true);
            }
          }
        } else {
          throw new Error(response.error || 'Failed to initialize conversation');
        }
      } catch (error) {
        console.error('Failed to initialize conversation:', error);
        throw error;
      } finally {
        chatStore.setAwaitingResponse(false);
      }
    },
    [chatStore.setConversationId, chatStore.setTopicDetail, chatStore.setChatSessionId, chatStore.clearMessages, chatStore.setAwaitingResponse, chatStore.addMessage, chatStore.setEndConversation]
  );

  // Send message
  const sendMessage = useCallback(
    async (text: string, audioPath?: string) => {
      console.log('🚀 sendMessage called with:', { text, audioPath, textType: typeof text });
      
      if (!text || typeof text !== 'string' || !text.trim()) {
        console.warn('❌ Invalid text parameter:', { text, textType: typeof text });
        return;
      }

      console.log('📝 Sending message:', text.substring(0, 100) + '...');
      
      const timestamp = Date.now();
      const userMessage: ChatMessage = {
        id: timestamp,
        content: {
          original: text,
          segments: [],
        },
        isUserMessage: true,
        timestamp,
        pathRecord: audioPath,
      };

      console.log('👤 User message created:', userMessage);

      // Add user message to store
      chatStore.addMessage(userMessage);
      chatStore.setAwaitingResponse(true);

      try {
        console.log('🔄 Calling chatApiService.sendMessage...');
        const response = await chatApiService.sendMessage({
          chatSessionId: chatStore.chatSessionId,
          message: text,
          conversationId: chatStore.conversationId,
          topicId: chatStore.topicDetail?.topicId || 0,
        });

        console.log('📨 API Response received:', response);

        if (response.success && response.data) {
          console.log('✅ Processing successful response:', response.data);
          console.log('🔍 Response data type:', typeof response.data);
          
          // Transform API response to proper JiebaCollection format
          const messageData = chatUtils.transformApiResponseToJiebaCollection(response.data);
          console.log('🔍 Message data:', messageData);
          console.log('🔍 Message data original:', messageData.original);
          console.log('🔍 Message data original type:', typeof messageData.original);
          
          // Validate the response data structure
          if (!messageData.original || typeof messageData.original !== 'string') {
            console.error('❌ Invalid API response - missing original text:', messageData);
            console.error('❌ Full response object:', JSON.stringify(response, null, 2));
            throw new Error('Invalid API response structure');
          }
          
          const botMessage: ChatMessage = {
            id: Date.now() + 1,
            content: messageData,
            isUserMessage: false,
            timestamp: Date.now(),
          };

          console.log('🤖 Bot message created:', botMessage);
          chatStore.addMessage(botMessage);

          // Check for conversation end - ensure we have valid content
          if (messageData?.original) {
            if (chatUtils.isEndConversation(messageData.original)) {
              chatStore.setEndConversation(true);
            }
          }
        } else {
          console.error('❌ API Error:', response.error);
          throw new Error(response.error || 'Failed to send message');
        }
      } catch (error) {
        console.error('❌ Error in sendMessage:', error);
        throw error;
      } finally {
        chatStore.setAwaitingResponse(false);
      }
    },
    [
      chatStore.addMessage,
      chatStore.setAwaitingResponse,
      chatStore.setEndConversation,
      chatStore.chatSessionId,
      chatStore.conversationId,
      chatStore.topicDetail?.topicId,
    ]
  );

  // Get hint
  const getHint = useCallback(async () => {
    try {
      chatStore.toggleHint();
      
      // Get the last user message for context
      const lastMessage = chatStore.messages[chatStore.messages.length - 1];
      const lastMessageText = lastMessage?.content.original || '';
      
      const response = await chatApiService.getHint({
        conversationId: chatStore.conversationId,
        topicId: chatStore.topicDetail?.topicId || 0,
        chatSessionId: chatStore.chatSessionId,
        message: lastMessageText,
      });

      if (response.success && response.data) {
        console.log('💡 Hint API Response:', response);
        
        // Transform API response to proper JiebaCollection format
        const hintData = chatUtils.transformApiResponseToJiebaCollection(response.data);
        console.log('💡 Transformed hint data:', hintData);
        
        chatStore.setHintMessage(hintData);
      } else {
        console.error('❌ Hint API Error:', response.error);
        throw new Error(response.error || 'Failed to get hint');
      }
    } catch (error) {
      console.error('❌ Error getting hint:', error);
      throw error;
    }
  }, [
    chatStore.toggleHint,
    chatStore.setHintMessage,
    chatStore.messages,
    chatStore.conversationId,
    chatStore.topicDetail?.topicId,
    chatStore.chatSessionId,
  ]);

  // Submit hint
  const submitHint = useCallback(
    async () => {
      console.log('🔧 submitHint called');
      
      if (!chatStore.hintMessage) {
        console.warn('❌ No hint message available');
        return;
      }

      console.log('💡 Submitting hint message:', chatStore.hintMessage);
      
      // Extract the original text for submission
      const hintText = chatStore.hintMessage.original;
      console.log('📝 Hint text to submit:', hintText);
      
      if (!hintText || typeof hintText !== 'string') {
        console.error('❌ Invalid hint text:', { hintText, type: typeof hintText });
        return;
      }

      // Clear hint and submit as regular message
      chatStore.setHintMessage(null);
      chatStore.toggleHint();
      
      await sendMessage(hintText);
    },
    [chatStore.hintMessage, chatStore.setHintMessage, chatStore.toggleHint, sendMessage]
  );

  // Translate message
  const translateMessage = useCallback(
    async (messageId: number) => {
      const message = chatStore.messages.find((msg) => msg.id === messageId);
      if (!message || !message.content?.original) return;

      chatStore.setLoadingState('isTranslating', messageId, true);

      try {
        const response = await chatApiService.translateText(
          message.content.original,
          'vi' // Default to Vietnamese
        );

        if (response.success && response.data) {
          chatStore.updateMessage(messageId, {
            translate: response.data.translatedText,
          });
          chatStore.setShowTranslatedText(messageId, true);
        }
      } catch (error) {
        console.error('Translation error:', error);
      } finally {
        chatStore.setLoadingState('isTranslating', messageId, false);
      }
    },
    [chatStore.messages, chatStore.setLoadingState, chatStore.updateMessage, chatStore.setShowTranslatedText]
  );

  // Improve message
  const improveMessage = useCallback(
    async (messageId: number) => {
      const message = chatStore.messages.find((msg) => msg.id === messageId);
      if (!message || !message.content?.original || !message.isUserMessage) return;

      // Find the previous bot message (question)
      const messageIndex = chatStore.messages.findIndex((msg) => msg.id === messageId);
      const previousMessage = messageIndex > 0 ? chatStore.messages[messageIndex - 1] : null;
      
      if (!previousMessage || previousMessage.isUserMessage) return;

      chatStore.setLoadingState('isImproving', messageId, true);

      try {
        const response = await chatApiService.improveMessage({
          conversationId: chatStore.conversationId,
          topicId: chatStore.topicDetail?.topicId || 0,
          chatSessionId: chatStore.chatSessionId,
          question: previousMessage.content.original,
          answer: message.content.original,
        });

        if (response.success && response.data) {
          chatStore.updateMessage(messageId, {
            suggestContent: response.data,
          });
          chatStore.setShowImprovedText(messageId, true);
        }
      } catch (error) {
        console.error('Improvement error:', error);
      } finally {
        chatStore.setLoadingState('isImproving', messageId, false);
      }
    },
    [
      chatStore.messages,
      chatStore.setLoadingState,
      chatStore.updateMessage,
      chatStore.setShowImprovedText,
      chatStore.conversationId,
      chatStore.topicDetail?.topicId,
      chatStore.chatSessionId,
    ]
  );

  // Get conversation feedback
  const getConversationFeedback = useCallback(async () => {
    try {
      chatStore.setGeneratingFeedback(true);
      
      const response = await chatApiService.getFeedback({
        conversationId: chatStore.conversationId,
        topicId: chatStore.topicDetail?.topicId || 0,
        chatSessionId: chatStore.chatSessionId,
      });

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get feedback');
      }
    } catch (error) {
      console.error('Error getting conversation feedback:', error);
      throw error;
    } finally {
      chatStore.setGeneratingFeedback(false);
    }
  }, [
    chatStore.setGeneratingFeedback,
    chatStore.conversationId,
    chatStore.topicDetail?.topicId,
    chatStore.chatSessionId,
  ]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatStore.messages.length, scrollToBottom]);

  // Reset conversation
  const resetConversation = useCallback(() => {
    chatStore.clearMessages();
    chatStore.setConversationId('');
    chatStore.setTopicDetail(null as unknown as TopicDetail);
    chatStore.setEndConversation(false);
    chatStore.setGeneratingFeedback(false);
    chatStore.setHintMessage(null);
    chatStore.setChatSessionId('');
    mainChat.current = true;
  }, [chatStore]);

  return {
    // State
    messages: chatStore.messages,
    isAwaitingResponse: chatStore.isAwaitingResponse,
    isEndConversation: chatStore.isEndConversation,
    isShowKeyboard: chatStore.isShowKeyboard,
    isOpenHint: chatStore.isOpenHint,
    hintMessage: chatStore.hintMessage,
    conversationId: chatStore.conversationId,
    topicDetail: chatStore.topicDetail,
    isGeneratingFeedback: chatStore.isGeneratingFeedback,

    // Actions
    initializeConversation,
    sendMessage,
    getHint,
    submitHint,
    translateMessage,
    improveMessage,
    getConversationFeedback,
    resetConversation,
    scrollToBottom,

    // Refs
    scrollRef,
    chatSessionId: chatStore.chatSessionId,
  };
} 