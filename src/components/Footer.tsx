
import { Link } from "react-router-dom";
import { Shield, FileText, Lock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('footer.about')}</h3>
            <p className="text-gray-300 text-sm">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('footer.legal')}</h3>
            <div className="space-y-2">
              <Link 
                to="/privacy" 
                className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Lock className="w-4 h-4 mr-2" />
                {t('footer.privacy')}
              </Link>
              <Link 
                to="/terms" 
                className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                {t('footer.terms')}
              </Link>
              <Link 
                to="/data-protection" 
                className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                {t('footer.dataProtection')}
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('footer.contact')}</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>{t('footer.support')}: support@giveaway.com</p>
              <p>{t('footer.business')}: business@giveaway.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 {t('footer.allRights')}. {t('footer.fairPlay')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
