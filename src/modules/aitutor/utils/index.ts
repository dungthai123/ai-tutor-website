import { SelectedTopic } from '../types';

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
  return `${token}-${topicId}`;
};

/**
 * Utility function to get LiveKit server URL
 * @returns The LiveKit server URL
 */
export const getLiveKitServerUrl = (): string => {
  return process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://localhost:7880';
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
  return new Date(timestamp).toLocaleTimeString([], { timeStyle: 'short' });
}

/**
 * Generate unique message ID for transcriptions
 */
export function generateMessageId(prefix: string = 'message'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a message is from the current user
 */
export function isUserMessage(message: { from?: { isLocal?: boolean } }): boolean {
  return message.from?.isLocal ?? false;
}

/**
 * Get display name for message sender
 */
export function getSenderDisplayName(isUser: boolean): string {
  return isUser ? '👤 You' : '🤖 AI Tutor';
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
export function validateMessage(message: string): { isValid: boolean; error?: string } {
  const trimmed = message.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (trimmed.length > 1000) {
    return { isValid: false, error: 'Message too long (max 1000 characters)' };
  }
  
  return { isValid: true };
} 