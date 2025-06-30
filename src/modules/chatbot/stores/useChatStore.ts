'use client';

import { create } from 'zustand';
import { ChatStore, ChatMessage } from '../types';

export const useChatStore = create<ChatStore>((set) => ({
  // Initial state
  isOpen: false,
  messages: [],
  isLoading: false,
  error: null,

  // Actions
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    
    set((state) => {
      // Prevent duplicate messages within 2 seconds
      const recentMessages = state.messages.slice(-3);
      const isDuplicate = recentMessages.some(existing => 
        existing.role === newMessage.role && 
        existing.content === newMessage.content &&
        Math.abs(newMessage.timestamp.getTime() - existing.timestamp.getTime()) < 2000
      );
      
      if (isDuplicate) {
        return state;
      }
      
      return {
        messages: [...state.messages, newMessage],
        error: null,
      };
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  clearMessages: () => set({ messages: [], error: null }),
})); 