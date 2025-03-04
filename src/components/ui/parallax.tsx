
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // Speed multiplier (1 is normal, 0.5 is half speed, 2 is double speed)
  direction?: 'up' | 'down' | 'left' | 'right';
  disabled?: boolean;
}

export function Parallax({
  children,
  className,
  speed = 0.5,
  direction = 'up',
  disabled = false
}: ParallaxProps) {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [elementHeight, setElementHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  // Update element dimensions on resize
  useEffect(() => {
    const updateElementPosition = () => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      setElementTop(rect.top + window.scrollY);
      setElementHeight(rect.height);
      setViewportHeight(window.innerHeight);
    };

    updateElementPosition();
    window.addEventListener('resize', updateElementPosition);
    
    return () => {
      window.removeEventListener('resize', updateElementPosition);
    };
  }, []);

  // Update parallax effect on scroll
  useEffect(() => {
    if (disabled) return;

    const handleScroll = () => {
      if (!elementRef.current) return;
      
      // Calculate how far the element is from the viewport center
      const scrollTop = window.scrollY;
      const elementCenter = elementTop + elementHeight / 2;
      const viewportCenter = scrollTop + viewportHeight / 2;
      const distanceFromCenter = elementCenter - viewportCenter;
      
      // Calculate parallax offset based on distance from center
      const maxOffset = elementHeight * speed;
      const newOffset = (distanceFromCenter / viewportHeight) * maxOffset;
      
      setOffset(newOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [elementTop, elementHeight, viewportHeight, speed, disabled]);

  // Calculate transform based on direction
  const getTransform = () => {
    if (disabled) return '';
    
    switch (direction) {
      case 'up': return `translateY(${-offset}px)`;
      case 'down': return `translateY(${offset}px)`;
      case 'left': return `translateX(${-offset}px)`;
      case 'right': return `translateX(${offset}px)`;
      default: return `translateY(${-offset}px)`;
    }
  };

  return (
    <div ref={elementRef} className={cn("relative overflow-hidden", className)}>
      <div
        style={{
          transform: getTransform(),
          transition: 'transform 0.1s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
}
