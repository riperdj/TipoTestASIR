
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface QuizConfig {
  questionCount: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  instantFeedback: boolean;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  isFinished: boolean;
  isLoading: boolean;
  error: string | null;
}

export enum AppStep {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  CONFIG = 'CONFIG',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS'
}
