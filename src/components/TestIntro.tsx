
import React, { useState } from 'react';
import { useTest } from '@/context/TestContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Clock, HelpCircle } from 'lucide-react';

const TestIntro: React.FC = () => {
  const { startTest } = useTest();
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto space-y-8 animate-in">
      <div className="relative">
        <div className="text-xs uppercase tracking-widest text-primary/80 font-medium animate-in">SSC Mock Test</div>
        <h1 className="text-4xl font-bold tracking-tight mt-2 animate-in animate-in-delay-100">
          Welcome to the SSC Exam Preparation
        </h1>
        <p className="text-lg text-muted-foreground mt-3 animate-in animate-in-delay-200">
          This mock test will help you prepare for your upcoming SSC examination. 
          Take your time, focus, and do your best!
        </p>
      </div>

      <div className="bg-card shadow-subtle rounded-xl p-6 border border-border/50 animate-in animate-in-delay-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-primary" />
          Test Overview
        </h2>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Format</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-primary/80 mr-2 inline-block"></span>
                100 multiple-choice questions
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-primary/80 mr-2 inline-block"></span>
                Mixed difficulty levels (easy, medium, hard)
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-primary/80 mr-2 inline-block"></span>
                Four options for each question
              </li>
            </ul>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Time</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-primary/80 mr-2 inline-block"></span>
                30 seconds per question
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-primary/80 mr-2 inline-block"></span>
                Timer for each question
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-primary/80 mr-2 inline-block"></span>
                No overall time limit
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 rounded-xl p-6 border border-border/50 animate-in animate-in-delay-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <HelpCircle className="w-5 h-5 mr-2 text-primary" />
          How to Use This Test
        </h2>
        
        <ul className="space-y-4 pl-2">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
            <div>
              <p className="font-medium">Read each question carefully</p>
              <p className="text-sm text-muted-foreground">Take your time to understand what is being asked.</p>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
            <div>
              <p className="font-medium">Select your answer</p>
              <p className="text-sm text-muted-foreground">Click on the option you believe is correct.</p>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
            <div>
              <p className="font-medium">Use navigation tools</p>
              <p className="text-sm text-muted-foreground">Skip difficult questions and come back to them later if needed.</p>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
            <div>
              <p className="font-medium">Review your answers</p>
              <p className="text-sm text-muted-foreground">Utilize the question panel to review and check your answers before submitting.</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-amber-50 rounded-xl p-6 border border-amber-200/50 animate-in animate-in-delay-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold mb-1">Important Note</h2>
            <p className="text-sm text-muted-foreground">
              Your progress will be saved automatically in your browser. If you accidentally close the tab, 
              you can return and continue from where you left off. However, clearing your browser cache 
              will reset the test.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4 animate-in animate-in-delay-200">
        {!isReady ? (
          <Button 
            size="lg"
            className="px-10 h-12 rounded-full font-medium shadow-button transition-all hover:shadow-lg"
            onClick={() => setIsReady(true)}
          >
            I'm Ready
          </Button>
        ) : (
          <div className="bg-white shadow-floating rounded-xl p-6 border border-border/50 w-full max-w-md text-center">
            <h3 className="text-xl font-bold mb-2">Start Now?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You can pause anytime. Your progress will be saved automatically.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                className="rounded-full px-6"
                onClick={() => setIsReady(false)}
              >
                Not Yet
              </Button>
              <Button 
                size="lg"
                className="rounded-full px-6 bg-primary text-white hover:bg-primary/90"
                onClick={startTest}
              >
                <Clock className="mr-2 h-4 w-4" />
                Start Test
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestIntro;
