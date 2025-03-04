
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { SeasonalThemeSwitcher } from '@/components/ui/seasonal-theme';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Appearance</h3>
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Seasonal Theme</h4>
        <SeasonalThemeSwitcher />
      </div>
    </div>
  );
}
