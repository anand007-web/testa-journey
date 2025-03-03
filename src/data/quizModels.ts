import { Question, DifficultyLevel } from '@/data/questionData';

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  questions: Question[];
  timeLimit?: number; // In minutes, optional
  passingScore?: number; // Percentage, optional
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserQuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  timeTaken: number; // In seconds
  completedAt: string;
}

// Initial default categories
export const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'General Knowledge',
    description: 'Questions about general knowledge',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Mathematics',
    description: 'Questions about mathematics',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'English',
    description: 'Questions about English language',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Reasoning',
    description: 'Questions about logical reasoning',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper functions for quiz management
export const getCategories = (): Category[] => {
  try {
    const categories = localStorage.getItem('quiz_categories');
    if (!categories) {
      // If no categories exist, initialize with defaults and save
      localStorage.setItem('quiz_categories', JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    return JSON.parse(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    return defaultCategories;
  }
};

export const getQuizzes = (): Quiz[] => {
  try {
    const quizzes = localStorage.getItem('quizzes');
    if (!quizzes) {
      // If no quizzes exist, initialize with empty array and save
      localStorage.setItem('quizzes', JSON.stringify([]));
      return [];
    }
    return JSON.parse(quizzes);
  } catch (error) {
    console.error('Error getting quizzes:', error);
    return [];
  }
};

export const getPublishedQuizzes = (): Quiz[] => {
  const quizzes = getQuizzes();
  const published = quizzes.filter(quiz => quiz.isPublished === true);
  console.log('Retrieved published quizzes:', published.length);
  return published;
};

export const getQuizById = (id: string): Quiz | undefined => {
  const quizzes = getQuizzes();
  return quizzes.find(quiz => quiz.id === id);
};

export const saveCategory = (category: Category): void => {
  try {
    const categories = getCategories();
    const existingIndex = categories.findIndex(c => c.id === category.id);
    
    if (existingIndex >= 0) {
      // Update existing category
      categories[existingIndex] = {
        ...category,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add new category
      categories.push({
        ...category,
        id: category.id || crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    localStorage.setItem('quiz_categories', JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving category:', error);
  }
};

export const saveQuiz = (quiz: Quiz): void => {
  try {
    const quizzes = getQuizzes();
    const existingIndex = quizzes.findIndex(q => q.id === quiz.id);
    
    if (existingIndex >= 0) {
      // Update existing quiz
      quizzes[existingIndex] = {
        ...quiz,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add new quiz
      quizzes.push({
        ...quiz,
        id: quiz.id || crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  } catch (error) {
    console.error('Error saving quiz:', error);
  }
};

export const deleteQuiz = (id: string): void => {
  try {
    const quizzes = getQuizzes();
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
  } catch (error) {
    console.error('Error deleting quiz:', error);
  }
};

export const saveUserQuizAttempt = (attempt: UserQuizAttempt): void => {
  try {
    const attempts = getUserQuizAttempts();
    attempts.push({
      ...attempt,
      id: attempt.id || crypto.randomUUID(),
    });
    localStorage.setItem('quiz_attempts', JSON.stringify(attempts));
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
  }
};

export const getUserQuizAttempts = (): UserQuizAttempt[] => {
  try {
    const attempts = localStorage.getItem('quiz_attempts');
    return attempts ? JSON.parse(attempts) : [];
  } catch (error) {
    console.error('Error getting quiz attempts:', error);
    return [];
  }
};

export const getUserQuizAttemptsById = (userId: string): UserQuizAttempt[] => {
  const attempts = getUserQuizAttempts();
  return attempts.filter(attempt => attempt.userId === userId);
};

// Initialize local storage with default categories if none exist
export const initializeQuizData = (): void => {
  console.log('Initializing quiz data...');
  
  if (!localStorage.getItem('quiz_categories')) {
    localStorage.setItem('quiz_categories', JSON.stringify(defaultCategories));
    console.log('Initialized default categories');
  }
  
  if (!localStorage.getItem('quizzes')) {
    localStorage.setItem('quizzes', JSON.stringify([]));
    console.log('Initialized empty quizzes array');
  }
  
  if (!localStorage.getItem('quiz_attempts')) {
    localStorage.setItem('quiz_attempts', JSON.stringify([]));
    console.log('Initialized empty quiz attempts array');
  }
  
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
    console.log('Initialized empty users array');
  }
};
