import { useState, useEffect } from 'react';
import { WritingQuestionType, WritingQuizModel } from '../../../types';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { Button } from '@/shared/components/ui/buttons/Button';

interface WritingAnswerInputProps {
  quizModel: WritingQuizModel;
  onAnswerChange: (answer: string) => void;
  currentAnswer?: string;
}

export function WritingAnswerInput({ quizModel, onAnswerChange, currentAnswer }: WritingAnswerInputProps) {
  const [inputValue, setInputValue] = useState(currentAnswer || '');
  const debouncedInputValue = useDebounce(inputValue, 500);

  useEffect(() => {
    if (debouncedInputValue !== (currentAnswer || '')) {
      onAnswerChange(debouncedInputValue);
    }
  }, [debouncedInputValue, currentAnswer, onAnswerChange]);

  const handleWordBankClick = (word: string) => {
    // remove brackets from word
    const cleanedWord = word.replace(/\[|\]/g, '');
    setInputValue(prev => (prev ? `${prev} ${cleanedWord}` : cleanedWord));
  };
  
  const handleClear = () => {
    setInputValue('');
  };

  if (quizModel.questionType === WritingQuestionType.WRITE_ORDERING) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-lg">
          {quizModel.orderingItems?.map((item, index) => (
            <Button key={index} variant="secondary" onClick={() => handleWordBankClick(item)}>
              {item.replace(/\[|\]/g, '')}
            </Button>
          ))}
        </div>
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Construct your sentence here by clicking the words above or typing."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          <button 
            onClick={handleClear} 
            className="absolute top-2 right-2 text-xs text-gray-500 hover:text-gray-800 p-1"
          >
            Clear
          </button>
        </div>
      </div>
    );
  }

  return (
    <textarea
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Type your answer here..."
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      rows={5}
    />
  );
} 