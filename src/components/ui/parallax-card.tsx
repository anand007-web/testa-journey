
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxCardProps {
  className?: string;
  children: React.ReactNode;
  depth?: number;
  sensitivity?: number;
}

export function ParallaxCard({
  className,
  children,
  depth = 30,
  sensitivity = 0.05,
}: ParallaxCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    setPosition({
      x: mouseX * sensitivity,
      y: mouseY * sensitivity
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-xl transition-all duration-300",
        "perspective-1000 preserve-3d cursor-pointer",
        "advanced-glassmorphism",
        isHovered ? "shadow-[0_20px_40px_rgba(0,0,0,0.2)]" : "shadow-[0_10px_30px_rgba(0,0,0,0.1)]",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateY: position.x * -1,
        rotateX: position.y,
        transformPerspective: 1000,
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0,0,0,0.2)' 
          : '0 10px 30px rgba(0,0,0,0.1)',
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <motion.div
        className="relative z-10"
        animate={{
          translateZ: isHovered ? depth : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {children}
      </motion.div>
      
      {/* Reflective surface effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 z-20 pointer-events-none"
        animate={{
          opacity: isHovered ? 0.3 : 0,
          rotateX: position.y * -1.5,
          rotateY: position.x * 1.5,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />
    </motion.div>
  );
}
