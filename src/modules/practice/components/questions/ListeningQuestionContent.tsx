import { useState } from 'react';
import { ListeningQuizModel, TypeAnswer } from '../../types';
import { Card } from '@/shared/components/ui/cards/Card';
import { Button } from '@/shared/components/ui/buttons/Button';
import { usePracticeDetailStore } from '@/lib/stores/practiceDetailStore';

interface ListeningQuestionContentProps {
  quizModel: ListeningQuizModel;
  questionIndex: number;
  totalQuestions: number;
}

export function ListeningQuestionContent({ 
  quizModel, 
  questionIndex, 
  totalQuestions 
}: ListeningQuestionContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  const {
    isShowTranslation,
    isShowExplanation,
    isShowTranscript,
    toggleTranslation,
    toggleTranscript
  } = usePracticeDetailStore();

  // Determine audio URL and transcript
  const audioUrl = quizModel.audioContext?.length ? quizModel.audioContext : quizModel.audio;
  const transcript = quizModel.audioContext?.length 
    ? quizModel.transcriptContext 
    : quizModel.transcript;

  const handlePlayAudio = () => {
    if (!audioUrl) return;

    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
    } else {
      const audio = new Audio(audioUrl);
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        console.error('Audio failed to load:', audioUrl);
        setIsPlaying(false);
      };
      
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleRestartAudio = () => {
    if (audioElement) {
      audioElement.currentTime = 0;
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const renderImageGrid = () => {
    if (quizModel.typeAnswer !== TypeAnswer.WORD_MATCHING && 
        quizModel.typeAnswer !== TypeAnswer.IMAGE_SELECTION) {
      return null;
    }

    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Images</h4>
        <div className="grid grid-cols-2 gap-3">
          {quizModel.optionList?.map((option, index) => (
            option.imageUrl && (
              <div key={option.id} className="relative">
                <img
                  src={option.imageUrl}
                  alt={`Option ${index + 1}`}
                  className="w-full h-24 object-cover rounded border border-gray-200"
                />
                <span className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                  {String.fromCharCode(65 + index)}
                </span>
              </div>
            )
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6">
      {/* Question number indicator */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          Listening Question {questionIndex + 1} of {totalQuestions}
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={toggleTranslation}
            className={`text-xs px-2 py-1 ${isShowTranslation ? 'bg-blue-100' : ''}`}
          >
            🌐 Translate
          </Button>
          {transcript && (
            <Button
              variant="secondary"
              onClick={toggleTranscript}
              className={`text-xs px-2 py-1 ${isShowTranscript ? 'bg-green-100' : ''}`}
            >
              📝 Transcript
            </Button>
          )}
        </div>
      </div>

      {/* Audio Player */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🎧</span>
          <span className="font-semibold">Audio</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Click play to listen to the audio clip. You can replay it as many times as needed.
        </p>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={handlePlayAudio}
            className={`flex items-center gap-2 ${
              isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleRestartAudio}
            disabled={!audioElement}
            className="flex items-center gap-2"
          >
            🔄 Restart
          </Button>
        </div>
      </div>

      {/* Image Grid for word matching/image selection */}
      {renderImageGrid()}

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">
          {quizModel.question}
        </h3>
        
        {/* Translation */}
        {isShowTranslation && quizModel.readingTranslation && (
          <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-800">
              <strong>Translation:</strong> {quizModel.readingTranslation}
            </p>
          </div>
        )}
      </div>

      {/* Transcript */}
      {isShowTranscript && transcript && (
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <h4 className="font-medium text-gray-700 mb-2">📝 Transcript</h4>
          <p className="text-gray-600 leading-relaxed">{transcript}</p>
          
          {/* Context translation if available */}
          {isShowTranslation && quizModel.readingTranslationContext && (
            <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
              <p className="text-sm text-yellow-800">
                <strong>Translation:</strong> {quizModel.readingTranslationContext}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {isShowExplanation && quizModel.explanation && (
        <div className="mb-4 p-4 bg-green-50 rounded border-l-4 border-green-400">
          <h4 className="font-medium text-green-700 mb-2">💡 Explanation</h4>
          <p className="text-green-700">{quizModel.explanation}</p>
        </div>
      )}
    </Card>
  );
} 