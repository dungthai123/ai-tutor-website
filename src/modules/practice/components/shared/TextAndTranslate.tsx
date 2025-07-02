interface TextAndTranslateProps {
  text: string;
  translation?: string;
  isShowTranslation?: boolean;
  className?: string;
  fontClasses?: {
    questionText: string;
    answerText: string;
    transcriptText: string;
    passageText: string;
  };
}

export function TextAndTranslate({ 
  text, 
  translation, 
  isShowTranslation, 
  className = "",
  fontClasses
}: TextAndTranslateProps) {
  return (
    <div className={`text-and-translate ${className}`}>
      <p className={`text-gray-700 leading-relaxed mb-2 ${fontClasses?.passageText || 'text-base'}`}>{text}</p>
      
      {isShowTranslation && translation && (
        <div className="translation p-2 bg-yellow-50 rounded border-l-3 border-yellow-400">
          <p className={`text-yellow-800 ${fontClasses?.passageText || 'text-sm'}`}>
            <span className="font-medium">Translation:</span> {translation}
          </p>
        </div>
      )}
    </div>
  );
} 