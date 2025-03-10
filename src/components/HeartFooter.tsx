
import React from 'react';
import { motion } from 'framer-motion';

export function HeartFooter() {
  return (
    <motion.div 
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-center z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-sm flex items-center justify-center gap-2 advanced-glassmorphism bg-white/10 dark:bg-black/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}
      >
        Made with 
        <motion.span 
          className="text-lg relative"
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <span className="absolute inset-0 text-red-500 animate-ping opacity-75">❤️</span>
          <span className="relative inline-block text-red-600">❤️</span>
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
