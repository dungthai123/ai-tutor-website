'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useChatStore } from '../storage/chat-store';
import { useSettingsStore } from '../storage/settings-store';
import { chatApiService } from '../../services';
import { ChatMessage, TopicDetail, JiebaCollection } from '../../types';
import { chatUtils, storageUtils } from '../../utils';

export function useChat() {
  const chatStore = useChatStore();
  const settingsStore = useSettingsStore();
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
        chatStore.setAwaitingResponse(true);

        const response = await chatApiService.initialMessage({
          conversationId,
          topicId: topicDetail.topicId,
          chatSessionId: newChatSessionId,
        });

        if (response.success && response.data) {
          console.log('🤖 Bot message created:', response.data);
          console.log('🔍 Response data type:', typeof response.data);
          
          // Handle nested response structure from backend
          const messageData = (response.data as { data?: JiebaCollection } & JiebaCollection).data || response.data;
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
          
          // Handle nested response structure from backend
          const messageData = (response.data as { data?: JiebaCollection } & JiebaCollection).data || response.data;
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
        console.error('💥 sendMessage error:', error);
        const errorMessage: ChatMessage = {
          id: Date.now() + 1,
          content: {
            original: 'Sorry, I encountered an error. Please try again.',
            segments: [],
          },
          isUserMessage: false,
          timestamp: Date.now(),
        };
        chatStore.addMessage(errorMessage);
      } finally {
        chatStore.setAwaitingResponse(false);
      }
    },
    [chatStore.addMessage, chatStore.setAwaitingResponse, chatStore.chatSessionId, chatStore.conversationId, chatStore.topicDetail, chatStore.setEndConversation]
  );

  // Get hint
  const getHint = useCallback(async () => {
    if (!chatStore.topicDetail) return;

    chatStore.toggleHint();
    chatStore.setHintMessage(null);

    const lastMessage = chatStore.messages[chatStore.messages.length - 1];
    const lastMessageText = lastMessage?.content.original || '';

    try {
      const response = await chatApiService.getHint({
        conversationId: chatStore.conversationId,
        topicId: chatStore.topicDetail.topicId,
        chatSessionId: chatStore.chatSessionId,
        message: lastMessageText,
      });

      if (response.success && response.data) {
        chatStore.setHintMessage(response.data);
      }
    } catch (error) {
      console.error('Failed to get hint:', error);
    }
  }, [chatStore.topicDetail, chatStore.toggleHint, chatStore.setHintMessage, chatStore.messages, chatStore.conversationId, chatStore.chatSessionId]);

  // Submit hint as message
  const submitHint = useCallback(() => {
    console.log('🎯 submitHint called');
    console.log('🔍 Current hint message:', chatStore.hintMessage);
    
    if (chatStore.hintMessage) {
      const hintText = chatStore.hintMessage.original;
      console.log('💡 Submitting hint as message:', hintText);
      
      sendMessage(hintText);
      chatStore.toggleHint();
      chatStore.setHintMessage(null);
    } else {
      console.warn('⚠️ No hint message available to submit');
    }
  }, [chatStore.hintMessage, sendMessage, chatStore.toggleHint, chatStore.setHintMessage]);

  // Translate message
  const translateMessage = useCallback(
    async (messageId: number) => {
      const message = chatStore.messages.find((m) => m.id === messageId);
      if (!message) return;

      chatStore.setLoadingState('isTranslating', messageId, true);

      try {
        const response = await chatApiService.translateText(
          message.content.original,
          settingsStore.language
        );

        if (response.success && response.data) {
          chatStore.updateMessage(messageId, {
            translate: response.data.translatedText,
          });
          chatStore.setShowTranslatedText(messageId, true);
        }
      } catch (error) {
        console.error('Failed to translate message:', error);
      } finally {
        chatStore.setLoadingState('isTranslating', messageId, false);
      }
    },
    [chatStore, settingsStore.language]
  );

  // Improve message
  const improveMessage = useCallback(
    async (messageId: number) => {
      const message = chatStore.messages.find((m) => m.id === messageId);
      if (!message || !message.isUserMessage) return;

      const messageIndex = chatStore.messages.findIndex(
        (m) => m.id === messageId
      );
      const previousMessage =
        messageIndex > 0 ? chatStore.messages[messageIndex - 1] : null;

      if (!previousMessage) return;

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
        console.error('Failed to improve message:', error);
      } finally {
        chatStore.setLoadingState('isImproving', messageId, false);
      }
    },
    [chatStore]
  );

  // Get conversation feedback
  const getConversationFeedback = useCallback(async () => {
    if (!chatStore.topicDetail) return null;

    chatStore.setGeneratingFeedback(true);

    try {
      const response = await chatApiService.getFeedback({
        conversationId: chatStore.conversationId,
        topicId: chatStore.topicDetail.topicId,
        chatSessionId: chatStore.chatSessionId,
      });

      if (response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error('Failed to get conversation feedback:', error);
    } finally {
      chatStore.setGeneratingFeedback(false);
    }

    return null;
  }, [chatStore]);

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