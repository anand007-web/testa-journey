
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

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
  const [currentSeason, setCurrentSeason] = useState<Season>(forceSeason || 'spring');

  useEffect(() => {
    if (forceSeason) {
      setCurrentSeason(forceSeason);
      return;
    }

    // Determine season based on month
    const month = new Date().getMonth();
    // 0-2: Winter, 3-5: Spring, 6-8: Summer, 9-11: Autumn
    const seasons: Season[] = ['winter', 'winter', 'winter', 'spring', 'spring', 'spring', 
                               'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn'];
    setCurrentSeason(seasons[month]);
  }, [forceSeason]);

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
      seasonalStyles[currentSeason],
      className
    )}>
      {children}
    </div>
  );
}
