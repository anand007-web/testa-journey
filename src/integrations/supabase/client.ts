
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = 'https://ljoieocugpdzhvdxkrcc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqb2llb2N1Z3Bkemh2ZHhrcmNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNjQ1NzgsImV4cCI6MjA1NjY0MDU3OH0.QbsoiVud0j6xKKDiTHXfDCeHW-pz4qiKS7UxheMXeBo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables that match our Supabase schema
export type Profile = {
  id: string;
  username: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  // Add these fields to match the application's expected structure
  createdAt?: string;
  updatedAt?: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  user_id: string;
  time_limit: number | null;
  passing_score: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // Add these fields to match the application's expected structure
  categoryId?: string;
  questions?: any[];
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Question = {
  id: string;
  quiz_id: string;
  question_text: string;
  difficulty: string | null;
  explanation: string | null;
  points: number;
  created_at: string;
  updated_at: string;
  // Add these fields to match the application's expected Question type
  text?: string;
  options?: any[];
  correctAnswer?: number;
};

export type Answer = {
  id: string;
  question_id: string;
  answer_text: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
  // Add these fields to match the application's expected Answer type
  text?: string;
  isCorrect?: boolean;
};

export type QuizAttempt = {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  skipped_questions: number;
  time_taken: number;
  completed_at: string;
  // Add these fields to match the application's expected QuizAttempt type
  userId?: string;
  quizId?: string;
  totalQuestions?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  skippedQuestions?: number;
  timeTaken?: number;
  completedAt?: string;
};
