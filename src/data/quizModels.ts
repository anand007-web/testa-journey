
import { Question as QuestionData, DifficultyLevel } from '@/data/questionData';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  questions: QuestionData[];
  timeLimit?: number; // In minutes, optional
  passingScore?: number; // Percentage, optional
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  user_id?: string; // Add this to match Supabase schema
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

// Helper functions for quiz management using Supabase
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error getting categories:', error);
      toast.error('Failed to fetch categories');
      return [];
    }
    
    // Transform the data to match our interface
    return data.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.created_at,
      updatedAt: category.updated_at
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

export const getQuizzes = async (): Promise<Quiz[]> => {
  try {
    const { data: quizzesData, error: quizzesError } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (quizzesError) {
      console.error('Error getting quizzes:', quizzesError);
      toast.error('Failed to fetch quizzes');
      return [];
    }
    
    // Fetch all questions and answers in batch operations
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .select('*');
      
    if (questionsError) {
      console.error('Error getting questions:', questionsError);
      return [];
    }
    
    const { data: answersData, error: answersError } = await supabase
      .from('answers')
      .select('*');
      
    if (answersError) {
      console.error('Error getting answers:', answersError);
      return [];
    }
    
    // Transform data to match our interfaces
    const quizzes = quizzesData.map(quiz => {
      // Find all questions for this quiz
      const quizQuestions = questionsData.filter(q => q.quiz_id === quiz.id);
      
      // For each question, find its answers
      const questions: QuestionData[] = quizQuestions.map(question => {
        const questionAnswers = answersData.filter(a => a.question_id === question.id);
        
        // Find the correct answer index
        const correctAnswerIndex = questionAnswers.findIndex(a => a.is_correct);
        
        return {
          id: question.id,
          text: question.question_text,
          explanation: question.explanation || '',
          options: questionAnswers.map(answer => answer.answer_text),
          correctAnswer: correctAnswerIndex !== -1 ? correctAnswerIndex : 0,
          difficulty: (question.difficulty as DifficultyLevel) || 'medium',
          points: question.points || 1
        };
      });
      
      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description || '',
        categoryId: quiz.category_id || '',
        questions: questions,
        timeLimit: quiz.time_limit,
        passingScore: quiz.passing_score,
        isPublished: quiz.is_published,
        createdAt: quiz.created_at,
        updatedAt: quiz.updated_at,
        user_id: quiz.user_id
      };
    });
    
    console.log('Retrieved quizzes from Supabase:', quizzes.length);
    return quizzes;
  } catch (error) {
    console.error('Error getting quizzes:', error);
    return [];
  }
};

export const getPublishedQuizzes = async (): Promise<Quiz[]> => {
  try {
    const quizzes = await getQuizzes();
    const published = quizzes.filter(quiz => quiz.isPublished === true);
    console.log('Retrieved published quizzes:', published.length);
    return published;
  } catch (error) {
    console.error('Error getting published quizzes:', error);
    return [];
  }
};

export const getQuizById = async (id: string): Promise<Quiz | undefined> => {
  try {
    const quizzes = await getQuizzes();
    return quizzes.find(quiz => quiz.id === id);
  } catch (error) {
    console.error('Error getting quiz by ID:', error);
    return undefined;
  }
};

export const saveCategory = async (category: any): Promise<boolean> => {
  try {
    // Format data for Supabase
    const categoryData = {
      id: category.id,
      name: category.name,
      description: category.description || null
    };
    
    // Check if category exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('id', category.id)
      .single();
      
    let result;
    
    if (existingCategory) {
      // Update existing category
      result = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', category.id);
    } else {
      // Create new category
      result = await supabase
        .from('categories')
        .insert(categoryData);
    }
    
    if (result.error) {
      console.error('Error saving category:', result.error);
      toast.error('Failed to save category');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving category:', error);
    toast.error('Failed to save category');
    return false;
  }
};

export const saveQuiz = async (quiz: Quiz): Promise<boolean> => {
  try {
    // Begin a transaction using multiple operations
    // 1. Save quiz data
    const quizData = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description || null,
      category_id: quiz.categoryId,
      time_limit: quiz.timeLimit || null,
      passing_score: quiz.passingScore || null,
      is_published: quiz.isPublished,
      // Supabase automatically handles created_at and updated_at
    };
    
    // Check if quiz exists
    const { data: existingQuiz } = await supabase
      .from('quizzes')
      .select('id')
      .eq('id', quiz.id)
      .single();
    
    let quizResult;
    
    if (existingQuiz) {
      // Update existing quiz
      quizResult = await supabase
        .from('quizzes')
        .update(quizData)
        .eq('id', quiz.id);
    } else {
      // Create new quiz with a user_id 
      // This assumes the user is authenticated; we get the user ID from the auth context
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        toast.error('You must be logged in to create a quiz');
        return false;
      }
      
      quizData.user_id = userData.user.id;
      quizResult = await supabase
        .from('quizzes')
        .insert(quizData);
    }
    
    if (quizResult.error) {
      console.error('Error saving quiz:', quizResult.error);
      toast.error('Failed to save quiz');
      return false;
    }
    
    // 2. Save questions and answers
    for (const question of quiz.questions) {
      const questionData = {
        id: question.id.toString(),
        quiz_id: quiz.id,
        question_text: question.text,
        difficulty: question.difficulty,
        explanation: question.explanation || null,
        points: question.points || 1
      };
      
      // Check if question exists
      const { data: existingQuestion } = await supabase
        .from('questions')
        .select('id')
        .eq('id', question.id.toString())
        .single();
        
      let questionResult;
      
      if (existingQuestion) {
        // Update existing question
        questionResult = await supabase
          .from('questions')
          .update(questionData)
          .eq('id', question.id.toString());
      } else {
        // Create new question
        questionResult = await supabase
          .from('questions')
          .insert(questionData);
      }
      
      if (questionResult.error) {
        console.error('Error saving question:', questionResult.error);
        toast.error('Failed to save question');
        return false;
      }
      
      // Save answers for this question
      for (let i = 0; i < question.options.length; i++) {
        const option = question.options[i];
        const isCorrect = i === question.correctAnswer;
        
        const answerId = `${question.id}_${i}`;
        const answerData = {
          id: answerId,
          question_id: question.id.toString(),
          answer_text: option,
          is_correct: isCorrect
        };
        
        // Check if answer exists
        const { data: existingAnswer } = await supabase
          .from('answers')
          .select('id')
          .eq('id', answerId)
          .single();
          
        let answerResult;
        
        if (existingAnswer) {
          // Update existing answer
          answerResult = await supabase
            .from('answers')
            .update(answerData)
            .eq('id', answerId);
        } else {
          // Create new answer
          answerResult = await supabase
            .from('answers')
            .insert(answerData);
        }
        
        if (answerResult.error) {
          console.error('Error saving answer:', answerResult.error);
          toast.error('Failed to save answer');
          return false;
        }
      }
    }
    
    console.log(`Saved quiz: ${quiz.title} (ID: ${quiz.id}), Published: ${quiz.isPublished}`);
    return true;
  } catch (error) {
    console.error('Error saving quiz:', error);
    toast.error('Failed to save quiz. Please try again.');
    return false;
  }
};

export const deleteQuiz = async (id: string): Promise<boolean> => {
  try {
    // Due to cascading deletes, we only need to delete the quiz
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Failed to delete quiz');
      return false;
    }
    
    toast.success('Quiz deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting quiz:', error);
    toast.error('Failed to delete quiz. Please try again.');
    return false;
  }
};

export const saveUserQuizAttempt = async (attempt: UserQuizAttempt): Promise<boolean> => {
  try {
    const attemptData = {
      id: attempt.id,
      user_id: attempt.userId,
      quiz_id: attempt.quizId,
      score: attempt.score,
      total_questions: attempt.totalQuestions,
      correct_answers: attempt.correctAnswers,
      incorrect_answers: attempt.incorrectAnswers,
      skipped_questions: attempt.skippedQuestions,
      time_taken: attempt.timeTaken
      // completed_at is handled automatically
    };
    
    const { error } = await supabase
      .from('quiz_attempts')
      .insert(attemptData);
      
    if (error) {
      console.error('Error saving quiz attempt:', error);
      toast.error('Failed to save your quiz attempt');
      return false;
    }
    
    console.log(`Saved quiz attempt for user ${attempt.userId}, quiz ${attempt.quizId}, score: ${attempt.score}%`);
    return true;
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    toast.error('Failed to save your quiz attempt. Your progress might not be recorded.');
    return false;
  }
};

export const getUserQuizAttempts = async (userId: string): Promise<UserQuizAttempt[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
      
    if (error) {
      console.error('Error getting quiz attempts:', error);
      return [];
    }
    
    // Transform data to match our interface
    return data.map(attempt => ({
      id: attempt.id,
      userId: attempt.user_id,
      quizId: attempt.quiz_id,
      score: attempt.score,
      totalQuestions: attempt.total_questions,
      correctAnswers: attempt.correct_answers,
      incorrectAnswers: attempt.incorrect_answers,
      skippedQuestions: attempt.skipped_questions,
      timeTaken: attempt.time_taken,
      completedAt: attempt.completed_at
    }));
  } catch (error) {
    console.error('Error getting quiz attempts:', error);
    return [];
  }
};

// Initialize function
export const initializeQuizData = (): void => {
  console.log('Initializing quiz data with Supabase integration...');
  // No need to initialize local storage data since we're using Supabase
};
