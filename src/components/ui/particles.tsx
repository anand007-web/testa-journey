
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Particle = {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  alpha: number;
  alphaSpeed: number;
};

type ParticlesProps = {
  className?: string;
  quantity?: number;
  stationary?: boolean;
  style?: React.CSSProperties;
  particleColor?: string;
  minSize?: number;
  maxSize?: number;
};

export function Particles({
  className,
  quantity = 50,
  stationary = false,
  style,
  particleColor = "hsl(var(--primary))",
  minSize = 1,
  maxSize = 3,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef<number | null>(null);

  const generateParticles = useCallback(() => {
    if (!canvasRef.current) return [];
    
    const { width, height } = canvasRef.current;
    const particles: Particle[] = [];
    
    for (let i = 0; i < quantity; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: minSize + Math.random() * (maxSize - minSize),
        color: particleColor,
        speedX: stationary ? 0 : Math.random() * 0.2 - 0.1,
        speedY: stationary ? 0 : Math.random() * 0.2 - 0.1,
        alpha: 0.1 + Math.random() * 0.4,
        alphaSpeed: 0.001 + Math.random() * 0.005
      });
    }
    
    return particles;
  }, [quantity, stationary, particleColor, minSize, maxSize]);

  const updateParticles = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particlesRef.current.forEach((particle, index) => {
      // Update position
      if (!stationary) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      }
      
      // Pulse alpha
      particle.alpha += particle.alphaSpeed;
      if (particle.alpha > 0.5 || particle.alpha < 0.1) {
        particle.alphaSpeed = -particle.alphaSpeed;
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
    });
    
    animationFrameRef.current = requestAnimationFrame(updateParticles);
  }, [stationary]);

  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    setDimensions({ width, height });
    
    // Generate particles
    particlesRef.current = generateParticles();
    
    // Start animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updateParticles);
  }, [generateParticles, updateParticles]);

  useEffect(() => {
    initCanvas();
    
    const handleResize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        if (width !== dimensions.width || height !== dimensions.height) {
          initCanvas();
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initCanvas, dimensions.width, dimensions.height]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        ...style,
        width: '100%',
        height: '100%',
      }}
    />
  );
}
