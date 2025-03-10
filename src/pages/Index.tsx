
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/animated-button';
import { UserIcon, ShieldIcon, FileTextIcon } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import HeartLoader from '@/components/HeartLoader';
import LanguageToggle from '@/components/LanguageToggle';
import { SeasonalTheme } from '@/components/ui/seasonal-theme';
import { motion } from 'framer-motion';
import { ParallaxCard } from '@/components/ui/parallax-card';
import { CinematicTransition } from '@/components/ui/cinematic-transition';

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const cards = containerRef.current.querySelectorAll('.mouse-move-card');
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      cards.forEach((card: Element) => {
        const rect = card.getBoundingClientRect();
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;
        
        const distanceX = mouseX - cardX;
        const distanceY = mouseY - cardY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        if (distance < 400) {
          const cardElement = card as HTMLElement;
          const moveX = distanceX * 0.01;
          const moveY = distanceY * 0.01;
          cardElement.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          const cardElement = card as HTMLElement;
          cardElement.style.transform = 'translate(0px, 0px)';
        }
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 bg-gradient-to-br from-background/50 via-background/70 to-background/90 relative overflow-hidden"
    >
      {/* Background animated circles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-smooth-wave"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary/5 blur-3xl animate-float"></div>
      </div>
      
      <div className="absolute top-4 right-4 flex space-x-2 z-50">
        <LanguageToggle variant="minimal" />
        <ThemeSwitcher />
      </div>

      <motion.div 
        className="w-full max-w-4xl backdrop-blur-xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <HeartLoader />
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-2 text-gradient"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          QuizHive
        </motion.h1>
        
        <motion.p 
          className="text-center text-lg text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Test your knowledge with interactive quizzes
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CinematicTransition show={true} effect="slide-up">
            <ParallaxCard className="h-full">
              <Card className="border-0 shadow-none bg-transparent h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div 
                      className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <UserIcon className="h-5 w-5 text-primary" />
                    </motion.div>
                    <span>Student Access</span>
                  </CardTitle>
                  <CardDescription>
                    Login or register as a student to access mock tests and track your progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 flex-grow">
                  <AnimatedButton asChild animationType="glass" className="w-full mt-auto">
                    <Link to="/login">
                      <span className="relative z-10">Login</span>
                    </Link>
                  </AnimatedButton>
                  <AnimatedButton asChild variant="outline" animationType="float" className="w-full">
                    <Link to="/register">Register</Link>
                  </AnimatedButton>
                </CardContent>
              </Card>
            </ParallaxCard>
          </CinematicTransition>
          
          <CinematicTransition show={true} effect="slide-up" duration={700}>
            <ParallaxCard className="h-full">
              <Card className="border-0 shadow-none bg-transparent h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div 
                      className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
                      animate={{ 
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <FileTextIcon className="h-5 w-5 text-primary" />
                    </motion.div>
                    <span>Create Quizzes</span>
                  </CardTitle>
                  <CardDescription>
                    Create your own custom quizzes with multiple-choice questions and share them
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 flex-grow">
                  <AnimatedButton asChild animationType="glow" className="w-full mt-auto">
                    <Link to="/create-quiz">
                      <span className="relative z-10">Create Quiz</span>
                    </Link>
                  </AnimatedButton>
                  <p className="text-sm text-center text-muted-foreground mt-2">
                    Login required to create quizzes
                  </p>
                </CardContent>
              </Card>
            </ParallaxCard>
          </CinematicTransition>
          
          <CinematicTransition show={true} effect="slide-up" duration={900}>
            <ParallaxCard className="h-full">
              <Card className="border-0 shadow-none bg-transparent h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div 
                      className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ShieldIcon className="h-5 w-5 text-primary" />
                    </motion.div>
                    <span>Admin Access</span>
                  </CardTitle>
                  <CardDescription>
                    Login as an administrator to manage tests, questions, and view analytics
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 flex-grow">
                  <AnimatedButton asChild animationType="3d" className="w-full mt-auto">
                    <Link to="/admin-login">
                      <span className="relative z-10">Admin Login</span>
                    </Link>
                  </AnimatedButton>
                  <p className="text-sm text-center text-muted-foreground mt-2">
                    For administrative staff only
                  </p>
                </CardContent>
              </Card>
            </ParallaxCard>
          </CinematicTransition>
        </div>
        
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} QuizHive. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
