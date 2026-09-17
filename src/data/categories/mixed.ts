import { Question } from '../../types';

export const getMixed = (): Question[] => {
  return [
    {
      id: 'mx_1', category: 'Mixed Reasoning', difficulty: 1, type: 'multiple-choice',
      prompt: 'If TOMORROW is coded as UPNPSSP, how is TODAY coded?',
      choices: ['UPEBZ', 'UPEBX', 'UPDBZ', 'UPDAZ'], correctAnswer: 'UPEBZ',
      explanation: 'Each letter is shifted forward by 1 in the alphabet. T->U, O->P, D->E, A->B, Y->Z.', estimatedTime: 20, discriminationWeight: 0.8
    },
    {
      id: 'mx_2', category: 'Mixed Reasoning', difficulty: 2, type: 'multiple-choice',
      prompt: 'What day is three days before the day after tomorrow if today is Monday?',
      choices: ['Sunday', 'Monday', 'Tuesday', 'Saturday'], correctAnswer: 'Sunday',
      explanation: 'Today = Monday. Tomorrow = Tuesday. Day after tomorrow = Wednesday. Three days before Wednesday = Sunday.', estimatedTime: 25, discriminationWeight: 0.9
    },
    {
      id: 'mx_3', category: 'Mixed Reasoning', difficulty: 2, type: 'multiple-choice',
      prompt: 'Which word can be formed from the letters in "CONSTELLATION"?',
      choices: ['TENSION', 'SALMON', 'CANCER', 'TRACTOR'], correctAnswer: 'TENSION',
      explanation: 'C-O-N-S-T-E-L-L-A-T-I-O-N has 2 Ns, 1 A, 2 Ts, 1 I, 2 Os, 1 E, 1 S. TENSION uses T(1) E(1) N(2) S(1) I(1) O(1).',
      estimatedTime: 30, discriminationWeight: 0.95
    },
    {
      id: 'mx_4', category: 'Mixed Reasoning', difficulty: 3, type: 'multiple-choice',
      prompt: 'A snail is at the bottom of a 20-foot well. Each day it climbs up 5 feet, but at night it slips back 4 feet. How many days will it take for the snail to reach the top?',
      choices: ['20 days', '19 days', '16 days', '15 days'], correctAnswer: '16 days',
      explanation: 'It nets 1 foot per day. On the 15th day, it starts at 15 feet. During the day it climbs 5 feet, reaching 20 feet (the top) and escapes before night falls.', estimatedTime: 40, discriminationWeight: 1.15
    },
    {
      id: 'mx_5', category: 'Mixed Reasoning', difficulty: 3, type: 'multiple-choice',
      prompt: 'If 2 = 6, 3 = 12, 4 = 20, 5 = 30, then 6 = ?',
      choices: ['42', '36', '40', '48'], correctAnswer: '42',
      explanation: 'The pattern is n * (n + 1). 6 * (6 + 1) = 6 * 7 = 42.', estimatedTime: 25, discriminationWeight: 1.1
    },
    {
      id: 'mx_6', category: 'Mixed Reasoning', difficulty: 3, type: 'multiple-choice',
      prompt: 'In a drawer, there are 10 black socks and 10 white socks. You are blindfolded. What is the minimum number of socks you must pull out to guarantee a matching pair?',
      choices: ['3', '2', '11', '10'], correctAnswer: '3',
      explanation: 'Since there are only 2 colors, picking 3 socks guarantees at least two will be of the same color.', estimatedTime: 20, discriminationWeight: 1.05
    },
    {
      id: 'mx_7', category: 'Mixed Reasoning', difficulty: 4, type: 'multiple-choice',
      prompt: 'How many times do the hands of a clock overlap in 24 hours?',
      choices: ['24', '22', '23', '12'], correctAnswer: '22',
      explanation: 'The hands overlap once every 12/11 hours. In 24 hours, they overlap 24 / (12/11) = 22 times.', estimatedTime: 40, discriminationWeight: 1.3
    },
    {
      id: 'mx_8', category: 'Mixed Reasoning', difficulty: 4, type: 'multiple-choice',
      prompt: 'You have two ropes. Each rope takes exactly 1 hour to burn from end to end, but they burn unevenly. How can you measure exactly 45 minutes?',
      choices: ['Burn one rope from both ends, and the other from one end. When the first finishes, light the other end of the second.', 'Burn both ropes from one end.', 'Burn one rope from both ends, cut the other in half.', 'Fold one rope in half and burn it.'], correctAnswer: 'Burn one rope from both ends, and the other from one end. When the first finishes, light the other end of the second.',
      explanation: 'Rope 1 burning from both ends takes 30 mins. At that moment, Rope 2 has 30 mins left. Lighting the other end of Rope 2 makes the remainder burn in 15 mins. Total: 30 + 15 = 45 mins.', estimatedTime: 50, discriminationWeight: 1.35
    },
    {
      id: 'mx_9', category: 'Mixed Reasoning', difficulty: 4, type: 'multiple-choice',
      prompt: 'If FIRE is coded as 6-9-18-5, and SNOW is coded as 19-14-15-23, how is RAIN coded?',
      choices: ['18-1-9-14', '17-1-9-14', '18-2-9-13', '19-1-8-14'], correctAnswer: '18-1-9-14',
      explanation: 'Each letter is mapped to its position in the alphabet. R=18, A=1, I=9, N=14.', estimatedTime: 25, discriminationWeight: 1.2
    },
    {
      id: 'mx_10', category: 'Mixed Reasoning', difficulty: 5, type: 'multiple-choice',
      prompt: 'You have 8 balls that look identical, but one is slightly heavier. You have a balance scale. What is the minimum number of weighings to guarantee finding the heavy ball?',
      choices: ['2', '3', '4', '1'], correctAnswer: '2',
      explanation: 'Weigh 3 against 3. If they balance, weigh the remaining 2. If they don\'t balance, take the heavier group of 3, pick 2 and weigh them. You can always find it in 2 weighings.', estimatedTime: 60, discriminationWeight: 1.45
    },
    {
      id: 'mx_11', category: 'Mixed Reasoning', difficulty: 5, type: 'multiple-choice',
      prompt: 'Three people check into a hotel room that costs $30. They each contribute $10. The manager realizes the room only costs $25 and gives the bellboy $5 to return to them. The bellboy keeps $2 and gives each person $1 back. Now, each person paid $9, totaling $27. The bellboy has $2. $27 + $2 = $29. Where is the missing dollar?',
      choices: ['The math is misleading; you should subtract the $2 from $27, not add it.', 'The bellboy stole it.', 'The manager kept it.', 'It never existed.'], correctAnswer: 'The math is misleading; you should subtract the $2 from $27, not add it.',
      explanation: 'The $27 they paid already includes the $2 the bellboy kept ($25 for room + $2 for bellboy = $27). Adding the $2 to $27 counts it twice. The remaining $3 is what they received back.', estimatedTime: 45, discriminationWeight: 1.4
    },
    {
      id: 'mx_12', category: 'Mixed Reasoning', difficulty: 5, type: 'multiple-choice',
      prompt: 'A man is looking at a photograph. Someone asks who it is. He replies: "Brothers and sisters, I have none. But that man\'s father is my father\'s son." Who is in the photograph?',
      choices: ['His son', 'Himself', 'His father', 'His nephew'], correctAnswer: 'His son',
      explanation: '"My father\'s son" is the man himself (since he has no siblings). So, substituting "myself" into the sentence: "That man\'s father is myself." Therefore, the man in the photograph is his son.', estimatedTime: 50, discriminationWeight: 1.5
    },
    {
      id: 'mx_13', category: 'Mixed Reasoning', difficulty: 4, type: 'multiple-choice',
      prompt: 'If you have a 3-liter jug and a 5-liter jug, and an unlimited supply of water, can you measure exactly 4 liters?',
      choices: ['Yes', 'No', 'Only with a scale', 'Only by guessing'], correctAnswer: 'Yes',
      explanation: 'Fill 5L. Pour into 3L, leaving 2L in 5L. Empty 3L. Pour the 2L into 3L. Fill 5L. Pour from 5L into 3L until 3L is full (takes 1L). 5L jug now has exactly 4 liters.', estimatedTime: 55, discriminationWeight: 1.3
    },
    {
      id: 'mx_14', category: 'Mixed Reasoning', difficulty: 3, type: 'multiple-choice',
      prompt: 'Which is heavier, a ton of feathers or a ton of bricks?',
      choices: ['They weigh the same', 'Bricks', 'Feathers', 'Depends on gravity'], correctAnswer: 'They weigh the same',
      explanation: 'A ton is a measure of weight. A ton of anything weighs the same as a ton of anything else.', estimatedTime: 10, discriminationWeight: 0.9
    }
  ];
};
