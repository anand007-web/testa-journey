
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Edit, Plus, Trophy, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/context/UserAuthContext';
import { formatDistanceToNow } from 'date-fns';
import { getQuizzes, getCategories, getUserQuizAttempts } from '@/data/quizModels';
import { Category, Quiz, QuizAttempt } from '@/integrations/supabase/client';

const UserDashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const fetchedQuizzes = await getQuizzes();
        setQuizzes(fetchedQuizzes);
        
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        
        const fetchedAttempts = await getUserQuizAttempts(user.id);
        setAttempts(fetchedAttempts);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  const myQuizzes = quizzes.filter(quiz => quiz.user_id === user?.id);
  const publishedQuizzes = myQuizzes.filter(quiz => quiz.is_published);
  const draftQuizzes = myQuizzes.filter(quiz => !quiz.is_published);

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const getQuizTitle = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz ? quiz.title : 'Unknown Quiz';
  };

  const calculateSuccessRate = () => {
    if (attempts.length === 0) return 0;
    const successfulAttempts = attempts.filter(a => 
      a.score >= 70 // Assuming 70% is passing
    ).length;
    return Math.round((successfulAttempts / attempts.length) * 100);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.user_metadata?.username || 'User'}
          </p>
        </div>
        <Button asChild>
          <Link to="/admin" className="flex items-center gap-2">
            <Plus size={16} />
            Create New Quiz
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              My Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{myQuizzes.length}</p>
            <p className="text-sm text-muted-foreground">
              {publishedQuizzes.length} published, {draftQuizzes.length} drafts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Quiz Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{attempts.length}</p>
            <p className="text-sm text-muted-foreground">
              {calculateSuccessRate()}% success rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              Best Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {attempts.length > 0 
                ? `${Math.max(...attempts.map(a => a.score))}%` 
                : '0%'}
            </p>
            <p className="text-sm text-muted-foreground">
              {attempts.length > 0 ? 'Great job!' : 'No attempts yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="my-quizzes" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="my-quizzes">My Quizzes</TabsTrigger>
          <TabsTrigger value="attempts">Quiz Attempts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-quizzes">
          {myQuizzes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myQuizzes.map(quiz => (
                <Card key={quiz.id} className="overflow-hidden">
                  <div className={`h-2 ${quiz.is_published ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">{getCategoryName(quiz.category_id)}</Badge>
                      <Badge variant={quiz.is_published ? "default" : "secondary"}>
                        {quiz.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">{quiz.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar size={14} />
                      <span>Created {formatDate(quiz.created_at)}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link to={`/quiz/${quiz.id}`}>
                          <BookOpen size={14} className="mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="flex-1">
                        <Link to={`/admin?edit=${quiz.id}`}>
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No quizzes created yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-4">
                Start creating your first quiz to test others' knowledge or for educational purposes.
              </p>
              <Button asChild>
                <Link to="/admin" className="flex items-center gap-2">
                  <Plus size={16} />
                  Create New Quiz
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="attempts">
          {attempts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {attempts.map(attempt => (
                <Card key={attempt.id} className="overflow-hidden">
                  <div className={`h-2 ${attempt.score >= 70 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{getQuizTitle(attempt.quiz_id)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Trophy className={`h-5 w-5 ${attempt.score >= 70 ? 'text-green-500' : 'text-red-500'}`} />
                        <span className="text-xl font-bold">{attempt.score}%</span>
                      </div>
                      <Badge variant={attempt.score >= 70 ? "success" : "destructive"}>
                        {attempt.score >= 70 ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Correct:</span>
                        <span className="font-medium">{attempt.correct_answers} of {attempt.total_questions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time taken:</span>
                        <span className="font-medium">
                          {Math.floor(attempt.time_taken / 60)}m {attempt.time_taken % 60}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed:</span>
                        <span className="font-medium">{formatDate(attempt.completed_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <XCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No quiz attempts yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-4">
                Take some quizzes to see your performance and track your progress here.
              </p>
              <Button asChild>
                <Link to="/quizzes" className="flex items-center gap-2">
                  <BookOpen size={16} />
                  Browse Quizzes
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
