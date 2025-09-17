import { Link } from "react-router-dom";
import { Shield, FileText, Lock } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

const Footer = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      const ref = doc(firestore, "siteStats", "main");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setData(snap.data());
      }
    };
    fetchFooterData();
  }, []);

  return (
    <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              {t("footer.about")}
            </h3>
            <p className="text-gray-300 text-sm">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              {t("footer.legal")}
            </h3>
            <div className="space-y-2">
              <Link
                to={data?.privacyUrl || "/privacy"}
                className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Lock className="w-4 h-4 mr-2" />
                {t("footer.privacy")}
              </Link>
              <Link
                to={data?.termsUrl || "/terms"}
                className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                {t("footer.terms")}
              </Link>
              <Link
                to={data?.dataProtectionUrl || "/data-protection"}
                className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                {t("footer.dataProtection")}
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              {t("footer.contact")}
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                {t("footer.support")}: {data?.supportEmail || "support@giveaway.com"}
              </p>
              <p>
                {t("footer.business")}: {data?.businessEmail || "business@giveaway.com"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 {t("footer.allRights")}. {t("footer.fairPlay")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
