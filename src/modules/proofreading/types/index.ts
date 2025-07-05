export interface EditModel {
  oldText: string;
  newText: string;
  reasons: { en: string };
}

export interface AssistantResult {
  correction: string;
  suggestion?: string;
  edits: EditModel[];
}

export interface ProofreadingState {
  content: string;
  result: AssistantResult | null;
  loading: boolean;
  error: string | null;
  isEditable: boolean;
}

export interface WritingHelperRequest {
  topic: string;
  style: string;
  tone: string;
  level: string;
}

export interface VocabularyItem {
  word: string;
  meaning: string;
}

export interface WritingHelperResponse {
  outline: string[];
  vocabulary: VocabularyItem[];
  grammarTips: string[];
  writingStyleTips: string[];
}

export interface WritingHelperState {
  loading: boolean;
  error: string | null;
  result: WritingHelperResponse | null;
} 