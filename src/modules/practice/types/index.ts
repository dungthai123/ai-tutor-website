// HSK Levels
export enum HSKLevel {
  HSK1 = 'HSK1',
  HSK2 = 'HSK2',
  HSK3 = 'HSK3',
  HSK4 = 'HSK4',
  HSK5 = 'HSK5',
  HSK6 = 'HSK6'
}

// Practice Types (Listening & Reading only)
export enum PracticeType {
  LISTENING = 'listening',
  READING = 'reading',
  WRITING = 'writing'
}

// Answer Types
export enum TypeAnswer {
  TRUE_FALSE = 'trueFalse',
  IMAGE_SELECTION = 'imageSelection',
  WORD_MATCHING = 'wordMatching',
  QUESTION_ANSWER = 'questionAnswer'
}

// Base Quiz Model
export interface BaseQuizModel {
  id: string;
  question: string;
  correctAnswer: string;
  optionList: OptionModel[];
  typeAnswer: TypeAnswer;
  explanation?: string;
  readingTranslation?: string;
  correctAnswerTranslation?: string;
  optionListText?: string;
}

// Listening Quiz Model (extends BaseQuizModel)
export interface ListeningQuizModel extends BaseQuizModel {
  type: PracticeType.LISTENING;
  audio: string;
  audioContext?: string;
  transcript?: string;
  transcriptContext?: string;
  readingTranslationContext?: string;
  questionType?: ListeningQuestionType;
  imageList?: string[];
  imageUrl?: string; // Main question image for listening questions
}

// Reading Quiz Model (extends BaseQuizModel)  
export interface ReadingQuizModel extends BaseQuizModel {
  type: PracticeType.READING;
  passage?: string;
  questionType?: ReadingQuestionType;
  readingTranslationContext?: string;
  imageUrl?: string; // Main question image
  imageList?: string[]; // Context images for picture matching questions
}

// Writing Quiz Model (extends BaseQuizModel)
export interface WritingQuizModel extends BaseQuizModel {
  type: PracticeType.WRITING;
  questionType?: WritingQuestionType;
  orderingItems?: string[]; // For Write_Ordering questions
  requiredWords?: string[]; // For questions that require specific words
  prompt?: string; // Writing prompt
  context?: string; // Additional context
  answerExample?: string; // Example answer
  imageUrl?: string; // Main question image for Write_SentencefromImage
  imageDescription?: string; // Description of the image
  instruction?: string; // Special instructions for the question
}

// Answer Options
export interface OptionModel {
  id: string;
  text: string;
  imageUrl?: string;
}

// Practice Topic
export interface PracticeTopicModel {
  id: string;
  title: string;
  displayOrder: number;
  level: HSKLevel;
  typePractice: PracticeType;
  totalQuestions: number;
  totalListeningQuestions: number;
  totalReadingQuestions: number;
  totalWritingQuestions: number;
  // Legacy fields for backward compatibility
  type?: PracticeType;
  description?: string;
  difficulty?: string;
  questionCount?: number;
  estimatedTime?: number;
}

// Test Progress
export interface TestProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  timeSpent: number;
  startTime: Date;
}

// Test Results
export interface TestResult {
  testId: string;
  level: HSKLevel;
  type: PracticeType;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: Date;
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  selectedAnswer?: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

// Union type for Quiz Models
export type QuizModel = ListeningQuizModel | ReadingQuizModel | WritingQuizModel;

export interface QuizState {
  quizList: QuizModel[];
  position: number;
  currentTime: number;
  right: number;
  wrong: number;
  skip: number;
  answerPosition: (number | null)[];
}

export interface HistoryModel {
  type: QuizStats;
  completedAt: Date;
  quizData: QuizModel;
}

export interface TestOptions {
  showAnswerAfterEach: boolean;
  typeOfQuestion?: string;
  resume: boolean;
  isReview: boolean;
}

export interface TimerState {
  currentTime: number;
  totalTime: number;
  isRunning: boolean;
  isPaused: boolean;
}

export interface TranslationData {
  readingTranslationContext?: string;
  readingTranslation?: string;
  correctAnswerTranslation?: string;
  optionListText?: string;
  transcript?: string;
  transcriptContext?: string;
}

export interface TestScore {
  correct: number;
  total: number;
  percentage: number;
  right: number;
  wrong: number;
  skip: number;
  score: number;
}

export enum QuizStats {
  SKIPPED = 'skipped',
  CORRECT = 'correct',
  WRONG = 'wrong'
}

export enum ReadingQuestionType {
  READ_ORDERING = 'Read_Ordering',
  READ_WRONG_SENTENCE = 'Read_MultipleChoice_WrongSentence',
  READ_TRUE_FALSE = 'Read_TrueFalse',
  READ_MATCH_PICTURE_WITH_STATEMENT = 'Read_Match_PictureWithStatement',
  READ_MATCH_STATEMENT_WITH_STATEMENT = 'Read_Match_StatementWithStatement',
  READ_MATCH_MISSING_WORD_WITH_STATEMENT = 'Read_Match_MissingWordWithStatement',
  READ_MULTIPLE_CHOICE_SHORT_PASSAGE = 'Read_MultipleChoice_ShortPassage',
  READ_MULTIPLE_CHOICE_LONG_PASSAGE = 'Read_MultipleChoice_LongPassage',
  READ_MULTIPLE_CHOICE_STATEMENT = 'Read_MultipleChoice_Statement',
  READ_MULTIPLE_CHOICE_PASSAGE = 'Read_MultipleChoice_Passage',
  READ_MATCHING_MISSING_SENTENCE = 'Read_Matching_MissingSentence',
  READ_MULTIPLE_CHOICE_MISSING_WORDS_SENTENCE = 'Read_MultipleChoice_MissingWords_sentence',
  NORMAL = 'normal'
}

export enum ListeningQuestionType {
  LISTEN_TRUE_FALSE = 'Listen_TrueFalse',
  LISTEN_MATCH_PICTURE_WITH_AUDIO = 'Listen_Match_PictureWithAudio',
  LISTEN_MULTIPLE_CHOICE_PICTURE = 'Listen_MultipleChoice_Picture',
  LISTEN_MULTIPLE_CHOICE_STATEMENT = 'Listen_MultipleChoice_Statement',
  LISTEN_MULTIPLE_CHOICE_SHORT_DIALOGUE = 'Listen_MultipleChoice_ShortDialogue',
  LISTEN_MULTIPLE_CHOICE_MEDIUM_DIALOGUE = 'Listen_MultipleChoice_MediumDialogue',
  LISTEN_MULTIPLE_CHOICE_DIALOGUE = 'Listen_MultipleChoice_Dialogue',
  LISTEN_MULTIPLE_CHOICE_SHORT_PASSAGE = 'Listen_MultipleChoice_ShortPassage',
  LISTEN_MULTIPLE_CHOICE_CONSISTENT_STATEMENT = 'Listen_MultipleChoice_ConsistentStatement',
  LISTEN_MULTIPLE_CHOICE_INTERVIEW = 'Listen_MultipleChoice_Interview',
  NORMAL = 'normal'
}

export enum WritingQuestionType {
  WRITE_ORDERING = 'Write_Ordering',
  WRITE_SENTENCE_FROM_IMAGE = 'Write_SentencefromImage',
  WRITE_COMPLETION = 'Write_Completion',
  WRITE_ESSAY = 'Write_Essay',
  NORMAL = 'normal'
}

// Page Component Props
export interface PracticePageProps {
  initialLevel?: HSKLevel;
}

export interface PracticeTypePageProps {
  practiceType: PracticeType;
  level: HSKLevel;
}

export interface TestPageProps {
  testType: PracticeType;
  testId: string;
}

// Component Props
export interface LevelSelectorProps {
  selectedLevel: HSKLevel;
  onLevelChange: (level: HSKLevel) => void;
  loading?: boolean;
  className?: string;
}

export interface PracticeCardProps {
  practiceType: PracticeType;
  topicCount: number;
  selectedLevel: HSKLevel;
  className?: string;
}

export interface TestContainerProps {
  testType: PracticeType;
  testId: string;
  onBack: () => void;
}

export interface QuestionNavigationProps {
  currentPosition: number;
  totalQuestions: number;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
  className?: string;
}


export interface TestTimerProps {
  timeElapsed: number;
  isRunning: boolean;
  onTimeUp?: () => void;
  className?: string;
}

// State Management Types
export interface PracticePageState {
  selectedLevel: HSKLevel;
  practiceTopics: PracticeTopicModel[];
  loading: boolean;
  error: string | null;
}

export interface TestSessionState {
  testId: string;
  testType: PracticeType;
  topic: PracticeTopicModel | null;
  questions: QuizModel[];
  currentPosition: number;
  selectedAnswers: Record<number, number>;
  timeStarted: number;
  timeElapsed: number;
  isCompleted: boolean;
  score: TestScore | null;
  loading: boolean;
  error: string | null;
}

// Service Response Types
export interface PracticeTopicsResponse {
  listening: PracticeTopicModel[];
  reading: PracticeTopicModel[];
  writing: PracticeTopicModel[];
  total: number;
}

export interface TestInitResponse {
  topic: PracticeTopicModel;
  questions: QuizModel[];
}

// Hook Return Types
export interface UsePracticePageReturn {
  state: PracticePageState;
  actions: {
    setLevel: (level: HSKLevel) => void;
    refreshTopics: () => Promise<void>;
  };
  isLoaded: boolean;
}

export interface UseTestSessionReturn {
  state: TestSessionState;
  actions: {
    setAnswer: (answerIndex: number) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    goToQuestion: (index: number) => void;
    completeTest: () => void;
    resetTest: () => void;
  };
  computed: {
    currentQuestion: QuizModel | null;
    progress: { current: number; total: number; percentage: number };
    canGoNext: boolean;
    canGoPrevious: boolean;
    isLastQuestion: boolean;
  };
}

// Configuration Types
export interface TestConfiguration {
  showAnswerAfterEach: boolean;
  allowReview: boolean;
  showTimer: boolean;
  timeLimit?: number;
}

export interface HSKLevelInfo {
  level: HSKLevel;
  name: string;
  description: string;
  color: string;
  wordCount: string;
}

// Constants
export const HSK_LEVELS: HSKLevelInfo[] = [
  { level: HSKLevel.HSK1, name: 'HSK 1', description: 'Beginner - 150 words', color: 'bg-green-500', wordCount: '150 words' },
  { level: HSKLevel.HSK2, name: 'HSK 2', description: 'Elementary - 300 words', color: 'bg-blue-500', wordCount: '300 words' },
  { level: HSKLevel.HSK3, name: 'HSK 3', description: 'Intermediate - 600 words', color: 'bg-yellow-500', wordCount: '600 words' },
  { level: HSKLevel.HSK4, name: 'HSK 4', description: 'Upper Intermediate - 1200 words', color: 'bg-orange-500', wordCount: '1200 words' },
  { level: HSKLevel.HSK5, name: 'HSK 5', description: 'Advanced - 2500 words', color: 'bg-purple-500', wordCount: '2500 words' },
  { level: HSKLevel.HSK6, name: 'HSK 6', description: 'Fluent - 5000+ words', color: 'bg-red-500', wordCount: '5000+ words' },
];

export const PRACTICE_TYPE_INFO = {
  [PracticeType.LISTENING]: {
    title: 'Listening Practice',
    description: 'Practice listening comprehension with audio clips, transcripts, and various question types.',
    icon: '🎧',
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    features: [
      'Audio comprehension exercises',
      'Multiple choice and image selection',
      'Transcript viewing support'
    ]
  },
  [PracticeType.READING]: {
    title: 'Reading Practice',
    description: 'Improve reading comprehension with passages, articles, and comprehension questions.',
    icon: '📖',
    color: 'bg-green-600',
    hoverColor: 'hover:bg-green-700',
    features: [
      'Reading comprehension passages',
      'True/false and multiple choice',
      'Vocabulary and grammar focus'
    ]
  },
  [PracticeType.WRITING]: {
    title: 'Writing Practice',
    description: 'Improve writing skills with various writing exercises and prompts.',
    icon: '📝',
    color: 'bg-red-600',
    hoverColor: 'hover:bg-red-700',
    features: [
      'Writing exercises and prompts',
      'Grammar and vocabulary practice'
    ]
  }
}; 