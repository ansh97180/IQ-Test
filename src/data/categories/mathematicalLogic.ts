import { Question } from '../../types';

export const getMathematicalLogic = (): Question[] => {
  return [
    {
      id: 'math-1',
      category: 'Mathematical Logic',
      difficulty: 1,
      prompt: 'If 3 cats can catch 3 mice in 3 minutes, how many cats are needed to catch 100 mice in 100 minutes?',
      type: 'multiple-choice',
      choices: ['3 cats', '100 cats', '33 cats', '1 cat'],
      correctAnswer: '3 cats',
      explanation: '3 cats catch 3 mice in 3 minutes. This means 3 cats catch 1 mouse per minute, or 100 mice in 100 minutes.',
      estimatedTime: 30,
      discriminationWeight: 1.0
    },
    {
      id: 'math-2',
      category: 'Mathematical Logic',
      difficulty: 2,
      prompt: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
      type: 'multiple-choice',
      choices: ['$0.10', '$0.05', '$0.15', '$1.00'],
      correctAnswer: '$0.05',
      explanation: 'Bat + Ball = $1.10. Bat = Ball + $1.00. (Ball + $1.00) + Ball = $1.10. 2 * Ball = $0.10. Ball = $0.05.',
      estimatedTime: 30,
      discriminationWeight: 1.1
    },
    {
      id: 'math-3',
      category: 'Mathematical Logic',
      difficulty: 3,
      prompt: 'In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take for the patch to cover half of the lake?',
      type: 'multiple-choice',
      choices: ['24 days', '47 days', '12 days', '46 days'],
      correctAnswer: '47 days',
      explanation: 'If it doubles every day and covers the lake on day 48, it must have covered half the lake the day before (day 47).',
      estimatedTime: 20,
      discriminationWeight: 1.2
    },
    {
      id: 'math-4',
      category: 'Mathematical Logic',
      difficulty: 4,
      prompt: 'A man buys a horse for $60, sells it for $70, buys it back for $80, and sells it again for $90. How much profit did he make?',
      type: 'multiple-choice',
      choices: ['$10', '$20', '$30', '$0'],
      correctAnswer: '$20',
      explanation: 'He spent $60 + $80 = $140. He earned $70 + $90 = $160. Profit = $160 - $140 = $20.',
      estimatedTime: 40,
      discriminationWeight: 1.4
    },
    {
      id: 'math-5',
      category: 'Mathematical Logic',
      difficulty: 5,
      prompt: 'If a clock takes 2 seconds to strike 3 o’clock, how long will it take to strike 6 o’clock?',
      type: 'multiple-choice',
      choices: ['4 seconds', '5 seconds', '6 seconds', '3 seconds'],
      correctAnswer: '5 seconds',
      explanation: 'Striking 3 involves 3 strikes and 2 intervals. So 1 interval = 1 second. Striking 6 involves 6 strikes and 5 intervals, which takes 5 seconds.',
      estimatedTime: 50,
      discriminationWeight: 1.5
    },
    {
      id: 'math-6',
      category: 'Mathematical Logic',
      difficulty: 4,
      prompt: 'A snail is at the bottom of a 20-foot well. Each day it climbs up 5 feet, and each night it slides down 4 feet. How many days will it take to reach the top?',
      type: 'multiple-choice',
      choices: ['20 days', '16 days', '15 days', '17 days'],
      correctAnswer: '16 days',
      explanation: 'It gains 1 foot net per day. By day 15, it is at 15 feet. On day 16, it climbs 5 feet and reaches 20 feet (the top) before the night slides it down.',
      estimatedTime: 45,
      discriminationWeight: 1.4
    }
  ];
};
