import { Question } from '../../types';

export const getWorkingMemory = (): Question[] => {
  return [
    {
      id: 'wm_1', category: 'Working-Memory Style', difficulty: 1, type: 'multiple-choice',
      prompt: 'Hold this sequence in mind: 4, 9, 2, 7. Now, which number was second?',
      choices: ['4', '9', '2', '7'], correctAnswer: '9',
      explanation: 'The sequence was 4, 9, 2, 7. The second number is 9.', estimatedTime: 10, discriminationWeight: 0.8
    },
    {
      id: 'wm_2', category: 'Working-Memory Style', difficulty: 1, type: 'multiple-choice',
      prompt: 'Hold these letters in mind: X, M, P, R. What is the sequence backwards?',
      choices: ['R, P, M, X', 'R, M, P, X', 'P, R, M, X', 'R, P, X, M'], correctAnswer: 'R, P, M, X',
      explanation: 'Reversing X, M, P, R yields R, P, M, X.', estimatedTime: 15, discriminationWeight: 0.85
    },
    {
      id: 'wm_3', category: 'Working-Memory Style', difficulty: 2, type: 'multiple-choice',
      prompt: 'Sequence: Apple, Dog, Car, Book. If you alphabetize this list, what is the third item?',
      choices: ['Apple', 'Book', 'Car', 'Dog'], correctAnswer: 'Car',
      explanation: 'Alphabetized: Apple, Book, Car, Dog. The third is Car.', estimatedTime: 20, discriminationWeight: 0.95
    },
    {
      id: 'wm_4', category: 'Working-Memory Style', difficulty: 2, type: 'multiple-choice',
      prompt: 'Sequence: 8, 3, 5, 1. If you add 2 to each number, what is the new sequence?',
      choices: ['10, 5, 7, 3', '6, 1, 3, -1', '10, 5, 8, 3', '9, 4, 6, 2'], correctAnswer: '10, 5, 7, 3',
      explanation: '8+2=10, 3+2=5, 5+2=7, 1+2=3.', estimatedTime: 25, discriminationWeight: 1.0
    },
    {
      id: 'wm_5', category: 'Working-Memory Style', difficulty: 3, type: 'multiple-choice',
      prompt: 'Sequence: Circle, Square, Triangle, Hexagon. Swap the first and third items, then reverse the whole list. What is the final sequence?',
      choices: ['Hexagon, Square, Triangle, Circle', 'Hexagon, Circle, Square, Triangle', 'Hexagon, Square, Circle, Triangle', 'Triangle, Square, Circle, Hexagon'], correctAnswer: 'Hexagon, Circle, Square, Triangle',
      explanation: 'Original: C, S, T, H. Swap 1 & 3: T, S, C, H. Reverse: H, C, S, T (Hexagon, Circle, Square, Triangle).',
      estimatedTime: 40, discriminationWeight: 1.15
    },
    {
      id: 'wm_6', category: 'Working-Memory Style', difficulty: 3, type: 'multiple-choice',
      prompt: 'Hold: 5, 9, 2, 6, 1. Discard the lowest and highest numbers. What is the sum of the remaining numbers?',
      choices: ['13', '12', '17', '15'], correctAnswer: '13',
      explanation: 'Lowest is 1, highest is 9. Remaining: 5, 2, 6. Sum = 13.', estimatedTime: 30, discriminationWeight: 1.1
    },
    {
      id: 'wm_7', category: 'Working-Memory Style', difficulty: 4, type: 'multiple-choice',
      prompt: 'Imagine a 3x3 phone keypad. Start at 5 (center). Move up 1, left 1, down 2, right 2, up 1. What number are you on?',
      choices: ['6', '9', '3', '8'], correctAnswer: '6',
      explanation: 'Keypad: 123/456/789. Start 5. Up 1 -> 2. Left 1 -> 1. Down 2 -> 7. Right 2 -> 9. Up 1 -> 6.', estimatedTime: 45, discriminationWeight: 1.25
    },
    {
      id: 'wm_8', category: 'Working-Memory Style', difficulty: 4, type: 'multiple-choice',
      prompt: 'Colors: Red, Blue, Green, Yellow, Purple. Move Green to the front. Then move Blue to the end. What is the 4th color?',
      choices: ['Yellow', 'Purple', 'Blue', 'Red'], correctAnswer: 'Purple',
      explanation: 'Start: R, B, G, Y, P. Move G to front: G, R, B, Y, P. Move B to end: G, R, Y, P, B. The 4th color is Purple.', estimatedTime: 40, discriminationWeight: 1.3
    },
    {
      id: 'wm_9', category: 'Working-Memory Style', difficulty: 5, type: 'multiple-choice',
      prompt: 'Sequence: 7, 2, 8, 4, 9, 1. Sort the even numbers in ascending order, keeping the odd numbers in their original positions. What is the new sequence?',
      choices: ['7, 2, 4, 8, 9, 1', '7, 2, 8, 4, 9, 1', '1, 2, 4, 7, 8, 9', '7, 4, 2, 8, 9, 1'], correctAnswer: '7, 2, 4, 8, 9, 1',
      explanation: 'Original: 7, (2), (8), (4), 9, 1. Evens are 2, 8, 4. Sorted evens: 2, 4, 8. Place them back into the even slots: 7, (2), (4), (8), 9, 1.', estimatedTime: 60, discriminationWeight: 1.45
    },
    {
      id: 'wm_10', category: 'Working-Memory Style', difficulty: 5, type: 'multiple-choice',
      prompt: 'Imagine a cube with faces labeled 1-6. 1 is opposite 6, 2 opposite 5, 3 opposite 4. Face 1 is facing you, face 3 is on top. Rotate the cube 90 degrees clockwise (looking directly at face 1). Then rotate it 90 degrees upwards (so the face that was facing you goes to the top). Which face is now facing you?',
      choices: ['2', '5', '4', '6'], correctAnswer: '2',
      explanation: 'Initial state: Front=1, Back=6, Top=3, Bottom=4, Right=2, Left=5. \nRotate clockwise around Front (1 axis): Front stays 1. Top (3) moves to Right. Right (2) moves to Bottom. Bottom (4) moves to Left. Left (5) moves to Top.\nNew state: Front=1, Top=5, Right=3, Bottom=2, Left=4, Back=6.\nRotate upwards (pitch): Front (1) moves to Top. Bottom (2) moves to Front. Back (6) moves to Bottom. Top (5) moves to Back.\nFace facing you (Front) is now 2.', estimatedTime: 75, discriminationWeight: 1.5
    }
  ];
};
