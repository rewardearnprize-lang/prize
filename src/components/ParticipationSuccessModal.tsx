import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Gift } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface ParticipationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueToSocial: () => void;
  email: string;
  prizeName: string;
}

const ParticipationSuccessModal = ({ 
  isOpen, 
  onClose, 
  onContinueToSocial, 
  email, 
  prizeName 
}: ParticipationSuccessModalProps) => {
  const { t } = useTranslation();

  // Auto redirect بعد 3 ثواني
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onContinueToSocial();
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onContinueToSocial, onClose]);

  const handleSocialMediaRedirect = () => {
    onContinueToSocial();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-green-900 via-blue-900 to-emerald-900 border border-green-500/30">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                🎉 {t("participation.congratulations")}
              </h2>
              <p className="text-lg text-green-300">{t("participation.confirmed")}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-green-500/30">
            <CardContent className="p-4 space-y-3">
              <div className="text-center">
                <h3 className="text-white font-bold mb-2">{t("participation.details")}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">{t("admin.email")}:</span>
                    <span className="text-white">{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">{t("admin.prize")}:</span>
                    <span className="text-white">{prizeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">{t("admin.status")}:</span>
                    <span className="text-green-400 font-bold">
                      ✅ {t("participation.qualified")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-500/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-yellow-400" />
                <div>
                  <h4 className="text-white font-medium">{t("participation.nextSteps")}</h4>
                  <p className="text-gray-300 text-sm">
                    {t("participation.followSocial")}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {t("participation.autoRedirect")} ⏳
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button 
              onClick={handleSocialMediaRedirect}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg py-3"
            >
              <Gift className="w-5 h-5 mr-2" />
              {t("participation.followForBonus")}
            </Button>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              {t("participation.backToSite")}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>{t("participation.emailNotification")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipationSuccessModal;
