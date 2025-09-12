
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SocialPlatformCard from "./social/SocialPlatformCard";
import NextDrawCountdown from "./social/NextDrawCountdown";
import ReferralSystem from "./social/ReferralSystem";
import BonusTracker from "./social/BonusTracker";
import VerificationNote from "./social/VerificationNote";

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SocialMediaModal = ({ isOpen, onClose }: SocialMediaModalProps) => {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const { toast } = useToast();

  const socialPlatforms = [
    {
      id: "telegram",
      name: "قناة Telegram الرسمية",
      description: "احصل على إشعارات فورية عند إعلان الفائزين وعروض حصرية",
      icon: "📱",
      color: "from-blue-500 to-blue-600",
      url: "https://t.me/your_channel",
      benefit: "سحب إضافي مجاني",
      followers: "12.5K",
      priority: 1
    },
    {
      id: "facebook",
      name: "صفحة Facebook",
      description: "تابع أحدث الأخبار وشاهد صور الفائزين مع جوائزهم",
      icon: "👥",
      color: "from-blue-600 to-blue-700",
      url: "https://facebook.com/your_page",
      benefit: "فرصة مضاعفة للفوز",
      followers: "8.3K",
      priority: 2
    },
    {
      id: "tiktok",
      name: "TikTok / Instagram",
      description: "شاهد فيديوهات قصص الفائزين الحقيقيين وكيف غيرت حياتهم",
      icon: "🎬",
      color: "from-pink-500 to-purple-600",
      url: "https://tiktok.com/@your_account",
      benefit: "دخول في سحب خاص",
      followers: "25.1K",
      priority: 3
    }
  ];

  const handleSocialClick = (platform: any) => {
    console.log(`User clicked ${platform.name}`);
    
    window.open(platform.url, '_blank');
    
    if (!completedActions.includes(platform.id)) {
      setCompletedActions([...completedActions, platform.id]);
      
      toast({
        title: `تم فتح ${platform.name}! 🎉`,
        description: `بعد الانضمام، ستحصل على: ${platform.benefit}`,
      });
    }
  };

  const handleClaimBonus = () => {
    if (completedActions.length === 0) {
      toast({
        title: "لم تنضم لأي قناة بعد",
        description: "انضم لقناة واحدة على الأقل للحصول على المكافأة",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "تم استلام المكافآت! 🎁",
      description: `حصلت على ${completedActions.length} سحب إضافي للانضمام إلى ${completedActions.length} قناة`,
    });

    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="space-y-4">
              <div className="text-4xl">🎉</div>
              <h2 className="text-3xl font-bold text-white">تهانينا! تم تسجيل مشاركتك بنجاح</h2>
              <p className="text-lg text-gray-300">احصل على فرص إضافية للفوز بالانضمام إلى قنواتنا الاجتماعية</p>
              
              <div className="inline-flex items-center bg-yellow-500/20 backdrop-blur-sm rounded-full px-6 py-2">
                <Gift className="w-5 h-5 mr-2 text-yellow-400" />
                <span className="text-yellow-300 font-semibold">مكافآت حصرية للمتابعين الجدد!</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <NextDrawCountdown />

          <div className="grid md:grid-cols-3 gap-4">
            {socialPlatforms.map((platform) => {
              const isCompleted = completedActions.includes(platform.id);
              
              return (
                <SocialPlatformCard
                  key={platform.id}
                  platform={platform}
                  isCompleted={isCompleted}
                  onPlatformClick={handleSocialClick}
                />
              );
            })}
          </div>

          <ReferralSystem />

          <BonusTracker 
            completedActions={completedActions} 
            totalPlatforms={socialPlatforms.length} 
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleClaimBonus}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-lg py-3"
              disabled={completedActions.length === 0}
            >
              <Gift className="w-5 h-5 mr-2" />
              استلم المكافآت (+{completedActions.length + (completedActions.includes('telegram') ? 1 : 0)})
            </Button>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              متابعة إلى الموقع
            </Button>
          </div>

          <VerificationNote />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialMediaModal;
