export type QuestionCategory =
  | 'Number Sequences'
  | 'Letter Sequences'
  | 'Logical Deduction'
  | 'Verbal Analogies'
  | 'Quantitative Reasoning'
  | 'Spatial Reasoning'
  | 'Visual Pattern'
  | 'Odd-One-Out'
  | 'Working-Memory Style'
  | 'Mixed Reasoning';

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface VisualData {
  type: 'matrix' | 'sequence' | 'grid' | 'shapes';
  elements: any[]; // Definition depends on specific visual type
}

export interface Question {
  id: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  prompt: string;
  type: 'multiple-choice';
  choices: string[];
  correctAnswer: string;
  explanation: string;
  estimatedTime: number; // in seconds
  discriminationWeight: number; // 0.8 - 1.5
  visualData?: VisualData;
  tags?: string[];
}

export interface AnswerRecord {
  questionId: string;
  selectedAnswer: string | null;
  timeSpent: number; // cumulative time spent in ms
  firstViewedAt: number | null; // timestamp
  lastAnsweredAt: number | null; // timestamp
  history: { answer: string | null; timestamp: number }[];
}

export interface TestSession {
  sessionId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startTime: number | null;
  endTime: number | null;
  totalDurationMs: number; // e.g. 70 * 60 * 1000
  elapsedTimeMs: number;
  questionOrder: string[]; // Randomized IDs
  currentIndex: number;
  answers: Record<string, AnswerRecord>;
  flags: Record<string, boolean>;
  integrityEvents: {
    visibilityHidden: number;
    blur: number;
    copy: number;
  };
  settings: {
    theme: 'light' | 'dark' | 'system';
    readingMode: boolean;
    textScale: number;
  };
}

export interface AssessmentResults {
  rawScore: number; // Correct answers
  totalQuestions: number;
  accuracy: number; // 0-1
  difficultyWeightedScore: number;
  categoryScores: Record<QuestionCategory, CategoryResult>;
  difficultyScores: Record<Difficulty, DifficultyResult>;
  consistencyScore: number;
  provisionalReasoningIndex: number;
  provisionalBand: string;
  completionRate: number; // 0-1
  totalTimeMs: number;
  averageTimePerQuestionMs: number;
  medianTimePerQuestionMs: number;
  fastestCorrectMs: number;
  slowestCorrectMs: number;
  answerRevisionCount: number;
  skippedCount: number;
}

export interface CategoryResult {
  attempted: number;
  correct: number;
  accuracy: number;
  averageTimeMs: number;
  medianTimeMs: number;
  weightedPerformance: number;
}

export interface DifficultyResult {
  attempted: number;
  correct: number;
  accuracy: number;
  averageTimeMs: number;
  weightedPerformance: number;
}
