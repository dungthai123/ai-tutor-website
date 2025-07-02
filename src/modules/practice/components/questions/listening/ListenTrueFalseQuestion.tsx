import { ListeningQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';

export function ListenTrueFalseQuestion({ 
  quizModel, 
  isShowTranslation 
}: ListeningQuestionProps) {
  return (
    <div className="listen-true-false">
      <div className="mb-4 p-4 pb-2 bg-green-50 rounded-lg border-l-4 border-green-400">
        <h4 className="font-semibold text-green-800 mb-2">🎧 Listen and Evaluate</h4>
      </div>

      {quizModel.question && (
        <div className="question-text p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
          <h4 className="font-semibold text-amber-800 mb-2">❓ Statement:</h4>
          <TextAndTranslate 
            text={quizModel.question} 
            translation={quizModel.readingTranslation}
            isShowTranslation={isShowTranslation}
          />
        </div>
      )}
    </div>
  );
} 