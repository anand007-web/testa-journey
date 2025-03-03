
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserIcon, ShieldIcon } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">QuizHive</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                <span>Student Access</span>
              </CardTitle>
              <CardDescription>
                Login or register as a student to access mock tests and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild variant="default" className="w-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/register">Register</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5" />
                <span>Admin Access</span>
              </CardTitle>
              <CardDescription>
                Login as an administrator to manage tests, questions, and view analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild variant="default" className="w-full">
                <Link to="/admin-login">Admin Login</Link>
              </Button>
              <p className="text-sm text-center text-muted-foreground mt-2">
                For administrative staff only
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
