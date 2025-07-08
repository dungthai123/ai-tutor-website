import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { JiebaCollection, JiebaSegment } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Audio utility functions
export const audioUtils = {
  formatTime: (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  createAudioUrl: (blob: Blob): string => {
    return URL.createObjectURL(blob);
  },

  revokeAudioUrl: (url: string): void => {
    URL.revokeObjectURL(url);
  },

  getAudioDuration: (audioElement: HTMLAudioElement): Promise<number> => {
    return new Promise((resolve) => {
      audioElement.addEventListener('loadedmetadata', () => {
        resolve(audioElement.duration);
      });
    });
  }
};

// Chat utility functions
export const chatUtils = {
  generateMessageId: (): number => {
    return Date.now() + Math.random();
  },

  formatTimestamp: (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  },

  isEndConversation: (content: string): boolean => {
    // Handle undefined, null, or empty content
    if (!content || typeof content !== 'string') {
      return false;
    }
    
    const endContentList = ['再见', 'goodbye', 'bye', 'see you', 'talk to you later'];
    return endContentList.some(endContent => 
      content.toLowerCase().includes(endContent.toLowerCase())
    );
  },

  extractTextFromJiebaCollection: (collection: { original: string; segments: unknown[] }): string => {
    return collection.original;
  },

  // Transform API response to JiebaCollection format
  transformApiResponseToJiebaCollection: (apiData: { original: string; segments: (string | JiebaSegment)[] }): JiebaCollection => {
    // Handle case where segments is an array of strings (from API)
    if (Array.isArray(apiData.segments) && apiData.segments.length > 0) {
      const segments = apiData.segments.map((segment: string | JiebaSegment) => {
        if (typeof segment === 'string') {
          // Convert string to JiebaSegment
          return {
            word: segment,
            pinyin: undefined,
            translation: undefined,
            explanation: undefined,
          };
        } else {
          // Already a JiebaSegment object
          return segment;
        }
      });

      return {
        original: apiData.original,
        segments,
      };
    }

    // Fallback: create segments from original text if no segments provided
    return {
      original: apiData.original,
      segments: [],
    };
  },
};

// Format utility functions
export const formatUtils = {
  capitalizeFirst: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  formatFileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
};

// Validation utility functions
export const validationUtils = {
  isValidAudioBlob: (blob: Blob): boolean => {
    return blob && blob.size > 0 && blob.type.startsWith('audio/');
  },

  isValidMessage: (message: string): boolean => {
    return message.trim().length > 0;
  },

  isValidTopicId: (topicId: number): boolean => {
    return topicId > 0 && Number.isInteger(topicId);
  },

  isValidConversationId: (conversationId: string): boolean => {
    return conversationId.trim().length > 0;
  }
};

// Error handling utilities
export const errorUtils = {
  getErrorMessage: (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  },

  isNetworkError: (error: unknown): boolean => {
    return error instanceof Error && 
           (error.message.includes('fetch') || 
            error.message.includes('network') ||
            error.message.includes('connection'));
  }
};

// Storage utility functions
export const storageUtils = {
  generateChatSessionId: (): string => {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  saveChatHistory: (conversationId: string, messages: unknown[]): void => {
    if (typeof window !== 'undefined') {
      const key = `chat-history-${conversationId}`;
      localStorage.setItem(key, JSON.stringify(messages));
    }
  },

  loadChatHistory: (conversationId: string): unknown[] => {
    if (typeof window !== 'undefined') {
      const key = `chat-history-${conversationId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  },

  clearChatHistory: (conversationId: string): void => {
    if (typeof window !== 'undefined') {
      const key = `chat-history-${conversationId}`;
      localStorage.removeItem(key);
    }
  },

  saveUserPreferences: (preferences: Record<string, unknown>): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user-preferences', JSON.stringify(preferences));
    }
  },

  loadUserPreferences: (): Record<string, unknown> => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user-preferences');
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  },
}; 