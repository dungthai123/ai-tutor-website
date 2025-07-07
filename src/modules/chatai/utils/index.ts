import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  }
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

// Storage utilities
export const storageUtils = {
  generateChatSessionId: (): string => {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  formatDateForStorage: (date: Date): string => {
    return date.toISOString();
  },

  parseStorageDate: (dateString: string): Date => {
    return new Date(dateString);
  }
}; 