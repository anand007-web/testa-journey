
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LockIcon, UserIcon } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import LanguageToggle from '@/components/LanguageToggle';
import { motion } from 'framer-motion';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse parallax effect for background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast.success('Logged in successfully');
        navigate('/admin');
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden bg-gradient-to-br from-background/70 to-background/90"
    >
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 -z-10 opacity-50"
        animate={{
          background: [
            'radial-gradient(circle at 30% 30%, var(--primary-rgb, 59, 130, 246, 0.1), transparent 40%)',
            'radial-gradient(circle at 70% 70%, var(--primary-rgb, 59, 130, 246, 0.1), transparent 40%)',
            'radial-gradient(circle at 30% 70%, var(--primary-rgb, 59, 130, 246, 0.1), transparent 40%)',
            'radial-gradient(circle at 70% 30%, var(--primary-rgb, 59, 130, 246, 0.1), transparent 40%)',
            'radial-gradient(circle at 30% 30%, var(--primary-rgb, 59, 130, 246, 0.1), transparent 40%)',
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div 
        className="absolute h-96 w-96 rounded-full bg-primary/5 blur-3xl"
        animate={{
          x: [mousePosition.x * -30, mousePosition.x * -30],
          y: [mousePosition.y * -30, mousePosition.y * -30],
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20
        }}
      />
      
      <div className="absolute top-4 right-4 flex space-x-2 z-50">
        <LanguageToggle variant="minimal" />
        <ThemeSwitcher />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Card className="advanced-glassmorphism backdrop-blur-2xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
            animate={{ translateX: "200%" }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
          />
          
          <CardHeader className="space-y-1 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CardTitle className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Admin Login</span>
              </CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <CardDescription>
                Enter your credentials to access the admin dashboard
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 relative z-10">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Username"
                    className="pl-10 backdrop-blur-xl bg-white/5 dark:bg-black/5 border-white/20 dark:border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="relative">
                  <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10 backdrop-blur-xl bg-white/5 dark:bg-black/5 border-white/20 dark:border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
            </CardContent>
            
            <CardFooter className="relative z-10">
              <AnimatedButton 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                variant="glass"
                animationType="glow"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </AnimatedButton>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
