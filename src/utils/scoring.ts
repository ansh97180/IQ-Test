import { AssessmentResults, TestSession, QuestionCategory, Difficulty, CategoryResult, DifficultyResult } from '../types';
import { questions } from '../data/questions';

export const calculateResults = (session: TestSession): AssessmentResults => {
  const qMap = new Map(questions.map(q => [q.id, q]));
  
  let rawScore = 0;
  let difficultyWeightedScore = 0;
  let answerRevisionCount = 0;
  let skippedCount = 0;

  const categories: Record<QuestionCategory, { attempted: number; correct: number; timeMs: number[]; weighted: number }> = {
    'Number Sequences': { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    'Letter Sequences': { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    'Logical Deduction': { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    'Verbal Analogies': { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    'Quantitative Reasoning': { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    'Spatial Reasoning': { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    'Visual Pattern': { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    'Odd-One-Out': { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    'Working-Memory Style': { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    'Mixed Reasoning': { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
  };

  const difficulties: Record<Difficulty, { attempted: number; correct: number; timeMs: number[]; weighted: number }> = {
    1: { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    2: { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    3: { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    4: { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    5: { attempted: 0, correct: 0, timeMs: [], weighted: 0 }
  };

  const diffWeights = { 1: 0.80, 2: 0.95, 3: 1.10, 4: 1.25, 5: 1.40 };
  const allTimes: number[] = [];
  const correctTimes: number[] = [];

  session.questionOrder.forEach(qId => {
    const q = qMap.get(qId);
    if (!q) return;
    
    const ans = session.answers[qId];
    if (!ans || !ans.selectedAnswer) {
      skippedCount++;
      return;
    }

    const isCorrect = ans.selectedAnswer === q.correctAnswer;
    const timeSpent = ans.timeSpent;
    const itemWeight = diffWeights[q.difficulty] * q.discriminationWeight;

    categories[q.category].attempted++;
    categories[q.category].timeMs.push(timeSpent);
    difficulties[q.difficulty].attempted++;
    difficulties[q.difficulty].timeMs.push(timeSpent);
    
    if (ans.history.length > 1) {
      answerRevisionCount += ans.history.length - 1;
    }

    allTimes.push(timeSpent);

    if (isCorrect) {
      rawScore++;
      difficultyWeightedScore += itemWeight;
      categories[q.category].correct++;
      categories[q.category].weighted += itemWeight;
      difficulties[q.difficulty].correct++;
      difficulties[q.difficulty].weighted += itemWeight;
      correctTimes.push(timeSpent);
    }
  });

  const median = (arr: number[]) => {
    if (arr.length === 0) return 0;
    const s = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  };

  const average = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const catResult = {} as Record<QuestionCategory, CategoryResult>;
  (Object.keys(categories) as QuestionCategory[]).forEach(c => {
    const d = categories[c];
    catResult[c] = {
      attempted: d.attempted,
      correct: d.correct,
      accuracy: d.attempted ? d.correct / d.attempted : 0,
      averageTimeMs: average(d.timeMs),
      medianTimeMs: median(d.timeMs),
      weightedPerformance: d.weighted
    };
  });

  const diffResult = {} as Record<Difficulty, DifficultyResult>;
  ([1,2,3,4,5] as Difficulty[]).forEach(d => {
    const data = difficulties[d];
    diffResult[d] = {
      attempted: data.attempted,
      correct: data.correct,
      accuracy: data.attempted ? data.correct / data.attempted : 0,
      averageTimeMs: average(data.timeMs),
      weightedPerformance: data.weighted
    };
  });

  // Calculate consistency: deviation of accuracy across categories
  const accuracies = Object.values(catResult).filter(c => c.attempted > 0).map(c => c.accuracy);
  const meanAcc = average(accuracies);
  const variance = accuracies.reduce((acc, val) => acc + Math.pow(val - meanAcc, 2), 0) / (accuracies.length || 1);
  const consistencyScore = Math.max(0, 1 - Math.sqrt(variance)); // 1 is perfectly consistent

  // Provisional Reasoning Index Calculation (Design choice model)
  // Max possible difficulty weighted score: sum of all weights
  const maxWeighted = questions.reduce((sum, q) => sum + (diffWeights[q.difficulty] * q.discriminationWeight), 0);
  
  // Normalize weighted score (0 to 1)
  const normWeighted = difficultyWeightedScore / maxWeighted;
  
  // Speed contribution: tiny bonus for completing correctly faster than average, max 5% bump
  const speedBonus = 0; // Keeping it zero as requested "never reward wrong answers" and "reasonable time not punished".

  const indexRaw = (normWeighted * 100);
  
  // Map indexRaw to a somewhat familiar scale, centered around 100
  // Let's say a completely average performance (50% correctness on an escalating test) maps to ~100.
  // 100% correct would map to ~145.
  const provisionalReasoningIndex = Math.round(70 + (indexRaw * 0.75)); 

  let band = '';
  if (provisionalReasoningIndex < 90) band = 'Below 90 provisional reasoning band';
  else if (provisionalReasoningIndex < 100) band = '90–99';
  else if (provisionalReasoningIndex < 110) band = '100–109';
  else if (provisionalReasoningIndex < 120) band = '110–119';
  else if (provisionalReasoningIndex < 130) band = '120–129';
  else band = '130+';

  return {
    rawScore,
    totalQuestions: questions.length,
    accuracy: rawScore / questions.length,
    difficultyWeightedScore,
    categoryScores: catResult,
    difficultyScores: diffResult,
    consistencyScore,
    provisionalReasoningIndex,
    provisionalBand: band,
    completionRate: (questions.length - skippedCount) / questions.length,
    totalTimeMs: session.elapsedTimeMs,
    averageTimePerQuestionMs: average(allTimes),
    medianTimePerQuestionMs: median(allTimes),
    fastestCorrectMs: correctTimes.length ? Math.min(...correctTimes) : 0,
    slowestCorrectMs: correctTimes.length ? Math.max(...correctTimes) : 0,
    answerRevisionCount,
    skippedCount
  };
};
