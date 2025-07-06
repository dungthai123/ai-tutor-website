import { useState, useEffect, useCallback, useRef } from 'react';
import { WorkerLinter, binary } from 'harper.js';

export interface GrammarIssue {
  start: number;
  end: number;
  message: string;
  suggestions: string[];
  severity: 'error' | 'warning' | 'suggestion';
}

export interface UseGrammarCheckReturn {
  issues: GrammarIssue[];
  isChecking: boolean;
  checkGrammar: (text: string) => Promise<void>;
  applyCorrection: (text: string, issue: GrammarIssue, suggestionIndex: number) => Promise<string>;
  clearIssues: () => void;
}

export function useGrammarCheck(): UseGrammarCheckReturn {
  const [issues, setIssues] = useState<GrammarIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const linterRef = useRef<WorkerLinter | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Harper.js linter
  useEffect(() => {
    const initializeLinter = async () => {
      try {
        const linter = new WorkerLinter({ binary });
        await linter.setup();
        linterRef.current = linter;
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Harper.js:', error);
      }
    };

    initializeLinter();

    // Cleanup
    return () => {
      if (linterRef.current) {
        // Note: WorkerLinter doesn't have a cleanup method in the current API
        linterRef.current = null;
      }
    };
  }, []);

  const checkGrammar = useCallback(async (text: string) => {
    if (!linterRef.current || !isInitialized || !text.trim()) {
      setIssues([]);
      return;
    }

    setIsChecking(true);
    try {
      const lints = await linterRef.current.lint(text);
      
      const grammarIssues: GrammarIssue[] = await Promise.all(
        lints.map(async (lint) => {
          const span = await lint.span();
          const suggestions = await lint.suggestions();
          
          return {
            start: span.start,
            end: span.end,
            message: await lint.message(),
            suggestions: suggestions.map((suggestion) => suggestion.get_replacement_text()),
            severity: 'error' as const, // Harper.js doesn't provide severity levels
          };
        })
      );

      setIssues(grammarIssues);
    } catch (error) {
      console.error('Grammar check failed:', error);
      setIssues([]);
    } finally {
      setIsChecking(false);
    }
  }, [isInitialized]);

  const applyCorrection = useCallback(async (
    text: string, 
    issue: GrammarIssue, 
    suggestionIndex: number
  ): Promise<string> => {
    if (!linterRef.current || suggestionIndex >= issue.suggestions.length) {
      return text;
    }

    try {
      // Find the original lint that matches this issue
      const lints = await linterRef.current.lint(text);
      const matchingLint = lints.find(async (lint) => {
        const span = await lint.span();
        return span.start === issue.start && span.end === issue.end;
      });

      if (matchingLint) {
        const suggestions = await matchingLint.suggestions();
        if (suggestions[suggestionIndex]) {
          return await linterRef.current.applySuggestion(text, matchingLint, suggestions[suggestionIndex]);
        }
      }

      // Fallback: manual replacement
      return text.slice(0, issue.start) + 
             issue.suggestions[suggestionIndex] + 
             text.slice(issue.end);
    } catch (error) {
      console.error('Failed to apply correction:', error);
      return text;
    }
  }, []);

  const clearIssues = useCallback(() => {
    setIssues([]);
  }, []);

  return {
    issues,
    isChecking,
    checkGrammar,
    applyCorrection,
    clearIssues,
  };
} 