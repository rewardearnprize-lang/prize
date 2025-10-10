import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, ExternalLink, Clock, IdCard, Loader2, Smartphone, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, getDocs, query, where, setDoc, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

interface ParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prize: {
    id: string;
    name: string;
    image?: string;
    prizeValue?: number;
    value?: string;
    maxParticipants?: number;
    offerUrl?: string;
    participationType?: "email" | "id";
  } | null;
  onParticipate: (inputValue: string) => void;
}

const ParticipationModal = ({
  isOpen,
  onClose,
  prize,
  onParticipate,
}: ParticipationModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinedCount, setJoinedCount] = useState(0);
  const [savedKey, setSavedKey] = useState("");
  const { toast } = useToast();

  const fetchJoinedCount = async () => {
    if (!prize) return;
    try {
      const q = query(
        collection(firestore, "participants"),
        where("prizeId", "==", prize.id),
        where("verified", "==", true)
      );
      const snap = await getDocs(q);
      setJoinedCount(snap.size);
    } catch (error) {
      console.error("Error fetching count:", error);
    }
  };

  useEffect(() => {
    if (isOpen && prize) {
      fetchJoinedCount();
      setInputValue("");
      setIsSubmitting(false);
      setSavedKey("");
    }
  }, [isOpen, prize]);

  // 🔹 كشف إذا كان الجهاز هاتف
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // 🔹 حفظ المفتاح في localStorage للهاتف
  const saveKeyForMobile = (key: string) => {
    localStorage.setItem('lastParticipationKey', key);
    localStorage.setItem('lastParticipationTime', Date.now().toString());
    console.log("📱 Key saved for mobile:", key);
  };

  // 🔹 فتح الرابط مع معالجة خاصة للهاتف
  const openOfferWithKey = (key: string) => {
    if (!prize?.offerUrl) return;

    // 🔹 حفظ المفتاح للهاتف
    if (isMobileDevice()) {
      saveKeyForMobile(key);
    }

    // 🔹 بناء الرابط مع المفتاح
    const offerUrlWithKey = prize.offerUrl.includes('kldool') 
      ? prize.offerUrl.replace('kldool', `kldool?sub1=${key}`)
      : `${prize.offerUrl}${prize.offerUrl.includes("?") ? "&" : "?"}sub1=${key}`;

    console.log("🔗 Opening URL:", offerUrlWithKey);
    
    if (isMobileDevice()) {
      // 🔹 للهاتف: فتح في نافذة جديدة ومراقبة الإغلاق
      const newWindow = window.open(offerUrlWithKey, '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        // مراقبة إذا أغلقت النافذة (يدل على اكتمال العملية)
        const checkClosed = setInterval(() => {
          if (newWindow.closed) {
            clearInterval(checkClosed);
            console.log("📱 Mobile window closed - offer completed");
            
            // فتح الرابط النهائي بعد إكمال العرض
            setTimeout(() => {
              const finalUrl = prize.offerUrl!.replace('/i/', '/v/');
              window.open(finalUrl, '_blank', 'noopener,noreferrer');
            }, 1000);
          }
        }, 1000);

        // تنظيف بعد 30 ثانية
        setTimeout(() => clearInterval(checkClosed), 30000);
      }
    } else {
      // 🔹 للكمبيوتر: فتح بشكل طبيعي
      window.open(offerUrlWithKey, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || !prize) {
      toast({
        title: "Error",
        description: `Please enter your ${prize?.participationType || "email"}.`,
        variant: "destructive",
      });
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1️⃣ إنشاء مفتاح فريد
      const uniqueKey = `key_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      console.log("🔑 Generated Key:", uniqueKey);
      setSavedKey(uniqueKey);

      // 2️⃣ حفظ البيانات في Firebase
      const participantData = {
        [prize.participationType || "email"]: inputValue.trim(),
        prize: prize.name,
        prizeId: prize.id,
        status: "pending",
        joinDate: new Date().toISOString(),
        verified: false,
        completed: false,
        key: uniqueKey,
        participantKey: uniqueKey,
        deviceType: isMobileDevice() ? "mobile" : "desktop",
        timestamp: new Date().toISOString(),
      };

      await setDoc(doc(firestore, "participants", uniqueKey), participantData);
      console.log("✅ Data saved with key:", uniqueKey);

      // 3️⃣ فتح الرابط مع المفتاح
      openOfferWithKey(uniqueKey);

      // 4️⃣ إخطار Parent component
      onParticipate(inputValue.trim());
      
      toast({
        title: "Success! 🎉",
        description: isMobileDevice() 
          ? "Offer opened! Complete it to verify your participation." 
          : "Your participation has been recorded!",
      });

      // 5️⃣ إغلاق بعد نجاح العملية
      setTimeout(() => {
        setInputValue("");
        onClose();
      }, 2000);

    } catch (error) {
      console.error("❌ Error:", error);
      toast({
        title: "Error",
        description: "Failed to save participation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setInputValue("");
      setSavedKey("");
      onClose();
    }
  };

  if (!prize) return null;

  const remaining = prize.maxParticipants
    ? Math.max(0, prize.maxParticipants - joinedCount)
    : 0;

  const progressPercentage = prize.maxParticipants
    ? ((prize.maxParticipants - remaining) / prize.maxParticipants) * 100
    : 0;

  const isMobile = isMobileDevice();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="space-y-4">
              <div className="text-4xl">{prize.image || "🎁"}</div>
              <h2 className="text-2xl font-bold text-white">Enter the Draw</h2>
              <p className="text-lg text-gray-300">{prize.name}</p>
              <Badge className="bg-green-500/20 text-green-400 text-lg px-4 py-2">
                Prize Value: {prize.prizeValue || prize.value}
              </Badge>
              
              {/* 🔹 إشعار بنوع الجهاز */}
              <div className="flex items-center justify-center gap-2">
                {isMobile ? (
                  <>
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 text-sm">Mobile Device</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">Desktop Device</span>
                  </>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Remaining slots:</span>
                <Badge variant="secondary">{remaining}</Badge>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center text-sm text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                <span>The draw will take place once all slots are filled.</span>
              </div>
            </CardContent>
          </Card>

          {savedKey && (
            <Card className="bg-yellow-500/20 border-yellow-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge className="bg-yellow-500 mr-2">Your Key</Badge>
                    <code className="text-yellow-300 text-sm font-mono">
                      {savedKey}
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(savedKey)}
                    className="text-yellow-300 border-yellow-300"
                  >
                    Copy
                  </Button>
                </div>
                {isMobile && (
                  <p className="text-yellow-200 text-xs mt-2">
                    ⚠️ Key saved locally for mobile verification
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                {prize.participationType === "id" ? (
                  <IdCard className="w-4 h-4 inline mr-2" />
                ) : (
                  <Mail className="w-4 h-4 inline mr-2" />
                )}
                {prize.participationType === "id" ? "ID" : "Email"}
              </label>
              <Input
                type={prize.participationType === "id" ? "text" : "email"}
                placeholder={
                  prize.participationType === "id"
                    ? "Enter your ID"
                    : "Enter your Email"
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* 🔹 إرشادات خاصة للهاتف */}
            {isMobile && (
              <Card className="bg-blue-500/20 border-blue-500/30">
                <CardContent className="p-4">
                  <h4 className="text-white font-medium mb-2 flex items-center">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobile Instructions:
                  </h4>
                  <div className="text-sm text-blue-200 space-y-1">
                    <p>• The offer will open in a new window</p>
                    <p>• Complete the required steps</p>
                    <p>• Return to this app after completion</p>
                    <p>• Your key is saved automatically</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex space-x-3">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                disabled={isSubmitting || !inputValue.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isMobile ? "Preparing..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Participate Now
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-white/30 text-black hover:bg-white/10"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipationModal;
