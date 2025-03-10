
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserQuizManager } from '@/components/user/UserQuizManager';
import { UserQuizQuestionManager } from '@/components/user/UserQuizQuestionManager';
import { Quiz } from '@/data/quizModels';
import { AnimatedButton } from '@/components/ui/animated-button';
import { ArrowLeftIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserAuth } from '@/context/UserAuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const UserQuizCreator = () => {
  const { user } = useUserAuth();
  const { t } = useLanguage();
  const [editingQuizQuestions, setEditingQuizQuestions] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleEditQuizQuestions = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setEditingQuizQuestions(true);
  };

  const handleBackToQuizzes = () => {
    setEditingQuizQuestions(false);
    setSelectedQuiz(null);
  };

  const handleSaveQuiz = (quiz: Quiz) => {
    toast({
      title: t('quiz.saved'),
      description: `${t('quiz.saved.description')} "${quiz.title}"`,
    });
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="absolute top-4 right-4 flex space-x-2 z-50">
        <LanguageToggle variant="minimal" />
        <ThemeSwitcher />
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <AnimatedButton 
            variant="outline" 
            size="sm" 
            onClick={handleBackToDashboard}
            className="mr-4"
            animationType="ripple"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            {t('button.back')}
          </AnimatedButton>
          <h1 className="text-3xl font-bold">
            {editingQuizQuestions 
              ? `${t('quiz.editing')}: ${selectedQuiz?.title}` 
              : t('quiz.create')}
          </h1>
        </div>

        <div className="bg-background border rounded-lg shadow-sm p-4">
          {editingQuizQuestions && selectedQuiz ? (
            <UserQuizQuestionManager
              quiz={selectedQuiz}
              onBack={handleBackToQuizzes}
              onSave={handleSaveQuiz}
            />
          ) : (
            <UserQuizManager
              onEditQuizQuestions={handleEditQuizQuestions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserQuizCreator;
