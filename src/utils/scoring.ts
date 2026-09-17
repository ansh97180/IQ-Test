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
    'Algorithmic Reasoning': { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
    'Mathematical Logic': { attempted: 0, correct: 0, timeMs: [], weighted: 0 },
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
  // Wait, totalQuestions might be 60 now, not all questions.
  // Actually, we must use `session.questionOrder` for the theoretical max
  const maxPossibleSessionWeighted = session.questionOrder.reduce((sum, qId) => {
    const q = qMap.get(qId);
    return q ? sum + (diffWeights[q.difficulty] * q.discriminationWeight) : sum;
  }, 0);

  const normWeighted = difficultyWeightedScore / (maxPossibleSessionWeighted || 1);
  
  // Advanced Algorithms & Memory Analysis
  // 1. Guessing Penalty: Very fast but wrong answers (< 3000ms)
  let guessingPenaltyCount = 0;
  let rapidAccurateBonus = 0;

  session.questionOrder.forEach(qId => {
    const ans = session.answers[qId];
    if (ans && ans.selectedAnswer) {
      const q = qMap.get(qId);
      if (q) {
        if (ans.selectedAnswer !== q.correctAnswer && ans.timeSpent < 3000) {
          guessingPenaltyCount++;
        } else if (ans.selectedAnswer === q.correctAnswer && ans.timeSpent < 10000) {
          // Bonus for getting a complex question right very quickly
          rapidAccurateBonus += (diffWeights[q.difficulty] * 0.5);
        }
      }
    }
  });
  const guessingPenalty = Math.min(15, guessingPenaltyCount * 2); // Max 15 penalty points
  const speedBonus = Math.min(10, rapidAccurateBonus); // Max 10 bonus points

  // 2. Cognitive Processing Speed (CPS):
  // Based on median time of correct answers (lower is better, mapped to 70-140)
  const medianCorrectTime = median(correctTimes);
  // Assume ~15000ms is 100, 5000ms is 130
  const cpsIndex = correctTimes.length ? Math.round(145 - (medianCorrectTime / 1000) * 1.5) : 70;
  const cognitiveProcessingSpeed = Math.max(70, Math.min(145, cpsIndex));

  // 3. Working Memory Capacity (WMC)
  // Accuracy in 'Working-Memory Style', 'Spatial Reasoning', 'Logical Deduction'
  const wmAcc = ((catResult['Working-Memory Style']?.accuracy || 0) + 
                (catResult['Spatial Reasoning']?.accuracy || 0) + 
                (catResult['Logical Deduction']?.accuracy || 0)) / 3;
  const workingMemoryCapacity = Math.round(70 + (wmAcc * 70));

  // 4. Fluid Intelligence (Gf)
  // Pattern recognition, spatial, logic
  const gfAcc = ((catResult['Visual Pattern']?.accuracy || 0) + 
                (catResult['Number Sequences']?.accuracy || 0) + 
                (catResult['Letter Sequences']?.accuracy || 0)) / 3;
  const fluidIntelligence = Math.round(70 + (gfAcc * 70));

  // 5. Crystallized Intelligence (Gc)
  // Replaced with structured math & logic
  const gcAcc = ((catResult['Algorithmic Reasoning']?.accuracy || 0) + 
                (catResult['Mathematical Logic']?.accuracy || 0)) / 2;
  const crystallizedIntelligence = Math.round(70 + (gcAcc * 70));

  // 6. Multi-dimensional G-factor Score
  // Weighted average of Gf, Gc, WMC, CPS, adjusted by consistency and penalized by guessing, rewarded by speed
  const gFactorRaw = (fluidIntelligence * 0.4) + (crystallizedIntelligence * 0.2) + (workingMemoryCapacity * 0.3) + (cognitiveProcessingSpeed * 0.1);
  const gFactorScore = Math.max(70, Math.round(gFactorRaw * consistencyScore - guessingPenalty + speedBonus));

  const indexRaw = (normWeighted * 100);
  // Map indexRaw to a somewhat familiar scale, centered around 100
  let provisionalReasoningIndex = Math.round(70 + (indexRaw * 0.75)); 
  
  // Blend provisional Reasoning with the new deep G-factor for a highly accurate ultimate score
  provisionalReasoningIndex = Math.round((provisionalReasoningIndex * 0.4) + (gFactorScore * 0.6));

  let band = '';
  if (provisionalReasoningIndex < 90) band = 'Below Average';
  else if (provisionalReasoningIndex < 110) band = 'Average';
  else if (provisionalReasoningIndex < 120) band = 'High Average';
  else if (provisionalReasoningIndex < 130) band = 'Superior';
  else band = 'Very Superior';

  return {
    rawScore,
    totalQuestions: session.questionOrder.length,
    accuracy: rawScore / (session.questionOrder.length || 1),
    difficultyWeightedScore,
    categoryScores: catResult,
    difficultyScores: diffResult,
    consistencyScore,
    provisionalReasoningIndex,
    provisionalBand: band,
    gFactorScore,
    workingMemoryCapacity,
    fluidIntelligence,
    crystallizedIntelligence,
    cognitiveProcessingSpeed,
    guessingPenalty,
    speedBonus,
    completionRate: (session.questionOrder.length - skippedCount) / (session.questionOrder.length || 1),
    totalTimeMs: session.elapsedTimeMs,
    averageTimePerQuestionMs: average(allTimes),
    medianTimePerQuestionMs: median(allTimes),
    fastestCorrectMs: correctTimes.length ? Math.min(...correctTimes) : 0,
    slowestCorrectMs: correctTimes.length ? Math.max(...correctTimes) : 0,
    answerRevisionCount,
    skippedCount
  };
};
