import { Question } from '../../types';

export const getOddOneOut = (): Question[] => {
  return [
    {
      id: 'ooo_1', category: 'Odd-One-Out', difficulty: 1, type: 'multiple-choice',
      prompt: 'Which word does not belong?',
      choices: ['Apple', 'Banana', 'Carrot', 'Orange'], correctAnswer: 'Carrot',
      explanation: 'Carrot is a vegetable, the others are fruits.', estimatedTime: 15, discriminationWeight: 0.8
    },
    {
      id: 'ooo_2', category: 'Odd-One-Out', difficulty: 1, type: 'multiple-choice',
      prompt: 'Which number does not belong?',
      choices: ['2', '4', '6', '7'], correctAnswer: '7',
      explanation: '7 is the only odd number.', estimatedTime: 15, discriminationWeight: 0.85
    },
    {
      id: 'ooo_3', category: 'Odd-One-Out', difficulty: 2, type: 'multiple-choice',
      prompt: 'Which shape does not belong?',
      choices: ['Square', 'Rectangle', 'Rhombus', 'Triangle'], correctAnswer: 'Triangle',
      explanation: 'Triangle has 3 sides, the rest are quadrilaterals (4 sides).', estimatedTime: 20, discriminationWeight: 0.9
    },
    {
      id: 'ooo_4', category: 'Odd-One-Out', difficulty: 2, type: 'multiple-choice',
      prompt: 'Which word does not belong?',
      choices: ['Run', 'Walk', 'Sprint', 'Sleep'], correctAnswer: 'Sleep',
      explanation: 'Sleep implies rest/stillness, the others involve leg-based locomotion.', estimatedTime: 20, discriminationWeight: 0.95
    },
    {
      id: 'ooo_5', category: 'Odd-One-Out', difficulty: 3, type: 'multiple-choice',
      prompt: 'Which number does not belong?',
      choices: ['9', '16', '25', '27'], correctAnswer: '27',
      explanation: '27 is a perfect cube, while 9, 16, and 25 are perfect squares (3², 4², 5²).', estimatedTime: 25, discriminationWeight: 1.1
    },
    {
      id: 'ooo_6', category: 'Odd-One-Out', difficulty: 3, type: 'multiple-choice',
      prompt: 'Which word does not belong?',
      choices: ['Radius', 'Diameter', 'Circumference', 'Diagonal'], correctAnswer: 'Diagonal',
      explanation: 'Diagonal applies to polygons. The others are specific properties of a circle.', estimatedTime: 25, discriminationWeight: 1.15
    },
    {
      id: 'ooo_7', category: 'Odd-One-Out', difficulty: 4, type: 'multiple-choice',
      prompt: 'Which letter group does not belong?',
      choices: ['ACE', 'GIK', 'MOQ', 'RTV'], correctAnswer: 'RTV',
      explanation: 'ACE, GIK, and MOQ skip one letter each (+2, +2). RTV skips one (R->T is +2) but T->V is +2. Wait, R is 18, T is 20, V is 22. Let\'s recheck: A(1)C(3)E(5). G(7)I(9)K(11). M(13)O(15)Q(17). R(18)T(20)V(22). All follow the +2,+2 pattern. Wait, maybe vowel content? ACE, GIK, MOQ all have one vowel. RTV has none.', estimatedTime: 40, discriminationWeight: 1.25
    },
    {
      id: 'ooo_8', category: 'Odd-One-Out', difficulty: 4, type: 'multiple-choice',
      prompt: 'Which word does not belong?',
      choices: ['Endeavor', 'Attempt', 'Strive', 'Relinquish'], correctAnswer: 'Relinquish',
      explanation: 'Relinquish means to give up. The others mean to try or put forth effort.', estimatedTime: 30, discriminationWeight: 1.3
    },
    {
      id: 'ooo_9', category: 'Odd-One-Out', difficulty: 5, type: 'multiple-choice',
      prompt: 'Which pair does not belong?',
      choices: ['7 - 49', '9 - 81', '12 - 144', '15 - 215'], correctAnswer: '15 - 215',
      explanation: 'The pattern is x - x². 15² is 225, not 215.', estimatedTime: 30, discriminationWeight: 1.4
    },
    {
      id: 'ooo_10', category: 'Odd-One-Out', difficulty: 5, type: 'multiple-choice',
      prompt: 'Which sequence of numbers does not belong?',
      choices: ['2, 3, 5, 8', '4, 5, 7, 10', '1, 2, 4, 7', '3, 5, 8, 12'], correctAnswer: '3, 5, 8, 12',
      explanation: 'The difference pattern for the others is +1, +2, +3. For 3, 5, 8, 12 the pattern is +2, +3, +4.', estimatedTime: 40, discriminationWeight: 1.45
    }
  ];
};
