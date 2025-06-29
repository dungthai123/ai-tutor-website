import { QuizModel, ListeningQuizModel, PracticeType } from '../../types';
import { Card } from '@/shared/components/ui/cards/Card';

interface QuestionCardProps {
  question: QuizModel;
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <Card className="p-6">
      {/* Audio for listening questions */}
      {question.type === PracticeType.LISTENING && 'audio' in question && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🎧</span>
            <span className="font-semibold">Audio</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Click play to listen to the audio clip. You can replay it as many times as needed.
          </p>
          <div className="bg-gray-200 rounded p-3 text-center text-gray-500">
            🔊 Audio Player (Demo)
            <div className="text-xs mt-1">Audio: {(question as ListeningQuizModel).audio}</div>
          </div>
        </div>
      )}

      {/* Reading passage */}
      {question.type === PracticeType.READING && 'passage' in question && question.passage && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📖</span>
            <span className="font-semibold">Reading Passage</span>
          </div>
          <p className="text-lg leading-relaxed">{question.passage}</p>
        </div>
      )}

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">
          {question.question}
        </h3>
      </div>

      {/* Show transcript for listening questions */}
      {question.type === PracticeType.LISTENING && 'transcript' in question && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <details>
            <summary className="cursor-pointer font-medium text-gray-700">
              Show Transcript
            </summary>
            <p className="mt-2 text-gray-600">{(question as ListeningQuizModel).transcript}</p>
          </details>
        </div>
      )}
    </Card>
  );
} 