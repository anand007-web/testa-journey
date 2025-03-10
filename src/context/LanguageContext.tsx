
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Basic translations for UI elements
const translations: Record<string, Record<Language, string>> = {
  // General UI
  'app.title': {
    en: 'QuizHive',
    hi: 'क्विज़हाइव'
  },
  'button.start': {
    en: 'Start',
    hi: 'शुरू करें'
  },
  'button.next': {
    en: 'Next',
    hi: 'अगला'
  },
  'button.previous': {
    en: 'Previous',
    hi: 'पिछला'
  },
  'button.finish': {
    en: 'Finish',
    hi: 'समाप्त करें'
  },
  'button.submit': {
    en: 'Submit',
    hi: 'जमा करें'
  },
  'button.cancel': {
    en: 'Cancel',
    hi: 'रद्द करें'
  },
  'button.save': {
    en: 'Save',
    hi: 'सहेजें'
  },
  'button.login': {
    en: 'Login',
    hi: 'लॉग इन करें'
  },
  'button.register': {
    en: 'Register',
    hi: 'पंजीकरण करें'
  },
  'button.logout': {
    en: 'Logout',
    hi: 'लॉग आउट'
  },
  // Navigation
  'nav.home': {
    en: 'Home',
    hi: 'होम'
  },
  'nav.dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड'
  },
  'nav.quizzes': {
    en: 'Quizzes',
    hi: 'क्विज़'
  },
  'nav.create': {
    en: 'Create Quiz',
    hi: 'क्विज़ बनाएं'
  },
  // Quiz related
  'quiz.question': {
    en: 'Question',
    hi: 'प्रश्न'
  },
  'quiz.explanation': {
    en: 'Explanation',
    hi: 'व्याख्या'
  },
  'quiz.correct': {
    en: 'Correct',
    hi: 'सही'
  },
  'quiz.incorrect': {
    en: 'Incorrect',
    hi: 'गलत'
  },
  'quiz.score': {
    en: 'Score',
    hi: 'स्कोर'
  },
  'quiz.time': {
    en: 'Time',
    hi: 'समय'
  },
  'quiz.difficulty': {
    en: 'Difficulty',
    hi: 'कठिनाई'
  },
  'quiz.category': {
    en: 'Category',
    hi: 'श्रेणी'
  },
  // Language selector
  'language.select': {
    en: 'Select Language',
    hi: 'भाषा चुनें'
  },
  'language.english': {
    en: 'English',
    hi: 'अंग्रेज़ी'
  },
  'language.hindi': {
    en: 'Hindi',
    hi: 'हिंदी'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserPreference = async () => {
      try {
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Try to get user's language preference
          const { data: preferences } = await supabase
            .from('user_preferences')
            .select('language')
            .eq('user_id', user.id)
            .maybeSingle();

          if (preferences) {
            setLanguageState(preferences.language as Language);
          } else {
            // Create default preference if not exists
            await supabase.from('user_preferences').insert({
              user_id: user.id,
              language: language
            });
          }
        } else {
          // If not logged in, check session storage
          const savedLanguage = sessionStorage.getItem('language');
          if (savedLanguage) {
            setLanguageState(savedLanguage as Language);
          }
        }
      } catch (error) {
        console.error('Error fetching language preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPreference();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      // Always save to session storage
      sessionStorage.setItem('language', lang);
      
      // Update state
      setLanguageState(lang);
      
      // If user is logged in, save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            language: lang,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
      }
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  // Translation function
  const t = (key: string, fallback?: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return fallback || key;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
