import { ReadingQuizModel } from '../../../types';

export interface ReadingQuestionProps {
  quizModel: ReadingQuizModel;
  isShowTranslation?: boolean;
  isShowExplanation?: boolean;
  isTextSegmentEnabled?: boolean;
  fontClasses?: {
    questionText: string;
    answerText: string;
    transcriptText: string;
    passageText: string;
  };
}

export interface TextAndTranslateProps {
  text: string;
  translation?: string;
  isShowTranslation?: boolean;
  fontClasses?: {
    questionText: string;
    answerText: string;
    transcriptText: string;
    passageText: string;
  };
} 