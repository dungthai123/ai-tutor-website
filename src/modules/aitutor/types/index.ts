import type { ReceivedChatMessage } from '@livekit/components-react';

// Re-export from livekit for convenience
export type { ReceivedChatMessage };

// SelectedTopic Type (moved from global types)
export interface SelectedTopic {
  categoryId: number;
  topicId: string;
  categoryName: string;
  topicName: string;
  description: string;
  tasks: string[];
  imageUrl?: string;
}

// Topic Selector Types
export interface Category {
  id: number;
  name: string;
  topic_count: number;
  display_order: number;
}

export interface Topic {
  topic_id: string;
  title: string;
  description: string;
  tasks: string[];
  image_url?: string;
}

export interface TopicSelectorProps {
  onTopicSelect: (categoryId: number, topicId: string, topicData: {
    categoryName: string;
    topicName: string;
    description: string;
    tasks: string[];
    imageUrl?: string;
  }) => void;
  selectedCategoryId?: number;
  selectedTopicId?: string;
}

export interface TopicSelectorState {
  categories: Category[];
  topics: Topic[];
  selectedCategory: Category | null;
  selectedTopic: Topic | null;
  loading: boolean;
  error: string | null;
}

// Voice Assistant Panel Types
export interface VoiceAssistantPanelProps {
  selectedTopic: SelectedTopic | null;
  userName: string;
  token: string | null;
  isConnecting: boolean;
  onStartCall: () => void;
  onDeclineCall: () => void;
  onDisconnect: () => void;
  onToggleFullScreen: () => void;
}

export interface VoiceAssistantPanelState {
  isConnected: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export interface SessionHeaderProps {
  selectedTopic: SelectedTopic;
  userName: string;
  onToggleFullScreen: () => void;
  onDisconnect: () => void;
}

export interface EmptyStateProps {
  title: string;
  message: string;
  icon: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Chat and Connection Types
export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
  type: 'text' | 'audio' | 'system';
}

export interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  hasError: boolean;
  errorMessage?: string;
  token: string | null;
}

export interface AITutorPageState {
  selectedTopic: SelectedTopic | null;
  userName: string;
  token: string | null;
  isConnecting: boolean;
  connectionState: ConnectionState;
  chatMessages: ChatMessage[];
}

// LiveKit Connection Types
export interface LiveKitConnectionProps {
  token: string;
  serverUrl: string;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
}

export interface AgentState {
  isActive: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  volume: number;
}

// Lesson Types
export interface LessonData {
  topicId: string;
  progress: number;
  startTime: number;
  completedSections?: string[];
}

export interface VoiceAssistantProps {
  selectedTopic: SelectedTopic;
  onStartCall?: () => void;
  onDeclineCall?: () => void;
  isConnecting?: boolean;
  isConnected?: boolean;
  isFullScreenMode?: boolean;
}

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
}

export interface ChatEntryProps {
  message: ReceivedChatMessage;
  variant?: 'default' | 'compact';
}

export interface PhoneCallScreenProps {
  selectedTopic: SelectedTopic;
  onAccept: () => void;
  onDecline: () => void;
}

export interface ControlBarProps {
  chatOpen: boolean;
  onChatToggle: () => void;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
} 