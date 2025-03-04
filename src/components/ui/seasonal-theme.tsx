
import React, { useState, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Leaf, SunIcon, Snowflake, Flame } from 'lucide-react';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface SeasonalThemeContextType {
  currentSeason: Season;
  setCurrentSeason: (season: Season) => void;
  isAutoSeason: boolean;
  toggleAutoSeason: () => void;
}

const SeasonalThemeContext = createContext<SeasonalThemeContextType>({
  currentSeason: 'spring',
  setCurrentSeason: () => {},
  isAutoSeason: true,
  toggleAutoSeason: () => {},
});

export const useSeasonalTheme = () => useContext(SeasonalThemeContext);

export function SeasonalThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentSeason, setCurrentSeason] = useState<Season>('spring');
  const [isAutoSeason, setIsAutoSeason] = useState(true);

  useEffect(() => {
    if (isAutoSeason) {
      // Determine season based on month
      const month = new Date().getMonth();
      // 0-2: Winter, 3-5: Spring, 6-8: Summer, 9-11: Autumn
      const seasons: Season[] = ['winter', 'winter', 'winter', 'spring', 'spring', 'spring', 
                                'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn'];
      setCurrentSeason(seasons[month]);
    }
  }, [isAutoSeason]);

  const toggleAutoSeason = () => {
    setIsAutoSeason(!isAutoSeason);
  };

  return (
    <SeasonalThemeContext.Provider 
      value={{ 
        currentSeason, 
        setCurrentSeason, 
        isAutoSeason, 
        toggleAutoSeason 
      }}
    >
      {children}
    </SeasonalThemeContext.Provider>
  );
}

interface SeasonalThemeProps {
  children: React.ReactNode;
  className?: string;
  forceSeason?: Season;
}

export function SeasonalTheme({ 
  children, 
  className,
  forceSeason 
}: SeasonalThemeProps) {
  const { currentSeason, isAutoSeason } = useSeasonalTheme();
  
  // Use forceSeason if provided, otherwise use the context value
  const activeSeason = forceSeason || currentSeason;

  // Define theme based on season
  const seasonalStyles = {
    spring: "bg-gradient-to-br from-seasonal-spring/30 to-white dark:from-seasonal-spring/20 dark:to-background border-seasonal-spring/50",
    summer: "bg-gradient-to-br from-seasonal-summer/30 to-white dark:from-seasonal-summer/20 dark:to-background border-seasonal-summer/50",
    autumn: "bg-gradient-to-br from-seasonal-autumn/30 to-white dark:from-seasonal-autumn/20 dark:to-background border-seasonal-autumn/50",
    winter: "bg-gradient-to-br from-seasonal-winter/30 to-white dark:from-seasonal-winter/20 dark:to-background border-seasonal-winter/50"
  };

  return (
    <div className={cn(
      "transition-colors duration-1000",
      seasonalStyles[activeSeason],
      className
    )}>
      {children}
    </div>
  );
}

export function SeasonalThemeSwitcher() {
  const { currentSeason, setCurrentSeason, isAutoSeason, toggleAutoSeason } = useSeasonalTheme();
  
  const seasons: { value: Season; icon: JSX.Element; label: string }[] = [
    { value: 'spring', icon: <Leaf className="h-4 w-4" />, label: 'Spring' },
    { value: 'summer', icon: <SunIcon className="h-4 w-4" />, label: 'Summer' },
    { value: 'autumn', icon: <Flame className="h-4 w-4" />, label: 'Autumn' },
    { value: 'winter', icon: <Snowflake className="h-4 w-4" />, label: 'Winter' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex space-x-1">
        {seasons.map((season) => (
          <Button
            key={season.value}
            size="sm"
            variant={currentSeason === season.value ? "default" : "outline"}
            className={cn(
              "gap-1 px-2 py-1 h-8",
              isAutoSeason && "opacity-50 pointer-events-none"
            )}
            onClick={() => setCurrentSeason(season.value)}
            disabled={isAutoSeason}
            title={season.label}
          >
            {season.icon}
            <span className="sr-only md:not-sr-only md:inline-flex">{season.label}</span>
          </Button>
        ))}
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleAutoSeason}
        className="text-xs"
      >
        {isAutoSeason ? "Disable Auto Season" : "Enable Auto Season"}
      </Button>
    </div>
  );
}
