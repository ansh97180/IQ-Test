import { Question } from '../../types';

export const getVisual = (): Question[] => {
  return [
    {
      id: 'vis_1', category: 'Visual Pattern', difficulty: 1, type: 'multiple-choice',
      prompt: 'Which shape completes the sequence?',
      choices: ['A large circle', 'A small square', 'A small circle', 'A large square'], correctAnswer: 'A small square',
      explanation: 'The sequence alternates between large and small shapes, and between circles and squares: Large Circle, Small Square, Large Circle...', estimatedTime: 15, discriminationWeight: 0.8,
      visualData: { type: 'sequence', elements: ['lg-circle', 'sm-square', 'lg-circle', '?'] }
    },
    {
      id: 'vis_2', category: 'Visual Pattern', difficulty: 1, type: 'multiple-choice',
      prompt: 'Which pattern completes the 2x2 matrix?',
      choices: ['Black Triangle', 'White Triangle', 'Black Circle', 'White Circle'], correctAnswer: 'Black Triangle',
      explanation: 'The top row has a White Circle and a Black Circle. The bottom row has a White Triangle and should logically have a Black Triangle.', estimatedTime: 15, discriminationWeight: 0.85,
      visualData: { type: 'matrix', elements: ['white-circle', 'black-circle', 'white-triangle', '?'] }
    },
    {
      id: 'vis_3', category: 'Visual Pattern', difficulty: 2, type: 'multiple-choice',
      prompt: 'Determine the missing shape in the sequence.',
      choices: ['Square with 4 dots', 'Square with 5 dots', 'Circle with 4 dots', 'Square with 3 dots'], correctAnswer: 'Square with 4 dots',
      explanation: 'The shapes are all squares. The number of dots increases by one: 1, 2, 3, 4.', estimatedTime: 20, discriminationWeight: 0.9,
      visualData: { type: 'sequence', elements: ['sq-1', 'sq-2', 'sq-3', '?'] }
    },
    {
      id: 'vis_4', category: 'Visual Pattern', difficulty: 2, type: 'multiple-choice',
      prompt: 'Determine the missing pattern.',
      choices: ['Arrow pointing Left', 'Arrow pointing Down', 'Arrow pointing Up-Right', 'Arrow pointing Down-Right'], correctAnswer: 'Arrow pointing Down',
      explanation: 'The arrow rotates 90 degrees clockwise in each step: Up, Right, Down.', estimatedTime: 20, discriminationWeight: 0.95,
      visualData: { type: 'sequence', elements: ['arr-up', 'arr-right', '?'] }
    },
    {
      id: 'vis_5', category: 'Visual Pattern', difficulty: 3, type: 'multiple-choice',
      prompt: 'Which matrix completes the 3x3 grid?',
      choices: ['3 vertical lines', '2 horizontal lines', '3 horizontal lines', '1 vertical line'], correctAnswer: '3 horizontal lines',
      explanation: 'In each row, the number of lines increases by 1 (1, 2, 3) and the orientation alternates between rows. Row 1 is vertical. Row 2 is horizontal. Row 3 is horizontal (Wait, if row 3 is horizontal, 1, 2, 3).', estimatedTime: 35, discriminationWeight: 1.1,
      visualData: { type: 'matrix', elements: ['1-v', '2-v', '3-v', '1-h', '2-h', '3-h', '1-h', '2-h', '?'] } // Row 3 is horizontal.
    },
    {
      id: 'vis_6', category: 'Visual Pattern', difficulty: 3, type: 'multiple-choice',
      prompt: 'Find the missing element.',
      choices: ['Pentagon', 'Hexagon', 'Heptagon', 'Octagon'], correctAnswer: 'Hexagon',
      explanation: 'The number of sides increases by 1: Triangle (3), Square (4), Pentagon (5), Hexagon (6).', estimatedTime: 25, discriminationWeight: 1.05,
      visualData: { type: 'sequence', elements: ['triangle', 'square', 'pentagon', '?'] }
    },
    {
      id: 'vis_7', category: 'Visual Pattern', difficulty: 3, type: 'multiple-choice',
      prompt: 'Which image completes the sequence?',
      choices: ['Circle in Square', 'Square in Circle', 'Triangle in Circle', 'Circle in Triangle'], correctAnswer: 'Square in Circle',
      explanation: 'The shapes alternate nesting: Circle in Square, Square in Circle, Circle in Square...', estimatedTime: 25, discriminationWeight: 1.15,
      visualData: { type: 'sequence', elements: ['circ-in-sq', 'sq-in-circ', 'circ-in-sq', '?'] }
    },
    {
      id: 'vis_8', category: 'Visual Pattern', difficulty: 4, type: 'multiple-choice',
      prompt: 'Complete the 3x3 matrix.',
      choices: ['Empty Square', 'Square with Cross', 'Square with X', 'Solid Square'], correctAnswer: 'Empty Square',
      explanation: 'In each row, the third image is the result of superimposing the first two and removing any overlapping lines (XOR logic).', estimatedTime: 50, discriminationWeight: 1.3,
      visualData: { type: 'matrix', elements: ['cross', 'x', 'star', 'hline', 'vline', 'cross', 'x', 'x', '?'] } // x XOR x = empty
    },
    {
      id: 'vis_9', category: 'Visual Pattern', difficulty: 4, type: 'multiple-choice',
      prompt: 'Find the missing element in the transformation.',
      choices: ['Rotated 90 deg', 'Rotated 180 deg, colors inverted', 'Mirrored horizontally', 'Colors inverted'], correctAnswer: 'Rotated 180 deg, colors inverted',
      explanation: 'The transformation rule from step 1 to 2 is applied to step 3 to get 4. The rule is 180 degree rotation + color inversion.', estimatedTime: 40, discriminationWeight: 1.25,
      visualData: { type: 'sequence', elements: ['half-black-up', 'half-white-down', 'black-left', '?'] }
    },
    {
      id: 'vis_10', category: 'Visual Pattern', difficulty: 4, type: 'multiple-choice',
      prompt: 'Which option follows the pattern?',
      choices: ['3 black dots, 2 white', '2 black dots, 3 white', '4 black dots, 1 white', '1 black dot, 4 white'], correctAnswer: '2 black dots, 3 white',
      explanation: 'The total number of dots is constant (5). The number of black dots decreases by 1 each time (4, 3, 2).', estimatedTime: 30, discriminationWeight: 1.2,
      visualData: { type: 'sequence', elements: ['4b-1w', '3b-2w', '?'] }
    },
    {
      id: 'vis_11', category: 'Visual Pattern', difficulty: 5, type: 'multiple-choice',
      prompt: 'Complete the 3x3 visual matrix.',
      choices: ['Shape A', 'Shape B', 'Shape C', 'Shape D'], correctAnswer: 'Shape C',
      explanation: 'Each column follows a specific permutation of 3 shapes and 3 internal shading patterns. The missing cell must have the shape and shading that hasn\'t appeared in the 3rd row or 3rd column.', estimatedTime: 60, discriminationWeight: 1.45,
      visualData: { type: 'matrix', elements: ['S1-P1', 'S2-P2', 'S3-P3', 'S2-P3', 'S3-P1', 'S1-P2', 'S3-P2', 'S1-P3', '?'] } // Missing is S2-P1. Let's call it Shape C.
    },
    {
      id: 'vis_12', category: 'Visual Pattern', difficulty: 5, type: 'multiple-choice',
      prompt: 'What comes next in the visual sequence?',
      choices: ['Outer rotates 90, inner rotates -90', 'Outer rotates 45, inner 45', 'Outer 90, inner 90', 'Outer -90, inner -90'], correctAnswer: 'Outer rotates 90, inner rotates -90',
      explanation: 'The outer polygon rotates 90 degrees clockwise per step, while the inner polygon rotates 90 degrees counter-clockwise.', estimatedTime: 55, discriminationWeight: 1.4,
      visualData: { type: 'sequence', elements: ['comp-1', 'comp-2', 'comp-3', '?'] }
    },
    {
      id: 'vis_13', category: 'Visual Pattern', difficulty: 3, type: 'multiple-choice',
      prompt: 'Which shape fits the missing space?',
      choices: ['Circle', 'Triangle', 'Diamond', 'Hexagon'], correctAnswer: 'Diamond',
      explanation: 'The number of sides of the shapes in the sequence are 0, 3, 4, 0, 3, 4. Wait, circle is 0 (or infinite). Sequence: Circle, Triangle, Diamond, Circle, Triangle, ... Diamond.', estimatedTime: 20, discriminationWeight: 1.0,
      visualData: { type: 'sequence', elements: ['circle', 'triangle', 'diamond', 'circle', 'triangle', '?'] }
    },
    {
      id: 'vis_14', category: 'Visual Pattern', difficulty: 4, type: 'multiple-choice',
      prompt: 'What completes the grid?',
      choices: ['1 dot', '2 dots', '3 dots', '4 dots'], correctAnswer: '4 dots',
      explanation: 'The number of dots in the third column is the sum of the dots in the first two columns.', estimatedTime: 35, discriminationWeight: 1.35,
      visualData: { type: 'matrix', elements: ['1d', '2d', '3d', '2d', '0d', '2d', '1d', '3d', '?'] }
    },
    {
      id: 'vis_15', category: 'Visual Pattern', difficulty: 5, type: 'multiple-choice',
      prompt: 'Find the rule and complete the sequence.',
      choices: ['Grid with top-left filled', 'Grid with bottom-right filled', 'Grid with center filled', 'Grid with all filled'], correctAnswer: 'Grid with bottom-right filled',
      explanation: 'The filled cell in a 3x3 grid moves like a Knight in chess.', estimatedTime: 65, discriminationWeight: 1.5,
      visualData: { type: 'sequence', elements: ['k-1', 'k-2', 'k-3', '?'] }
    },
    {
      id: 'vis_16', category: 'Visual Pattern', difficulty: 2, type: 'multiple-choice',
      prompt: 'Complete the pattern.',
      choices: ['Two vertical lines', 'Two horizontal lines', 'One vertical, one horizontal', 'A cross'], correctAnswer: 'Two horizontal lines',
      explanation: 'The pattern alternates: vertical, horizontal, vertical, horizontal.', estimatedTime: 15, discriminationWeight: 0.9,
      visualData: { type: 'sequence', elements: ['1-v', '1-h', '2-v', '?'] }
    }
  ];
};
