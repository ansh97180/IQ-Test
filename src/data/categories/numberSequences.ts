import { Question } from '../../types';

export const getNumberSequences = (): Question[] => {
  return [
    {
      id: 'ns_1', category: 'Number Sequences', difficulty: 1, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\n2, 4, 6, 8, ...',
      choices: ['10', '12', '9', '14'], correctAnswer: '10',
      explanation: 'The sequence adds 2 at each step.', estimatedTime: 15, discriminationWeight: 0.8
    },
    {
      id: 'ns_2', category: 'Number Sequences', difficulty: 1, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\n1, 3, 9, 27, ...',
      choices: ['81', '54', '36', '45'], correctAnswer: '81',
      explanation: 'The sequence multiplies by 3 at each step.', estimatedTime: 15, discriminationWeight: 0.85
    },
    {
      id: 'ns_3', category: 'Number Sequences', difficulty: 2, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\n1, 4, 9, 16, 25, ...',
      choices: ['36', '35', '49', '30'], correctAnswer: '36',
      explanation: 'The sequence is composed of perfect squares (1², 2², 3², 4², 5², 6²).', estimatedTime: 20, discriminationWeight: 0.9
    },
    {
      id: 'ns_4', category: 'Number Sequences', difficulty: 2, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\n5, 7, 11, 17, 25, ...',
      choices: ['35', '33', '37', '31'], correctAnswer: '35',
      explanation: 'The differences between terms are consecutive even numbers (+2, +4, +6, +8, +10).', estimatedTime: 25, discriminationWeight: 1.0
    },
    {
      id: 'ns_5', category: 'Number Sequences', difficulty: 3, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\n2, 3, 5, 9, 17, ...',
      choices: ['33', '32', '34', '31'], correctAnswer: '33',
      explanation: 'The differences between terms double at each step (+1, +2, +4, +8, +16).', estimatedTime: 30, discriminationWeight: 1.1
    },
    {
      id: 'ns_6', category: 'Number Sequences', difficulty: 3, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\n10, 9, 11, 8, 12, ...',
      choices: ['7', '13', '6', '14'], correctAnswer: '7',
      explanation: 'The sequence alternates between subtracting and adding increasing integers: -1, +2, -3, +4, -5.', estimatedTime: 30, discriminationWeight: 1.15
    },
    {
      id: 'ns_7', category: 'Number Sequences', difficulty: 3, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\n3, 6, 18, 72, ...',
      choices: ['360', '216', '144', '288'], correctAnswer: '360',
      explanation: 'The sequence multiplies by increasing integers: ×2, ×3, ×4, ×5.', estimatedTime: 35, discriminationWeight: 1.2
    },
    {
      id: 'ns_8', category: 'Number Sequences', difficulty: 4, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\n2, 5, 14, 41, 122, ...',
      choices: ['365', '366', '364', '363'], correctAnswer: '365',
      explanation: 'Multiply by 3 and subtract 1 at each step: (122 × 3) - 1 = 365.', estimatedTime: 40, discriminationWeight: 1.3
    },
    {
      id: 'ns_9', category: 'Number Sequences', difficulty: 4, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\n1, 2, 6, 21, 88, ...',
      choices: ['445', '440', '436', '450'], correctAnswer: '445',
      explanation: 'Multiply by the position and add the position: (1×1)+1=2, (2×2)+2=6, (6×3)+3=21, (21×4)+4=88, (88×5)+5=445.', estimatedTime: 45, discriminationWeight: 1.35
    },
    {
      id: 'ns_10', category: 'Number Sequences', difficulty: 4, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\n7, 10, 16, 28, 52, ...',
      choices: ['100', '96', '104', '92'], correctAnswer: '100',
      explanation: 'The difference between terms doubles: +3, +6, +12, +24, +48.', estimatedTime: 40, discriminationWeight: 1.25
    },
    {
      id: 'ns_11', category: 'Number Sequences', difficulty: 5, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\n4, 18, 48, 100, 180, ...',
      choices: ['294', '288', '300', '276'], correctAnswer: '294',
      explanation: 'The sequence follows the formula n²(n+1) or n³+n². For n=6: 6³+6² = 216+36 = 252? Wait. Let\'s check differences: 14, 30, 52, 80. Second differences: 16, 22, 28. Third diff: 6. Next second diff = 34. Next diff = 80+34=114. 180+114=294.', estimatedTime: 60, discriminationWeight: 1.45
    },
    {
      id: 'ns_12', category: 'Number Sequences', difficulty: 5, type: 'multiple-choice',
      prompt: 'What comes next in the sequence?\n10, 1, 8, 3, 6, 6, 4, 10, 2, ...',
      choices: ['15', '14', '0', '16'], correctAnswer: '15',
      explanation: 'The sequence interleaves two separate patterns. The odd positions (10, 8, 6, 4, 2) subtract 2. The even positions (1, 3, 6, 10) add increasing integers (+2, +3, +4, +5). The next number is an even position, so 10 + 5 = 15.', 
      estimatedTime: 50, discriminationWeight: 1.4
    }
  ];
};
