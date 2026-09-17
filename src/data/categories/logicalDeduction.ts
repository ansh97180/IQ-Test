import { Question } from '../../types';

export const getLogicalDeduction = (): Question[] => {
  return [
    {
      id: 'ld_1', category: 'Logical Deduction', difficulty: 1, type: 'multiple-choice',
      prompt: 'If all bloops are razzies, and all razzies are lazzies, are all bloops lazzies?',
      choices: ['Yes', 'No', 'Cannot be determined', 'Some are, some are not'], correctAnswer: 'Yes',
      explanation: 'This is a standard categorical syllogism (Barbara). If A is a subset of B, and B is a subset of C, then A is a subset of C.', estimatedTime: 20, discriminationWeight: 0.8
    },
    {
      id: 'ld_2', category: 'Logical Deduction', difficulty: 1, type: 'multiple-choice',
      prompt: 'If it is raining, the ground is wet. The ground is not wet. What can you conclude?',
      choices: ['It is not raining.', 'It is raining.', 'It might be raining.', 'The ground is dry because of the sun.'], correctAnswer: 'It is not raining.',
      explanation: 'By modus tollens, if P implies Q, and Q is false, then P must be false.', estimatedTime: 20, discriminationWeight: 0.85
    },
    {
      id: 'ld_3', category: 'Logical Deduction', difficulty: 2, type: 'multiple-choice',
      prompt: 'Some glorps are trumps. All trumps are snorps. What must be true?',
      choices: ['Some glorps are snorps.', 'All glorps are snorps.', 'All snorps are glorps.', 'No glorps are snorps.'], correctAnswer: 'Some glorps are snorps.',
      explanation: 'Since some glorps are inside the trump category, and the entire trump category is inside the snorp category, those specific glorps must also be snorps.', estimatedTime: 30, discriminationWeight: 0.9
    },
    {
      id: 'ld_4', category: 'Logical Deduction', difficulty: 2, type: 'multiple-choice',
      prompt: 'If John is taller than Mary, and Mary is taller than Sue, who is the shortest?',
      choices: ['Sue', 'Mary', 'John', 'Cannot be determined'], correctAnswer: 'Sue',
      explanation: 'John > Mary > Sue. Therefore, Sue is the shortest.', estimatedTime: 25, discriminationWeight: 0.95
    },
    {
      id: 'ld_5', category: 'Logical Deduction', difficulty: 3, type: 'multiple-choice',
      prompt: 'If I study, I will pass. If I do not study, I will sleep. I did not pass. What did I do?',
      choices: ['I slept.', 'I studied.', 'I did not sleep.', 'Cannot be determined'], correctAnswer: 'I slept.',
      explanation: 'If studying implies passing, and you didn\'t pass, you didn\'t study (modus tollens). Since not studying implies sleeping, you must have slept.', estimatedTime: 40, discriminationWeight: 1.1
    },
    {
      id: 'ld_6', category: 'Logical Deduction', difficulty: 3, type: 'multiple-choice',
      prompt: 'Five runners finish a race. A is faster than B but slower than C. D is faster than E but slower than B. Who finished third?',
      choices: ['B', 'A', 'C', 'D'], correctAnswer: 'B',
      explanation: 'C > A > B. B > D > E. Combining them: C > A > B > D > E. B is the third.', estimatedTime: 45, discriminationWeight: 1.15
    },
    {
      id: 'ld_7', category: 'Logical Deduction', difficulty: 3, type: 'multiple-choice',
      prompt: 'No A are B. Some C are B. Which statement is logically valid?',
      choices: ['Some C are not A.', 'No C are A.', 'All C are not A.', 'Some A are C.'], correctAnswer: 'Some C are not A.',
      explanation: 'Since some C are B, and no B are A, those C that are B cannot be A. Thus, some C are not A.', estimatedTime: 50, discriminationWeight: 1.2
    },
    {
      id: 'ld_8', category: 'Logical Deduction', difficulty: 4, type: 'multiple-choice',
      prompt: 'Only people who wear glasses are allowed in the club. Tim is not allowed in the club. What can be deduced?',
      choices: ['Tim might wear glasses.', 'Tim definitely does not wear glasses.', 'Tim definitely wears glasses.', 'Nothing can be deduced about Tim\'s glasses.'], correctAnswer: 'Tim might wear glasses.',
      explanation: 'Wearing glasses is a necessary condition (only if you wear glasses), not a sufficient one. Someone with glasses might still be denied entry for other reasons.', estimatedTime: 50, discriminationWeight: 1.3
    },
    {
      id: 'ld_9', category: 'Logical Deduction', difficulty: 4, type: 'multiple-choice',
      prompt: 'Either X is true or Y is true, but not both. If Z is true, then Y is true. Z is true. What is the state of X?',
      choices: ['X is false.', 'X is true.', 'X could be true or false.', 'Cannot be determined.'], correctAnswer: 'X is false.',
      explanation: 'Since Z is true, Y is true. Since X and Y cannot both be true (exclusive OR), and Y is true, X must be false.', estimatedTime: 45, discriminationWeight: 1.25
    },
    {
      id: 'ld_10', category: 'Logical Deduction', difficulty: 4, type: 'multiple-choice',
      prompt: 'A box contains Red, Blue, and Green balls. If you do not draw a Red ball, you will draw a Blue ball. Which of the following is necessarily true?',
      choices: ['There are no Green balls.', 'All balls are Blue.', 'You cannot draw a Green ball.', 'If you draw a Green ball, you must have drawn a Red ball.'], correctAnswer: 'There are no Green balls.',
      explanation: 'The statement means that everything that is not Red must be Blue. Therefore, nothing can be Green. (The set of balls is only Red and Blue).', estimatedTime: 55, discriminationWeight: 1.35
    },
    {
      id: 'ld_11', category: 'Logical Deduction', difficulty: 5, type: 'multiple-choice',
      prompt: 'Four friends (A, B, C, D) are sitting in a row. A is not next to B. C is immediately to the right of B. D is not on either end. D is sitting next to C. Who is on the far right?',
      choices: ['A', 'C', 'B', 'D'], correctAnswer: 'A',
      explanation: 'Positions: 1, 2, 3, 4. D is not on the ends, so D is at 2 or 3. C is immediately right of B, so BC is a block. The possibilities for BC are (1,2), (2,3), or (3,4). If BC is at 1,2, then D must be at 3, leaving A at 4. (Order: B, C, D, A). This works: A is not next to B, C is right of B, D is not on ends, D is next to C. If BC is at 2,3, D must be 1 or 4 (fails). If BC is at 3,4, D is at 2, leaving A at 1. (Order: A, D, B, C). A is not next to B, but D is not next to C (fails). So it must be B,C,D,A. Who is on the far right? A.',
      estimatedTime: 70, discriminationWeight: 1.45
    },
    {
      id: 'ld_12', category: 'Logical Deduction', difficulty: 5, type: 'multiple-choice',
      prompt: 'In a certain kingdom, Knights always tell the truth and Knaves always lie. You meet two people, X and Y. X says: "Y is a Knight." Y says: "X and I are of opposite types." What are X and Y?',
      choices: ['X is a Knave, Y is a Knave', 'X is a Knight, Y is a Knight', 'X is a Knave, Y is a Knight', 'X is a Knight, Y is a Knave'], correctAnswer: 'X is a Knave, Y is a Knave',
      explanation: 'If X is a Knight, his statement is true, so Y is a Knight. If Y is a Knight, his statement is true, meaning they are opposite types, which contradicts them both being Knights. Therefore, X must be a Knave. Since X is a Knave, his statement is false, meaning Y is NOT a Knight, so Y is a Knave. If Y is a Knave, his statement ("we are opposite") must be false, which it is, because they are the same type (both Knaves).', estimatedTime: 75, discriminationWeight: 1.5
    },
    {
      id: 'ld_13', category: 'Logical Deduction', difficulty: 4, type: 'multiple-choice',
      prompt: 'If P → Q, and R → S, and ¬Q ∨ ¬S. Which of the following is necessarily true?',
      choices: ['¬P ∨ ¬R', 'P ∧ R', '¬P ∧ ¬R', 'Q ∨ S'], correctAnswer: '¬P ∨ ¬R',
      explanation: 'This is the destructive dilemma. Since P implies Q and R implies S, and we know that either Q is false or S is false, it must be that either P is false or R is false.', estimatedTime: 60, discriminationWeight: 1.4
    },
    {
      id: 'ld_14', category: 'Logical Deduction', difficulty: 5, type: 'multiple-choice',
      prompt: 'Alice, Bob, and Charlie have different professions: Doctor, Lawyer, and Teacher. Bob is not the Lawyer. The Teacher is older than Alice. Charlie is the Teacher. What is Bob\'s profession?',
      choices: ['Doctor', 'Teacher', 'Lawyer', 'Cannot be determined'], correctAnswer: 'Doctor',
      explanation: 'Charlie is the Teacher. That leaves Doctor and Lawyer for Alice and Bob. Bob is not the Lawyer, so Bob must be the Doctor. (Alice is the Lawyer).', estimatedTime: 45, discriminationWeight: 1.3
    }
  ];
};
