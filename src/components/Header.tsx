
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { Language } from "@/hooks/useTranslation";

interface HeaderProps {
  onLanguageChange: (lang: Language) => void;
}

const Header = ({ onLanguageChange }: HeaderProps) => {
  return (
    <header className="absolute top-4 right-4 z-50 flex items-center space-x-4">
      <ThemeToggle />
      <LanguageToggle onLanguageChange={onLanguageChange} />
    </header>
  );
};

export default Header;
