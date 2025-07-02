import { ListeningQuizModel } from '../../../types';

export interface ListeningQuestionProps {
  quizModel: ListeningQuizModel;
  isShowTranslation?: boolean;
  isShowExplanation?: boolean;
  isShowTranscript?: boolean;
  fontClasses?: {
    questionText: string;
    answerText: string;
    transcriptText: string;
    passageText: string;
  };
} 