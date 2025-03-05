
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserIcon, ShieldIcon, MoonIcon, SunIcon, PaletteIcon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCustomTheme } from '@/context/CustomThemeContext';
import { CustomThemeSwitcher } from '@/components/CustomThemeSwitcher';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 transition-colors duration-300">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="w-full max-w-4xl animate-in">
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
        
        <div className="mt-8 mb-12">
          <Card className="w-full max-w-xl mx-auto p-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                <PaletteIcon className="h-5 w-5" />
                <span>Theme Options</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomThemeSwitcher />
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} QuizHive. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
