import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserAuth } from '@/context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">User Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.email}!</p>
      </div>

      <div className="space-y-4">
        <Button asChild>
          <Link to="/quizzes">View Available Quizzes</Link>
        </Button>
        <Button asChild>
            <Link to="/create-quiz">Create Your Quiz</Link>
        </Button>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserDashboard;
