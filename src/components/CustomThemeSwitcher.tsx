
import React from 'react';
import { useCustomTheme } from '@/context/CustomThemeContext';
import { Button } from '@/components/ui/button';
import { 
  Sun, Moon, Sparkles, Zap, Leaf, CheckCircle
} from 'lucide-react';

export function CustomThemeSwitcher() {
  const { theme, setTheme } = useCustomTheme();

  const themes = [
    { id: 'minimalist', name: 'Minimalist', icon: <Sun className="h-5 w-5" /> },
    { id: 'dark-delight', name: 'Dark Delight', icon: <Moon className="h-5 w-5" /> },
    { id: 'playful', name: 'Playful', icon: <Sparkles className="h-5 w-5" /> },
    { id: 'futuristic', name: 'Futuristic', icon: <Zap className="h-5 w-5" /> },
    { id: 'nature', name: 'Nature', icon: <Leaf className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose a Theme</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {themes.map((t) => (
          <Button 
            key={t.id} 
            variant={theme === t.id ? "default" : "outline"} 
            size="sm"
            className="flex items-center justify-center gap-2 h-auto py-2"
            onClick={() => setTheme(t.id as any)}
          >
            {t.icon}
            <span className="text-xs">{t.name}</span>
            {theme === t.id && <CheckCircle className="h-3 w-3 ml-1" />}
          </Button>
        ))}
      </div>
    </div>
  );
}
