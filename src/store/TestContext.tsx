import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TestSession, AnswerRecord } from '../types';
import { questions } from '../data/questions';

const LOCAL_STORAGE_KEY = 'patterniq_session_v1';

// Helper to shuffle array
const shuffle = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const generateInitialSession = (durationMinutes: number = 30): TestSession => {
  // Sort by difficulty to create a gradual progression, then shuffle within difficulty bands
  const byDiff = {
    1: questions.filter(q => q.difficulty === 1),
    2: questions.filter(q => q.difficulty === 2),
    3: questions.filter(q => q.difficulty === 3),
    4: questions.filter(q => q.difficulty === 4),
    5: questions.filter(q => q.difficulty === 5),
  };
  
  // Pick a random subset from each difficulty to keep it balanced but different every time
  const pickSubset = (arr: any[], count: number) => shuffle(arr).slice(0, count);

  // Dynamic question count based on duration (roughly 1 question per minute for fluid testing, or slightly faster for easy ones)
  let counts = { d1: 5, d2: 5, d3: 5, d4: 3, d5: 2 }; // Default 20 q (~20 mins)
  
  if (durationMinutes === 10) {
    counts = { d1: 3, d2: 3, d3: 2, d4: 1, d5: 1 }; // 10 questions
  } else if (durationMinutes === 20) {
    counts = { d1: 5, d2: 5, d3: 5, d4: 3, d5: 2 }; // 20 questions
  } else if (durationMinutes === 30) {
    counts = { d1: 10, d2: 8, d3: 6, d4: 4, d5: 2 }; // 30 questions
  } else if (durationMinutes === 60) {
    counts = { d1: 15, d2: 15, d3: 15, d4: 10, d5: 5 }; // 60 questions
  }

  const questionOrder = [
    ...pickSubset(byDiff[1], counts.d1).map(q => q.id),
    ...pickSubset(byDiff[2], counts.d2).map(q => q.id),
    ...pickSubset(byDiff[3], counts.d3).map(q => q.id),
    ...pickSubset(byDiff[4], counts.d4).map(q => q.id),
    ...pickSubset(byDiff[5], counts.d5).map(q => q.id),
  ];

  return {
    sessionId: Math.random().toString(36).substring(2, 15),
    status: 'not-started',
    startTime: null,
    endTime: null,
    totalDurationMs: durationMinutes * 60 * 1000,
    elapsedTimeMs: 0,
    questionOrder,
    currentIndex: 0,
    answers: {},
    flags: {},
    integrityEvents: { visibilityHidden: 0, blur: 0, copy: 0 },
    settings: { theme: 'system', readingMode: false, textScale: 1 }
  };
};

interface TestContextType {
  session: TestSession;
  startTest: (durationMins: number) => void;
  endTest: () => void;
  submitSession: () => void;
  resetTest: () => void;
  goToQuestion: (index: number) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  toggleFlag: (questionId: string) => void;
  updateTime: (ms: number) => void;
  recordIntegrityEvent: (event: keyof TestSession['integrityEvents']) => void;
  updateSettings: (settings: Partial<TestSession['settings']>) => void;
  getTimeRemaining: () => number;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<TestSession>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.status === 'in-progress') {
           // Recalculate elapsed time if needed, but for simplicity we rely on the saved elapsedTimeMs
           // or we can calculate based on Date.now() - startTime
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse stored session');
      }
    }
    return generateInitialSession();
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const startTest = (durationMins: number) => {
    // Need to reset session with new duration questions if it was just created
    setSession(prev => ({
      ...generateInitialSession(durationMins),
      status: 'in-progress',
      startTime: Date.now()
    }));
  };

  const endTest = () => {
    setSession(prev => ({
      ...prev,
      status: 'completed',
      endTime: Date.now()
    }));
  };

  const submitSession = () => endTest();

  const resetTest = () => {
    setSession(generateInitialSession());
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < session.questionOrder.length) {
      setSession(prev => {
        const questionId = prev.questionOrder[index];
        const answers = { ...prev.answers };
        if (!answers[questionId]) {
           answers[questionId] = { questionId, selectedAnswer: null, timeSpent: 0, firstViewedAt: Date.now(), lastAnsweredAt: null, history: [] };
        } else if (!answers[questionId].firstViewedAt) {
           answers[questionId].firstViewedAt = Date.now();
        }
        return { ...prev, currentIndex: index, answers };
      });
    }
  };

  const answerQuestion = (questionId: string, answer: string) => {
    setSession(prev => {
      const now = Date.now();
      const existing = prev.answers[questionId] || { questionId, selectedAnswer: null, timeSpent: 0, firstViewedAt: now, lastAnsweredAt: null, history: [] };
      const nextAnswers = {
        ...prev.answers,
        [questionId]: {
          ...existing,
          selectedAnswer: answer,
          lastAnsweredAt: now,
          history: [...existing.history, { answer, timestamp: now }]
        }
      };

      // Auto-advance logic (optional, but requested for smooth flow)
      // Only auto-advance if it's the current question and not the last one
      let nextIndex = prev.currentIndex;
      if (prev.questionOrder[prev.currentIndex] === questionId && prev.currentIndex < prev.questionOrder.length - 1) {
        nextIndex = prev.currentIndex + 1;
        const nextQId = prev.questionOrder[nextIndex];
        if (!nextAnswers[nextQId]) {
           nextAnswers[nextQId] = { questionId: nextQId, selectedAnswer: null, timeSpent: 0, firstViewedAt: now, lastAnsweredAt: null, history: [] };
        }
      }

      return {
        ...prev,
        currentIndex: nextIndex,
        answers: nextAnswers
      };
    });
  };


  const toggleFlag = (questionId: string) => {
    setSession(prev => ({
      ...prev,
      flags: { ...prev.flags, [questionId]: !prev.flags[questionId] }
    }));
  };

  const updateTime = (ms: number) => {
    if (session.status !== 'in-progress') return;
    setSession(prev => {
      const currentQId = prev.questionOrder[prev.currentIndex];
      const answers = { ...prev.answers };
      if (answers[currentQId]) {
        answers[currentQId] = { ...answers[currentQId], timeSpent: answers[currentQId].timeSpent + ms };
      }
      return { ...prev, elapsedTimeMs: prev.elapsedTimeMs + ms, answers };
    });
  };

  const recordIntegrityEvent = (event: keyof TestSession['integrityEvents']) => {
    setSession(prev => ({
      ...prev,
      integrityEvents: {
        ...prev.integrityEvents,
        [event]: prev.integrityEvents[event] + 1
      }
    }));
  };

  const updateSettings = (settings: Partial<TestSession['settings']>) => {
    setSession(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
  };

  const getTimeRemaining = () => {
    return Math.max(0, session.totalDurationMs - session.elapsedTimeMs);
  };

  return (
    <TestContext.Provider value={{
      session, startTest, endTest, submitSession, resetTest, goToQuestion, answerQuestion, toggleFlag, updateTime, recordIntegrityEvent, updateSettings, getTimeRemaining
    }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) throw new Error('useTest must be used within a TestProvider');
  return context;
};
