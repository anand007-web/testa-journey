
import React, { useState } from 'react';
import { useTest } from '@/context/TestContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { BookmarkIcon, ChevronDown, ChevronUp, CheckCircle2, SkipForward, XCircle } from 'lucide-react';

const QuestionPanel: React.FC = () => {
  const { 
    questions, 
    userAnswers, 
    currentQuestionIndex, 
    jumpToQuestion 
  } = useTest();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter questions based on active tab
  const getFilteredQuestionIndices = () => {
    return questions.map((_, index) => index).filter(index => {
      const answer = userAnswers[index];
      
      switch (activeTab) {
        case 'answered':
          return answer.selectedOption !== null;
        case 'unanswered':
          return answer.selectedOption === null && !answer.isSkipped;
        case 'marked':
          return answer.isMarkedForReview;
        case 'skipped':
          return answer.isSkipped;
        default:
          return true;
      }
    });
  };
  
  const filteredIndices = getFilteredQuestionIndices();
  
  // Calculate counts for each tab
  const answerCounts = {
    all: questions.length,
    answered: userAnswers.filter(a => a.selectedOption !== null).length,
    unanswered: userAnswers.filter(a => a.selectedOption === null && !a.isSkipped).length,
    marked: userAnswers.filter(a => a.isMarkedForReview).length,
    skipped: userAnswers.filter(a => a.isSkipped).length
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-muted/30 rounded-xl border border-border/50 overflow-hidden">
        <div 
          className="flex items-center justify-between px-4 py-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="font-medium flex items-center">
            Question Overview
            {answerCounts.answered > 0 && (
              <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                {answerCounts.answered}/{questions.length} answered
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="px-4 pb-5 animate-in">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="all" className="text-xs">
                  All <span className="ml-1 opacity-70">({answerCounts.all})</span>
                </TabsTrigger>
                <TabsTrigger value="answered" className="text-xs">
                  Answered <span className="ml-1 opacity-70">({answerCounts.answered})</span>
                </TabsTrigger>
                <TabsTrigger value="unanswered" className="text-xs">
                  Pending <span className="ml-1 opacity-70">({answerCounts.unanswered})</span>
                </TabsTrigger>
                <TabsTrigger value="marked" className="text-xs">
                  Marked <span className="ml-1 opacity-70">({answerCounts.marked})</span>
                </TabsTrigger>
                <TabsTrigger value="skipped" className="text-xs">
                  Skipped <span className="ml-1 opacity-70">({answerCounts.skipped})</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                <div className="grid grid-cols-10 gap-2">
                  {filteredIndices.map(index => {
                    const answer = userAnswers[index];
                    
                    let buttonClass = "flex flex-col items-center justify-center rounded h-9 text-xs font-medium transition-colors";
                    let statusIcon = null;
                    
                    // Apply styles based on answer status
                    if (answer.selectedOption !== null) {
                      buttonClass += " bg-primary/10 text-primary hover:bg-primary/20";
                      statusIcon = <CheckCircle2 className="w-3 h-3" />;
                    } else if (answer.isSkipped) {
                      buttonClass += " bg-amber-100 text-amber-800 hover:bg-amber-200";
                      statusIcon = <SkipForward className="w-3 h-3" />;
                    } else {
                      buttonClass += " bg-muted hover:bg-muted/80 text-muted-foreground";
                    }
                    
                    // Highlight current question
                    if (index === currentQuestionIndex) {
                      buttonClass += " ring-2 ring-primary ring-offset-1";
                    }
                    
                    return (
                      <button
                        key={index}
                        className={buttonClass}
                        onClick={() => jumpToQuestion(index)}
                      >
                        <span>{index + 1}</span>
                        {statusIcon && <span className="mt-0.5">{statusIcon}</span>}
                        {answer.isMarkedForReview && (
                          <BookmarkIcon className="w-3 h-3 text-blue-600 absolute -top-1 -right-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {filteredIndices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No questions in this category yet.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPanel;
