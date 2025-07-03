import { WritingQuizModel } from '../../../types';

export interface WritingQuestionProps {
  quizModel: WritingQuizModel;
  isShowTranslation?: boolean;
  isShowExplanation?: boolean;
  fontClasses?: {
    questionText: string;
    answerText: string;
    transcriptText: string;
    passageText: string;
  };
} 