interface SubtitlesSectionProps {
  isShowTranscript: boolean;
  transcript?: string;
  transcriptContext?: string;
  isShowTranslation?: boolean;
  translation?: string;
  fontClasses?: {
    questionText: string;
    answerText: string;
    transcriptText: string;
    passageText: string;
  };
}

export function SubtitlesSection({ 
  isShowTranscript,
  transcript,
  transcriptContext,
  isShowTranslation,
  translation,
  fontClasses
}: SubtitlesSectionProps) {
  if (!isShowTranscript) return null;

  const displayTranscript = transcriptContext || transcript;
  
  if (!displayTranscript) return null;

  return (
    <div className="subtitles-section mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">📝</span>
        <h4 className="font-medium text-gray-700">Audio Transcript</h4>
      </div>
      
      <div className="transcript-content">
        <p className={`text-gray-600 leading-relaxed whitespace-pre-line ${fontClasses?.transcriptText || 'text-base'}`}>
          {displayTranscript}
        </p>
        
        {/* Translation */}
        {isShowTranslation && translation && (
          <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
            <p className={`text-yellow-800 ${fontClasses?.transcriptText || 'text-sm'}`}>
              <strong>Translation:</strong> {translation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 