import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export type Language = 'ar' | 'en';

interface LanguageToggleProps {
  onLanguageChange: (lang: Language) => void;
}

const LanguageToggle = ({ onLanguageChange }: LanguageToggleProps) => {
  const [currentLang, setCurrentLang] = useState<Language>('en'); // English افتراضي

  useEffect(() => {
    // استرجاع اللغة من localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setCurrentLang(savedLang);
      onLanguageChange(savedLang);
      document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
    } else {
      
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [onLanguageChange]);

  const toggleLanguage = () => {
    const newLang: Language = currentLang === 'ar' ? 'en' : 'ar';
    setCurrentLang(newLang);
    localStorage.setItem('language', newLang);
    onLanguageChange(newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
  };


};

export default LanguageToggle;
