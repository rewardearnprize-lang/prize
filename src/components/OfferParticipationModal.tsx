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
import { collection, getDocs, query, where, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

interface OfferParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: {
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

const OfferParticipationModal = ({
  isOpen,
  onClose,
  offer,
  onParticipate,
}: OfferParticipationModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinedCount, setJoinedCount] = useState(0);
  const { toast } = useToast();

  // 🔹 جلب عدد المشاركين الحاليين
  const fetchJoinedCount = async () => {
    if (!offer) return;
    try {
      const q = query(
        collection(firestore, "participants"),
        where("offerId", "==", offer.id),
        where("verified", "==", true)
      );
      const snap = await getDocs(q);
      setJoinedCount(snap.size);
    } catch (err) {
      console.error("Error fetching joined count:", err);
    }
  };

  useEffect(() => {
    if (isOpen && offer) {
      fetchJoinedCount();
      setInputValue(""); // Reset input when modal opens
    }
  }, [isOpen, offer]);

  // ✅ معالجة المشاركة
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue || !offer) {
      toast({
        title: "Error",
        description: `Please enter your ${offer?.participationType || "email"}.`,
        variant: "destructive",
      });
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1️⃣ إنشاء مفتاح فريد
      const uniqueKey = `key_${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;

      // 2️⃣ حفظ البيانات في Firestore
      await setDoc(doc(firestore, "participants", uniqueKey), {
        [offer.participationType || "email"]: inputValue,
        offerName: offer.name,
        offerId: offer.id,
        status: "pending",
        joinDate: new Date().toISOString(),
        verified: false,
        key: uniqueKey,
        timestamp: serverTimestamp(),
      });

      console.log("✅ Participant added with key:", uniqueKey);

      // 3️⃣ فتح رابط العرض مع إضافة الباراميترات
      if (offer.offerUrl) {
        const normalizedUrl = offer.offerUrl.startsWith('http') 
          ? offer.offerUrl 
          : `https://${offer.offerUrl}`;
        
        let offerUrlWithParams = `${normalizedUrl}${
          normalizedUrl.includes("?") ? "&" : "?"
        }aff_sub4=${encodeURIComponent(uniqueKey)}&aff_sub5=${encodeURIComponent(inputValue)}`;

        // الكشف عن نوع الجهاز
        const ua = navigator.userAgent || (navigator as any).vendor || (window as any).opera;
        const isMobile = /iphone|ipod|ipad|android|blackberry|mobile|windows phone|opera mini/i.test(ua);

        // تعديل المسار إذا كان موبايل
        if (isMobile) {
          offerUrlWithParams = offerUrlWithParams.replace("/cl/i/", "/cl/v/");
        }

        // فتح الرابط في نافذة جديدة
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
      } else {
        console.warn("⚠️ No offer URL provided");
      }

      // 4️⃣ إغلاق المودال وإظهار التنبيه
      onParticipate(inputValue);
      setInputValue("");
      onClose();

      toast({
        title: "Participation Registered 🎉",
        description: "Check your entry on the verification page to confirm participation.",
      });
    } catch (error) {
      console.error("Error adding participation:", error);
      toast({
        title: "Error",
        description: "There was an error registering your participation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!offer) return null;

  const remaining = offer.maxParticipants
    ? offer.maxParticipants - joinedCount
    : 0;

  const participationType = offer.participationType || "email";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="space-y-4">
              <div className="text-4xl">{offer.image || "🎯"}</div>
              <h2 className="text-2xl font-bold text-white">Join Offer</h2>
              <p className="text-lg text-gray-300">{offer.name}</p>
              <Badge className="bg-green-500/20 text-green-400 text-lg px-4 py-2">
                Complete to unlock rewards
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Card */}
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
                      offer.maxParticipants
                        ? ((offer.maxParticipants - remaining) / offer.maxParticipants) * 100
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
            {/* Input Field */}
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

            {/* Steps Card */}
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
                    Enter your {participationType === "id" ? "ID" : "Email"}
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

            {/* Buttons */}
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
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
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

export default OfferParticipationModal;
