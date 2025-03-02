
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Question, questions as allQuestions } from '@/data/questionData';
import { toast } from '@/components/ui/sonner';

interface UserAnswer {
  questionId: number;
  selectedOption: number | null;
  isCorrect: boolean;
  isSkipped: boolean;
  isMarkedForReview: boolean;
}

interface TestContextType {
  currentQuestionIndex: number;
  questions: Question[];
  userAnswers: UserAnswer[];
  timePerQuestion: number;
  remainingTime: number;
  isTestStarted: boolean;
  isTestCompleted: boolean;
  score: number;
  startTest: () => void;
  endTest: () => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  selectAnswer: (optionIndex: number) => void;
  skipQuestion: () => void;
  toggleMarkForReview: () => void;
  restartTest: () => void;
}

const defaultTestContext: TestContextType = {
  currentQuestionIndex: 0,
  questions: [],
  userAnswers: [],
  timePerQuestion: 30, // 30 seconds per question
  remainingTime: 30,
  isTestStarted: false,
  isTestCompleted: false,
  score: 0,
  startTest: () => {},
  endTest: () => {},
  goToNextQuestion: () => {},
  goToPreviousQuestion: () => {},
  jumpToQuestion: () => {},
  selectAnswer: () => {},
  skipQuestion: () => {},
  toggleMarkForReview: () => {},
  restartTest: () => {},
};

const TestContext = createContext<TestContextType>(defaultTestContext);

export const useTest = () => useContext(TestContext);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(30);
  const [remainingTime, setRemainingTime] = useState<number>(30);
  const [isTestStarted, setIsTestStarted] = useState<boolean>(false);
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [score, setScore] = useState<number>(0);

  // Initialize test data
  useEffect(() => {
    const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
    
    const initialUserAnswers = shuffledQuestions.map((question) => ({
      questionId: question.id,
      selectedOption: null,
      isCorrect: false,
      isSkipped: false,
      isMarkedForReview: false,
    }));
    
    setUserAnswers(initialUserAnswers);
    
    // Load from localStorage if available
    try {
      const savedTest = localStorage.getItem('ssc_mock_test');
      if (savedTest) {
        const parsedData = JSON.parse(savedTest);
        
        // Only restore if test is in progress (not completed)
        if (parsedData.isTestStarted && !parsedData.isTestCompleted) {
          setCurrentQuestionIndex(parsedData.currentQuestionIndex || 0);
          setUserAnswers(parsedData.userAnswers || initialUserAnswers);
          setIsTestStarted(parsedData.isTestStarted || false);
          setRemainingTime(parsedData.remainingTime || timePerQuestion);
          
          // Notify user
          toast("Test progress restored from your last session");
        }
      }
    } catch (error) {
      console.error("Error loading saved test:", error);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (isTestStarted && !isTestCompleted) {
      const dataToSave = {
        currentQuestionIndex,
        userAnswers,
        isTestStarted,
        remainingTime,
      };
      
      localStorage.setItem('ssc_mock_test', JSON.stringify(dataToSave));
    }
  }, [currentQuestionIndex, userAnswers, isTestStarted, isTestCompleted, remainingTime]);

  // Timer logic
  useEffect(() => {
    if (isTestStarted && !isTestCompleted) {
      // Clear any existing interval
      if (timerInterval) clearInterval(timerInterval);
      
      // Set up new timer
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            // Time's up for this question
            skipQuestion();
            return timePerQuestion;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      setTimerInterval(interval);
      
      // Cleanup
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isTestStarted, isTestCompleted, currentQuestionIndex]);
  
  // Calculate score when test is completed
  useEffect(() => {
    if (isTestCompleted) {
      const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
      setScore(correctAnswers);
      
      // Clear saved test
      localStorage.removeItem('ssc_mock_test');
      
      // Clear timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  }, [isTestCompleted, userAnswers]);

  const startTest = () => {
    setIsTestStarted(true);
    setRemainingTime(timePerQuestion);
  };

  const endTest = () => {
    setIsTestCompleted(true);
    
    // Count unattempted questions
    const unattempted = userAnswers.filter(a => a.selectedOption === null && !a.isSkipped).length;
    
    // Notify user about score
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    toast(`Test completed! Your score: ${correctAnswers}/100`);
    
    if (unattempted > 0) {
      toast(`Note: You left ${unattempted} questions unattempted.`, {
        description: "These questions were marked as skipped."
      });
      
      // Mark all unattempted as skipped
      setUserAnswers(prev => 
        prev.map(answer => 
          answer.selectedOption === null && !answer.isSkipped
            ? { ...answer, isSkipped: true }
            : answer
        )
      );
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRemainingTime(timePerQuestion);
    } else {
      // At last question, ask if they want to end
      toast("This is the last question. Use the 'Submit Test' button to finish.", {
        duration: 3000,
        action: {
          label: "Submit Now",
          onClick: () => endTest()
        }
      });
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setRemainingTime(timePerQuestion);
    }
  };

  const jumpToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setRemainingTime(timePerQuestion);
    }
  };

  const selectAnswer = (optionIndex: number) => {
    if (isTestCompleted) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    setUserAnswers(prevAnswers => 
      prevAnswers.map((answer, idx) => 
        idx === currentQuestionIndex
          ? { 
              ...answer, 
              selectedOption: optionIndex, 
              isCorrect, 
              isSkipped: false 
            }
          : answer
      )
    );
    
    // Give user feedback
    if (isCorrect) {
      toast("Correct answer!", { duration: 1500 });
    }
    
    // Automatically go to next question after selection
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        goToNextQuestion();
      }
    }, 1500);
  };

  const skipQuestion = () => {
    setUserAnswers(prevAnswers => 
      prevAnswers.map((answer, idx) => 
        idx === currentQuestionIndex
          ? { ...answer, isSkipped: true }
          : answer
      )
    );
    
    // Move to next question if possible
    if (currentQuestionIndex < questions.length - 1) {
      goToNextQuestion();
    }
  };

  const toggleMarkForReview = () => {
    setUserAnswers(prevAnswers => 
      prevAnswers.map((answer, idx) => 
        idx === currentQuestionIndex
          ? { ...answer, isMarkedForReview: !answer.isMarkedForReview }
          : answer
      )
    );
    
    const action = userAnswers[currentQuestionIndex]?.isMarkedForReview 
      ? "removed from" 
      : "marked for";
      
    toast(`Question ${action} review`);
  };

  const restartTest = () => {
    // Reset all states to initial values
    setCurrentQuestionIndex(0);
    
    const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
    
    const initialUserAnswers = shuffledQuestions.map((question) => ({
      questionId: question.id,
      selectedOption: null,
      isCorrect: false,
      isSkipped: false,
      isMarkedForReview: false,
    }));
    
    setUserAnswers(initialUserAnswers);
    setRemainingTime(timePerQuestion);
    setIsTestStarted(false);
    setIsTestCompleted(false);
    setScore(0);
    
    // Clear localStorage
    localStorage.removeItem('ssc_mock_test');
    
    toast("Test has been reset. Ready to start a new attempt!");
  };

  const testContextValue: TestContextType = {
    currentQuestionIndex,
    questions,
    userAnswers,
    timePerQuestion,
    remainingTime,
    isTestStarted,
    isTestCompleted,
    score,
    startTest,
    endTest,
    goToNextQuestion,
    goToPreviousQuestion,
    jumpToQuestion,
    selectAnswer,
    skipQuestion,
    toggleMarkForReview,
    restartTest,
  };

  return (
    <TestContext.Provider value={testContextValue}>
      {children}
    </TestContext.Provider>
  );
};
