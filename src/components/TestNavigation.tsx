import React from 'react';
import { useTest } from '@/context/TestContext';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ArrowRight, 
  Timer, 
  CheckSquare, 
  BookmarkIcon,
  SkipForward
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

const TestNavigation: React.FC = () => {
  const { 
    currentQuestionIndex, 
    questions, 
    userAnswers,
    isTestCompleted,
    goToNextQuestion, 
    goToPreviousQuestion, 
    skipQuestion,
    toggleMarkForReview,
    endTest
  } = useTest();
  
  const currentUserAnswer = userAnswers[currentQuestionIndex];
  const hasAnswered = currentUserAnswer?.selectedOption !== null && currentUserAnswer?.selectedOption !== undefined;
  const isMarkedForReview = currentUserAnswer?.isMarkedForReview || false;
  
  const handleEndTest = () => {
    // Count unanswered questions
    const unansweredCount = userAnswers.filter(a => a.selectedOption === null && !a.isSkipped).length;
    
    if (unansweredCount > 0) {
      toast(`You have ${unansweredCount} unanswered questions`, {
        description: "Are you sure you want to end the test?",
        action: {
          label: "End Anyway",
          onClick: () => endTest(),
        },
        cancel: {
          label: "Continue Test",
          onClick: () => {},
        },
        duration: 5000,
      });
    } else {
      endTest();
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-4 py-2 h-auto"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0 || isTestCompleted}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button
            variant={isMarkedForReview ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full px-4 py-2 h-auto",
              isMarkedForReview && "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
            )}
            onClick={toggleMarkForReview}
            disabled={isTestCompleted}
          >
            <BookmarkIcon className="mr-2 h-4 w-4" />
            {isMarkedForReview ? "Marked" : "Mark for Review"}
          </Button>
        </div>
        
        <div className="flex gap-3">
          {!hasAnswered && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-4 py-2 h-auto"
              onClick={skipQuestion}
              disabled={isTestCompleted}
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Skip
            </Button>
          )}
          
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              variant="default"
              size="sm"
              className="rounded-full px-4 py-2 h-auto"
              onClick={goToNextQuestion}
              disabled={isTestCompleted}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="rounded-full px-4 py-2 h-auto bg-primary hover:bg-primary/90"
              onClick={handleEndTest}
              disabled={isTestCompleted}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Submit Test
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestNavigation;
