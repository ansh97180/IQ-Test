import { Question } from '../../types';

export const getLetterSequences = (): Question[] => {
  return [
    {
      id: 'ls_1', category: 'Letter Sequences', difficulty: 1, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\nA, C, E, G, ...',
      choices: ['H', 'I', 'J', 'K'], correctAnswer: 'I',
      explanation: 'The sequence skips one letter in the alphabet each time (+2 positions).', estimatedTime: 15, discriminationWeight: 0.8
    },
    {
      id: 'ls_2', category: 'Letter Sequences', difficulty: 1, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\nZ, X, V, T, ...',
      choices: ['S', 'R', 'Q', 'P'], correctAnswer: 'R',
      explanation: 'The sequence goes backwards in the alphabet, skipping one letter (-2 positions).', estimatedTime: 20, discriminationWeight: 0.85
    },
    {
      id: 'ls_3', category: 'Letter Sequences', difficulty: 2, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\nA, D, H, M, ...',
      choices: ['Q', 'R', 'S', 'T'], correctAnswer: 'S',
      explanation: 'The gaps between letters increase by one each time: +3, +4, +5, +6. (M is 13, 13+6 = 19 = S).', estimatedTime: 25, discriminationWeight: 0.95
    },
    {
      id: 'ls_4', category: 'Letter Sequences', difficulty: 2, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\nA, Z, B, Y, C, ...',
      choices: ['W', 'X', 'D', 'V'], correctAnswer: 'X',
      explanation: 'The sequence interleaves two patterns: A, B, C (forward) and Z, Y, X (backward).', estimatedTime: 25, discriminationWeight: 1.0
    },
    {
      id: 'ls_5', category: 'Letter Sequences', difficulty: 3, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\nB, E, I, N, ...',
      choices: ['S', 'T', 'U', 'R'], correctAnswer: 'T',
      explanation: 'Positions in alphabet: 2, 5, 9, 14. Differences: +3, +4, +5. Next difference is +6. 14+6 = 20 (T).', estimatedTime: 30, discriminationWeight: 1.1
    },
    {
      id: 'ls_6', category: 'Letter Sequences', difficulty: 3, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\nC, F, E, H, G, J, ...',
      choices: ['K', 'I', 'L', 'M'], correctAnswer: 'I',
      explanation: 'The sequence alternates between +3 and -1. F-E is -1. E to H is +3. H to G is -1. G to J is +3. J to I is -1.', estimatedTime: 35, discriminationWeight: 1.15
    },
    {
      id: 'ls_7', category: 'Letter Sequences', difficulty: 4, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\nJ, F, M, A, M, J, ...',
      choices: ['J', 'F', 'M', 'A'], correctAnswer: 'J',
      explanation: 'These are the first letters of the months of the year: January, February, March, April, May, June, July (J).', estimatedTime: 40, discriminationWeight: 1.25
    },
    {
      id: 'ls_8', category: 'Letter Sequences', difficulty: 4, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\nO, T, T, F, F, S, S, ...',
      choices: ['E', 'N', 'T', 'O'], correctAnswer: 'E',
      explanation: 'First letters of numbers: One, Two, Three, Four, Five, Six, Seven, Eight (E).', estimatedTime: 40, discriminationWeight: 1.3
    },
    {
      id: 'ls_9', category: 'Letter Sequences', difficulty: 5, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\nA, B, D, G, K, P, ...',
      choices: ['V', 'W', 'U', 'X'], correctAnswer: 'V',
      explanation: 'The letter positions are 1, 2, 4, 7, 11, 16. The differences are +1, +2, +3, +4, +5. The next is +6, making it 22 (V).', estimatedTime: 45, discriminationWeight: 1.4
    },
    {
      id: 'ls_10', category: 'Letter Sequences', difficulty: 5, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\nZ, W, S, N, H, ...',
      choices: ['B', 'A', 'C', 'D'], correctAnswer: 'A',
      explanation: 'The positions are 26, 23, 19, 14, 8. The differences are -3, -4, -5, -6. The next is -7. 8 - 7 = 1 (A).', estimatedTime: 50, discriminationWeight: 1.45
    }
  ];
};
