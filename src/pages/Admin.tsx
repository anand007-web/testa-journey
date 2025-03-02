
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  LogOutIcon, 
  BarChart3Icon, 
  UsersIcon,
  FileTextIcon,
  TagIcon,
} from 'lucide-react';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import CategoryManager from '@/components/admin/CategoryManager';
import QuizManager from '@/components/admin/QuizManager';
import QuizQuestionManager from '@/components/admin/QuizQuestionManager';
import CSVUploader from '@/components/admin/CSVUploader';
import { Quiz, initializeQuizData } from '@/data/quizModels';
import { Question } from '@/data/questionData';

const Admin: React.FC = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
    
    // Initialize quiz data
    initializeQuizData();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
    toast.success('Logged out successfully');
  };

  const handleEditQuizQuestions = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
  };

  const handleProcessCSV = (questions: Question[]) => {
    if (questions.length === 0) {
      toast.error('No valid questions found in CSV');
      return;
    }

    if (!selectedQuiz) {
      toast.error('Please select a quiz first to add questions to');
      return;
    }

    // Add IDs to new questions
    const highestId = Math.max(...selectedQuiz.questions.map(q => q.id), 0);
    const questionsWithIds = questions.map((q, index) => ({
      ...q,
      id: highestId + index + 1
    }));

    // Update the quiz with new questions
    const updatedQuiz: Quiz = {
      ...selectedQuiz,
      questions: [...selectedQuiz.questions, ...questionsWithIds],
      updatedAt: new Date().toISOString()
    };

    // Save the updated quiz
    setSelectedQuiz(updatedQuiz);
    
    toast.success(`${questionsWithIds.length} questions imported successfully`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SSC Mock Test Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-8 px-4">
        {selectedQuiz ? (
          <QuizQuestionManager 
            quiz={selectedQuiz} 
            onBack={handleBackToQuizzes} 
            onSave={(updatedQuiz) => {
              setSelectedQuiz(updatedQuiz);
              toast.success('Quiz saved successfully');
            }}
          />
        ) : (
          <Tabs defaultValue="quizzes">
            <TabsList className="mb-6">
              <TabsTrigger value="quizzes">
                <FileTextIcon className="mr-2 h-4 w-4" />
                Quizzes
              </TabsTrigger>
              <TabsTrigger value="categories">
                <TagIcon className="mr-2 h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3Icon className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="users">
                <UsersIcon className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quizzes">
              <QuizManager onEditQuizQuestions={handleEditQuizQuestions} />
            </TabsContent>

            <TabsContent value="categories">
              <CategoryManager />
            </TabsContent>

            <TabsContent value="analytics">
              <AdminAnalytics />
            </TabsContent>

            <TabsContent value="users">
              <div className="text-center py-12 border rounded-lg">
                <h2 className="text-xl font-semibold mb-2">User Management</h2>
                <p className="text-muted-foreground">
                  User management features will be added in a future update.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Admin;
