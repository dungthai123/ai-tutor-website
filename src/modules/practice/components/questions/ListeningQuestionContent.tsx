/**
 * ListeningQuestionContent - HSK Listening Test Component
 * 
 * Implements HSK-specific listening question type handling as per the plan:
 * - Uses questionType field to route to specific question handlers
 * - Real audio player with progress tracking, seeking, and playback speed control
 * - Integrates SubtitlesSection component for transcript display
 * - Supports specialized components for different listening question types
 * 
 * Supported Question Types:
 * - LISTEN_TRUE_FALSE: Audio-based true/false questions
 * - LISTEN_MATCH_PICTURE_WITH_AUDIO: Audio-picture matching tasks
 * - Default: Falls back to general listening question handler
 * 
 * Features:
 * - Real-time audio progress tracking
 * - Clickable progress bar for seeking
 * - Variable playback speed (1x, 1.25x, 1.5x, 0.75x)
 * - Integrated transcript toggle
 * - Translation support
 */

import { useState, useEffect, useRef } from 'react';
import { ListeningQuizModel, ListeningQuestionType } from '../../types';
import { Button } from '@/shared/components/ui/buttons/Button';
import { useTestSessionStoreForReadingAndListening } from '@/lib/stores/testSessionStoreForReadingAndListening';
import { SubtitlesSection } from '../shared/SubtitlesSection';
import { AspectRatioImage } from '../shared/AspectRatioImage';
import { getFontSizeClasses } from '../../utils';

// Import specific question type components
import { 
  ListenTrueFalseQuestion,
  ListenPictureMatchQuestion,
  DefaultListeningQuestion
} from './listening';

interface ListeningQuestionContentProps {
  quizModel: ListeningQuizModel;
  questionIndex: number;
  totalQuestions: number;
}

export function ListeningQuestionContent({ 
  quizModel, 
  questionIndex 
}: ListeningQuestionContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const {
    isShowTranslation,
    isShowExplanation,
    isShowTranscript,
    fontSize,
    toggleTranslation,
    toggleTranscript
  } = useTestSessionStoreForReadingAndListening();

  const fontClasses = getFontSizeClasses(fontSize);

  // Determine audio URL and transcript
  const audioUrl = quizModel.audioContext?.length ? quizModel.audioContext : quizModel.audio;
  const transcript = quizModel.audioContext?.length 
    ? quizModel.transcriptContext 
    : quizModel.transcript;

  // Render by specific question type based on questionType field
  const renderByQuestionType = () => {
    const questionProps = {
      quizModel,
      isShowTranslation,
      isShowExplanation,
      isShowTranscript,
      fontClasses
    };

    switch (quizModel.questionType) {
      case ListeningQuestionType.LISTEN_TRUE_FALSE:
        return <ListenTrueFalseQuestion {...questionProps} />;
      case ListeningQuestionType.LISTEN_MATCH_PICTURE_WITH_AUDIO:
        return <ListenPictureMatchQuestion {...questionProps} />;
      default:
        return <DefaultListeningQuestion {...questionProps} />;
    }
  };

  // Initialize audio element
  useEffect(() => {
    if (audioUrl && !audioRef.current) {
      const audio = new Audio(audioUrl);
      audio.preload = 'metadata';
      
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
      
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      audio.onerror = () => {
        console.error('Audio failed to load:', audioUrl);
        setIsPlaying(false);
      };
      
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const handlePlayAudio = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePlaybackRateChange = () => {
    const rates = [1, 1.25, 1.5, 0.75];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Audio player matching the design in the image
  const renderAudioPlayer = () => {
    if (!audioUrl) {
      return (
        <div className="mb-8">
          <div className="inline-flex items-center px-3 py-1 mb-4 bg-black text-white text-sm font-medium rounded-full">
            Câu {questionIndex + 1}
          </div>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-gray-500 text-center">No audio available for this question</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-8">
        {/* Question number badge */}
        <div className="inline-flex items-center px-3 py-1 mb-4 bg-black text-white text-sm font-medium rounded-full">
          Câu {questionIndex + 1}
        </div>
        
        {/* Audio player controls */}
        <div className="bg-blue-100 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={handlePlayAudio}
              disabled={!audioUrl}
              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            {/* Audio progress bar */}
            <div className="flex-1 flex items-center gap-3">
              <div 
                className="flex-1 bg-blue-300 rounded-full h-2 relative cursor-pointer"
                onClick={handleProgressClick}
              >
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-150"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
                <div 
                  className="absolute top-0 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1 -translate-x-2 transition-all duration-150"
                  style={{ left: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 font-medium min-w-[40px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>
          
          {/* Additional controls */}
          <div className="flex items-center gap-2">
            {transcript && (
              <button 
                onClick={toggleTranscript}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  isShowTranscript 
                    ? 'bg-blue-300 text-blue-800' 
                    : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
                }`}
              >
                📝 Xem phụ đề
              </button>
            )}
            <button 
              onClick={handlePlaybackRateChange}
              className="px-3 py-1 bg-blue-200 text-blue-700 text-sm rounded-md hover:bg-blue-300 transition-colors"
            >
              🔄 {playbackRate}x
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* Control buttons */}
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="secondary"
          onClick={toggleTranslation}
          className={`text-xs px-3 py-1 ${isShowTranslation ? 'bg-blue-100' : ''}`}
        >
          🌐 Translate
        </Button>
        {transcript && (
          <Button
            variant="secondary"
            onClick={toggleTranscript}
            className={`text-xs px-3 py-1 ${isShowTranscript ? 'bg-green-100' : ''}`}
          >
            📝 Transcript
          </Button>
        )}
      </div>

      {/* Question Image - displayed above audio player when available */}
      {quizModel.imageUrl && (
        <div className="mb-6">
          <AspectRatioImage 
            src={quizModel.imageUrl}
            alt="Question image"
            aspectRatio="video"
          />
        </div>
      )}

      {/* Audio Player */}
      {renderAudioPlayer()}

      {/* Render specific question type content */}
      {renderByQuestionType()}

      {/* Subtitles Section - using the specialized component */}
      <SubtitlesSection 
        isShowTranscript={isShowTranscript}
        transcript={transcript}
        transcriptContext={quizModel.transcriptContext}
        isShowTranslation={isShowTranslation}
        translation={quizModel.readingTranslationContext}
        fontClasses={fontClasses}
      />

      {/* Explanation */}
      {isShowExplanation && quizModel.explanation && (
        <div className="mb-4 p-4 bg-green-50 rounded border-l-4 border-green-400">
          <h4 className="font-medium text-green-700 mb-2">💡 Explanation</h4>
          <p className="text-green-700">{quizModel.explanation}</p>
        </div>
      )}

      {/* Question Type Info */}
      {quizModel.questionType && (
        <div className="mt-4 text-xs text-gray-500">
          Question Type: {quizModel.questionType}
        </div>
      )}
    </div>
  );
} 