
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  flipOnClick?: boolean;
}

export function FlipCard({ 
  front, 
  back, 
  className, 
  flipOnClick = true 
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (flipOnClick) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div 
      className={cn(
        "relative w-full h-full perspective-1000 group", 
        className
      )}
      onClick={handleClick}
    >
      <div className={cn(
        "relative w-full h-full transition-transform duration-500 preserve-3d",
        isFlipped ? "rotate-y-180" : ""
      )}>
        {/* Front */}
        <div className={cn(
          "absolute inset-0 backface-hidden",
          isFlipped ? "invisible" : "visible"
        )}>
          {front}
        </div>
        
        {/* Back */}
        <div className={cn(
          "absolute inset-0 rotate-y-180 backface-hidden",
          isFlipped ? "visible" : "invisible"
        )}>
          {back}
        </div>
      </div>
    </div>
  );
}
