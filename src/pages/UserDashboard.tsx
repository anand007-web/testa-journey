
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '@/context/UserAuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  LogOutIcon, 
  FileTextIcon, 
  TrophyIcon, 
  HistoryIcon, 
  BookOpenIcon, 
  BarChart3Icon, 
  AwardIcon, 
  TimerIcon,
  UserIcon,
  GraduationCapIcon
} from 'lucide-react';
import { Quiz, getPublishedQuizzes, Category, getCategories, UserQuizAttempt, getUserQuizAttemptsById } from '@/data/quizModels';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUserAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [attempts, setAttempts] = useState<UserQuizAttempt[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      // Load published quizzes
      const loadedQuizzes = getPublishedQuizzes();
      setQuizzes(loadedQuizzes);
      
      // Load categories
      const loadedCategories = getCategories();
      setCategories(loadedCategories);
      
      // Load user attempts
      const userAttempts = getUserQuizAttemptsById(user.id);
      setAttempts(userAttempts);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const getQuizAttempts = (quizId: string) => {
    return attempts.filter(a => a.quizId === quizId);
  };

  const getHighestScore = (quizId: string) => {
    const quizAttempts = getQuizAttempts(quizId);
    if (quizAttempts.length === 0) return 0;
    
    const scores = quizAttempts.map(a => a.score);
    return Math.max(...scores);
  };

  const getAverageScore = () => {
    if (attempts.length === 0) return 0;
    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    return Math.round((totalScore / attempts.length) * 10) / 10;
  };

  const getTotalQuizzesTaken = () => {
    const uniqueQuizIds = new Set(attempts.map(a => a.quizId));
    return uniqueQuizIds.size;
  };

  const getQuizName = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz ? quiz.title : 'Unknown Quiz';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">SSC Mock Test Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UserIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tests Taken</p>
                  <p className="text-3xl font-bold">{attempts.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <HistoryIcon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unique Quizzes</p>
                  <p className="text-3xl font-bold">{getTotalQuizzesTaken()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FileTextIcon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-3xl font-bold">{getAverageScore()}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <BarChart3Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Quizzes</p>
                  <p className="text-3xl font-bold">{quizzes.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpenIcon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="quizzes">
          <TabsList className="mb-6">
            <TabsTrigger value="quizzes">
              <FileTextIcon className="mr-2 h-4 w-4" />
              Available Quizzes
            </TabsTrigger>
            <TabsTrigger value="history">
              <HistoryIcon className="mr-2 h-4 w-4" />
              Test History
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <AwardIcon className="mr-2 h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quizzes">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => {
                  const quizAttempts = getQuizAttempts(quiz.id);
                  const highestScore = getHighestScore(quiz.id);
                  
                  return (
                    <Card key={quiz.id} className="overflow-hidden flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge className="mb-2">{getCategoryName(quiz.categoryId)}</Badge>
                            <CardTitle>{quiz.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 flex-grow">
                        <p className="text-sm text-muted-foreground">
                          {quiz.description || 'No description provided'}
                        </p>
                        
                        <div className="flex gap-4 mt-4">
                          <div className="flex items-center gap-1 text-sm">
                            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{quiz.questions.length} questions</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <TimerIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{quiz.timeLimit || 30} min</span>
                          </div>
                        </div>
                        
                        {quizAttempts.length > 0 && (
                          <div className="mt-4 p-2 rounded-md bg-muted/50">
                            <div className="flex justify-between text-sm">
                              <span>Highest Score:</span>
                              <span className="font-medium">{highestScore}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Attempts:</span>
                              <span className="font-medium">{quizAttempts.length}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button asChild className="w-full">
                          <Link to={`/quiz/${quiz.id}`}>
                            {quizAttempts.length > 0 ? 'Retry Quiz' : 'Start Quiz'}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 border rounded-lg">
                  <GraduationCapIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No Quizzes Available</h2>
                  <p className="text-muted-foreground">
                    There are no quizzes available at the moment. Please check back later.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Your Test History</CardTitle>
                <CardDescription>
                  Review your past quiz attempts and track your progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attempts.length > 0 ? (
                  <div className="space-y-4">
                    {attempts.map((attempt, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                          <div>
                            <h3 className="font-medium">{getQuizName(attempt.quizId)}</h3>
                            <p className="text-sm text-muted-foreground">
                              Completed on {formatDate(attempt.completedAt)}
                            </p>
                          </div>
                          <Badge variant={attempt.score >= 70 ? "default" : "outline"}>
                            {attempt.score}% Score
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">Total Questions</p>
                            <p className="font-medium">{attempt.totalQuestions}</p>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">Correct</p>
                            <p className="font-medium text-green-600">{attempt.correctAnswers}</p>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">Incorrect</p>
                            <p className="font-medium text-red-600">{attempt.incorrectAnswers}</p>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <p className="text-muted-foreground">Time Taken</p>
                            <p className="font-medium">
                              {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex justify-end">
                          <Button 
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link to={`/quiz/${attempt.quizId}`}>
                              Retake Quiz
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HistoryIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Test History</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't taken any tests yet. Start with one of our available quizzes.
                    </p>
                    <Button asChild>
                      <Link to="/quizzes">Browse Quizzes</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Track your progress and unlock achievements as you complete more quizzes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className={`p-4 border rounded-lg ${attempts.length >= 1 ? "bg-primary/5 border-primary" : "opacity-50"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${attempts.length >= 1 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <TrophyIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">First Quiz</h3>
                        <p className="text-sm text-muted-foreground">Complete your first quiz</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 border rounded-lg ${attempts.length >= 5 ? "bg-primary/5 border-primary" : "opacity-50"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${attempts.length >= 5 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <AwardIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">Quiz Enthusiast</h3>
                        <p className="text-sm text-muted-foreground">Complete 5 quizzes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 border rounded-lg ${attempts.length >= 10 ? "bg-primary/5 border-primary" : "opacity-50"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${attempts.length >= 10 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <GraduationCapIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">Quiz Master</h3>
                        <p className="text-sm text-muted-foreground">Complete 10 quizzes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 border rounded-lg ${getAverageScore() >= 80 ? "bg-primary/5 border-primary" : "opacity-50"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getAverageScore() >= 80 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <BarChart3Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">High Achiever</h3>
                        <p className="text-sm text-muted-foreground">Maintain 80% average score</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 border rounded-lg ${getTotalQuizzesTaken() >= 5 ? "bg-primary/5 border-primary" : "opacity-50"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getTotalQuizzesTaken() >= 5 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <FileTextIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">Well-Rounded</h3>
                        <p className="text-sm text-muted-foreground">Complete 5 different quizzes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserDashboard;
