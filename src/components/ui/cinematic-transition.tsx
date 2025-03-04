
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type TransitionEffect = 
  | 'fade' 
  | 'slide-up' 
  | 'slide-down' 
  | 'slide-left' 
  | 'slide-right' 
  | 'zoom-in' 
  | 'zoom-out' 
  | 'rotate' 
  | 'flip';

interface CinematicTransitionProps {
  children: React.ReactNode;
  show: boolean;
  effect?: TransitionEffect;
  duration?: number; // in milliseconds
  className?: string;
  onExited?: () => void;
}

export function CinematicTransition({
  children,
  show,
  effect = 'fade',
  duration = 500,
  className,
  onExited
}: CinematicTransitionProps) {
  const [shouldRender, setShouldRender] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        if (onExited) onExited();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onExited]);

  if (!shouldRender) return null;

  const getEffectClasses = () => {
    const baseClasses = `transition-all duration-${duration}`;
    
    switch (effect) {
      case 'fade':
        return `${baseClasses} ${isAnimating ? 'opacity-100' : 'opacity-0'}`;
      case 'slide-up':
        return `${baseClasses} ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`;
      case 'slide-down':
        return `${baseClasses} ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`;
      case 'slide-left':
        return `${baseClasses} ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`;
      case 'slide-right':
        return `${baseClasses} ${isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`;
      case 'zoom-in':
        return `${baseClasses} ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`;
      case 'zoom-out':
        return `${baseClasses} ${isAnimating ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`;
      case 'rotate':
        return `${baseClasses} ${isAnimating ? 'rotate-0 opacity-100 scale-100' : '-rotate-3 opacity-0 scale-95'}`;
      case 'flip':
        return `${baseClasses} ${isAnimating ? 'rotate-y-0 opacity-100' : 'rotate-y-90 opacity-0'}`;
      default:
        return `${baseClasses} ${isAnimating ? 'opacity-100' : 'opacity-0'}`;
    }
  };

  return (
    <div className={cn(getEffectClasses(), className)}>
      {children}
    </div>
  );
}
