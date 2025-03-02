
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer in options array
  explanation: string;
  difficulty: DifficultyLevel;
}

// Mock questions for testing - in a real app, these would come from an API or database
export const questions: Question[] = [
  // Easy Questions (1-35)
  {
    id: 1,
    text: "Which of the following is the capital of India?",
    options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    correctAnswer: 1,
    explanation: "New Delhi is the capital city of India.",
    difficulty: "easy"
  },
  {
    id: 2,
    text: "Who was the first Prime Minister of India?",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Patel", "Dr. Rajendra Prasad"],
    correctAnswer: 1,
    explanation: "Jawaharlal Nehru was the first Prime Minister of India, serving from 1947 until his death in 1964.",
    difficulty: "easy"
  },
  {
    id: 3,
    text: "Which planet is known as the Red Planet?",
    options: ["Jupiter", "Venus", "Mars", "Mercury"],
    correctAnswer: 2,
    explanation: "Mars is called the Red Planet because of its reddish appearance.",
    difficulty: "easy"
  },
  {
    id: 4,
    text: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    explanation: "The Pacific Ocean is the largest and deepest ocean on Earth.",
    difficulty: "easy"
  },
  {
    id: 5,
    text: "Which of the following is not a primary color?",
    options: ["Red", "Blue", "Green", "Yellow"],
    correctAnswer: 3,
    explanation: "Yellow is not a primary color in the RGB color model; it's a primary color in the RYB model.",
    difficulty: "easy"
  },
  // Medium Questions (36-70)
  {
    id: 36,
    text: "Who discovered the law of gravitation?",
    options: ["Albert Einstein", "Galileo Galilei", "Isaac Newton", "Nikola Tesla"],
    correctAnswer: 2,
    explanation: "Sir Isaac Newton discovered the law of universal gravitation in the 17th century.",
    difficulty: "medium"
  },
  {
    id: 37,
    text: "In which year did India gain independence from British rule?",
    options: ["1942", "1945", "1947", "1950"],
    correctAnswer: 2,
    explanation: "India gained independence from British rule on August 15, 1947.",
    difficulty: "medium"
  },
  {
    id: 38,
    text: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    explanation: "Au (from Latin 'aurum') is the chemical symbol for gold in the periodic table.",
    difficulty: "medium"
  },
  {
    id: 39,
    text: "Which river is known as the 'Ganges' in India?",
    options: ["Yamuna", "Brahmaputra", "Ganga", "Indus"],
    correctAnswer: 2,
    explanation: "The Ganga River is known as the 'Ganges' in English.",
    difficulty: "medium"
  },
  {
    id: 40,
    text: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: 2,
    explanation: "2 is the smallest prime number and the only even prime number.",
    difficulty: "medium"
  },
  // Hard Questions (71-100)
  {
    id: 71,
    text: "Which of the following is a non-metal that remains liquid at room temperature?",
    options: ["Phosphorus", "Bromine", "Chlorine", "Helium"],
    correctAnswer: 1,
    explanation: "Bromine is the only non-metal element that is liquid at room temperature.",
    difficulty: "hard"
  },
  {
    id: 72,
    text: "What is the value of Avogadro's number?",
    options: ["6.023 × 10^22", "6.023 × 10^23", "6.023 × 10^24", "6.023 × 10^25"],
    correctAnswer: 1,
    explanation: "Avogadro's number is approximately 6.023 × 10^23, representing the number of atoms in one mole of a substance.",
    difficulty: "hard"
  },
  {
    id: 73,
    text: "Which of the following dynasties ruled India immediately before the Mughals?",
    options: ["Lodhi Dynasty", "Khilji Dynasty", "Tughlaq Dynasty", "Sayyid Dynasty"],
    correctAnswer: 0,
    explanation: "The Lodhi Dynasty was the last dynasty of the Delhi Sultanate, ruling just before the Mughal Empire was established.",
    difficulty: "hard"
  },
  {
    id: 74,
    text: "What is the Riemann Hypothesis related to?",
    options: ["Theory of Relativity", "Distribution of Prime Numbers", "Quantum Mechanics", "Thermodynamics"],
    correctAnswer: 1,
    explanation: "The Riemann Hypothesis is a conjecture about the distribution of prime numbers and zeros of the Riemann zeta function.",
    difficulty: "hard"
  },
  {
    id: 75,
    text: "Which Indian scientist contributed to the Chandrasekhar limit?",
    options: ["C.V. Raman", "Homi J. Bhabha", "S. Chandrasekhar", "Vikram Sarabhai"],
    correctAnswer: 2,
    explanation: "Subrahmanyan Chandrasekhar calculated the limit above which a white dwarf star will collapse into a neutron star.",
    difficulty: "hard"
  },
];

// Generate the rest of the mock questions to reach 100
for (let i = 6; i <= 35; i++) {
  questions.push({
    id: i,
    text: `Easy sample question ${i}`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: i % 4,
    explanation: `This is the explanation for easy question ${i}.`,
    difficulty: "easy"
  });
}

for (let i = 41; i <= 70; i++) {
  questions.push({
    id: i,
    text: `Medium sample question ${i}`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: i % 4,
    explanation: `This is the explanation for medium question ${i}.`,
    difficulty: "medium"
  });
}

for (let i = 76; i <= 100; i++) {
  questions.push({
    id: i,
    text: `Hard sample question ${i}`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: i % 4,
    explanation: `This is the explanation for hard question ${i}.`,
    difficulty: "hard"
  });
}
