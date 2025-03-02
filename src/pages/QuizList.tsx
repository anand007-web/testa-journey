
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/context/UserAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LogOutIcon, 
  FileTextIcon, 
  SearchIcon, 
  TimerIcon, 
  TagIcon, 
  ArrowLeftIcon 
} from 'lucide-react';
import { Quiz, getPublishedQuizzes, Category, getCategories } from '@/data/quizModels';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const QuizList: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useUserAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Load published quizzes
    const loadedQuizzes = getPublishedQuizzes();
    setQuizzes(loadedQuizzes);
    
    // Load categories
    const loadedCategories = getCategories();
    setCategories(loadedCategories);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const getFilteredQuizzes = () => {
    let filteredQuizzes = [...quizzes];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.categoryId === categoryFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      filteredQuizzes = filteredQuizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCategoryName(quiz.categoryId).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filteredQuizzes;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">SSC Mock Tests</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link to="/dashboard">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Browse Mock Tests</h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quizzes by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="w-full md:w-64">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <TagIcon className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredQuizzes().length > 0 ? (
            getFilteredQuizzes().map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="mb-2">{getCategoryName(quiz.categoryId)}</Badge>
                      <CardTitle>{quiz.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {quiz.description || 'No description provided'}
                  </p>
                  
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-sm">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{quiz.questions.length} questions</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <TimerIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{quiz.timeLimit || 30} min</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/quiz/${quiz.id}`}>
                      Start Quiz
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 border rounded-lg">
              <FileTextIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Quizzes Found</h3>
              <p className="text-muted-foreground">
                {searchQuery || categoryFilter !== 'all'
                  ? 'No quizzes match your search criteria. Try adjusting your filters.'
                  : 'There are no quizzes available at the moment. Please check back later.'}
              </p>
              
              {(searchQuery || categoryFilter !== 'all') && (
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                  }}
                  className="mt-2"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizList;
