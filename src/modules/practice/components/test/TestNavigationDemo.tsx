'use client';

import { useEffect } from 'react';
import { useTestNavigationStore } from '@/lib/stores/testNavigationStore';
import { PracticeType, QuizModel, TypeAnswer } from '../../types';
import { TestNavigationPanel } from './TestNavigationPanel';
import { QuestionNavigationGrid } from './QuestionNavigationGrid';

// Sample test data
const createSampleQuestions = (count: number, testType: PracticeType): QuizModel[] => {
  if (testType === PracticeType.LISTENING) {
    return Array.from({ length: count }, (_, index) => ({
      id: `question-${index + 1}`,
      type: PracticeType.LISTENING as const,
      question: `Sample listening question ${index + 1}: What is the correct answer for this test question?`,
      correctAnswer: '1',
      optionList: [
        { id: `opt-${index}-1`, text: 'Option A', imageUrl: '' },
        { id: `opt-${index}-2`, text: 'Option B', imageUrl: '' },
        { id: `opt-${index}-3`, text: 'Option C', imageUrl: '' },
        { id: `opt-${index}-4`, text: 'Option D', imageUrl: '' },
      ],
      typeAnswer: TypeAnswer.QUESTION_ANSWER,
      optionListText: 'Multiple choice question',
      correctAnswerTranslation: 'This is the correct answer explanation',
      audio: `audio-${index + 1}.mp3`,
      transcript: `Sample transcript for question ${index + 1}`,
    }));
  } else {
    return Array.from({ length: count }, (_, index) => ({
      id: `question-${index + 1}`,
      type: PracticeType.READING as const,
      question: `Sample reading question ${index + 1}: What is the correct answer for this test question?`,
      correctAnswer: '1',
      optionList: [
        { id: `opt-${index}-1`, text: 'Option A', imageUrl: '' },
        { id: `opt-${index}-2`, text: 'Option B', imageUrl: '' },
        { id: `opt-${index}-3`, text: 'Option C', imageUrl: '' },
        { id: `opt-${index}-4`, text: 'Option D', imageUrl: '' },
      ],
      typeAnswer: TypeAnswer.QUESTION_ANSWER,
      optionListText: 'Multiple choice question',
      correctAnswerTranslation: 'This is the correct answer explanation',
      passage: `Sample reading passage for question ${index + 1}`,
    }));
  }
};

interface TestNavigationDemoProps {
  questionCount?: number;
  testType?: PracticeType;
}

export function TestNavigationDemo({ 
  questionCount = 40, 
  testType = PracticeType.LISTENING 
}: TestNavigationDemoProps) {
  const {
    initializeTest,
    questions,
    currentQuestionIndex,
    selectedAnswers,
    setAnswer,
    setCurrentQuestion,
    getAnsweredCount,
    getUnansweredCount,
    getProgressPercentage,
    resetTest,
  } = useTestNavigationStore();

  // Initialize demo test
  useEffect(() => {
    const sampleQuestions = createSampleQuestions(questionCount, testType);
    initializeTest('demo-test', testType, sampleQuestions);
    
    // Add some sample answers for demonstration
    setTimeout(() => {
      setAnswer(0, 0); // Answer question 1
      setAnswer(2, 1); // Answer question 3
      setAnswer(5, 2); // Answer question 6
      setAnswer(10, 0); // Answer question 11
      setAnswer(15, 3); // Answer question 16
    }, 500);

    return () => {
      resetTest();
    };
  }, [questionCount, testType, initializeTest, setAnswer, resetTest]);

  const handleQuestionChange = (questionIndex: number) => {
    console.log(`Navigated to question ${questionIndex + 1}`);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setAnswer(currentQuestionIndex, answerIndex);
    console.log(`Selected answer ${answerIndex + 1} for question ${currentQuestionIndex + 1}`);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading demo test...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🎯 Test Navigation Demo
          </h1>
          <p className="text-gray-600">
            This demo showcases the question navigation grid, answer tracking, and submission features.
          </p>
          
          {/* Demo Stats */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="font-medium text-blue-700">Total Questions</div>
              <div className="text-xl font-bold text-blue-900">{questions.length}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="font-medium text-green-700">Answered</div>
              <div className="text-xl font-bold text-green-900">{getAnsweredCount()}</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="font-medium text-orange-700">Remaining</div>
              <div className="text-xl font-bold text-orange-900">{getUnansweredCount()}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="font-medium text-purple-700">Progress</div>
              <div className="text-xl font-bold text-purple-900">{getProgressPercentage()}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Navigation Panel */}
      <TestNavigationPanel onQuestionChange={handleQuestionChange} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Content */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <span className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <h2 className="text-xl font-semibold text-gray-900 mt-1">
                  {currentQuestion?.question}
                </h2>
              </div>

              {/* Sample Answer Options */}
              <div className="space-y-3">
                {currentQuestion?.optionList.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === index;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span>{option.text}</span>
                        {isSelected && (
                          <span className="ml-auto text-blue-600">✓</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Grid Sidebar */}
          <div className="lg:col-span-1">
            <QuestionNavigationGrid 
              onQuestionSelect={handleQuestionChange}
              className="mb-6"
            />
            
            {/* Demo Controls */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-3">Demo Controls</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    // Answer some random questions
                    for (let i = 0; i < 10; i++) {
                      const randomQ = Math.floor(Math.random() * questions.length);
                      const randomA = Math.floor(Math.random() * 4);
                      setAnswer(randomQ, randomA);
                    }
                  }}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Add Random Answers
                </button>
                <button
                  onClick={() => {
                    // Go to random question
                    const randomQ = Math.floor(Math.random() * questions.length);
                    setCurrentQuestion(randomQ);
                  }}
                  className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  Random Question
                </button>
                <button
                  onClick={resetTest}
                  className="w-full px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Reset Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 