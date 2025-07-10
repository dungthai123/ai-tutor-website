// Core Chat Types
export interface JiebaSegment {
  word: string;
  pinyin?: string;
  translation?: string;
  explanation?: string;
}

export interface JiebaCollection {
  original: string;
  segments: JiebaSegment[];
}

export interface TopicDetail {
  topicId: number;
  title: string;
  description: string;
  prompt: string;
  image: string;
  firstMessage?: string;
  tasks: string[];
}

export interface ChatGPTModel {
  conversationId: string;
  index: number;
  name: string;
  topicDetails: TopicDetail[];
}

// Message Types
export interface ImprovedChineseFeedback {
  improvedFeedback: string;
  commentFeedback: string;
  isPerfect: boolean;
}

export interface ConversationFeedback {
  vocabularyFeedback: string;
  grammarFeedback: string;
  taskCompleted: number;
}

export interface ChatMessage {
  id: number;
  content: JiebaCollection;
  isUserMessage: boolean;
  timestamp: number;
  translate?: string;
  pathRecord?: string;
  isPlaying?: boolean;
  suggestContent?: ImprovedChineseFeedback;
  speechData?: SpeechData;
}

// Audio Types
export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
}

export interface AudioRecorderState {
  isRecording: boolean;
  recordingTime: number;
  audioBlob?: Blob;
  audioUrl?: string;
  isProcessing?: boolean;
  mimeType?: string;
  fileExtension?: string;
}

export interface BackgroundMusicState {
  isEnabled: boolean;
  isPlaying: boolean;
  volume: number;
  currentTrack?: string;
}

// Pronunciation Assessment Types
export interface PronunciationAssessment {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  pronScore: number;
}

export interface WordData {
  word: string;
  offset: number;
  duration: number;
  pronunciationAssessment: PronunciationAssessment;
  syllables: SyllableData[];
}

export interface SyllableData {
  syllable: string;
  grapheme: string;
  pronunciationAssessment: PronunciationAssessment;
  offset: number;
  duration: number;
}

export interface NBest {
  confidence: number;
  lexical: string;
  itn: string;
  maskedItn: string;
  display: string;
  pronunciationAssessment: PronunciationAssessment;
  words: WordData[];
}

export interface SpeechData {
  id: string;
  recognitionStatus: string;
  offset: number;
  duration: number;
  channel: number;
  displayText: string;
  snr: number;
  nBest: NBest[];
}

// Audio API Types
export interface TTSRequest {
  text: string;
  speechRate: number;
  voice?: string;
}

export interface STTRequest {
  audioBlob: Blob;
  language?: string;
}

export interface PronunciationRequest {
  audioBlob: Blob;
  referenceText: string;
}

// Audio Player Events
export interface AudioPlayerEvents {
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onError?: (error: Error) => void;
}

// UI State Types
export interface ChatUIState {
  isShowKeyboard: boolean;
  isOpenHint: boolean;
  isEndConversation: boolean;
  isGeneratingFeedback: boolean;
  isAwaitingResponse: boolean;
  isAwaitSpeechToText: boolean;
  isListeningSpeechToText: boolean;
  isExplainFunctionSpeechToText: boolean;
  showTranslatedText: Record<number, boolean>;
  showImprovedText: Record<number, boolean>;
  showPronunciationAssessment: Record<number, boolean>;
}

export interface SettingsState {
  isSeparateWordOn: boolean;
  isMusicBackgroundTurnOn: boolean;
  selectedSpeechRate: number;
  selectedFontSize: number;
  isAutoPlayTTS: boolean;
  language: string;
}

export interface LoadingStates {
  isTranslating: Record<number, boolean>;
  isImproving: Record<number, boolean>;
  isPronunciationLoading: Record<number, boolean>;
  isPlayingAudio: Record<number, boolean>;
}

// Storage Types
export interface MainChatEntity {
  id?: number;
  question: string;
  answer: JiebaCollection;
  date: string;
  topic: TopicDetail;
}

export interface SubChatEntity {
  id?: number;
  mainChatId?: number;
  question?: string;
  answer?: JiebaCollection;
  date?: string;
  improve?: string;
}

export interface FeedbackEntity {
  id?: number;
  mainChatId: number;
  conversationFeedback: string;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatApiRequest {
  chatSessionId: string;
  message: string;
  conversationId?: string;
  topicId?: number;
}

export interface InitialMessageRequest {
  conversationId: string;
  topicId: number;
  chatSessionId: string;
}

export interface HintRequest {
  conversationId: string;
  topicId: number;
  chatSessionId: string;
  message: string;
}

export interface ImproveMessageRequest {
  conversationId: string;
  topicId: number;
  chatSessionId: string;
  question: string;
  answer: string;
}

export interface FeedbackRequest {
  conversationId: string;
  topicId: number;
  chatSessionId: string;
}

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
}

// Task related types
export type { Task, TaskCategory, TaskStatus, TaskCheckRequest, TaskCheckResponse } from './tasks'; 

// Speaking Helper Types
export interface SpeakingHelperRequest {
  topic: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tone: 'Casual' | 'Formal' | 'Friendly' | 'Professional';
  focus: 'Grammar' | 'Vocabulary' | 'Pronunciation' | 'Conversation Flow';
}

export interface SpeakingHelperResponse {
  suggestions: {
    phrases: string[];
    vocabulary: Array<{
      word: string;
      pinyin: string;
      meaning: string;
      example: string;
    }>;
    grammarTips: string[];
    conversationStarters: string[];
  };
  level: string;
  tone: string;
  focus: string;
} 