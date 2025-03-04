
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type AnimationType = 'success' | 'error' | 'loading' | 'confetti' | 'trophy' | 'correct' | 'incorrect';

interface LottieAnimationProps {
  animationType: AnimationType;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

export function LottieAnimation({
  animationType,
  className,
  loop = true,
  autoplay = true,
  style,
  onComplete
}: LottieAnimationProps) {
  const animationContainer = useRef<HTMLDivElement>(null);
  const [animationInstance, setAnimationInstance] = useState<any>(null);
  const [lottie, setLottie] = useState<any>(null);

  useEffect(() => {
    // Dynamically import Lottie
    import('lottie-web').then((Lottie) => {
      setLottie(Lottie.default);
    });
  }, []);

  useEffect(() => {
    if (!lottie || !animationContainer.current) return;
    
    // Import the specific animation JSON based on the type
    import(`../../assets/animations/${animationType}.json`).then((animationData) => {
      if (animationInstance) {
        animationInstance.destroy();
      }

      const instance = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop,
        autoplay,
        animationData: animationData.default
      });

      if (onComplete && !loop) {
        instance.addEventListener('complete', onComplete);
      }

      setAnimationInstance(instance);
      
      return () => {
        instance.removeEventListener('complete', onComplete);
        instance.destroy();
      };
    }).catch(error => {
      console.error(`Failed to load animation: ${animationType}`, error);
      
      // Fallback to a simple CSS animation
      if (animationContainer.current) {
        const fallbackClass = getFallbackAnimation(animationType);
        animationContainer.current.classList.add(fallbackClass);
      }
    });

    return () => {
      if (animationInstance) {
        if (onComplete && !loop) {
          animationInstance.removeEventListener('complete', onComplete);
        }
        animationInstance.destroy();
      }
    };
  }, [lottie, animationType, loop, autoplay, onComplete]);

  // Fallback animations when JSON files aren't available
  const getFallbackAnimation = (type: AnimationType): string => {
    switch (type) {
      case 'success':
        return 'animate-bounce text-success';
      case 'error':
        return 'animate-pulse text-destructive';
      case 'loading':
        return 'animate-spin text-primary';
      case 'confetti':
        return 'animate-bounce text-primary';
      case 'trophy':
        return 'animate-float text-seasonal-summer';
      case 'correct':
        return 'animate-pulse text-success';
      case 'incorrect':
        return 'animate-shake text-destructive';
      default:
        return 'animate-pulse';
    }
  };

  return (
    <div 
      ref={animationContainer}
      className={cn("w-20 h-20", className)}
      style={style}
    />
  );
}
