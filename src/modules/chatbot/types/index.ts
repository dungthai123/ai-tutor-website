export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatStore extends ChatState {
  toggleChat: () => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

export interface ChatApiRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatApiResponse {
  reply: string;
  success: boolean;
  error?: string;
} 