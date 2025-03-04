
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/context/UserAuthContext';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { SeasonalTheme } from '@/components/ui/seasonal-theme';

const UserDashboard = () => {
  const { user, isAuthenticated, isLoading, logout } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleStartQuiz = () => {
    navigate('/quizzes');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SeasonalTheme className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.user_metadata?.username || 'User'}</p>
          </div>
          <Button variant="outline" onClick={() => logout()}>Sign Out</Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Pick up where you left off or start something new</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-medium">Continue Learning</h3>
                  <p className="text-sm text-muted-foreground">You have quizzes in progress</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleStartQuiz}>Browse Quizzes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Statistics</CardTitle>
                <CardDescription>Track your progress and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">Completed Quizzes</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-primary">0%</p>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Username</p>
                    <p>{user?.user_metadata?.username || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p>{user?.email}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Edit Profile</Button>
              </CardFooter>
            </Card>
            
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </SeasonalTheme>
  );
};

export default UserDashboard;
