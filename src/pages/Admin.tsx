
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogOutIcon, PlusCircleIcon, TrashIcon, SaveIcon } from 'lucide-react';
import { DifficultyLevel, Question, questions as defaultQuestions } from '@/data/questionData';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Admin: React.FC = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<{
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: DifficultyLevel;
  }>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'medium',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
    
    // Load questions from localStorage or use defaults
    const storedQuestions = localStorage.getItem('admin_questions');
    if (storedQuestions) {
      try {
        setQuestions(JSON.parse(storedQuestions));
      } catch (error) {
        console.error('Error parsing stored questions:', error);
        setQuestions(defaultQuestions);
      }
    } else {
      setQuestions(defaultQuestions);
    }
  }, [isAuthenticated, navigate]);

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
    });

    toast.success('Question added successfully');
  };

  const handleDeleteQuestion = (id: number) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    localStorage.setItem('admin_questions', JSON.stringify(updatedQuestions));
    toast.success('Question deleted successfully');
  };

  const handleSaveAllQuestions = () => {
    localStorage.setItem('admin_questions', JSON.stringify(questions));
    // Update the main questions data
    localStorage.setItem('test_questions', JSON.stringify(questions));
    toast.success('All questions saved and published to the test');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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
          </TabsList>

          {/* Questions List Tab */}
          <TabsContent value="questions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Test Questions ({questions.length})</h2>
              <Button onClick={handleSaveAllQuestions}>
                <SaveIcon className="mr-2 h-4 w-4" />
                Save & Publish All Questions
              </Button>
            </div>

            <div className="grid gap-4">
              {questions.map((question) => (
                <Card key={question.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted">
                          {question.difficulty}
                        </span>
                        <CardTitle className="text-lg mt-2">{question.text}</CardTitle>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {question.options.map((option, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-md border ${
                            index === question.correctAnswer 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-border'
                          }`}
                        >
                          {option}
                          {index === question.correctAnswer && (
                            <span className="ml-2 text-xs font-medium text-green-700">
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
              ))}
            </div>
          </TabsContent>

          {/* Create Question Tab */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Question</CardTitle>
                <CardDescription>
                  Add a new question to the test bank
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
                  />
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <Label>Answer Options</Label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
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
                    <SelectTrigger>
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
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
