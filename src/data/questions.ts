import { Question } from '../types';
import { getNumberSequences } from './categories/numberSequences';
import { getLetterSequences } from './categories/letterSequences';
import { getLogicalDeduction } from './categories/logicalDeduction';
import { getAlgorithmicReasoning } from './categories/algorithmicReasoning';
import { getMathematicalLogic } from './categories/mathematicalLogic';
import { getSpatial } from './categories/spatial';
import { getVisual } from './categories/visual';
import { getOddOneOut } from './categories/oddOneOut';
import { getWorkingMemory } from './categories/workingMemory';
import { getMixed } from './categories/mixed';

export const questions: Question[] = [
  ...getNumberSequences(),
  ...getLetterSequences(),
  ...getLogicalDeduction(),
  ...getAlgorithmicReasoning(),
  ...getMathematicalLogic(),
  ...getSpatial(),
  ...getVisual(),
  ...getOddOneOut(),
  ...getWorkingMemory(),
  ...getMixed(),
];

export const validateQuestions = () => {
  const errors: string[] = [];
  const ids = new Set<string>();

  if (questions.length < 60) {
    errors.push(`Expected at least 60 questions, found ${questions.length}`);
  }

  questions.forEach((q) => {
    if (ids.has(q.id)) errors.push(`Duplicate ID: ${q.id}`);
    ids.add(q.id);

    if (!q.category) errors.push(`${q.id} missing category`);
    if (q.difficulty < 1 || q.difficulty > 5) errors.push(`${q.id} invalid difficulty`);
    if (!q.choices || q.choices.length < 2) errors.push(`${q.id} needs >= 2 choices`);
    if (!q.correctAnswer) errors.push(`${q.id} missing correctAnswer`);
    if (!q.choices.includes(q.correctAnswer)) errors.push(`${q.id} correctAnswer not in choices`);
    
    // Check for exact one correct answer match
    const matches = q.choices.filter(c => c === q.correctAnswer);
    if (matches.length !== 1) errors.push(`${q.id} choices must contain exactly one match for correctAnswer`);
    
    if (!q.explanation) errors.push(`${q.id} missing explanation`);
    if (!q.estimatedTime || q.estimatedTime <= 0) errors.push(`${q.id} invalid estimatedTime`);
    if (!q.discriminationWeight || q.discriminationWeight < 0.5 || q.discriminationWeight > 2.0) errors.push(`${q.id} invalid discriminationWeight`);
  });

  return errors;
};
