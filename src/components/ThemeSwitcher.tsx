
import React, { useState } from 'react';
import { Moon, Sun, Palette, ChevronDown, ChevronUp } from 'lucide-react';
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
    { id: 'minimalist', name: 'Minimalist', icon: <Sun className="h-4 w-4" /> },
    { id: 'dark-delight', name: 'Dark Delight', icon: <Moon className="h-4 w-4" /> },
    { id: 'playful', name: 'Playful', icon: <span className="text-xs">🎨</span> },
    { id: 'futuristic', name: 'Futuristic', icon: <span className="text-xs">🚀</span> },
    { id: 'nature', name: 'Nature', icon: <span className="text-xs">🌿</span> },
  ];

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full">
        {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
        <span className="sr-only">Toggle theme</span>
      </Button>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Palette className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Change theme style</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="space-y-2">
            <h3 className="text-sm font-medium px-2 py-1">Choose Theme</h3>
            <div className="space-y-1">
              {themes.map((t) => (
                <Button 
                  key={t.id} 
                  variant={customTheme === t.id ? "default" : "ghost"} 
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    setTheme(t.id as any);
                    setOpen(false);
                  }}
                >
                  <span className="mr-2">{t.icon}</span>
                  {t.name}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
