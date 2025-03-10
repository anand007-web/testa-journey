
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  animationType?: 'bounce' | 'pulse' | 'scale' | 'glow' | 'ripple';
  children: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  animationType = 'scale',
  children,
  className,
  ...props
}) => {
  const getAnimationProps = () => {
    switch (animationType) {
      case 'bounce':
        return {
          whileHover: { y: -3 },
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
            boxShadow: '0 0 8px 2px hsl(var(--primary)/0.5)',
            transition: { duration: 0.2 }
          }
        };
      case 'ripple':
        return {
          whileTap: {
            scale: 0.95,
            transition: { duration: 0.1 }
          },
          // Ripple effect handled with pseudo-elements in className
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

  const animationClassName = cn(
    animationType === 'ripple' 
      ? 'relative overflow-hidden transition-all hover:before:opacity-100 before:absolute before:inset-0 before:opacity-0 before:bg-white/10 before:transition-opacity' 
      : '',
    animationType === 'glow' 
      ? 'animated-border' 
      : ''
  );

  return (
    <motion.div {...getAnimationProps()}>
      <Button
        {...props}
        className={cn(animationClassName, className)}
      >
        {children}
      </Button>
    </motion.div>
  );
};
