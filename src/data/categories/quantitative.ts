import { Question } from '../../types';

export const getQuantitative = (): Question[] => {
  return [
    {
      id: 'qr_1', category: 'Quantitative Reasoning', difficulty: 1, type: 'multiple-choice',
      prompt: 'If 3 apples cost $1.20, how much do 5 apples cost?',
      choices: ['$2.00', '$1.80', '$2.20', '$2.40'], correctAnswer: '$2.00',
      explanation: 'One apple costs 1.20 / 3 = $0.40. Five apples cost 5 * 0.40 = $2.00.', estimatedTime: 20, discriminationWeight: 0.8
    },
    {
      id: 'qr_2', category: 'Quantitative Reasoning', difficulty: 1, type: 'multiple-choice',
      prompt: 'A train travels at 60 mph. How far will it travel in 2.5 hours?',
      choices: ['150 miles', '120 miles', '180 miles', '140 miles'], correctAnswer: '150 miles',
      explanation: 'Distance = Speed × Time = 60 × 2.5 = 150.', estimatedTime: 20, discriminationWeight: 0.85
    },
    {
      id: 'qr_3', category: 'Quantitative Reasoning', difficulty: 2, type: 'multiple-choice',
      prompt: 'If a machine can produce 50 units in 2 hours, how many machines are needed to produce 300 units in 4 hours?',
      choices: ['3', '4', '2', '6'], correctAnswer: '3',
      explanation: 'One machine produces 25 units per hour. In 4 hours, one machine produces 100 units. To produce 300 units, you need 300 / 100 = 3 machines.', estimatedTime: 35, discriminationWeight: 0.95
    },
    {
      id: 'qr_4', category: 'Quantitative Reasoning', difficulty: 2, type: 'multiple-choice',
      prompt: 'A store marks up the wholesale price of an item by 20%. If the final price is $60, what was the wholesale price?',
      choices: ['$50', '$48', '$45', '$52'], correctAnswer: '$50',
      explanation: 'Wholesale Price × 1.20 = $60. Wholesale Price = $60 / 1.20 = $50.', estimatedTime: 30, discriminationWeight: 1.0
    },
    {
      id: 'qr_5', category: 'Quantitative Reasoning', difficulty: 3, type: 'multiple-choice',
      prompt: 'In a class, the ratio of boys to girls is 3:5. If there are 32 students in total, how many are girls?',
      choices: ['20', '12', '24', '15'], correctAnswer: '20',
      explanation: 'Total ratio parts = 3 + 5 = 8. Each part is 32 / 8 = 4 students. Girls = 5 parts × 4 = 20.', estimatedTime: 25, discriminationWeight: 1.05
    },
    {
      id: 'qr_6', category: 'Quantitative Reasoning', difficulty: 3, type: 'multiple-choice',
      prompt: 'If x + y = 10 and x - y = 4, what is the value of x * y?',
      choices: ['21', '24', '25', '16'], correctAnswer: '21',
      explanation: 'Adding equations: 2x = 14, x = 7. y = 3. Product is 7 * 3 = 21.', estimatedTime: 30, discriminationWeight: 1.15
    },
    {
      id: 'qr_7', category: 'Quantitative Reasoning', difficulty: 3, type: 'multiple-choice',
      prompt: 'A water tank can be filled by pipe A in 4 hours and by pipe B in 6 hours. How long will it take to fill if both pipes are open?',
      choices: ['2.4 hours', '2.5 hours', '5 hours', '3 hours'], correctAnswer: '2.4 hours',
      explanation: 'Rate A = 1/4 per hour. Rate B = 1/6 per hour. Combined rate = 1/4 + 1/6 = 3/12 + 2/12 = 5/12 per hour. Time = 12/5 = 2.4 hours.', estimatedTime: 40, discriminationWeight: 1.2
    },
    {
      id: 'qr_8', category: 'Quantitative Reasoning', difficulty: 4, type: 'multiple-choice',
      prompt: 'Two runners start from the same point on a 400m circular track, running in opposite directions. Runner A runs at 5 m/s, Runner B at 3 m/s. How long until they meet?',
      choices: ['50 seconds', '40 seconds', '80 seconds', '100 seconds'], correctAnswer: '50 seconds',
      explanation: 'Their relative speed is 5 + 3 = 8 m/s. Time to cover 400m together is 400 / 8 = 50 seconds.', estimatedTime: 45, discriminationWeight: 1.25
    },
    {
      id: 'qr_9', category: 'Quantitative Reasoning', difficulty: 4, type: 'multiple-choice',
      prompt: 'If the radius of a circle is increased by 50%, by what percentage does the area increase?',
      choices: ['125%', '100%', '50%', '150%'], correctAnswer: '125%',
      explanation: 'New radius = 1.5r. New area = π(1.5r)² = 2.25πr². Increase is 1.25 or 125%.', estimatedTime: 35, discriminationWeight: 1.3
    },
    {
      id: 'qr_10', category: 'Quantitative Reasoning', difficulty: 4, type: 'multiple-choice',
      prompt: 'A bag contains 3 red balls, 4 blue balls, and 5 green balls. If two balls are drawn at random without replacement, what is the probability they are both blue?',
      choices: ['1/11', '1/12', '2/11', '4/33'], correctAnswer: '1/11',
      explanation: 'P(First Blue) = 4/12. P(Second Blue | First Blue) = 3/11. (4/12) * (3/11) = (1/3) * (3/11) = 1/11.', estimatedTime: 50, discriminationWeight: 1.35
    },
    {
      id: 'qr_11', category: 'Quantitative Reasoning', difficulty: 5, type: 'multiple-choice',
      prompt: 'The sum of three consecutive primes is 71. What is the product of the smallest and largest of these three primes?',
      choices: ['529', '437', '551', '667'], correctAnswer: '551',
      explanation: 'Let\'s try primes around 23 (since 71/3 is ~23). 17 + 19 + 23 = 59 (too small). 19 + 23 + 29 = 71. The primes are 19, 23, 29. 19 * 29 = 551.', estimatedTime: 60, discriminationWeight: 1.45
    },
    {
      id: 'qr_12', category: 'Quantitative Reasoning', difficulty: 5, type: 'multiple-choice',
      prompt: 'A worker\'s daily wage is reduced by 20%. By what percentage must his new wage be increased to return to his original wage?',
      choices: ['25%', '20%', '30%', '22.5%'], correctAnswer: '25%',
      explanation: 'If original wage is 100, new wage is 80. To get back to 100, increase by 20. 20 is 25% of 80.', estimatedTime: 40, discriminationWeight: 1.4
    }
  ];
};
