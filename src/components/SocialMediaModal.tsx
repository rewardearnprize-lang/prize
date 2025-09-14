import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SocialPlatformCard from "./social/SocialPlatformCard";
import NextDrawCountdown from "./social/NextDrawCountdown";
import ReferralSystem from "./social/ReferralSystem";
import BonusTracker from "./social/BonusTracker";
import VerificationNote from "./social/VerificationNote";
import { firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SocialLinks {
  telegram: string;
  facebook: string;
  instagram: string; // أو tiktok حسب ما تم تخزينه
}

const SocialMediaModal = ({ isOpen, onClose }: SocialMediaModalProps) => {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const { toast } = useToast();

  // جلب الروابط من Firestore عند فتح المودال
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const docRef = doc(firestore, "adminData", "socialLinks");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSocialLinks(docSnap.data() as SocialLinks);
        }
      } catch (err) {
        console.error("Failed to fetch social links:", err);
        toast({
          title: "خطأ",
          description: "فشل في جلب روابط القنوات الاجتماعية",
          variant: "destructive",
        });
      }
    };

    if (isOpen) fetchSocialLinks();
  }, [isOpen, toast]);

  const handleSocialClick = (platform: any) => {
    if (!platform.url) return;
    window.open(platform.url, "_blank");

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

  if (!socialLinks) {
    return null; // أو Spinner أثناء التحميل
  }

  const socialPlatforms = [
    {
      id: "telegram",
      name: "قناة Telegram الرسمية",
      description: "احصل على إشعارات فورية عند إعلان الفائزين وعروض حصرية",
      icon: "📱",
      color: "from-blue-500 to-blue-600",
      url: socialLinks.telegram,
      benefit: "سحب إضافي مجاني",
      followers: "12.5K",
      priority: 1,
    },
    {
      id: "facebook",
      name: "صفحة Facebook",
      description: "تابع أحدث الأخبار وشاهد صور الفائزين مع جوائزهم",
      icon: "👥",
      color: "from-blue-600 to-blue-700",
      url: socialLinks.facebook,
      benefit: "فرصة مضاعفة للفوز",
      followers: "8.3K",
      priority: 2,
    },
    {
      id: "instagram",
      name: "Instagram / TikTok",
      description: "شاهد فيديوهات قصص الفائزين الحقيقيين وكيف غيرت حياتهم",
      icon: "🎬",
      color: "from-pink-500 to-purple-600",
      url: socialLinks.instagram,
      benefit: "دخول في سحب خاص",
      followers: "25.1K",
      priority: 3,
    },
  ];

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
              استلم المكافآت (+{completedActions.length + (completedActions.includes("telegram") ? 1 : 0)})
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
