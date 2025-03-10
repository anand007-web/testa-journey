
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  animationType?: 'bounce' | 'pulse' | 'scale' | 'glow' | 'ripple' | 'glass' | 'shimmer' | 'float' | '3d';
  children: React.ReactNode;
  mouseTrack?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  animationType = 'scale',
  children,
  className,
  variant = 'glass',
  mouseTrack = false,
  ...props
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseTrack) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      });
    }
  };

  const getAnimationProps = () => {
    switch (animationType) {
      case 'bounce':
        return {
          whileHover: { y: -5 },
          whileTap: { y: 0 },
          transition: { type: 'spring', stiffness: 400, damping: 10 }
        };
      case 'pulse':
        return {
          whileHover: { scale: [1, 1.05, 1] },
          transition: { 
            repeat: Infinity, 
            duration: 1.5 
          }
        };
      case 'glow':
        return {
          whileHover: { 
            boxShadow: '0 0 20px 5px hsl(var(--primary)/0.5)',
            transition: { duration: 0.3 }
          }
        };
      case 'ripple':
        return {
          whileTap: {
            scale: 0.95,
            transition: { duration: 0.1 }
          },
        };
      case 'glass':
        return {
          whileHover: { 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(15px)',
            transition: { duration: 0.3 }
          }
        };
      case 'shimmer':
        return {
          whileHover: {
            backgroundPosition: '200% center',
            transition: { duration: 1, ease: 'linear', repeat: Infinity }
          }
        };
      case 'float':
        return {
          animate: {
            y: [0, -5, 0],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          },
          whileHover: {
            y: -8,
            transition: { duration: 0.3 }
          }
        };
      case '3d':
        return {
          whileHover: { 
            z: 20,
            rotateX: mousePosition.y * 0.1,
            rotateY: mousePosition.x * -0.1,
            transition: { duration: 0.1 }
          }
        };
      case 'scale':
      default:
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          transition: { duration: 0.2 }
        };
    }
  };

  const getAnimationClassName = () => {
    const baseClass = 'advanced-glassmorphism relative overflow-hidden transition-all';
    
    switch (animationType) {
      case 'ripple':
        return cn(
          baseClass,
          'before:absolute before:inset-0 before:opacity-0 before:bg-white/20 hover:before:opacity-100 before:transition-opacity',
          'after:absolute after:inset-0 after:rounded-md after:border-2 after:border-primary/40 after:opacity-0 after:scale-105 hover:after:opacity-100 hover:after:animate-pulse',
          'shadow-lg hover:shadow-xl'
        );
      case 'glow':
        return cn(
          baseClass,
          'animated-border',
          'shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]'
        );
      case 'glass':
        return cn(
          baseClass,
          'backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20',
          'shadow-[0_8px_32px_rgba(0,0,0,0.1)]',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-1000'
        );
      case 'shimmer':
        return cn(
          baseClass,
          'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[size:200%_100%]',
          'shadow-lg hover:shadow-xl',
          'border border-white/20 dark:border-white/10'
        );
      case 'float':
        return cn(
          baseClass,
          'shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)]',
          'border border-white/20 dark:border-white/10'
        );
      case '3d':
        return cn(
          baseClass,
          'preserve-3d shadow-xl hover:shadow-2xl',
          'border border-white/20 dark:border-white/10'
        );
      default:
        return cn(
          baseClass,
          'shadow-lg hover:shadow-xl transition-shadow',
          'border border-white/20 dark:border-white/10'
        );
    }
  };

  return (
    <motion.div 
      {...getAnimationProps()} 
      className={cn("perspective-1000", animationType === '3d' ? "preserve-3d" : "")}
      onMouseMove={handleMouseMove}
    >
      <Button
        {...props}
        variant={variant}
        className={cn(getAnimationClassName(), className)}
      >
        {children}
      </Button>
    </motion.div>
  );
};
