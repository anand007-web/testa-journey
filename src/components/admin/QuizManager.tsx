import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Category, 
  Quiz, 
  getCategories, 
  getQuizzes, 
  saveQuiz, 
  deleteQuiz,
  getQuizById 
} from '@/data/quizModels';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircleIcon, 
  EditIcon, 
  TrashIcon, 
  SaveIcon, 
  XIcon, 
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Question } from '@/data/questionData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface QuizManagerProps {
  onEditQuizQuestions: (quiz: Quiz) => void;
}

const QuizManager: React.FC<QuizManagerProps> = ({ onEditQuizQuestions }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newQuiz, setNewQuiz] = useState<Partial<Quiz>>({
    title: '',
    description: '',
    categoryId: '',
    questions: [],
    timeLimit: 30,
    isPublished: false,
  });
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedCategories = getCategories();
    const loadedQuizzes = getQuizzes();
    setCategories(loadedCategories);
    setQuizzes(loadedQuizzes);
  };

  const resetForm = () => {
    setNewQuiz({
      title: '',
      description: '',
      categoryId: '',
      questions: [],
      timeLimit: 30,
      isPublished: false,
    });
    setEditingQuizId(null);
  };

  const handleCreateQuiz = () => {
    if (!newQuiz.title) {
      toast.error('Quiz title is required');
      return;
    }

    if (!newQuiz.categoryId) {
      toast.error('Please select a category');
      return;
    }

    const quiz: Quiz = {
      id: crypto.randomUUID(),
      title: newQuiz.title || 'Untitled Quiz',
      description: newQuiz.description || '',
      categoryId: newQuiz.categoryId || categories[0]?.id || '',
      questions: [],
      timeLimit: newQuiz.timeLimit || 30,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveQuiz(quiz);
    resetForm();
    loadData();
    toast.success('Quiz created successfully');
    
    setTimeout(() => {
      if (confirm('Would you like to add questions to this quiz now?')) {
        onEditQuizQuestions(quiz);
      }
    }, 500);
  };

  const handleUpdateQuiz = () => {
    if (!newQuiz.title || !editingQuizId) {
      toast.error('Quiz title is required');
      return;
    }

    if (!newQuiz.categoryId) {
      toast.error('Please select a category');
      return;
    }

    const existingQuiz = quizzes.find(q => q.id === editingQuizId);
    if (existingQuiz) {
      const updatedQuiz: Quiz = {
        ...existingQuiz,
        title: newQuiz.title,
        description: newQuiz.description || '',
        categoryId: newQuiz.categoryId,
        timeLimit: newQuiz.timeLimit || existingQuiz.timeLimit || 30,
        updatedAt: new Date().toISOString(),
      };

      saveQuiz(updatedQuiz);
      resetForm();
      loadData();
      toast.success('Quiz updated successfully');
    }
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuizId(quiz.id);
    setNewQuiz({
      title: quiz.title,
      description: quiz.description,
      categoryId: quiz.categoryId,
      timeLimit: quiz.timeLimit || 30,
    });
  };

  const handleDeleteQuiz = (id: string) => {
    if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      deleteQuiz(id);
      loadData();
      toast.success('Quiz deleted successfully');
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleEditQuestions = (quiz: Quiz) => {
    onEditQuizQuestions(quiz);
  };

  const handleTogglePublish = (quiz: Quiz) => {
    const updatedQuiz: Quiz = {
      ...quiz,
      isPublished: !quiz.isPublished,
      updatedAt: new Date().toISOString()
    };
    
    if (!quiz.isPublished && quiz.questions.length === 0) {
      toast.error('Cannot publish a quiz with no questions. Please add questions first.');
      return;
    }
    
    saveQuiz(updatedQuiz);
    loadData();
    
    console.log(`Quiz ${updatedQuiz.id} publish status toggled to: ${updatedQuiz.isPublished}`);
    
    if (!quiz.isPublished) {
      toast.success('Quiz published successfully! Users can now access this quiz.');
    } else {
      toast.success('Quiz unpublished. Users can no longer access this quiz.');
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const getFilteredQuizzes = () => {
    if (selectedTab === 'all') return quizzes;
    if (selectedTab === 'published') return quizzes.filter(q => q.isPublished);
    if (selectedTab === 'draft') return quizzes.filter(q => !q.isPublished);
    return quizzes;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingQuizId ? 'Edit Quiz' : 'Create New Quiz'}</CardTitle>
          <CardDescription>
            {editingQuizId 
              ? 'Update the details of your quiz' 
              : 'Create a new quiz by filling out the form below'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quiz-title">Quiz Title</Label>
            <Input
              id="quiz-title"
              placeholder="e.g., Mathematics Mock Test 1"
              value={newQuiz.title || ''}
              onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quiz-description">Description</Label>
            <Textarea
              id="quiz-description"
              placeholder="Provide a description of what this quiz covers"
              value={newQuiz.description || ''}
              onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-category">Category</Label>
              <Select
                value={newQuiz.categoryId}
                onValueChange={(value) => setNewQuiz({ ...newQuiz, categoryId: value })}
              >
                <SelectTrigger id="quiz-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quiz-time-limit">Time Limit (minutes)</Label>
              <Input
                id="quiz-time-limit"
                type="number"
                min="1"
                max="180"
                placeholder="30"
                value={newQuiz.timeLimit || ''}
                onChange={(e) => setNewQuiz({ 
                  ...newQuiz, 
                  timeLimit: Math.max(1, Math.min(180, parseInt(e.target.value) || 30)) 
                })}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {editingQuizId ? (
            <>
              <Button onClick={handleUpdateQuiz} className="flex-1">
                <SaveIcon className="mr-2 h-4 w-4" />
                Update Quiz
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                <XIcon className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleCreateQuiz} className="w-full">
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Create Quiz
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Quizzes</CardTitle>
          <CardDescription>
            View, edit, and manage your quizzes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Quizzes</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            
            <div className="space-y-4">
              {getFilteredQuizzes().length > 0 ? (
                getFilteredQuizzes().map((quiz) => (
                  <Card key={quiz.id} className="overflow-hidden">
                    <div className="p-4 border-b bg-muted/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{quiz.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={quiz.isPublished ? "default" : "outline"}>
                              {quiz.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                            <Badge variant="secondary">
                              {getCategoryName(quiz.categoryId)}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {quiz.timeLimit || 30} min
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <FileTextIcon className="h-3 w-3 mr-1" />
                              {quiz.questions.length} questions
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleTogglePublish(quiz)}
                            title={quiz.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            <CheckCircleIcon className={`h-4 w-4 ${quiz.isPublished ? 'text-green-500' : 'text-muted-foreground'}`} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditQuiz(quiz)}
                            title="Edit Details"
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditQuestions(quiz)}
                            title="Edit Questions"
                          >
                            <FileTextIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            className="text-destructive hover:text-destructive"
                            title="Delete Quiz"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {quiz.description && (
                        <p className="text-sm mt-2">{quiz.description}</p>
                      )}
                    </div>
                    
                    {quiz.questions.length > 0 ? (
                      <div className="p-4">
                        <h4 className="text-sm font-medium mb-2">
                          Questions ({quiz.questions.length})
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {quiz.questions.slice(0, 3).map((question, index) => (
                            <div key={index} className="text-sm border-b pb-2">
                              {question.text.length > 100 
                                ? `${question.text.substring(0, 100)}...` 
                                : question.text}
                            </div>
                          ))}
                          {quiz.questions.length > 3 && (
                            <p className="text-xs text-muted-foreground text-center">
                              +{quiz.questions.length - 3} more questions
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          No questions added yet
                        </p>
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => handleEditQuestions(quiz)}
                        >
                          Add Questions
                        </Button>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 border rounded-lg">
                  <p className="text-muted-foreground">
                    No quizzes found. Create your first quiz above.
                  </p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizManager;
