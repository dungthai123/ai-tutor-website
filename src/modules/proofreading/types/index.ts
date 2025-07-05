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