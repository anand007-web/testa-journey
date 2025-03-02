
import React from 'react';
import { useTest } from '@/context/TestContext';
import TestIntro from '@/components/TestIntro';
import QuestionCard from '@/components/QuestionCard';
import TestNavigation from '@/components/TestNavigation';
import QuestionPanel from '@/components/QuestionPanel';
import TestResults from '@/components/TestResults';
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from 'framer-motion';

const TestPage: React.FC = () => {
  const { isTestStarted, isTestCompleted } = useTest();
  
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Toaster position="top-center" />
      
      <AnimatePresence mode="wait">
        {!isTestStarted && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pb-10"
          >
            <TestIntro />
          </motion.div>
        )}
        
        {isTestStarted && !isTestCompleted && (
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="container max-w-4xl px-4 py-8 mx-auto space-y-6"
          >
            <QuestionCard />
            <TestNavigation />
            <QuestionPanel />
          </motion.div>
        )}
        
        {isTestCompleted && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TestResults />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="py-8 text-center text-xs text-muted-foreground">
        SSC Mock Test • <span className="opacity-70">©{new Date().getFullYear()}</span>
      </div>
    </div>
  );
};

export default TestPage;
