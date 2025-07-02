import { ListeningQuestionProps } from './types';
import { TextAndTranslate } from '../../shared/TextAndTranslate';
import { ImageGrid } from '../../shared/ImageGrid';

export function ListenPictureMatchQuestion({ 
  quizModel, 
  isShowTranslation 
}: ListeningQuestionProps) {
  return (
    <div className="listen-picture-match">
      <div className="mb-4 p-4 pb-2 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
        <h4 className="font-semibold text-indigo-800 mb-2">🎧🖼️ Listen and Match Picture</h4>
      </div>
      
      {/* Show images from imageList if available */}
      {quizModel.imageList && quizModel.imageList.length > 0 && (
        <div className="mb-6">
          <h5 className="font-medium text-gray-700 mb-3">Choose the correct image:</h5>
          <ImageGrid images={quizModel.imageList} />
        </div>
      )}

      {/* Show images from optionList if no imageList */}
      {(!quizModel.imageList || quizModel.imageList.length === 0) && 
       quizModel.optionList && quizModel.optionList.some(opt => opt.imageUrl) && (
        <div className="mb-6">
          <h5 className="font-medium text-gray-700 mb-3">Choose the correct image:</h5>
          <ImageGrid 
            images={quizModel.optionList.map(opt => opt.imageUrl || '').filter(Boolean)} 
          />
        </div>
      )}

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