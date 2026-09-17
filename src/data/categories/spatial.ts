import { Question } from '../../types';

export const getSpatial = (): Question[] => {
  return [
    {
      id: 'sp_1', category: 'Spatial Reasoning', difficulty: 1, type: 'multiple-choice',
      prompt: 'If you rotate a square 90 degrees clockwise, what shape do you get?',
      choices: ['Square', 'Diamond', 'Rectangle', 'Triangle'], correctAnswer: 'Square',
      explanation: 'A square has 90-degree rotational symmetry. Rotating it 90 degrees results in an identical square.', estimatedTime: 10, discriminationWeight: 0.8
    },
    {
      id: 'sp_2', category: 'Spatial Reasoning', difficulty: 1, type: 'multiple-choice',
      prompt: 'Imagine an analog clock. At 3:00, what is the angle between the hour hand and the minute hand?',
      choices: ['90 degrees', '45 degrees', '180 degrees', '0 degrees'], correctAnswer: '90 degrees',
      explanation: 'At 3:00, the minute hand is at 12 and the hour hand is at 3, making a perfect right angle (90 degrees).', estimatedTime: 15, discriminationWeight: 0.85
    },
    {
      id: 'sp_3', category: 'Spatial Reasoning', difficulty: 2, type: 'multiple-choice',
      prompt: 'If you fold a standard piece of rectangular paper in half twice (both times parallel to the short edge), and cut a small hole in the center of the folded piece, how many holes will the paper have when unfolded?',
      choices: ['4', '2', '1', '8'], correctAnswer: '4',
      explanation: 'Folding the paper in half twice creates 4 layers. Cutting one hole goes through all 4 layers, resulting in 4 holes when unfolded.', estimatedTime: 25, discriminationWeight: 0.9
    },
    {
      id: 'sp_4', category: 'Spatial Reasoning', difficulty: 2, type: 'multiple-choice',
      prompt: 'Imagine a 3x3x3 cube made of 27 smaller cubes. How many of the smaller cubes are on the very center, completely hidden from the outside?',
      choices: ['1', '8', '0', '9'], correctAnswer: '1',
      explanation: 'A 3x3x3 cube has exactly 1 center cube surrounded on all 6 sides by the other 26 cubes.', estimatedTime: 20, discriminationWeight: 1.0
    },
    {
      id: 'sp_5', category: 'Spatial Reasoning', difficulty: 3, type: 'multiple-choice',
      prompt: 'Imagine a compass heading North. Turn 90 degrees right, then 180 degrees right, then 90 degrees left. Which direction are you facing?',
      choices: ['South', 'North', 'East', 'West'], correctAnswer: 'South',
      explanation: 'Start N. 90 right = E. 180 right = W. 90 left = S.', estimatedTime: 30, discriminationWeight: 1.1
    },
    {
      id: 'sp_6', category: 'Spatial Reasoning', difficulty: 3, type: 'multiple-choice',
      prompt: 'If a wheel with a circumference of 2 meters rolls forward 5 complete revolutions, how far has its center point traveled?',
      choices: ['10 meters', '5 meters', '0 meters', '20 meters'], correctAnswer: '10 meters',
      explanation: 'The center moves linearly exactly the distance the circumference traces along the ground: 5 rev * 2m = 10 meters.', estimatedTime: 20, discriminationWeight: 1.05
    },
    {
      id: 'sp_7', category: 'Spatial Reasoning', difficulty: 3, type: 'multiple-choice',
      prompt: 'A standard die has opposite faces adding to 7. If you see the 1, 2, and 3 faces meeting at a corner, and you roll the die exactly twice forward (away from you), which face is on top?',
      choices: ['The face that was originally on the bottom.', 'The face that was originally on top.', 'Cannot be determined.', 'A face that was originally on the side.'], correctAnswer: 'The face that was originally on the bottom.',
      explanation: 'Rolling a die forward twice rotates it 180 degrees along that axis, meaning the bottom face comes to the top.', estimatedTime: 35, discriminationWeight: 1.2
    },
    {
      id: 'sp_8', category: 'Spatial Reasoning', difficulty: 4, type: 'multiple-choice',
      prompt: 'Imagine a solid 4x4x4 cube painted entirely red on the outside. It is then cut into 64 1x1x1 small cubes. How many of the small cubes have exactly two painted faces?',
      choices: ['24', '16', '32', '8'], correctAnswer: '24',
      explanation: 'Cubes with exactly two painted faces are the edge pieces, excluding the corners. A cube has 12 edges. On a 4x4x4 cube, each edge has 4 pieces, but the 2 end pieces are corners (3 painted faces). So each edge has 2 pieces with exactly two painted faces. 12 edges * 2 pieces/edge = 24.', estimatedTime: 45, discriminationWeight: 1.3
    },
    {
      id: 'sp_9', category: 'Spatial Reasoning', difficulty: 4, type: 'multiple-choice',
      prompt: 'Imagine the letter "d". Reflect it across a vertical line (left to right), then rotate it 180 degrees. What letter does it look like?',
      choices: ['q', 'p', 'b', 'd'], correctAnswer: 'q',
      explanation: 'Reflecting "d" vertically makes it a "b". Rotating a "b" 180 degrees makes it a "q".', estimatedTime: 30, discriminationWeight: 1.35
    },
    {
      id: 'sp_10', category: 'Spatial Reasoning', difficulty: 4, type: 'multiple-choice',
      prompt: 'You have a sheet of paper. You fold the top edge down to meet the bottom edge. Then you fold the left edge to meet the right edge. Then you cut off the top-left corner of the folded square. When you unfold it, where are the holes?',
      choices: ['In the center', 'On the four corners', 'On the left and right edges', 'On the top and bottom edges'], correctAnswer: 'In the center',
      explanation: 'The first fold moves the original top to the bottom. The fold crease is now the top. The second fold moves the left to the right. The left edge of the folded paper is the vertical center crease. Cutting the top-left corner cuts the intersection of the horizontal and vertical center creases, creating a hole in the center.', estimatedTime: 50, discriminationWeight: 1.4
    },
    {
      id: 'sp_11', category: 'Spatial Reasoning', difficulty: 5, type: 'multiple-choice',
      prompt: 'A regular tetrahedron (4-sided pyramid where all faces are equilateral triangles) is painted green. It is then cut into smaller regular tetrahedrons and octahedrons by halving each edge. How many small tetrahedrons are there, and how many have 0 painted faces?',
      choices: ['4 tetrahedrons, 0 unpainted', '8 tetrahedrons, 0 unpainted', '4 tetrahedrons, 1 unpainted', '8 tetrahedrons, 1 unpainted'], correctAnswer: '4 tetrahedrons, 0 unpainted',
      explanation: 'Cutting a regular tetrahedron by halving its edges yields 4 small tetrahedrons at the corners and 1 octahedron in the center. All 4 small tetrahedrons share an original corner and thus have at least one painted face (actually, they each have 3 painted faces, as they form the corners of the original tetrahedron). Thus 0 are unpainted.', estimatedTime: 70, discriminationWeight: 1.5
    },
    {
      id: 'sp_12', category: 'Spatial Reasoning', difficulty: 5, type: 'multiple-choice',
      prompt: 'Imagine a clock at exactly 3:15. What is the angle between the hour hand and the minute hand?',
      choices: ['7.5 degrees', '0 degrees', '15 degrees', '3.75 degrees'], correctAnswer: '7.5 degrees',
      explanation: 'At 15 minutes, the minute hand is exactly at 3 (90 degrees from 12). The hour hand has moved 15/60 = 1/4 of the way between 3 and 4. The angle between hours is 30 degrees. 1/4 of 30 is 7.5 degrees. The angle is 7.5 degrees.', estimatedTime: 60, discriminationWeight: 1.45
    }
  ];
};
