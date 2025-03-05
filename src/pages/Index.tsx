
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserIcon, ShieldIcon } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const MemojiAnimation = () => {
  return (
    <div className="w-full flex justify-center mb-4">
      <div className="relative perspective-1000 w-24 h-24 mb-8">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 opacity-75 blur-lg animate-pulse"></div>
        
        {/* Desk with Books */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-10 bg-amber-800/30 rounded-t-lg"></div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-4 bg-amber-300/40 rounded-sm"></div>
        
        {/* Memoji Character */}
        <div className="relative z-10 text-6xl animate-bounce-slow flex flex-col items-center">
          <div className="text-7xl">👩‍💻</div>
          
          {/* Laptop Animation */}
          <div className="absolute bottom-2 w-10 h-5 bg-gray-800/60 rounded-sm transform rotate-x-60 flex items-center justify-center">
            <div className="w-8 h-3 bg-blue-400/60 rounded-sm animate-pulse">
              <div className="w-1 h-1 bg-white rounded-full absolute top-1 left-1 animate-ping"></div>
            </div>
          </div>
          
          {/* Typing Animation */}
          <div className="absolute bottom-0 w-2 h-2 bg-skin-tone rounded-full transform translate-y-1 animate-bounce-slow" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-4xl animate-in">
        <MemojiAnimation />
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-gradient">QuizHive</h1>
        <p className="text-center text-lg text-muted-foreground mb-8">
          Test your knowledge with interactive quizzes
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/60 glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <span>Student Access</span>
              </CardTitle>
              <CardDescription>
                Login or register as a student to access mock tests and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild variant="default" className="w-full relative overflow-hidden group">
                <Link to="/login">
                  <span className="relative z-10">Login</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 group-hover:opacity-90 transition-opacity opacity-100"></span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/register">Register</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/60 glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldIcon className="h-5 w-5 text-primary" />
                </div>
                <span>Admin Access</span>
              </CardTitle>
              <CardDescription>
                Login as an administrator to manage tests, questions, and view analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild variant="default" className="w-full relative overflow-hidden group">
                <Link to="/admin-login">
                  <span className="relative z-10">Admin Login</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 group-hover:opacity-90 transition-opacity opacity-100"></span>
                </Link>
              </Button>
              <p className="text-sm text-center text-muted-foreground mt-2">
                For administrative staff only
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} QuizHive. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
