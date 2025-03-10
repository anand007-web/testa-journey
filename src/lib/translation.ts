
// Export the Language type so it can be imported elsewhere
export type Language = 'en' | 'hi';

// Simple function to check if the text is in Devanagari script (Hindi)
export const isHindiText = (text: string): boolean => {
  const devanagariRange = /[\u0900-\u097F]/;
  return devanagariRange.test(text);
};

// Function to get text in the right language
export const getLanguageText = (
  textEn: string | null | undefined,
  textHi: string | null | undefined,
  currentLang: Language
): string => {
  if (currentLang === 'hi' && textHi) {
    return textHi;
  }
  if (currentLang === 'en' && textEn) {
    return textEn;
  }
  
  // Fallback to available text
  return textHi || textEn || '';
};

// Format time function (missing in the QuizPage component)
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Mock translation function - in a real app, this would call a translation API
export const mockTranslate = async (
  text: string,
  targetLang: Language
): Promise<string> => {
  // This is just a simple mock function for demonstration
  // In a real app, this would call a translation API like Google Translate
  
  if (!text) return '';
  
  // Check if the text is already in the target language
  if (targetLang === 'hi' && isHindiText(text)) return text;
  if (targetLang === 'en' && !isHindiText(text)) return text;
  
  // In a real app, you would call an API here
  // For now, we'll just add a prefix to show it's translated
  if (targetLang === 'hi') {
    // Simple mock Hindi "translation" - THIS IS NOT REAL TRANSLATION
    // Just to demonstrate the concept
    return `[हिंदी] ${text}`;
  }
  
  // Mock English translation
  return `[Translated] ${text}`;
};
