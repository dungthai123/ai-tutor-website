import { ListeningQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { ImageGrid } from '../../shared/ImageGrid';

export function DefaultListeningQuestion({ 
  quizModel, 
  isShowTranslation 
}: ListeningQuestionProps) {
  return (
    <div className="default-listening-question">
      {/* Show images from imageList for WORD_MATCHING */}
      {quizModel.imageList && quizModel.imageList.length > 0 && (
        <div className="mb-6">
          <div className="mb-4 p-4 pb-2 bg-purple-50 rounded-lg">
            <h4 className="text-lg font-semibold text-purple-800 mb-2">🎧🧩 Listen and Match</h4>
          </div>
          <ImageGrid images={quizModel.imageList} />
        </div>
      )}

      {/* Question text */}
      {quizModel.question && (
        <div className="question-text p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h4 className="font-semibold text-blue-800 mb-2">📝 Question:</h4>
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