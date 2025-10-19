import { useState, useEffect } from "react";
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
import { Mail, ExternalLink, Clock, IdCard, Image as ImageIcon } from "lucide-react";
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
    imageUrl?: string; // أضفت هذا الحقل
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
  const { toast } = useToast();

  // 🔹 لجلب عدد المشاركين الحاليين
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
    } catch (err) {
      console.error("Error fetching joined count:", err);
    }
  };

  useEffect(() => {
    if (isOpen && prize) {
      fetchJoinedCount();
    }
  }, [isOpen, prize]);

  // ✅ عند الضغط على "Participate Now"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue || !prize) {
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
      // 1️⃣ إنشاء مفتاح واحد فقط
      const uniqueKey =
        "key_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

      // 2️⃣ حفظ البيانات في Firestore
      await setDoc(doc(firestore, "participants", uniqueKey), {
        [prize?.participationType || "email"]: inputValue,
        prize: prize.name,
        prizeId: prize.id,
        status: "pending",
        joinDate: new Date().toISOString(),
        verified: false,
        key: uniqueKey,
      });

      console.log("✅ Participant added with key:", uniqueKey);

      // 3️⃣ فتح رابط العرض مع aff_sub4 و aff_sub5
      if (prize.offerUrl) {
        // نضيف كل من المفتاح والبريد
        let offerUrlWithParams = `${prize.offerUrl}${
          prize.offerUrl.includes("?") ? "&" : "?"
        }aff_sub4=${encodeURIComponent(uniqueKey)}&aff_sub5=${encodeURIComponent(inputValue)}`;

        // الكشف عن نوع الجهاز
        const ua = navigator.userAgent || (navigator as any).vendor || (window as any).opera;
        const isMobile = /iphone|ipod|ipad|android|blackberry|mobile|windows phone|opera mini/i.test(ua);

        // تعديل المسار إذا كان موبايل (OGAds يستخدم /v/ للهواتف)
        if (isMobile) {
          offerUrlWithParams = offerUrlWithParams.replace("/cl/i/", "/cl/v/");
        }

        // فتح الرابط بطريقة آمنة (لتجنب حظر popup)
        const newTab = window.open("about:blank", "_blank");

        if (newTab) {
          setTimeout(() => {
            try {
              newTab.location.href = offerUrlWithParams;
            } catch (err) {
              console.warn("Could not set newTab.location.href:", err);
              window.location.href = offerUrlWithParams;
            }
          }, 100);
        } else {
          window.location.href = offerUrlWithParams;
        }
      } else {
        console.warn("⚠️ لا يوجد offerUrl في هذا العرض");
      }

      // 4️⃣ إغلاق المودال وإظهار تنبيه
      onParticipate(inputValue);
      setInputValue("");
      onClose();

      toast({
        title: "Participation Registered 🎉",
        description:
          "Check your entry on the verification page to confirm participation.",
      });
    } catch (error) {
      console.error("Error adding participation:", error);
      toast({
        title: "Error",
        description:
          "There was an error registering your participation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!prize) return null;

  const remaining = prize.maxParticipants
    ? prize.maxParticipants - joinedCount
    : 0;

  // الحصول على رابط الصورة (الأولوية لـ imageUrl ثم image)
  const imageUrl = prize.imageUrl || prize.image;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
     <div className="m-8">
 <DialogContent
  className="max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-white/20 m-6 rounded-2xl"
>
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="space-y-4">
              {/* عرض الصورة إذا كانت موجودة */}
              {imageUrl ? (
                <div className="flex justify-center">
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
                    <img 
                      src={imageUrl} 
                      alt={prize.name}
                      className="w-{50px} h-{50px} object-cover"
                      onError={(e) => {
                        // إذا فشل تحميل الصورة، عرض أيقونة بديلة
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-4xl">🎁</div>
              )}
              
              <h2 className="text-2xl font-bold text-white">Enter the Draw</h2>
              <p className="text-lg text-gray-300">{prize.name}</p>
              <Badge className="bg-green-500/20 text-green-400 text-lg px-4 py-2">
                Prize Value: {prize.prizeValue || prize.value}
              </Badge>
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
                    width: `${
                      prize.maxParticipants
                        ? ((prize.maxParticipants - remaining) / prize.maxParticipants) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center text-sm text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                <span>The draw will take place once all slots are filled.</span>
              </div>
            </CardContent>
          </Card>

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
              />
            </div>

            <Card className="bg-blue-500/20 border-blue-500/30">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-3">
                  Participation Steps:
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-300">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
                      1
                    </span>
                    Enter your {prize.participationType === "id" ? "ID" : "Email"} address
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
                      2
                    </span>
                    Complete the required offer
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
                      3
                    </span>
                    Wait for the draw results
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isSubmitting ? "Processing..." : "Participate Now"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
        </div>
    </Dialog>
  );
};

export default ParticipationModal;
