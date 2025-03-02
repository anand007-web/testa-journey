
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Quiz, saveQuiz } from '@/data/quizModels';
import { Question, DifficultyLevel } from '@/data/questionData';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircleIcon, TrashIcon, ArrowLeftIcon, SaveIcon } from 'lucide-react';

interface QuizQuestionManagerProps {
  quiz: Quiz;
  onBack: () => void;
  onSave: (quiz: Quiz) => void;
}

const QuizQuestionManager: React.FC<QuizQuestionManagerProps> = ({ quiz, onBack, onSave }) => {
  const [questions, setQuestions] = useState<Question[]>(quiz.questions);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'medium',
    category: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [highestId, setHighestId] = useState(0);

  useEffect(() => {
    // Find the highest ID among existing questions
    if (questions.length > 0) {
      const maxId = Math.max(...questions.map(q => q.id));
      setHighestId(maxId);
    }
  }, []);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options || ['', '', '', '']];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.text) {
      toast.error('Question text is required');
      return;
    }

    if ((newQuestion.options || []).some(option => !option.trim())) {
      toast.error('All options must be filled');
      return;
    }

    const nextId = highestId + 1;
    setHighestId(nextId);

    const questionToAdd: Question = {
      id: nextId,
      text: newQuestion.text,
      options: newQuestion.options || ['', '', '', ''],
      correctAnswer: newQuestion.correctAnswer || 0,
      explanation: newQuestion.explanation || '',
      difficulty: newQuestion.difficulty || 'medium',
      category: newQuestion.category || quiz.title,
    };

    setQuestions([...questions, questionToAdd]);
    
    // Reset form
    setNewQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      difficulty: 'medium',
      category: '',
    });

    toast.success('Question added to quiz');
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast.success('Question removed from quiz');
  };

  const handleSaveQuiz = () => {
    const updatedQuiz: Quiz = {
      ...quiz,
      questions,
      updatedAt: new Date().toISOString(),
    };

    saveQuiz(updatedQuiz);
    onSave(updatedQuiz);
    toast.success(`Saved ${questions.length} questions to ${quiz.title}`);
  };

  const getFilteredQuestions = () => {
    if (!searchQuery) return questions;
    
    return questions.filter(question => 
      question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.explanation?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Quizzes
          </Button>
          <h2 className="text-xl font-semibold">{quiz.title} - Questions</h2>
        </div>
        <Button onClick={handleSaveQuiz}>
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Quiz ({questions.length} questions)
        </Button>
      </div>

      <Tabs defaultValue="add">
        <TabsList>
          <TabsTrigger value="add">Add Questions</TabsTrigger>
          <TabsTrigger value="view">
            View Questions ({questions.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Question</CardTitle>
              <CardDescription>
                Add questions to your {quiz.title} quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question Text */}
              <div className="space-y-2">
                <Label htmlFor="question-text">Question Text</Label>
                <Textarea 
                  id="question-text" 
                  placeholder="Enter your question here..." 
                  value={newQuestion.text || ''}
                  onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>

              {/* Options */}
              <div className="space-y-4">
                <Label>Answer Options</Label>
                {(newQuestion.options || ['', '', '', '']).map((option, index) => (
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
                  value={newQuestion.explanation || ''}
                  onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select 
                  value={newQuestion.difficulty || 'medium'} 
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
                Add Question to Quiz
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="view" className="pt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Quiz Questions ({questions.length})</CardTitle>
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredQuestions().length > 0 ? (
                  getFilteredQuestions().map((question) => (
                    <Card key={question.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex gap-2 mb-2">
                              <Badge>{question.difficulty}</Badge>
                            </div>
                            <CardTitle className="text-base">{question.text}</CardTitle>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
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
                              className={`p-2 rounded-md border ${
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
                        {question.explanation && (
                          <div className="mt-2 p-2 bg-muted/50 rounded-md">
                            <p className="text-xs font-medium">Explanation:</p>
                            <p className="text-sm">{question.explanation}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <p className="text-muted-foreground">
                      {questions.length === 0 
                        ? 'No questions added to this quiz yet.' 
                        : 'No questions match your search query.'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizQuestionManager;
