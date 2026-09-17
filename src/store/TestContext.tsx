import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TestSession, AnswerRecord } from '../types';
import { questions } from '../data/questions';

const LOCAL_STORAGE_KEY = 'patterniq_session_v1';
const TOTAL_DURATION_MS = 70 * 60 * 1000; // 70 minutes

// Helper to shuffle array
const shuffle = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const generateInitialSession = (): TestSession => {
  // Sort by difficulty to create a gradual progression, then shuffle within difficulty bands
  const byDiff = {
    1: questions.filter(q => q.difficulty === 1),
    2: questions.filter(q => q.difficulty === 2),
    3: questions.filter(q => q.difficulty === 3),
    4: questions.filter(q => q.difficulty === 4),
    5: questions.filter(q => q.difficulty === 5),
  };
  
  const questionOrder = [
    ...shuffle(byDiff[1]).map(q => q.id),
    ...shuffle(byDiff[2]).map(q => q.id),
    ...shuffle(byDiff[3]).map(q => q.id),
    ...shuffle(byDiff[4]).map(q => q.id),
    ...shuffle(byDiff[5]).map(q => q.id),
  ];

  return {
    sessionId: Math.random().toString(36).substring(2, 15),
    status: 'not-started',
    startTime: null,
    endTime: null,
    totalDurationMs: TOTAL_DURATION_MS,
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
  startTest: () => void;
  endTest: () => void;
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

  const startTest = () => {
    setSession(prev => ({
      ...prev,
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
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: {
            ...existing,
            selectedAnswer: answer,
            lastAnsweredAt: now,
            history: [...existing.history, { answer, timestamp: now }]
          }
        }
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
      session, startTest, endTest, resetTest, goToQuestion, answerQuestion, toggleFlag, updateTime, recordIntegrityEvent, updateSettings, getTimeRemaining
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
