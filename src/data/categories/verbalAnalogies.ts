import { Question } from '../../types';

export const getVerbalAnalogies = (): Question[] => {
  return [
    {
      id: 'va_1', category: 'Verbal Analogies', difficulty: 1, type: 'multiple-choice',
      prompt: 'Tree is to Forest as Star is to:',
      choices: ['Galaxy', 'Sun', 'Night', 'Telescope'], correctAnswer: 'Galaxy',
      explanation: 'A forest is made up of trees; a galaxy is made up of stars (part-to-whole relationship).', estimatedTime: 15, discriminationWeight: 0.8
    },
    {
      id: 'va_2', category: 'Verbal Analogies', difficulty: 1, type: 'multiple-choice',
      prompt: 'Pen is to Write as Knife is to:',
      choices: ['Cut', 'Sharp', 'Blade', 'Fork'], correctAnswer: 'Cut',
      explanation: 'The function of a pen is to write; the function of a knife is to cut.', estimatedTime: 15, discriminationWeight: 0.85
    },
    {
      id: 'va_3', category: 'Verbal Analogies', difficulty: 2, type: 'multiple-choice',
      prompt: 'Odometer is to Mileage as Compass is to:',
      choices: ['Direction', 'Speed', 'Needle', 'Hiking'], correctAnswer: 'Direction',
      explanation: 'An odometer measures mileage; a compass measures/indicates direction.', estimatedTime: 20, discriminationWeight: 0.9
    },
    {
      id: 'va_4', category: 'Verbal Analogies', difficulty: 2, type: 'multiple-choice',
      prompt: 'Elated is to Despondent as Enlightened is to:',
      choices: ['Ignorant', 'Aware', 'Tolerant', 'Miserable'], correctAnswer: 'Ignorant',
      explanation: 'Elated and despondent are antonyms. The antonym of enlightened is ignorant.', estimatedTime: 25, discriminationWeight: 0.95
    },
    {
      id: 'va_5', category: 'Verbal Analogies', difficulty: 3, type: 'multiple-choice',
      prompt: 'Scalpel is to Surgeon as Palette is to:',
      choices: ['Artist', 'Canvas', 'Paint', 'Brush'], correctAnswer: 'Artist',
      explanation: 'A scalpel is the primary tool of a surgeon; a palette is a primary tool of an artist.', estimatedTime: 25, discriminationWeight: 1.1
    },
    {
      id: 'va_6', category: 'Verbal Analogies', difficulty: 3, type: 'multiple-choice',
      prompt: 'Symphony is to Composer as Novel is to:',
      choices: ['Author', 'Book', 'Publisher', 'Chapter'], correctAnswer: 'Author',
      explanation: 'A composer creates a symphony; an author creates a novel.', estimatedTime: 20, discriminationWeight: 1.05
    },
    {
      id: 'va_7', category: 'Verbal Analogies', difficulty: 4, type: 'multiple-choice',
      prompt: 'Ephemeral is to Enduring as Capricious is to:',
      choices: ['Steadfast', 'Fickle', 'Whimsical', 'Arbitrary'], correctAnswer: 'Steadfast',
      explanation: 'Ephemeral means short-lived, the opposite of enduring. Capricious means fickle or changing suddenly, the opposite of steadfast.', estimatedTime: 30, discriminationWeight: 1.25
    },
    {
      id: 'va_8', category: 'Verbal Analogies', difficulty: 4, type: 'multiple-choice',
      prompt: 'Quarantine is to Exposure as Vaccination is to:',
      choices: ['Disease', 'Immunity', 'Injection', 'Doctor'], correctAnswer: 'Disease',
      explanation: 'Quarantine prevents exposure; vaccination prevents disease.', estimatedTime: 35, discriminationWeight: 1.3
    },
    {
      id: 'va_9', category: 'Verbal Analogies', difficulty: 5, type: 'multiple-choice',
      prompt: 'Mendicant is to Begging as Sycophant is to:',
      choices: ['Flattery', 'Stealing', 'Giving', 'Ruling'], correctAnswer: 'Flattery',
      explanation: 'A mendicant is characterized by begging; a sycophant is characterized by using flattery.', estimatedTime: 40, discriminationWeight: 1.4
    },
    {
      id: 'va_10', category: 'Verbal Analogies', difficulty: 5, type: 'multiple-choice',
      prompt: 'Veneer is to Surface as Facade is to:',
      choices: ['Exterior', 'Building', 'Deception', 'Foundation'], correctAnswer: 'Exterior',
      explanation: 'A veneer is an attractive covering on the surface; a facade is the face or exterior (often deceptive) of a building or concept. Exterior is the most direct parallel relationship.', estimatedTime: 45, discriminationWeight: 1.45
    }
  ];
};
