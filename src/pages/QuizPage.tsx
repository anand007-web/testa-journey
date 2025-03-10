import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useUserAuth } from '../context/UserAuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Particles } from '@/components/ui/particles';
import { CinematicTransition } from '@/components/ui/cinematic-transition';
import { FlipCard } from '@/components/ui/flip-card';
import { SeasonalTheme } from '@/components/ui/seasonal-theme';
import { Parallax } from '@/components/ui/parallax';
import LanguageToggle from '@/components/LanguageToggle';
import { getLanguageText, formatTime } from '@/lib/translation';

interface Question {
  id: string;
  text: string;
  text_hi?: string;
  options: string[];
  options_hi?: string[];
  correctAnswer: number;
  explanation?: string;
  explanation_hi?: string;
}

interface Quiz {
  id: string;
  title: string;
  title_hi?: string;
  description: string;
  description_hi?: string;
  category: string;
  questions: Question[];
  createdAt: string;
}

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserAuth();
  const { language, t } = useLanguage();
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
      toast.error(t('error.login'));
      navigate('/login');
      return;
    }

    const fetchQuiz = () => {
      try {
        const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        const foundQuiz = quizzes.find((q: Quiz) => q.id === id);
        
        if (foundQuiz) {
          const processedQuiz = {
            ...foundQuiz,
            questions: foundQuiz.questions.map((q: any) => ({
              ...q,
              text_hi: q.question_text_hi || '',
              explanation_hi: q.explanation_hi || '',
              options_hi: q.options_hi || q.options
            }))
          };
          
          setQuiz(processedQuiz);
          setAnswers(new Array(processedQuiz.questions.length).fill(null));
          setTimeRemaining(processedQuiz.questions.length * 120);
          setTimerActive(true);
        } else {
          toast.error(t('quiz.not.found'));
          navigate('/quizzes');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error(t('error.load.quiz'));
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, navigate, isAuthenticated, t]);

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
    
    setTransitionEffect('slide-left');
    setShowContent(false);
    
    setTimeout(() => {
      if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        handleFinishQuiz();
      }
      setShowContent(true);
    }, 300);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setShowExplanation(false);
      
      setTransitionEffect('slide-right');
      setShowContent(false);
      
      setTimeout(() => {
        setSelectedAnswer(answers[currentQuestionIndex - 1]);
        setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        setShowContent(true);
      }, 300);
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

  const getQuestionText = (question: Question | undefined) => {
    if (!question) return '';
    return language === 'hi' && question.text_hi ? question.text_hi : question.text;
  };

  const getExplanationText = (question: Question | undefined) => {
    if (!question || !question.explanation) return '';
    return language === 'hi' && question.explanation_hi ? question.explanation_hi : question.explanation;
  };

  const getOptionText = (question: Question | undefined, optionIndex: number) => {
    if (!question || !question.options || question.options.length <= optionIndex) return '';
    
    if (language === 'hi' && question.options_hi && question.options_hi[optionIndex]) {
      return question.options_hi[optionIndex];
    }
    return question.options[optionIndex];
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
            <h2 className="text-2xl font-bold text-center">{t('quiz.not.found')}</h2>
            <p className="text-center mt-4">{t('quiz.not.found.description')}</p>
            <div className="flex justify-center mt-6">
              <AnimatedButton onClick={() => navigate('/quizzes')} animationType="bounce">
                {t('button.return.quizzes')}
              </AnimatedButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizCompleted && !reviewMode) {
    return (
      <div className="container mx-auto p-4 relative overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <LanguageToggle variant="minimal" />
        </div>
        
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
                <CardTitle className="text-2xl text-center text-gradient">{t('quiz.completed')}</CardTitle>
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
                        {t('quiz.result.correct', `You got ${answers.filter((ans, idx) => ans === quiz.questions[idx].correctAnswer).length} out of ${quiz.questions.length} questions correct`)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('quiz.result.time', `Time spent: ${formatTime(quiz.questions.length * 120 - timeRemaining)}`)}
                      </p>
                    </div>
                  </div>
                </Parallax>
              </CardContent>
              <CardFooter className="flex justify-center space-x-4">
                <AnimatedButton onClick={startReviewMode} variant="default" animationType="glow">
                  {t('button.review')}
                </AnimatedButton>
                <AnimatedButton onClick={() => navigate('/dashboard')} variant="outline" animationType="scale">
                  {t('nav.dashboard')}
                </AnimatedButton>
                <AnimatedButton variant="outline" onClick={() => navigate('/quizzes')} animationType="bounce">
                  {t('button.another.quiz')}
                </AnimatedButton>
              </CardFooter>
            </Card>
          </CinematicTransition>
        </SeasonalTheme>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 relative min-h-screen">
      <div className="absolute top-4 right-4 z-10">
        <LanguageToggle variant="minimal" />
      </div>
      
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
                {reviewMode && <Badge variant="outline" className="ml-2 bg-primary/10 animate-pulse">{t('quiz.review.mode')}</Badge>}
              </CardTitle>
              {!reviewMode && (
                <div className="text-sm text-muted-foreground mt-2 md:mt-0 animate-fade-in">
                  {t('quiz.time.remaining')}: <span className={timeRemaining < 60 ? "text-red-500 font-semibold animate-pulse" : ""}>{formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>
            <div className="mt-4 animate-fade-in">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                <span>{t('quiz.question')} {currentQuestionIndex + 1} {t('quiz.of')} {quiz.questions.length}</span>
                <span>{t('quiz.progress')}: {Math.round(progress)}%</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {currentQuestion && (
              <CinematicTransition show={showContent} effect={transitionEffect} duration={300}>
                <div>
                  <Parallax speed={0.2} disabled={reviewMode}>
                    <h3 className="text-lg font-semibold mb-4">{getQuestionText(currentQuestion)}</h3>
                  </Parallax>
                  
                  <RadioGroup value={selectedAnswer !== null ? selectedAnswer.toString() : undefined} onValueChange={(value) => handleSelectAnswer(parseInt(value))}>
                    <div className="space-y-3">
                      {currentQuestion.options.map((_, index) => {
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
                              {getOptionText(currentQuestion, index)}
                            </Label>
                            
                            {showCorrectness && (
                              <>
                                {isCorrect && (
                                  <span className="text-green-600 flex items-center gap-1 animate-fade-in">
                                    <CheckIcon size={16} className="animate-bounce" />
                                    {!isSelected && reviewMode && t('quiz.correct.answer')}
                                  </span>
                                )}
                                {!isCorrect && isSelected && (
                                  <span className="text-red-600 flex items-center gap-1 animate-fade-in">
                                    <XIcon size={16} className="animate-shake" />
                                    {t('quiz.incorrect')}
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
                      <h4 className="font-semibold">{t('quiz.explanation')}:</h4>
                      <p className="mt-2">{getExplanationText(currentQuestion)}</p>
                      <div className="mt-2">
                        <span className="font-semibold">{t('quiz.correct.answer')}: </span>
                        <span>{getOptionText(currentQuestion, currentQuestion.correctAnswer)}</span>
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
              <AnimatedButton 
                variant="outline" 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                animationType="ripple"
              >
                {t('button.previous')}
              </AnimatedButton>
            </div>
            
            <div className="flex space-x-2">
              {reviewMode ? (
                currentQuestionIndex < quiz.questions.length - 1 ? (
                  <AnimatedButton onClick={() => {
                    setTransitionEffect('slide-left');
                    setShowContent(false);
                    setTimeout(() => {
                      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                      setShowContent(true);
                    }, 300);
                  }}
                  animationType="bounce">
                    {t('button.next')}
                  </AnimatedButton>
                ) : (
                  <AnimatedButton onClick={() => navigate('/dashboard')} animationType="pulse">
                    {t('button.finish.review')}
                  </AnimatedButton>
                )
              ) : (
                <>
                  {!showExplanation && selectedAnswer !== null && (
                    <AnimatedButton variant="secondary" onClick={handleShowExplanation} animationType="scale">
                      {t('button.show.explanation')}
                    </AnimatedButton>
                  )}
                  
                  <AnimatedButton 
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    animationType="glow"
                  >
                    {currentQuestionIndex < quiz.questions.length - 1 ? t('button.next') : t('button.finish')}
                  </AnimatedButton>
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
