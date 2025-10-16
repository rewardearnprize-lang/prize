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
import { Mail, ExternalLink, Clock, IdCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { firestore } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, collection, getDocs, query, where } from "firebase/firestore";

interface OfferParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerId: string;
  offerTitle: string;
  offerLink: string;
  participationType: "email" | "id";
  // الإضافات الجديدة
  prizeValue?: number | string;
  maxParticipants?: number;
  offerImage?: string;
}

const OfferParticipationModal = ({
  isOpen,
  onClose,
  offerId,
  offerTitle,
  offerLink,
  participationType,
  // الإضافات الجديدة
  prizeValue,
  maxParticipants,
  offerImage,
}: OfferParticipationModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [joinedCount, setJoinedCount] = useState(0);
  const { toast } = useToast();

  // 🔹 جلب عدد المشاركين الحاليين (إضافة جديدة)
  const fetchJoinedCount = async () => {
    if (!offerId) return;
    try {
      const q = query(
        collection(firestore, "participants"),
        where("offerId", "==", offerId),
        where("verified", "==", true)
      );
      const snap = await getDocs(q);
      setJoinedCount(snap.size);
    } catch (err) {
      console.error("Error fetching joined count:", err);
    }
  };

  useEffect(() => {
    if (isOpen && offerId) {
      fetchJoinedCount();
    }
  }, [isOpen, offerId]);

  const normalizeUrl = (url: string) => {
    if (!/^https?:\/\//i.test(url)) {
      return "https://" + url;
    }
    return url;
  };

  const handleSubmit = async () => {
    if (!inputValue) {
      return toast({
        title: `Please enter your ${
          participationType === "email" ? "Email" : "ID"
        }`,
        variant: "destructive",
      });
    }

    if (!offerLink) {
      return toast({
        title: "This offer has no valid link",
        variant: "destructive",
      });
    }

    // التحقق من إذا كانت المشاركات ممتلئة (إضافة جديدة)
    if (maxParticipants && joinedCount >= maxParticipants) {
      return toast({
        title: "This offer is full",
        description: "All participation slots have been filled.",
        variant: "destructive",
      });
    }

    const finalLink = normalizeUrl(offerLink);

    setLoading(true);
    try {
      // إنشاء مفتاح فريد بدلاً من البريد/ID (إضافة جديدة)
      const uniqueKey = `key_${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;

      // حفظ البيانات مع حقول إضافية (إضافة جديدة)
      const participantRef = doc(firestore, "participants", uniqueKey);
      await setDoc(participantRef, {
        [participationType]: inputValue,
        offerId,
        offerTitle,
        offerurl: finalLink,
        status: "pending", // تغيير من "completed" إلى "pending"
        timestamp: serverTimestamp(),
        // الحقول الجديدة
        verified: false,
        key: uniqueKey,
        joinDate: new Date().toISOString(),
        prizeValue: prizeValue || null,
      });

      // فتح الرابط مع إضافة الباراميترات (إضافة جديدة)
      let offerUrlWithParams = `${finalLink}${
        finalLink.includes("?") ? "&" : "?"
      }aff_sub4=${encodeURIComponent(uniqueKey)}&aff_sub5=${encodeURIComponent(inputValue)}`;

      // الكشف عن نوع الجهاز وتعديل المسار (إضافة جديدة)
      const ua = navigator.userAgent || (navigator as any).vendor || (window as any).opera;
      const isMobile = /iphone|ipod|ipad|android|blackberry|mobile|windows phone|opera mini/i.test(ua);

      if (isMobile) {
        offerUrlWithParams = offerUrlWithParams.replace("/cl/i/", "/cl/v/");
      }

      // فتح الرابط في نافذة جديدة (تحسين)
      const newTab = window.open("about:blank", "_blank");
      if (newTab) {
        setTimeout(() => {
          try {
            newTab.location.href = offerUrlWithParams;
          } catch (err) {
            console.warn("Could not set newTab.location.href:", err);
            window.open(offerUrlWithParams, "_blank");
          }
        }, 100);
      } else {
        window.open(offerUrlWithParams, "_blank");
      }

      toast({
        title: "Participation submitted successfully 🎉",
        description: "Check your entry on the verification page to confirm participation.",
        variant: "default",
      });
      onClose();
      setInputValue("");
    } catch (error) {
      console.error(error);
      toast({ 
        title: "Something went wrong", 
        description: "Please try again later.",
        variant: "destructive" 
      });
    }
    setLoading(false);
  };

  // حساب المشاركات المتبقية (إضافة جديدة)
  const remaining = maxParticipants ? maxParticipants - joinedCount : 0;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        setInputValue("");
      }}
    >
      <DialogContent className="max-w-lg bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="space-y-4">
              <div className="text-4xl">{offerImage || "🎯"}</div>
              <h2 className="text-2xl font-bold text-white">Join Offer</h2>
              <p className="text-lg text-gray-300">{offerTitle}</p>
              <div className="flex flex-col gap-2">
                <Badge className="bg-green-500/20 text-green-400 text-lg px-4 py-2">
                  Complete to unlock rewards
                </Badge>
                {prizeValue && (
                  <Badge className="bg-blue-500/20 text-blue-400 text-md px-3 py-1">
                    Prize Value: {prizeValue}
                  </Badge>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* بطاقة تقدم المشاركين (إضافة جديدة) */}
          {maxParticipants && (
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
                      width: `${((maxParticipants - remaining) / maxParticipants) * 100}%`,
                    }}
                  ></div>
                </div>

                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>The draw will take place once all slots are filled.</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <label className="block text-white font-medium mb-2">
              {participationType === "id" ? (
                <IdCard className="w-4 h-4 inline mr-2" />
              ) : (
                <Mail className="w-4 h-4 inline mr-2" />
              )}
              {participationType === "id" ? "ID" : "Email"}
            </label>
            <Input
              type={participationType === "id" ? "text" : "email"}
              placeholder={
                participationType === "id"
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
                  Enter your {participationType === "email" ? "Email" : "ID"}
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
                  Wait for participation confirmation
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-3">
            <Button
              onClick={handleSubmit}
              disabled={loading || (maxParticipants && remaining <= 0)}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {loading ? "Processing..." : "Participate Now"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferParticipationModal;
