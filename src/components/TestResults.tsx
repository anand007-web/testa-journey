
import React, { useState } from 'react';
import { useTest } from '@/context/TestContext';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  List,
  RefreshCw,
  Printer,
  Download
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const TestResults: React.FC = () => {
  const { questions, userAnswers, score, restartTest } = useTest();
  const [activeTab, setActiveTab] = useState<string>('summary');
  
  // Calculate statistics
  const totalQuestions = questions.length;
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  const incorrectAnswers = userAnswers.filter(answer => answer.selectedOption !== null && !answer.isCorrect).length;
  const skippedQuestions = userAnswers.filter(answer => answer.isSkipped).length;
  const unattemptedQuestions = userAnswers.filter(answer => answer.selectedOption === null && !answer.isSkipped).length;
  
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Calculate difficulty breakdown
  const difficultyBreakdown = {
    easy: {
      total: questions.filter(q => q.difficulty === 'easy').length,
      correct: userAnswers.filter((a, i) => a.isCorrect && questions[i].difficulty === 'easy').length
    },
    medium: {
      total: questions.filter(q => q.difficulty === 'medium').length,
      correct: userAnswers.filter((a, i) => a.isCorrect && questions[i].difficulty === 'medium').length
    },
    hard: {
      total: questions.filter(q => q.difficulty === 'hard').length,
      correct: userAnswers.filter((a, i) => a.isCorrect && questions[i].difficulty === 'hard').length
    }
  };
  
  // Data for pie chart
  const pieData = [
    { name: 'Correct', value: correctAnswers, color: '#10b981' }, // green
    { name: 'Incorrect', value: incorrectAnswers, color: '#ef4444' }, // red
    { name: 'Skipped', value: skippedQuestions, color: '#f59e0b' }, // amber
    { name: 'Unattempted', value: unattemptedQuestions, color: '#94a3b8' } // slate
  ].filter(item => item.value > 0);
  
  // Get performance message
  const getPerformanceMessage = () => {
    if (scorePercentage >= 90) return "Outstanding performance! You've mastered this content.";
    if (scorePercentage >= 80) return "Excellent job! You have a strong grasp of the material.";
    if (scorePercentage >= 70) return "Good work! You're on the right track.";
    if (scorePercentage >= 60) return "Not bad! With a bit more practice, you'll improve.";
    if (scorePercentage >= 50) return "You're making progress. Focus on the areas you missed.";
    return "This is a good baseline. With dedicated study, you'll see improvement.";
  };
  
  // Get performance recommendation
  const getRecommendation = () => {
    // Check difficulty breakdown to give tailored advice
    const easyPercentage = difficultyBreakdown.easy.correct / difficultyBreakdown.easy.total * 100;
    const mediumPercentage = difficultyBreakdown.medium.correct / difficultyBreakdown.medium.total * 100;
    const hardPercentage = difficultyBreakdown.hard.correct / difficultyBreakdown.hard.total * 100;
    
    if (hardPercentage < 40) {
      return "Focus on advanced topics as you're struggling with difficult questions.";
    } else if (mediumPercentage < 50) {
      return "Strengthen your understanding of core concepts to improve on medium difficulty questions.";
    } else if (easyPercentage < 70) {
      return "Review the basics as you missed some easy questions.";
    } else if (skippedQuestions > 20) {
      return "Work on your time management as you skipped many questions.";
    }
    
    return "Keep practicing with mock tests to maintain and improve your performance.";
  };
  
  // Print results function
  const handlePrintResults = () => {
    window.print();
  };
  
  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto space-y-8">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-widest text-primary/80 font-medium">SSC Mock Test</div>
        <h1 className="text-3xl font-bold mt-2">Your Test Results</h1>
      </div>
      
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="summary" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>Summary</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="gap-2">
            <List className="w-4 h-4" />
            <span>Questions</span>
          </TabsTrigger>
          <TabsTrigger value="takeaways" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Takeaways</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-8">
          {/* Score Overview */}
          <motion.div 
            className="bg-white shadow-subtle rounded-xl overflow-hidden border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="p-6 pb-4 border-b border-border/70">
              <h2 className="text-xl font-semibold">Score Overview</h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-36 h-36 rounded-full bg-muted/40 border border-border/50 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-primary">{score}</div>
                  <div className="text-sm text-muted-foreground mt-1">out of 100</div>
                </div>
                
                <div className="flex-1 space-y-3 w-full">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Correct Answers</span>
                      <span className="text-primary font-medium">{correctAnswers} ({Math.round((correctAnswers / totalQuestions) * 100)}%)</span>
                    </div>
                    <Progress value={(correctAnswers / totalQuestions) * 100} className="h-2 bg-muted" indicatorClassName="bg-primary" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Incorrect Answers</span>
                      <span className="text-destructive font-medium">{incorrectAnswers} ({Math.round((incorrectAnswers / totalQuestions) * 100)}%)</span>
                    </div>
                    <Progress value={(incorrectAnswers / totalQuestions) * 100} className="h-2 bg-muted" indicatorClassName="bg-destructive" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Skipped Questions</span>
                      <span className="text-amber-500 font-medium">{skippedQuestions} ({Math.round((skippedQuestions / totalQuestions) * 100)}%)</span>
                    </div>
                    <Progress value={(skippedQuestions / totalQuestions) * 100} className="h-2 bg-muted" indicatorClassName="bg-amber-500" />
                  </div>
                  
                  {unattemptedQuestions > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Unattempted</span>
                        <span className="text-slate-500 font-medium">{unattemptedQuestions} ({Math.round((unattemptedQuestions / totalQuestions) * 100)}%)</span>
                      </div>
                      <Progress value={(unattemptedQuestions / totalQuestions) * 100} className="h-2 bg-muted" indicatorClassName="bg-slate-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Difficulty Breakdown */}
          <motion.div 
            className="bg-white shadow-subtle rounded-xl overflow-hidden border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="p-6 pb-4 border-b border-border/70">
              <h2 className="text-xl font-semibold">Difficulty Breakdown</h2>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="text-sm text-green-800 font-medium mb-2">Easy Questions</div>
                  <div className="flex justify-between items-end">
                    <div className="text-2xl font-semibold text-green-800">
                      {difficultyBreakdown.easy.correct}/{difficultyBreakdown.easy.total}
                    </div>
                    <div className="text-sm text-green-700">
                      {Math.round((difficultyBreakdown.easy.correct / difficultyBreakdown.easy.total) * 100)}%
                    </div>
                  </div>
                  <Progress 
                    value={(difficultyBreakdown.easy.correct / difficultyBreakdown.easy.total) * 100} 
                    className="h-1.5 mt-2 bg-green-200" 
                    indicatorClassName="bg-green-500" 
                  />
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <div className="text-sm text-amber-800 font-medium mb-2">Medium Questions</div>
                  <div className="flex justify-between items-end">
                    <div className="text-2xl font-semibold text-amber-800">
                      {difficultyBreakdown.medium.correct}/{difficultyBreakdown.medium.total}
                    </div>
                    <div className="text-sm text-amber-700">
                      {Math.round((difficultyBreakdown.medium.correct / difficultyBreakdown.medium.total) * 100)}%
                    </div>
                  </div>
                  <Progress 
                    value={(difficultyBreakdown.medium.correct / difficultyBreakdown.medium.total) * 100} 
                    className="h-1.5 mt-2 bg-amber-200" 
                    indicatorClassName="bg-amber-500" 
                  />
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <div className="text-sm text-red-800 font-medium mb-2">Hard Questions</div>
                  <div className="flex justify-between items-end">
                    <div className="text-2xl font-semibold text-red-800">
                      {difficultyBreakdown.hard.correct}/{difficultyBreakdown.hard.total}
                    </div>
                    <div className="text-sm text-red-700">
                      {Math.round((difficultyBreakdown.hard.correct / difficultyBreakdown.hard.total) * 100)}%
                    </div>
                  </div>
                  <Progress 
                    value={(difficultyBreakdown.hard.correct / difficultyBreakdown.hard.total) * 100} 
                    className="h-1.5 mt-2 bg-red-200" 
                    indicatorClassName="bg-red-500" 
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-base font-medium mb-3">Performance Visualization</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="questions" className="space-y-6">
          <div className="bg-white shadow-subtle rounded-xl overflow-hidden border border-border/50">
            <div className="p-6 pb-4 border-b border-border/70 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Question Analysis</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm">Correct</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <span className="text-sm">Incorrect</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Skipped</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  
                  let statusIcon;
                  let statusClass;
                  
                  if (userAnswer.isCorrect) {
                    statusIcon = <CheckCircle className="w-5 h-5 text-primary" />;
                    statusClass = "border-primary/20 bg-primary/5";
                  } else if (userAnswer.isSkipped) {
                    statusIcon = <AlertTriangle className="w-5 h-5 text-amber-500" />;
                    statusClass = "border-amber-200 bg-amber-50";
                  } else if (userAnswer.selectedOption !== null) {
                    statusIcon = <XCircle className="w-5 h-5 text-destructive" />;
                    statusClass = "border-destructive/20 bg-destructive/5";
                  } else {
                    statusIcon = <AlertTriangle className="w-5 h-5 text-slate-400" />;
                    statusClass = "border-slate-200 bg-slate-50";
                  }
                  
                  return (
                    <div 
                      key={question.id} 
                      className={`p-4 rounded-lg border ${statusClass}`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {statusIcon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="text-sm font-medium mb-1">Question {index + 1}</div>
                            <div className="text-xs px-2 py-0.5 rounded bg-muted/50 capitalize">
                              {question.difficulty}
                            </div>
                          </div>
                          
                          <p className="text-sm mb-3">{question.text}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            {question.options.map((option, optionIndex) => {
                              let optionClass = "text-xs p-2 rounded border";
                              
                              if (optionIndex === question.correctAnswer) {
                                optionClass += " border-green-200 bg-green-50 text-green-800";
                              } else if (optionIndex === userAnswer.selectedOption && !userAnswer.isCorrect) {
                                optionClass += " border-red-200 bg-red-50 text-red-800";
                              } else {
                                optionClass += " border-muted/50 text-muted-foreground";
                              }
                              
                              return (
                                <div key={optionIndex} className={optionClass}>
                                  <span className="font-mono mr-1">{String.fromCharCode(65 + optionIndex)}.</span>
                                  {option}
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                            <span className="font-medium">Explanation:</span> {question.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="takeaways" className="space-y-6">
          <motion.div 
            className="bg-white shadow-subtle rounded-xl overflow-hidden border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="p-6 pb-4 border-b border-border/70">
              <h2 className="text-xl font-semibold">Performance Assessment</h2>
            </div>
            
            <div className="p-6">
              <div className={cn(
                "p-5 rounded-lg mb-6",
                scorePercentage >= 70 ? "bg-green-50 border border-green-100" : 
                scorePercentage >= 50 ? "bg-amber-50 border border-amber-100" : 
                "bg-red-50 border border-red-100"
              )}>
                <div className="flex items-start gap-3">
                  {scorePercentage >= 70 ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  ) : scorePercentage >= 50 ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  
                  <div>
                    <h3 className="font-medium mb-1">Performance Summary</h3>
                    <p className="text-sm">{getPerformanceMessage()}</p>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-3">Key Insights</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex gap-3 items-start p-4 rounded-lg border border-border/60 bg-muted/20">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="font-medium text-sm">Strengths</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {difficultyBreakdown.easy.correct / difficultyBreakdown.easy.total > 0.7 
                        ? "You performed well on the easy questions, showing a good grasp of the basics." 
                        : "You struggled with some easy questions, suggesting a need to reinforce foundational concepts."}
                      {difficultyBreakdown.medium.correct / difficultyBreakdown.medium.total > 0.6 && 
                        " You also handled medium difficulty questions well."}
                      {difficultyBreakdown.hard.correct / difficultyBreakdown.hard.total > 0.5 && 
                        " Impressively, you tackled hard questions with good accuracy."}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-start p-4 rounded-lg border border-border/60 bg-muted/20">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="font-medium text-sm">Areas for Improvement</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {difficultyBreakdown.hard.correct / difficultyBreakdown.hard.total < 0.4 
                        ? "Focus on advanced topics as you struggled with difficult questions." 
                        : "You handled difficult questions relatively well."}
                      {skippedQuestions > 20 
                        ? " Work on time management as you skipped many questions." 
                        : " Your time management seems adequate."}
                      {incorrectAnswers > totalQuestions * 0.3 && 
                        " Review the questions you answered incorrectly to identify knowledge gaps."}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-start p-4 rounded-lg border border-border/60 bg-muted/20">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="font-medium text-sm">Recommended Focus</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getRecommendation()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={handlePrintResults}
                >
                  <Printer className="w-4 h-4" />
                  Print Results
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  onClick={restartTest}
                >
                  <RefreshCw className="w-4 h-4" />
                  Take Another Test
                </Button>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestResults;
