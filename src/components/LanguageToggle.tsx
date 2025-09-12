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
      // تحديد الاتجاه الافتراضي للصفحة
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

  return (
    <Button
      variant="outline"
      onClick={toggleLanguage}
      className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
    >
      <Globe className="h-4 w-4 mr-2" />
      {currentLang === 'ar' ? 'English' : 'العربية'}
    </Button>
  );
};

export default LanguageToggle;
