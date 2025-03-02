
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  LogOutIcon, 
  PlusCircleIcon, 
  TrashIcon, 
  SaveIcon, 
  UploadIcon, 
  BarChart3Icon, 
  RefreshCwIcon,
  UsersIcon,
  EyeIcon,
  FileTextIcon,
  TagIcon,
  FilterIcon,
  SearchIcon,
  CheckCircleIcon
} from 'lucide-react';
import { DifficultyLevel, Question, questions as defaultQuestions } from '@/data/questionData';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CSVUploader from '@/components/admin/CSVUploader';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

const Admin: React.FC = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [newQuestion, setNewQuestion] = useState<{
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: DifficultyLevel;
    category: string;
  }>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'medium',
    category: 'general',
  });
  const [categories, setCategories] = useState<string[]>(['general', 'mathematics', 'reasoning', 'english', 'gk']);
  const [newCategory, setNewCategory] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
    
    // Load questions from localStorage or use defaults
    const storedQuestions = localStorage.getItem('admin_questions');
    if (storedQuestions) {
      try {
        const parsedQuestions = JSON.parse(storedQuestions);
        setQuestions(parsedQuestions);
        setFilteredQuestions(parsedQuestions);
      } catch (error) {
        console.error('Error parsing stored questions:', error);
        setQuestions(defaultQuestions);
        setFilteredQuestions(defaultQuestions);
      }
    } else {
      setQuestions(defaultQuestions);
      setFilteredQuestions(defaultQuestions);
    }
    
    // Load categories from localStorage
    const storedCategories = localStorage.getItem('admin_categories');
    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories));
      } catch (error) {
        console.error('Error parsing stored categories:', error);
      }
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    filterQuestions();
  }, [searchQuery, filterDifficulty, questions]);

  const filterQuestions = () => {
    let filtered = [...questions];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.category && q.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by difficulty
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === filterDifficulty);
    }
    
    setFilteredQuestions(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
    toast.success('Logged out successfully');
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.text.trim()) {
      toast.error('Question text is required');
      return;
    }

    if (newQuestion.options.some(option => !option.trim())) {
      toast.error('All options must be filled');
      return;
    }

    if (!newQuestion.explanation.trim()) {
      toast.error('Explanation is required');
      return;
    }

    const highestId = questions.reduce((max, q) => Math.max(max, q.id), 0);
    const newQuestionWithId: Question = {
      ...newQuestion,
      id: highestId + 1,
      category: newQuestion.category || 'general',
    };

    const updatedQuestions = [...questions, newQuestionWithId];
    setQuestions(updatedQuestions);
    localStorage.setItem('admin_questions', JSON.stringify(updatedQuestions));

    // Reset form
    setNewQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      difficulty: 'medium',
      category: 'general',
    });

    toast.success('Question added successfully');
  };

  const handleDeleteQuestion = (id: number) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    setSelectedQuestions(selectedQuestions.filter(qId => qId !== id));
    localStorage.setItem('admin_questions', JSON.stringify(updatedQuestions));
    toast.success('Question deleted successfully');
  };

  const handleDeleteSelected = () => {
    if (selectedQuestions.length === 0) {
      toast.error('No questions selected');
      return;
    }
    
    const updatedQuestions = questions.filter(q => !selectedQuestions.includes(q.id));
    setQuestions(updatedQuestions);
    localStorage.setItem('admin_questions', JSON.stringify(updatedQuestions));
    setSelectedQuestions([]);
    toast.success(`${selectedQuestions.length} questions deleted successfully`);
  };

  const handleSaveAllQuestions = () => {
    localStorage.setItem('admin_questions', JSON.stringify(questions));
    // Update the main questions data
    localStorage.setItem('test_questions', JSON.stringify(questions));
    toast.success('All questions saved and published to the test');
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    if (categories.includes(newCategory.trim().toLowerCase())) {
      toast.error('Category already exists');
      return;
    }
    
    const updatedCategories = [...categories, newCategory.trim().toLowerCase()];
    setCategories(updatedCategories);
    localStorage.setItem('admin_categories', JSON.stringify(updatedCategories));
    setNewCategory('');
    toast.success('Category added successfully');
  };

  const handlePreviewQuestion = (id: number) => {
    // In a real implementation, you might want to open a modal or navigate to a preview page
    const question = questions.find(q => q.id === id);
    if (question) {
      toast.info(`Previewing: ${question.text.substring(0, 30)}...`, {
        description: 'Preview functionality would open a modal in a complete implementation',
        duration: 3000,
      });
    }
  };

  const handleToggleSelectQuestion = (id: number) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter(qId => qId !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedQuestions.length === filteredQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    }
  };

  const handleProcessCSV = (questions: Question[]) => {
    if (questions.length === 0) {
      toast.error('No valid questions found in CSV');
      return;
    }

    // Add IDs to new questions
    const highestId = questions.reduce((max, q) => Math.max(max, q.id), 0);
    const questionsWithIds = questions.map((q, index) => ({
      ...q,
      id: highestId + index + 1
    }));

    // Add new questions to existing ones
    const updatedQuestions = [...questions, ...questionsWithIds];
    setQuestions(updatedQuestions);
    localStorage.setItem('admin_questions', JSON.stringify(updatedQuestions));
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
        <Tabs defaultValue="questions">
          <TabsList className="mb-6">
            <TabsTrigger value="questions">Manage Questions</TabsTrigger>
            <TabsTrigger value="create">Create Question</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="import">Import CSV</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Questions List Tab */}
          <TabsContent value="questions" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold">Test Questions ({filteredQuestions.length})</h2>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={handleSaveAllQuestions} 
                  className="whitespace-nowrap"
                >
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Publish All
                </Button>
                
                {selectedQuestions.length > 0 && (
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteSelected}
                    className="whitespace-nowrap"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete Selected ({selectedQuestions.length})
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={handleSelectAll}
                  className="whitespace-nowrap"
                >
                  <CheckCircleIcon className="mr-2 h-4 w-4" />
                  {selectedQuestions.length === filteredQuestions.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="w-full sm:w-64">
                <Select 
                  value={filterDifficulty} 
                  onValueChange={(value) => setFilterDifficulty(value as DifficultyLevel | 'all')}
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <FilterIcon className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by difficulty" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <Card key={question.id} className={selectedQuestions.includes(question.id) ? "border-primary" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-1 gap-2">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.includes(question.id)}
                            onChange={() => handleToggleSelectQuestion(question.id)}
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge className="px-2 py-1 text-xs font-medium rounded-full">
                                {question.difficulty}
                              </Badge>
                              {question.category && (
                                <Badge variant="outline" className="px-2 py-1 text-xs font-medium rounded-full">
                                  {question.category}
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg">{question.text}</CardTitle>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handlePreviewQuestion(question.id)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-md border ${
                              index === question.correctAnswer 
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                                : 'border-border'
                            }`}
                          >
                            {option}
                            {index === question.correctAnswer && (
                              <span className="ml-2 text-xs font-medium text-green-700 dark:text-green-400">
                                (Correct Answer)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-muted/50 rounded-md">
                        <p className="text-sm font-medium">Explanation:</p>
                        <p className="text-sm">{question.explanation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">No questions found matching your filters</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchQuery('');
                      setFilterDifficulty('all');
                    }}
                  >
                    <RefreshCwIcon className="mr-2 h-4 w-4" />
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Create Question Tab */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Question</CardTitle>
                <CardDescription>
                  Add a new question to the SSC mock test bank
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question Text */}
                <div className="space-y-2">
                  <Label htmlFor="question-text">Question Text</Label>
                  <Textarea 
                    id="question-text" 
                    placeholder="Enter your question here..." 
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newQuestion.category} 
                    onValueChange={(value) => setNewQuestion({...newQuestion, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <Label>Answer Options</Label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-grow">
                        <div className="relative">
                          <Input
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-muted text-center text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={newQuestion.correctAnswer === index ? "default" : "outline"}
                        onClick={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                      >
                        {newQuestion.correctAnswer === index ? "Correct" : "Set as Correct"}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div className="space-y-2">
                  <Label htmlFor="explanation">Explanation</Label>
                  <Textarea 
                    id="explanation" 
                    placeholder="Explain why the answer is correct..." 
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                  />
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select 
                    value={newQuestion.difficulty} 
                    onValueChange={(value: DifficultyLevel) => 
                      setNewQuestion({...newQuestion, difficulty: value})
                    }
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddQuestion} className="w-full">
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
                <CardDescription>
                  Create and manage categories for organizing your questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="New category name..."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <Button onClick={handleAddCategory}>
                      <PlusCircleIcon className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Existing Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge 
                          key={category} 
                          variant="outline"
                          className="py-2 px-4 text-sm"
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                          
                          {/* In a real implementation, you might want to add delete functionality */}
                          {/* <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-4 w-4 ml-2 p-0"
                            onClick={() => handleDeleteCategory(category)}
                          >
                            <XIcon className="h-3 w-3" />
                          </Button> */}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Import CSV Tab */}
          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Import Questions from CSV</CardTitle>
                <CardDescription>
                  Upload a CSV file with questions to bulk import them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CSVUploader onProcessCSV={handleProcessCSV} />
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <div className="text-sm text-muted-foreground mt-4">
                  <p className="font-medium mb-2">CSV Format Requirements:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>CSV must include headers: category, question, optionA, optionB, optionC, optionD, correctAnswer, explanation, difficulty</li>
                    <li>correctAnswer should be 0, 1, 2, or 3 (corresponding to A, B, C, D)</li>
                    <li>difficulty should be "easy", "medium", or "hard"</li>
                    <li>All columns are required except explanation (optional)</li>
                  </ul>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
