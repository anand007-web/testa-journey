
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTest } from '@/context/TestContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Settings, Users, Award, Clock } from 'lucide-react';

const TestIntro = () => {
  const { startTest, questions } = useTest();
  const navigate = useNavigate();
  
  const handleStartTest = () => {
    startTest();
    navigate('/test');
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">SSC Mock Test</h1>
        <p className="text-muted-foreground">
          Practice with our comprehensive question bank to prepare for your SSC exam.
        </p>
      </div>
      
      <div className="grid gap-6 mb-10">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Test Overview</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Users className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm text-muted-foreground">Multiple Choice</span>
              <span className="font-medium">100 Questions</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Clock className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm text-muted-foreground">Time Limit</span>
              <span className="font-medium">30s per question</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Award className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm text-muted-foreground">Passing Score</span>
              <span className="font-medium">60% or higher</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <Settings className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm text-muted-foreground">Difficulty</span>
              <div className="flex gap-1 mt-1">
                <Badge variant="outline" className="text-xs">Easy</Badge>
                <Badge variant="outline" className="text-xs">Medium</Badge>
                <Badge variant="outline" className="text-xs">Hard</Badge>
              </div>
            </div>
          </div>
          
          <Button
            className="w-full py-6 text-lg"
            onClick={handleStartTest}
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Start Test Now
          </Button>
          
          <div className="mt-4 text-center">
            <Link to="/admin-login" className="text-sm text-muted-foreground hover:text-primary underline">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestIntro;
