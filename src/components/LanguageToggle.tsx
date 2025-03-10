
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LanguageToggleProps {
  variant?: 'default' | 'minimal';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ variant = 'default' }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  if (variant === 'minimal') {
    return (
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="text-xs font-medium bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all"
        >
          {language === 'en' ? 'A → अ' : 'अ → A'}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex items-center space-x-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className={`text-sm ${language === 'en' ? 'font-bold' : ''}`}>EN</span>
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
        onClick={toggleLanguage}
        style={{ 
          backgroundColor: language === 'en' ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
        }}
      >
        <span className="sr-only">{t('language.select')}</span>
        <motion.span
          className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0"
          animate={{ 
            x: language === 'en' ? 0 : 20 
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      </motion.button>
      <span className={`text-sm ${language === 'hi' ? 'font-bold' : ''}`}>हिं</span>
    </motion.div>
  );
};

export default LanguageToggle;
