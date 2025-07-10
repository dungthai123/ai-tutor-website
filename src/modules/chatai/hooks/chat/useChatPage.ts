import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChat, useChatStore } from '../index';
import { useChatStorage } from '../storage/use-chat-storage';
import { useTextToSpeech } from '../audio/use-text-to-speech';
import { useSettingsStore } from '../storage/settings-store';
import { chatApiService } from '../../services';
import { TopicDetail } from '@/modules/chatai/types';

interface UseChatPageProps {
  conversationId: string;
}

export function useChatPage({ conversationId }: UseChatPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [topicDetail, setTopicDetail] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);
  
  // Refs
  const initializingRef = useRef(false);
  const currentConversationRef = useRef<string>('');
  const playedMessagesRef = useRef<Set<string>>(new Set());
  
  // Hooks
  const { messages, isEndConversation, chatSessionId } = useChatStore();
  const { initializeConversation, resetConversation } = useChat();
  const { saveConversation } = useChatStorage();
  const { playTTS } = useTextToSpeech();
  const { isAutoPlayTTS } = useSettingsStore();
  
  // URL params
  const topicId = searchParams.get('topicId');
  const categoryId = searchParams.get('categoryId');
  const imageBackground = searchParams.get('imageBackground');
  
  // Reset state when route parameters change
  useEffect(() => {
    const newConversationKey = `${conversationId}-${topicId}-${categoryId}`;
    
    if (currentConversationRef.current && currentConversationRef.current !== newConversationKey) {
      console.log('🔄 Different conversation detected, resetting state...', {
        previous: currentConversationRef.current,
        new: newConversationKey
      });
      setIsInitialized(false);
      setLoading(true);
      setError(null);
      initializingRef.current = false;
      currentConversationRef.current = '';
      resetConversation();
      playedMessagesRef.current.clear();
      setIsPageReady(false);
    } else if (!currentConversationRef.current) {
      console.log('🔄 First time loading, resetting state...');
      setIsInitialized(false);
      setLoading(true);
      setError(null);
      initializingRef.current = false;
      currentConversationRef.current = '';
      resetConversation();
      playedMessagesRef.current.clear();
      setIsPageReady(false);
    }
  }, [conversationId, topicId, categoryId, resetConversation]);
  
  // Initialize conversation
  useEffect(() => {
    const initChat = async () => {
      const conversationKey = `${conversationId}-${topicId}-${categoryId}`;
      if (initializingRef.current || currentConversationRef.current === conversationKey) {
        return;
      }
      initializingRef.current = true;
      currentConversationRef.current = conversationKey;

      console.log('🔄 initChat called with:', { 
        conversationId, 
        topicId, 
        categoryId, 
        isInitialized,
        loading,
        isInitializing: initializingRef.current
      });
      
      if (isInitialized) {
        console.log('⚠️ Already initialized, skipping...');
        initializingRef.current = false;
        return;
      }

      if (!topicId) {
        setError('Topic ID is required');
        setLoading(false);
        initializingRef.current = false;
        return;
      }

      if (!categoryId) {
        setError('Category ID is required');
        setLoading(false);
        initializingRef.current = false;
        return;
      }

      try {
        console.log('🚀 Starting chat initialization...');
        const response = await chatApiService.fetchTopicById(categoryId);
        
        if (response.success && response.data) {
          const topic = response.data.topicDetails.find(
            (t) => t.topicId === parseInt(topicId)
          );
          
          if (topic) {
            console.log('✅ Topic found, initializing conversation...');
            setTopicDetail(topic);
            await initializeConversation(categoryId, topic);
            setIsInitialized(true);
            console.log('🎉 Chat initialization completed successfully');
          } else {
            setError('Topic not found in category');
            initializingRef.current = false;
          }
        } else {
          setError(response.error || 'Failed to fetch topic');
          initializingRef.current = false;
        }
      } catch (err) {
        setError('Failed to initialize chat');
        console.error('Chat initialization error:', err);
        initializingRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [conversationId, topicId, categoryId, isInitialized, initializeConversation]);
  
  // Set page ready state after component is fully mounted and rendered
  useLayoutEffect(() => {
    if (!loading && isInitialized && messages.length > 0) {
      Promise.resolve().then(() => {
        setIsPageReady(true);
        console.log('📱 Page is now ready for TTS');
      });
    } else {
      setIsPageReady(false);
    }
  }, [loading, isInitialized, messages.length]);
  
  // Auto-play TTS for bot messages (only after page is fully ready)
  useEffect(() => {
    console.log('🔊 TTS Effect triggered:', { 
      isAutoPlayTTS, 
      messagesLength: messages.length,
      loading,
      isInitialized,
      isPageReady,
      messages: messages.map(m => ({ id: m.id, isUser: m.isUserMessage, content: m.content.original.substring(0, 50) + '...' }))
    });
    
    if (isAutoPlayTTS && messages.length > 0 && isPageReady) {
      const lastMessage = messages[messages.length - 1];
      const messageId = lastMessage.id.toString();
      
      console.log('🎵 Checking last message for TTS:', { 
        messageId,
        isUserMessage: lastMessage.isUserMessage, 
        hasContent: !!lastMessage.content.original,
        content: lastMessage.content.original.substring(0, 50) + '...',
        alreadyPlayed: playedMessagesRef.current.has(messageId),
        loading,
        isInitialized,
        isPageReady
      });
      
      if (!lastMessage.isUserMessage && 
          lastMessage.content.original && 
          !playedMessagesRef.current.has(messageId)) {
        
        console.log('🎙️ Playing TTS for bot message:', lastMessage.content.original);
        playedMessagesRef.current.add(messageId);
        
        playTTS(lastMessage.content.original).catch((error) => {
          console.error('🚨 TTS playback failed:', error);
          playedMessagesRef.current.delete(messageId);
        });
      }
    } else if (!isPageReady) {
      console.log('🔇 TTS skipped - page not ready yet');
    }
  }, [messages, isAutoPlayTTS, playTTS, isPageReady]);
  
  // Event handlers
  const handleBack = useCallback(async () => {
    if (messages.length > 0) {
      const confirmLeave = window.confirm(
        'Are you sure you want to leave this conversation? Your progress will be saved.'
      );
      if (!confirmLeave) return;
    }
    
    // Save conversation before leaving
    if (messages.length > 0 && chatSessionId && topicDetail) {
      await saveConversation(chatSessionId, messages, topicDetail);
    }
    
    router.push('/chatai');
  }, [messages, chatSessionId, topicDetail, saveConversation, router]);

  const handleEndConversation = useCallback(async () => {
    if (messages.length > 0) {
      const confirmEnd = window.confirm(
        'Are you sure you want to end this conversation? Your progress will be saved.'
      );
      if (!confirmEnd) return;
    }

    // Save conversation
    if (chatSessionId && topicDetail) {
      await saveConversation(chatSessionId, messages, topicDetail);
    }

    router.push('/chatai');
  }, [messages, chatSessionId, topicDetail, saveConversation, router]);

  const handleSettingsToggle = useCallback(() => {
    setShowSettings(!showSettings);
  }, [showSettings]);
  
  return {
    // State
    topicDetail,
    loading,
    error,
    showSettings,
    isEndConversation,
    messages,
    imageBackground,
    
    // Handlers
    handleBack,
    handleEndConversation,
    handleSettingsToggle,
    setShowSettings,
  };
} 