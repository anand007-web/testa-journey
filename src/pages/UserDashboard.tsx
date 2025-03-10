
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useUserAuth } from '@/context/UserAuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { SeasonalTheme } from '@/components/ui/seasonal-theme';

const UserDashboard = () => {
  const { user, logout } = useUserAuth();
  const { t } = useLanguage();
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 bg-gradient-to-br from-background/60 to-background">
      <div className="absolute top-4 right-4 flex space-x-2 z-50">
        <LanguageToggle />
        <ThemeSwitcher />
      </div>
      
      <div className="w-full max-w-md backdrop-blur-lg bg-background/30 dark:bg-background/20 border border-primary/10 rounded-lg p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">{t('nav.dashboard')}</h1>
          <p className="text-muted-foreground">{t('welcome')}, {user?.email}!</p>
        </div>

        <div className="space-y-6">
          <SeasonalTheme className="rounded-lg overflow-hidden">
            <AnimatedButton 
              className="w-full bg-primary/80 backdrop-blur-sm"
              asChild 
              animationType="bounce"
            >
              <Link to="/quizzes">{t('nav.quizzes')}</Link>
            </AnimatedButton>
          </SeasonalTheme>
          
          <SeasonalTheme className="rounded-lg overflow-hidden">
            <AnimatedButton 
              className="w-full bg-primary/80 backdrop-blur-sm"
              asChild 
              animationType="glow"
            >
              <Link to="/create-quiz">{t('nav.create')}</Link>
            </AnimatedButton>
          </SeasonalTheme>
          
          <SeasonalTheme className="rounded-lg overflow-hidden">
            <AnimatedButton 
              className="w-full bg-destructive/80 backdrop-blur-sm"
              variant="destructive" 
              onClick={handleLogout}
              animationType="scale"
            >
              {t('button.logout')}
            </AnimatedButton>
          </SeasonalTheme>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
