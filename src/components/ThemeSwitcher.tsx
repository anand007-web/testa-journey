
import React, { useState } from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { useCustomTheme } from '@/context/CustomThemeContext';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { theme: customTheme, setTheme } = useCustomTheme();
  const [open, setOpen] = useState(false);

  const themes = [
    { id: 'light', name: 'Light Mode', icon: <span className="text-xs">☀️</span> },
    { id: 'dark', name: 'Dark Mode', icon: <span className="text-xs">🌙</span> },
    { id: 'minimalist', name: 'Minimalist', icon: <span className="text-xs">✨</span> },
    { id: 'dark-delight', name: 'Dark Delight', icon: <span className="text-xs">🌑</span> },
    { id: 'playful', name: 'Playful', icon: <span className="text-xs">🎨</span> },
    { id: 'futuristic', name: 'Futuristic', icon: <span className="text-xs">🚀</span> },
    { id: 'nature', name: 'Nature', icon: <span className="text-xs">🌿</span> },
  ];

  const handleThemeChange = (themeId: string) => {
    if (themeId === 'light' || themeId === 'dark') {
      // If Light or Dark theme is selected
      setTheme('minimalist'); // Set a default custom theme
      if (theme !== themeId) {
        toggleTheme(); // Toggle between light and dark
      }
    } else {
      // If any custom theme is selected
      setTheme(themeId as any);
      // Set proper base mode for custom themes
      if ((themeId === 'dark-delight' || themeId === 'futuristic') && theme !== 'dark') {
        toggleTheme(); // Ensure dark mode for dark-based themes
      } else if ((themeId === 'minimalist' || themeId === 'playful' || themeId === 'nature') && theme !== 'light') {
        toggleTheme(); // Ensure light mode for light-based themes
      }
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full animated-border z-50"
        >
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="space-y-2">
          <h3 className="text-sm font-medium px-2 py-1">Choose Theme</h3>
          <div className="space-y-1">
            {themes.map((t) => {
              const isActive = 
                (t.id === 'light' && theme === 'light') || 
                (t.id === 'dark' && theme === 'dark') || 
                (t.id !== 'light' && t.id !== 'dark' && customTheme === t.id);
              
              return (
                <Button 
                  key={t.id} 
                  variant={isActive ? "default" : "ghost"} 
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => handleThemeChange(t.id)}
                >
                  <span className="mr-2">{t.icon}</span>
                  {t.name}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
