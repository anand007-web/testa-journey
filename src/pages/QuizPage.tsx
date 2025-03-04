
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useUserAuth } from '../context/UserAuthContext';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Particles } from '@/components/ui/particles';
import { CinematicTransition } from '@/components/ui/cinematic-transition';
import { FlipCard } from '@/components/ui/flip-card';
import { SeasonalTheme } from '@/components/ui/seasonal-theme';
import { Parallax } from '@/components/ui/parallax';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: Question[];
  createdAt: string;
}

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [transitionEffect, setTransitionEffect] = useState<'slide-left' | 'slide-right' | 'fade'>('fade');
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to take a quiz');
      navigate('/login');
      return;
    }

    const fetchQuiz = () => {
      try {
        const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        const foundQuiz = quizzes.find((q: Quiz) => q.id === id);
        
        if (foundQuiz) {
          setQuiz(foundQuiz);
          setAnswers(new Array(foundQuiz.questions.length).fill(null));
          setTimeRemaining(foundQuiz.questions.length * 120);
          setTimerActive(true);
        } else {
          toast.error('Quiz not found');
          navigate('/quizzes');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, navigate, isAuthenticated]);

  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!quizCompleted) {
            toast.warning('Time\'s up! Quiz will be submitted automatically.');
            handleFinishQuiz();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeRemaining, quizCompleted]);

  const handleSelectAnswer = (index: number) => {
    if (reviewMode) return;
    
    setSelectedAnswer(index);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = index;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    
    // Trigger cinematic transition
    setTransitionEffect('slide-left');
    setShowContent(false);
    
    setTimeout(() => {
      if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        handleFinishQuiz();
      }
      setShowContent(true);
    }, 300); // Match with transition duration
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setShowExplanation(false);
      
      // Trigger cinematic transition
      setTransitionEffect('slide-right');
      setShowContent(false);
      
      setTimeout(() => {
        setSelectedAnswer(answers[currentQuestionIndex - 1]);
        setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        setShowContent(true);
      }, 300); // Match with transition duration
    }
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const handleFinishQuiz = () => {
    setTimerActive(false);
    setQuizCompleted(true);
    
    let correctCount = 0;
    if (quiz) {
      quiz.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          correctCount++;
        }
      });
    }
    
    const finalScore = quiz ? Math.round((correctCount / quiz.questions.length) * 100) : 0;
    setScore(finalScore);
    
    if (user && quiz) {
      try {
        const quizAttempts = JSON.parse(localStorage.getItem('quiz_attempts') || '[]');
        
        const attempt = {
          id: crypto.randomUUID(),
          userId: user.id,
          quizId: quiz.id,
          quizTitle: quiz.title,
          score: finalScore,
          date: new Date().toISOString(),
          answers: answers,
          timeSpent: quiz.questions.length * 120 - timeRemaining
        };
        
        quizAttempts.push(attempt);
        localStorage.setItem('quiz_attempts', JSON.stringify(quizAttempts));
        
        toast.success('Quiz completed! Your score has been saved.');
      } catch (error) {
        console.error('Error saving quiz attempt:', error);
        toast.error('Failed to save your quiz results');
      }
    }
  };

  const startReviewMode = () => {
    setReviewMode(true);
    setCurrentQuestionIndex(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/30"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-primary"></div>
          <div className="shimmer absolute inset-0 rounded-full bg-primary/10"></div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-center">Quiz not found</h2>
            <p className="text-center mt-4">The quiz you're looking for doesn't exist or has been removed.</p>
            <div className="flex justify-center mt-6">
              <Button onClick={() => navigate('/quizzes')}>Return to Quizzes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizCompleted && !reviewMode) {
    return (
      <div className="container mx-auto p-4 relative overflow-hidden">
        <Particles 
          className="absolute inset-0" 
          quantity={100} 
          particleColor="hsl(var(--primary))"
        />
        
        <SeasonalTheme className="relative">
          <CinematicTransition 
            show={true} 
            effect="zoom-in" 
            duration={800}
          >
            <Card className="backdrop-blur-sm bg-background/80 shadow-xl border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gradient">Quiz Completed!</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold">{quiz.title}</h3>
                  <p className="text-muted-foreground">{quiz.category}</p>
                </div>
                
                <Parallax>
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="w-36 h-36 rounded-full bg-primary/10 flex items-center justify-center shadow-glow animate-pulse">
                      <span className="text-4xl font-bold text-gradient">{score}%</span>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-lg">
                        You got {answers.filter((ans, idx) => ans === quiz.questions[idx].correctAnswer).length} out of {quiz.questions.length} questions correct
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Time spent: {formatTime(quiz.questions.length * 120 - timeRemaining)}
                      </p>
                    </div>
                  </div>
                </Parallax>
              </CardContent>
              <CardFooter className="flex justify-center space-x-4">
                <Button onClick={startReviewMode} variant="default" className="animate-float">Review Solutions</Button>
                <Button onClick={() => navigate('/dashboard')} variant="outline" className="group">
                  <span className="group-hover:animate-slide-right inline-block">Go to Dashboard</span>
                </Button>
                <Button variant="outline" onClick={() => navigate('/quizzes')} className="group">
                  <span className="group-hover:animate-bounce inline-block">Take Another Quiz</span>
                </Button>
              </CardFooter>
            </Card>
          </CinematicTransition>
        </SeasonalTheme>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 relative min-h-screen">
      {!reviewMode && (
        <Particles 
          className="absolute inset-0 opacity-40" 
          quantity={30} 
          stationary={true}
        />
      )}
      
      <SeasonalTheme className="min-h-[80vh]">
        <Card className={cn(
          "relative backdrop-blur-sm bg-background/80 shadow-card transition-all duration-500",
          reviewMode ? "border-green-300/50" : ""
        )}>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-xl md:text-2xl animate-fade-in">
                {quiz.title}
                {reviewMode && <Badge variant="outline" className="ml-2 bg-primary/10 animate-pulse">Review Mode</Badge>}
              </CardTitle>
              {!reviewMode && (
                <div className="text-sm text-muted-foreground mt-2 md:mt-0 animate-fade-in">
                  Time Remaining: <span className={timeRemaining < 60 ? "text-red-500 font-semibold animate-pulse" : ""}>{formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>
            <div className="mt-4 animate-fade-in">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <span>Progress: {Math.round(progress)}%</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {currentQuestion && (
              <CinematicTransition show={showContent} effect={transitionEffect} duration={300}>
                <div>
                  <Parallax speed={0.2} disabled={reviewMode}>
                    <h3 className="text-lg font-semibold mb-4">{currentQuestion.text}</h3>
                  </Parallax>
                  
                  <RadioGroup value={selectedAnswer !== null ? selectedAnswer.toString() : undefined} onValueChange={(value) => handleSelectAnswer(parseInt(value))}>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => {
                        const isCorrect = currentQuestion.correctAnswer === index;
                        const isSelected = reviewMode ? answers[currentQuestionIndex] === index : selectedAnswer === index;
                        const showCorrectness = reviewMode || (showExplanation && selectedAnswer !== null);
                        
                        return (
                          <div 
                            key={index} 
                            className={cn(
                              "transition-all duration-300 transform",
                              isSelected && !showCorrectness ? "scale-[1.02] shadow-md" : "",
                              showCorrectness && isCorrect ? "bg-green-50 border border-green-300 dark:bg-green-950/20 dark:border-green-800" : "",
                              showCorrectness && !isCorrect && isSelected ? "bg-red-50 border border-red-300 dark:bg-red-950/20 dark:border-red-800" : "",
                              !reviewMode ? "hover:bg-muted/50 hover:scale-[1.01]" : "",
                              "flex items-center space-x-2 p-3 rounded-md animate-in",
                              `animate-in-delay-${index * 100}`
                            )}
                          >
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={reviewMode} />
                            <Label htmlFor={`option-${index}`} className="flex-grow p-2 cursor-pointer">
                              {option}
                            </Label>
                            
                            {showCorrectness && (
                              <>
                                {isCorrect && (
                                  <span className="text-green-600 flex items-center gap-1 animate-fade-in">
                                    <CheckIcon size={16} className="animate-bounce" />
                                    {!isSelected && reviewMode && "Correct Answer"}
                                  </span>
                                )}
                                {!isCorrect && isSelected && (
                                  <span className="text-red-600 flex items-center gap-1 animate-fade-in">
                                    <XIcon size={16} className="animate-shake" />
                                    Wrong
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </RadioGroup>
                  
                  {(showExplanation || reviewMode) && currentQuestion.explanation && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-md animate-slide-up backdrop-blur-sm">
                      <h4 className="font-semibold">Explanation:</h4>
                      <p className="mt-2">{currentQuestion.explanation}</p>
                      <div className="mt-2">
                        <span className="font-semibold">Correct answer: </span>
                        <span>{currentQuestion.options[currentQuestion.correctAnswer]}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CinematicTransition>
            )}
          </CardContent>
          
          <Separator />
          
          <CardFooter className="flex justify-between p-4">
            <div>
              <Button 
                variant="outline" 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="group transition-all"
              >
                <span className="inline-block group-hover:-translate-x-1 transition-transform">Previous</span>
              </Button>
            </div>
            
            <div className="flex space-x-2">
              {reviewMode ? (
                currentQuestionIndex < quiz.questions.length - 1 ? (
                  <Button onClick={() => {
                    setTransitionEffect('slide-left');
                    setShowContent(false);
                    setTimeout(() => {
                      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                      setShowContent(true);
                    }, 300);
                  }}
                  className="group transition-all">
                    <span className="inline-block group-hover:translate-x-1 transition-transform">Next</span>
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/dashboard')} className="animate-pulse">
                    Finish Review
                  </Button>
                )
              ) : (
                <>
                  {!showExplanation && selectedAnswer !== null && (
                    <Button variant="secondary" onClick={handleShowExplanation} className="animate-fade-in">
                      Show Explanation
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className={cn(
                      "group transition-all",
                      selectedAnswer !== null ? "animate-pulse-light" : ""
                    )}
                  >
                    <span className="inline-block group-hover:translate-x-1 transition-transform">
                      {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Finish Quiz'}
                    </span>
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </SeasonalTheme>
    </div>
  );
};

export default QuizPage;
