import { SelectedTopic } from '../types';
import type { ReceivedChatMessage } from '@livekit/components-react';

/**
 * Utility function to get the correct image URL
 * @param imageUrl - The image URL from the API
 * @returns The full image URL
 */
export const getImageUrl = (imageUrl: string): string => {
  return imageUrl.startsWith('http') 
    ? imageUrl 
    : `https://thinkailabstaging.blob.core.windows.net/trum-chinese${imageUrl}`;
};

/**
 * Utility function to handle image loading errors
 * @param topicTitle - The title of the topic for logging
 */
export const handleImageError = (topicTitle: string): void => {
  console.log('Image failed to load for topic:', topicTitle);
};

/**
 * Utility function to format category count display
 * @param count - Number of categories
 * @returns Formatted string
 */
export const formatCategoryCount = (count: number): string => {
  return `(${count} danh mục)`;
};

/**
 * Utility function to generate LiveKit room key
 * @param token - The LiveKit token
 * @param topicId - The topic ID
 * @returns Unique room key for forcing remount
 */
export const generateRoomKey = (token: string, topicId: string): string => {
  return `room_${topicId}_${Date.now()}`;
};

/**
 * Utility function to get LiveKit server URL
 * @returns The LiveKit server URL
 */
export const getLiveKitServerUrl = (): string => {
  return process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://your-livekit-server.com';
};

/**
 * Utility function to check if session is connected
 * @param token - The LiveKit token
 * @param selectedTopic - The selected topic
 * @param isConnecting - Whether currently connecting
 * @returns Boolean indicating if session is connected
 */
export const isSessionConnected = (
  token: string | null,
  selectedTopic: SelectedTopic | null,
  isConnecting: boolean
): boolean => {
  return !!(token && selectedTopic && !isConnecting);
};

/**
 * Format timestamp for chat messages
 */
export function formatMessageTime(timestamp: number): string {
  const time = new Date(timestamp);
  return time.toLocaleTimeString([], { timeStyle: 'short' });
}

/**
 * Generate unique message ID for transcriptions
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a message is from the current user
 */
export function isUserMessage(message: ReceivedChatMessage): boolean {
  return message.from?.isLocal ?? false;
}

/**
 * Get display name for message sender
 */
export function getSenderDisplayName(message: ReceivedChatMessage): string {
  return isUserMessage(message) ? '👤 You' : '🤖 AI Tutor';
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Validate message content before sending
 */
export function validateMessage(message: string): boolean {
  return message.trim().length > 0;
}

/**
 * Animation utility functions
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

/**
 * CSS class utility functions
 */
export function getMessageBubbleClasses(isUser: boolean, variant: 'default' | 'compact' = 'default'): string {
  const baseClasses = 'rounded-2xl px-4 py-3 shadow-lg';
  const variantClasses = variant === 'compact' ? 'text-sm' : 'text-xl font-semibold';
  
  if (isUser) {
    return `${baseClasses} ${variantClasses} bg-gradient-to-r from-primary-green to-green-500 text-white ml-auto`;
  }
  
  return `${baseClasses} ${variantClasses} bg-gradient-to-r from-gray-700 to-gray-600 text-white mr-auto border border-gray-600`;
}

export function getChatInputClasses(variant: 'default' | 'compact' = 'default'): string {
  if (variant === 'compact') {
    return 'flex items-center gap-3 rounded-2xl bg-gray-800 px-4 py-3 border border-gray-600';
  }
  
  return 'flex items-center gap-4 rounded-2xl bg-gray-700 px-6 py-4 text-base shadow-lg';
}

export function getButtonClasses(
  variant: 'primary' | 'secondary' | 'icon' | 'icon-success' | 'icon-error' = 'primary',
  disabled: boolean = false
): string {
  const baseTransition = 'transition-all duration-200';
  
  if (disabled) {
    return `${baseTransition} cursor-not-allowed opacity-50`;
  }
  
  switch (variant) {
    case 'primary':
      return `${baseTransition} px-8 py-3 rounded-2xl text-base font-bold uppercase tracking-wider transform hover:scale-105 bg-gradient-to-r from-primary-green to-green-500 text-white hover:shadow-lg`;
    
    case 'secondary':
      return `${baseTransition} px-4 py-2 rounded-xl text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600`;
    
    case 'icon':
      return `${baseTransition} p-4 rounded-2xl transform hover:scale-105`;
    
    case 'icon-success':
      return `${baseTransition} w-20 h-20 bg-primary-green hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl`;
    
    case 'icon-error':
      return `${baseTransition} w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-2xl`;
    
    default:
      return baseTransition;
  }
} 