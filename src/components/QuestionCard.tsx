
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTest } from '@/context/TestContext';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkIcon, Clock3 } from 'lucide-react';

const QuestionCard: React.FC = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    userAnswers, 
    selectAnswer,
    remainingTime
  } = useTest();
  
  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestionIndex];
  
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState<number | null>(null);
  
  // Reset explanation visibility when moving to a new question
  useEffect(() => {
    setShowExplanation(false);
    setLastSelectedAnswer(userAnswer?.selectedOption || null);
  }, [currentQuestionIndex, userAnswer]);
  
  // Show explanation when user selects an answer
  useEffect(() => {
    if (userAnswer?.selectedOption !== null && userAnswer?.selectedOption !== undefined && userAnswer.selectedOption !== lastSelectedAnswer) {
      setShowExplanation(true);
      setLastSelectedAnswer(userAnswer.selectedOption);
    }
  }, [userAnswer?.selectedOption, lastSelectedAnswer]);
  
  if (!currentQuestion) return null;
  
  // Determine question difficulty style
  const difficultyColor = {
    easy: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    hard: "bg-red-100 text-red-800 border-red-200"
  }[currentQuestion.difficulty];
  
  // Determine timer color based on remaining time
  const timerColor = remainingTime <= 5 ? "text-red-500" : remainingTime <= 10 ? "text-amber-500" : "text-primary";
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-subtle border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
              {currentQuestionIndex + 1}
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</div>
              <div className="flex gap-2 items-center mt-1">
                <Badge variant="outline" className={cn("text-xs capitalize", difficultyColor)}>
                  {currentQuestion.difficulty}
                </Badge>
                
                {userAnswer?.isMarkedForReview && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                    <BookmarkIcon className="w-3 h-3 mr-1" />
                    Marked
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className={cn("flex items-center gap-2 font-mono text-base font-medium", timerColor)}>
            <Clock3 className="w-4 h-4" />
            <span className="tabular-nums">{remainingTime}s</span>
          </div>
        </div>
        
        {/* Question */}
        <div className="p-6 pt-5">
          <h2 className="text-lg font-medium mb-6">{currentQuestion.text}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = userAnswer?.selectedOption === index;
              const isCorrect = currentQuestion.correctAnswer === index;
              const hasAnswered = userAnswer?.selectedOption !== null && userAnswer?.selectedOption !== undefined;
              
              // Determine the class for the option
              let optionClass = "answer-option";
              
              if (isSelected && hasAnswered) {
                optionClass += isCorrect ? " correct" : " incorrect";
              } else if (isCorrect && hasAnswered && showExplanation) {
                optionClass += " correct";
              }
              
              if (isSelected) {
                optionClass += " selected";
              }
              
              return (
                <button
                  key={index}
                  className={optionClass}
                  onClick={() => !hasAnswered && selectAnswer(index)}
                  disabled={hasAnswered}
                >
                  <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1 text-left">{option}</div>
                  
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={cn(
                        "ml-2 h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center",
                        isCorrect ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                      )}
                    >
                      {isCorrect ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Explanation Section */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="mt-6 overflow-hidden"
              >
                <div className="p-4 bg-muted/60 rounded-lg border border-border/60">
                  <h3 className="text-sm font-medium mb-2">Explanation:</h3>
                  <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
