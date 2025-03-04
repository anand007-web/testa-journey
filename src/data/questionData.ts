
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: DifficultyLevel;
  category?: string;
  points?: number; // Add points as an optional property
}

export const questions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    explanation: "Paris is the capital city of France, known for landmarks like the Eiffel Tower and Louvre Museum.",
    difficulty: "easy",
    category: "general"
  },
  {
    id: 2,
    text: "Which of the following is NOT a primary color in RGB color model?",
    options: ["Red", "Green", "Yellow", "Blue"],
    correctAnswer: 2,
    explanation: "In the RGB (Red, Green, Blue) color model, Yellow is not a primary color, it's created by mixing Red and Green.",
    difficulty: "medium",
    category: "general"
  },
  {
    id: 3,
    text: "Solve for x: 2x + 7 = 15",
    options: ["x = 3", "x = 4", "x = 5", "x = 6"],
    correctAnswer: 1,
    explanation: "2x + 7 = 15 → 2x = 15 - 7 → 2x = 8 → x = 4",
    difficulty: "easy",
    category: "mathematics"
  },
  {
    id: 4,
    text: "Which of the following sorting algorithms has the worst average-case performance?",
    options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Heap Sort"],
    correctAnswer: 2,
    explanation: "Bubble Sort has an average time complexity of O(n²), which is worse than Quick Sort, Merge Sort, and Heap Sort, which all have O(n log n) average complexity.",
    difficulty: "hard",
    category: "reasoning"
  },
  {
    id: 5,
    text: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
    options: ["24", "32", "20", "30"],
    correctAnswer: 1,
    explanation: "This is a geometric sequence where each number is multiplied by 2 to get the next number. So 16 × 2 = 32.",
    difficulty: "medium",
    category: "reasoning"
  },
  {
    id: 6,
    text: "Which of these planets is closest to the sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correctAnswer: 1,
    explanation: "Mercury is the closest planet to the sun in our solar system, followed by Venus, Earth, and Mars.",
    difficulty: "easy",
    category: "general"
  },
  {
    id: 7,
    text: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
    explanation: "World War II ended in 1945 with the surrender of Nazi Germany in May and Japan in September.",
    difficulty: "medium",
    category: "gk"
  },
  {
    id: 8,
    text: "If a car travels at 60 km/h, how far will it travel in 2.5 hours?",
    options: ["120 km", "150 km", "180 km", "200 km"],
    correctAnswer: 1,
    explanation: "Distance = Speed × Time = 60 km/h × 2.5 h = 150 km",
    difficulty: "easy",
    category: "mathematics"
  },
  {
    id: 9,
    text: "Which of the following is NOT a work of William Shakespeare?",
    options: ["Hamlet", "Macbeth", "Pride and Prejudice", "Romeo and Juliet"],
    correctAnswer: 2,
    explanation: "Pride and Prejudice was written by Jane Austen, not William Shakespeare.",
    difficulty: "medium",
    category: "english"
  },
  {
    id: 10,
    text: "What is the square root of 144?",
    options: ["10", "12", "14", "16"],
    correctAnswer: 1,
    explanation: "The square root of 144 is 12, because 12 × 12 = 144.",
    difficulty: "easy",
    category: "mathematics"
  }
];
