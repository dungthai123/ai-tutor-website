import { useState, useEffect } from 'react';
import { WritingQuestionType, WritingQuizModel, WritingScore } from '../../../types';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { Button } from '@/shared/components/ui/buttons/Button';
import { useTestNavigationStore } from '@/lib/stores/testNavigationStore';
import { WritingScoringService } from '../../../services/writing-scoring.service';
import { WritingScoreDisplay } from './WritingScoreDisplay';

interface WritingAnswerInputProps {
  quizModel: WritingQuizModel;
  onAnswerChange: (answer: string) => void;
  currentAnswer?: string;
}

export function WritingAnswerInput({ quizModel, onAnswerChange, currentAnswer }: WritingAnswerInputProps) {
  // Get navigation store for updating answer state
  const { currentQuestionIndex, setAnswer } = useTestNavigationStore();
  
  // For WRITE_ORDERING, use array state for word bank and answer order
  const isOrdering = quizModel.questionType === WritingQuestionType.WRITE_ORDERING;
  const originalOrder = quizModel.orderingItems?.map(item => item.replace(/\[|\]/g, '')) || [];
  const [wordBank, setWordBank] = useState<string[]>(originalOrder);
  const [answerOrder, setAnswerOrder] = useState<string[]>(currentAnswer ? currentAnswer.split(' ') : []);

  // For other types, use string input
  const [inputValue, setInputValue] = useState(currentAnswer || '');
  const debouncedInputValue = useDebounce(inputValue, 500);

  // AI Scoring state
  const [isScoring, setIsScoring] = useState(false);
  const [scoringResult, setScoringResult] = useState<WritingScore | null>(null);
  const [scoringError, setScoringError] = useState<string | null>(null);

  // Check if current question type supports AI scoring
  const supportsAIScoring = quizModel.questionType && [
    WritingQuestionType.WRITE_SENTENCE_FROM_IMAGE,
    WritingQuestionType.WRITE_ESSAY,
    WritingQuestionType.WRITE_PASSAGE_FROM_VOCABS,
    WritingQuestionType.WRITE_PASSAGE_FROM_PICTURES,
    WritingQuestionType.WRITE_SUMMARIZE_PASSAGE
  ].includes(quizModel.questionType);

  // Sync state on question change or currentAnswer change
  useEffect(() => {
    if (isOrdering) {
      setWordBank(originalOrder.filter(word => !currentAnswer?.includes(word)));
      setAnswerOrder(currentAnswer ? currentAnswer.split(' ').filter(word => originalOrder.includes(word)) : []);
    }
  }, [quizModel.id, currentAnswer, isOrdering]);

  // Call onAnswerChange when answerOrder changes for ordering type
  useEffect(() => {
    if (isOrdering) {
      const joined = answerOrder.join(' ');
      if (joined !== (currentAnswer || '')) {
        onAnswerChange(joined);
        // Update the navigation store to trigger isAnswered state calculation
        setAnswer(currentQuestionIndex, joined);
      }
    }
  }, [answerOrder, isOrdering, onAnswerChange, currentAnswer, setAnswer, currentQuestionIndex]);

  // Call onAnswerChange for normal input
  useEffect(() => {
    if (!isOrdering && debouncedInputValue !== (currentAnswer || '')) {
      onAnswerChange(debouncedInputValue);
      // Update the navigation store to trigger isAnswered state calculation
      setAnswer(currentQuestionIndex, debouncedInputValue);
    }
  }, [debouncedInputValue, currentAnswer, onAnswerChange, isOrdering, setAnswer, currentQuestionIndex]);

  const addWord = (word: string) => {
    setWordBank(prev => prev.filter(w => w !== word));
    setAnswerOrder(prev => [...prev, word]);
  };

  const removeWord = (index: number) => {
    const word = answerOrder[index];
    setAnswerOrder(prev => prev.filter((_, i) => i !== index));
    setWordBank(prev => [...prev, word]);
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    setAnswerOrder(prev => {
      const newOrder = [...prev];
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= newOrder.length) return newOrder;
      [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
      return newOrder;
    });
  };

  const handleReset = () => {
    setAnswerOrder([]);
    setWordBank(originalOrder);
    // Clear the answer in both local callback and navigation store
    onAnswerChange('');
    setAnswer(currentQuestionIndex, '');
  };

  // Handle AI scoring
  const handleAIScoring = async () => {
    const currentText = isOrdering ? answerOrder.join(' ') : inputValue;
    
    if (!currentText || currentText.trim().length === 0) {
      setScoringError('Please provide an answer to score');
      return;
    }

    setIsScoring(true);
    setScoringError(null);
    setScoringResult(null);

    try {
      const result = await WritingScoringService.scoreWriting(quizModel, currentText);
      setScoringResult(result);
    } catch (error) {
      setScoringError(error instanceof Error ? error.message : 'Failed to score writing');
    } finally {
      setIsScoring(false);
    }
  };

  const handleCloseScoringResult = () => {
    setScoringResult(null);
    setScoringError(null);
  };

  if (isOrdering) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Your Answer:</label>
          <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-lg min-h-[100px]">
            {answerOrder.length === 0 && (
              <div className="text-gray-500 italic">Click words from the bank below to build your answer.</div>
            )}
            {answerOrder.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1 bg-white border border-gray-300 rounded px-3 py-2 shadow-sm cursor-pointer hover:bg-gray-200"
                   onClick={() => removeWord(idx)}
                   onContextMenu={(e) => {
                     e.preventDefault();
                     moveItem(idx, 1);
                   }}
              >
                <span className="font-medium text-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Word Bank:</label>
          <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg">
            {wordBank.map((word, idx) => (
              <button
                key={idx}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 rounded px-3 py-2 shadow-sm"
                onClick={() => addWord(word)}
                type="button"
              >
                {word}
              </button>
            ))}
            {wordBank.length === 0 && (
              <div className="text-gray-500 italic">No more words available. Click &apos;Reset&apos; to start over.</div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleReset} type="button">
            Reset
          </Button>
          {supportsAIScoring && (
            <Button 
              variant="primary" 
              onClick={handleAIScoring} 
              disabled={isScoring || answerOrder.length === 0}
              type="button"
            >
              {isScoring ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Scoring...</span>
                </div>
              ) : (
                'Score by AI 🤖'
              )}
            </Button>
          )}
        </div>
        
        {/* AI Scoring Error */}
        {scoringError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{scoringError}</p>
          </div>
        )}
      </div>
    );
  }

  // Fallback: normal textarea for other types
  return (
    <div className="space-y-4">
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        rows={5}
      />
      
      {/* AI Scoring Button for supported question types */}
      {supportsAIScoring && (
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            onClick={handleAIScoring} 
            disabled={isScoring || !inputValue.trim()}
            type="button"
          >
            {isScoring ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Scoring...</span>
              </div>
            ) : (
              'Score by AI 🤖'
            )}
          </Button>
        </div>
      )}
      
      {/* AI Scoring Error */}
      {scoringError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{scoringError}</p>
        </div>
      )}
      
      {/* AI Scoring Result Modal */}
      {scoringResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <WritingScoreDisplay 
              score={scoringResult} 
              onClose={handleCloseScoringResult}
            />
          </div>
        </div>
      )}
    </div>
  );
} 