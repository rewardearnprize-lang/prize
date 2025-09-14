import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, ExternalLink, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prize: any;
  onParticipate: (email: string) => void;
}

const ParticipationModal = ({ isOpen, onClose, prize, onParticipate }: ParticipationModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "خطأ",
        description: "من فضلك أدخل البريد الإلكتروني",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // 🟢 استدعاء callback
      onParticipate(email);

      // 🟢 خزّن الإيميل في localStorage
      localStorage.setItem("currentUserEmail", email);

      setEmail("");
      onClose();

      toast({
        title: "تم تسجيل مشاركتك 🎉",
        description: "سيتم تحويلك إلى صفحة العرض الآن. أكمل المطلوب لتتأهل للسحب.",
      });

      // 🟢 لو في offerUrl حطه هنا
      if (prize?.offerUrl) {
        const redirectUrl = `${prize.offerUrl}?prizeId=${prize.id}&email=${encodeURIComponent(
          email
        )}`;
        window.location.href = redirectUrl;
      } else {
        toast({
          title: "لا يوجد لينك للعرض",
          description: "من فضلك تواصل مع الإدارة",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  if (!prize) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="space-y-4">
              <div className="text-4xl">{prize.image || "🎁"}</div>
              <h2 className="text-2xl font-bold text-white">اشترك في السحب</h2>
              <p className="text-lg text-gray-300">{prize.name}</p>
              <Badge className="bg-green-500/20 text-green-400 text-lg px-4 py-2">
                قيمة الجائزة: {prize.prizeValue || prize.value}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Prize Info */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">المتبقي من المشاركين:</span>
                <Badge variant="secondary">{prize.remainingParticipants}</Badge>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((prize.maxParticipants - prize.remainingParticipants) /
                        prize.maxParticipants) *
                      100
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center text-sm text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                <span>سيتم السحب عند اكتمال العدد المطلوب</span>
              </div>
            </CardContent>
          </Card>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                required
              />
            </div>

            {/* Steps */}
            <Card className="bg-blue-500/20 border-blue-500/30">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-3">خطوات الاشتراك:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-300">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
                      1
                    </span>
                    أدخل بريدك الإلكتروني
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
                      2
                    </span>
                    أكمل العرض المطلوب
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
                      3
                    </span>
                    انتظر تأكيد مشاركتك
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "جاري المعالجة..."
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    اشترك الآن
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/30 text-white hover:bg-white/10"
              >
                إلغاء
              </Button>
            </div>
          </form>

          {/* Warning */}
          <div className="flex items-start space-x-3 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-300 font-medium">مهم:</p>
              <p className="text-yellow-200">
                تأكد من إكمال جميع خطوات العرض لتتأهل للسحب. ستصلك رسالة تأكيد على البريد الإلكتروني بعد نجاح المشاركة.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipationModal;
