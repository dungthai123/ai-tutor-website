import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type ReceivedChatMessage } from '@livekit/components-react';

/**
 * Format a number as a percentage string
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Debounce function to limit function calls
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Storage helpers for localStorage
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const chatLogger = {
  logAgentMessage: (message: ReceivedChatMessage | Record<string, unknown>, context?: string) => {
    console.group(`🤖 Agent Message ${context ? `(${context})` : ''}`);
    console.log('Raw Data:', JSON.stringify(message, null, 2));
    console.log('Timestamp:', new Date((message as ReceivedChatMessage).timestamp || Date.now()).toISOString());
    console.log('Message Type:', typeof message);
    console.log('Properties:', Object.keys(message));
    console.groupEnd();
  },
  
  logUserMessage: (message: ReceivedChatMessage | Record<string, unknown>, context?: string) => {
    console.group(`👤 User Message ${context ? `(${context})` : ''}`);
    console.log('Raw Data:', JSON.stringify(message, null, 2));
    console.log('Timestamp:', new Date((message as ReceivedChatMessage).timestamp || Date.now()).toISOString());
    console.groupEnd();
  },
  
  logTranscription: (transcription: unknown, isAgent: boolean = false) => {
    console.group(`🎤 ${isAgent ? 'Agent' : 'User'} Transcription`);
    console.log('Raw Transcription:', JSON.stringify(transcription, null, 2));
    const t = transcription as { text?: string; id?: string; firstReceivedTime?: number };
    console.log('Text:', t.text);
    console.log('ID:', t.id);
    console.log('First Received:', t.firstReceivedTime);
    console.groupEnd();
  },
  
  logAllMessages: (messages: ReceivedChatMessage[]) => {
    console.group('📋 All Messages Summary');
    console.log('Total Messages:', messages.length);
    console.log('Agent Messages:', messages.filter(m => !m.from?.isLocal).length);
    console.log('User Messages:', messages.filter(m => m.from?.isLocal).length);
    console.log('Raw Messages Array:', JSON.stringify(messages, null, 2));
    console.groupEnd();
  }
}; 