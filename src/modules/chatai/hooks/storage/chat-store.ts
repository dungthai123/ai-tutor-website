'use client';

import { create } from 'zustand';
import { ChatMessage, TopicDetail, JiebaCollection, ChatUIState, LoadingStates } from '../../types';

interface ChatState extends ChatUIState {
  // Message Management
  messages: ChatMessage[];

  // Conversation State
  conversationId: string;
  topicDetail: TopicDetail | null;
  chatSessionId: string;
  hintMessage: JiebaCollection | null;
  mainChatId: number;

  // Loading States
  loadingStates: LoadingStates;

  // Actions
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: number, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  setAwaitingResponse: (waiting: boolean) => void;
  setAwaitSpeechToText: (waiting: boolean) => void;
  setListeningSpeechToText: (listening: boolean) => void;
  setConversationId: (id: string) => void;
  setTopicDetail: (topic: TopicDetail) => void;
  setEndConversation: (ended: boolean) => void;
  setGeneratingFeedback: (generating: boolean) => void;
  toggleKeyboard: () => void;
  toggleHint: () => void;
  setHintMessage: (hint: JiebaCollection | null) => void;
  setShowTranslatedText: (messageId: number, show: boolean) => void;
  setShowImprovedText: (messageId: number, show: boolean) => void;
  setShowPronunciationAssessment: (messageId: number, show: boolean) => void;
  setLoadingState: (
    type: keyof LoadingStates,
    messageId: number,
    loading: boolean
  ) => void;
  setChatSessionId: (id: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // Initial state
  messages: [],
  isAwaitingResponse: false,
  isAwaitSpeechToText: false,
  isListeningSpeechToText: false,
  isGeneratingFeedback: false,
  isEndConversation: false,
  isShowKeyboard: false,
  isOpenHint: false,
  isExplainFunctionSpeechToText: false,
  conversationId: '',
  topicDetail: null,
  chatSessionId: '',
  hintMessage: null,
  mainChatId: 0,
  showTranslatedText: {},
  showImprovedText: {},
  showPronunciationAssessment: {},
  loadingStates: {
    isTranslating: {},
    isImproving: {},
    isPronunciationLoading: {},
    isPlayingAudio: {},
  },

  // Actions
  addMessage: (message) => {
    console.log('📨 Adding message to store:', { 
      id: message.id, 
      isUser: message.isUserMessage, 
      content: message.content?.original ? message.content.original.substring(0, 100) + '...' : 'No content',
      timestamp: message.timestamp,
      fullContent: message.content
    });
    
    set((state) => {
      const newMessages = [...state.messages, message];
      console.log('📚 Store messages after add:', { 
        totalMessages: newMessages.length,
        lastMessage: { 
          id: message.id, 
          isUser: message.isUserMessage, 
          content: message.content?.original ? message.content.original.substring(0, 50) + '...' : 'No content'
        }
      });
      return { messages: newMessages };
    });
  },

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),

  clearMessages: () => set({ messages: [] }),

  setAwaitingResponse: (waiting) => set({ isAwaitingResponse: waiting }),

  setAwaitSpeechToText: (waiting) => set({ isAwaitSpeechToText: waiting }),

  setListeningSpeechToText: (listening) =>
    set({ isListeningSpeechToText: listening }),

  setConversationId: (id) => set({ conversationId: id }),
  
  setChatSessionId: (id: string) => set({ chatSessionId: id }),

  setTopicDetail: (topic) => set({ topicDetail: topic }),

  setEndConversation: (ended) => set({ isEndConversation: ended }),

  setGeneratingFeedback: (generating) =>
    set({ isGeneratingFeedback: generating }),

  toggleKeyboard: () =>
    set((state) => ({ isShowKeyboard: !state.isShowKeyboard })),

  toggleHint: () => set((state) => ({ isOpenHint: !state.isOpenHint })),

  setHintMessage: (hint) => set({ hintMessage: hint }),

  setShowTranslatedText: (messageId, show) =>
    set((state) => ({
      showTranslatedText: { ...state.showTranslatedText, [messageId]: show },
    })),

  setShowImprovedText: (messageId, show) =>
    set((state) => ({
      showImprovedText: { ...state.showImprovedText, [messageId]: show },
    })),

  setShowPronunciationAssessment: (messageId, show) =>
    set((state) => ({
      showPronunciationAssessment: {
        ...state.showPronunciationAssessment,
        [messageId]: show,
      },
    })),

  setLoadingState: (type, messageId, loading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [type]: { ...state.loadingStates[type], [messageId]: loading },
      },
    })),
})); 