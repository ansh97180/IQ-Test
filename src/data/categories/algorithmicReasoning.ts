import { Question } from '../../types';

export const getAlgorithmicReasoning = (): Question[] => {
  return [
    {
      id: 'algo-1',
      category: 'Algorithmic Reasoning',
      difficulty: 1,
      prompt: 'If a machine processes 2 inputs per second and doubles its speed every 5 seconds, how many inputs will it process in the 12th second?',
      type: 'multiple-choice',
      choices: ['8', '16', '32', '64'],
      correctAnswer: '8',
      explanation: 'Seconds 1-5: 2 inputs/sec. Seconds 6-10: 4 inputs/sec. Seconds 11-15: 8 inputs/sec.',
      estimatedTime: 30,
      discriminationWeight: 1.0
    },
    {
      id: 'algo-2',
      category: 'Algorithmic Reasoning',
      difficulty: 2,
      prompt: 'A sorting algorithm takes N^2 operations. If N is 10, it takes 100 operations. If we double the input size to 20, how many operations will it take?',
      type: 'multiple-choice',
      choices: ['200', '300', '400', '800'],
      correctAnswer: '400',
      explanation: 'Since it is N^2, doubling N (20^2) equals 400.',
      estimatedTime: 40,
      discriminationWeight: 1.2
    },
    {
      id: 'algo-3',
      category: 'Algorithmic Reasoning',
      difficulty: 3,
      prompt: 'An algorithm searches a sorted list of 1024 items by cutting the search space in half each step. What is the maximum number of steps needed to find a specific item?',
      type: 'multiple-choice',
      choices: ['10', '11', '512', '1024'],
      correctAnswer: '10',
      explanation: 'Log base 2 of 1024 is 10. (2^10 = 1024). This represents Binary Search.',
      estimatedTime: 45,
      discriminationWeight: 1.3
    },
    {
      id: 'algo-4',
      category: 'Algorithmic Reasoning',
      difficulty: 4,
      prompt: 'A recursive function f(x) returns x if x <= 1, else returns f(x-1) + f(x-2). What is the value of f(6)?',
      type: 'multiple-choice',
      choices: ['5', '8', '13', '21'],
      correctAnswer: '8',
      explanation: 'This is the Fibonacci sequence: f(0)=0, f(1)=1, f(2)=1, f(3)=2, f(4)=3, f(5)=5, f(6)=8.',
      estimatedTime: 60,
      discriminationWeight: 1.4
    },
    {
      id: 'algo-5',
      category: 'Algorithmic Reasoning',
      difficulty: 5,
      prompt: 'Suppose a program evaluates states using a perfect binary tree of depth 4 (16 leaf nodes). If Alpha-Beta pruning is applied and the best possible pruning occurs, how many leaf nodes are evaluated?',
      type: 'multiple-choice',
      choices: ['4', '7', '8', '15'],
      correctAnswer: '7',
      explanation: 'In best-case alpha-beta pruning for a tree of depth d, the number of leaves evaluated is 2^(d/2) + 2^(d/2) - 1 for even depths. For d=4: 2^2 + 2^2 - 1 = 4 + 4 - 1 = 7.',
      estimatedTime: 90,
      discriminationWeight: 1.6
    },
    {
      id: 'algo-6',
      category: 'Algorithmic Reasoning',
      difficulty: 3,
      prompt: 'You have two hourglasses, a 7-minute one and a 11-minute one. What is the fastest you can time exactly 15 minutes?',
      type: 'multiple-choice',
      choices: ['15 minutes', '22 minutes', '18 minutes', 'Not possible'],
      correctAnswer: '15 minutes',
      explanation: 'Start both. When 7 runs out, flip it (7 mins passed). When 11 runs out, 4 mins are left in the 7-minute glass (11 mins passed). Flip the 7-minute glass immediately. It takes 4 minutes to run out, totaling 11+4=15 mins.',
      estimatedTime: 120,
      discriminationWeight: 1.3
    }
  ];
};
