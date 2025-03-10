
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Globe, Check } from 'lucide-react';

export interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'icon';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'default' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLanguage: 'en' | 'hi') => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  ];

  if (variant === 'icon') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <AnimatedButton 
            variant="ghost" 
            size="icon" 
            animationType="scale"
            className="h-8 w-8 rounded-full"
          >
            <Globe className="h-4 w-4" />
          </AnimatedButton>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('language.select')}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLanguageChange(lang.code as 'en' | 'hi')}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  language === lang.code 
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 hover:bg-muted'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">{lang.flag}</span>
                  <div>
                    <p className="font-medium">{lang.nativeName}</p>
                    <p className="text-sm opacity-70">{lang.name}</p>
                  </div>
                </div>
                {language === lang.code && <Check className="h-5 w-5" />}
              </motion.button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        {languages.map((lang) => (
          <AnimatedButton
            key={lang.code}
            variant={language === lang.code ? "default" : "outline"}
            size="sm"
            onClick={() => handleLanguageChange(lang.code as 'en' | 'hi')}
            animationType="scale"
            className="min-w-[40px] px-2"
          >
            <span>{lang.code.toUpperCase()}</span>
          </AnimatedButton>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {languages.map((lang) => (
        <AnimatedButton
          key={lang.code}
          variant={language === lang.code ? "default" : "outline"}
          onClick={() => handleLanguageChange(lang.code as 'en' | 'hi')}
          animationType="glow"
        >
          <span className="mr-2">{lang.flag}</span>
          <span>{lang.nativeName}</span>
        </AnimatedButton>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
