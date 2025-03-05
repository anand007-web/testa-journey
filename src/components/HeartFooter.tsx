
import React from 'react';

export function HeartFooter() {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-center z-10">
      <div className="text-sm flex items-center justify-center gap-2">
        Made with 
        <span className="animate-pulse text-lg relative">
          <span className="absolute inset-0 text-red-500 animate-ping opacity-75">❤️</span>
          <span className="relative inline-block text-red-600">❤️</span>
        </span>
      </div>
    </div>
  );
}
