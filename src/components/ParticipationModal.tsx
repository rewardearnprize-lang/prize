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
import { Mail, ExternalLink, Clock, IdCard, Loader2 } from "lucide-react";
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
  const { toast } = useToast();

  // 🔹 لحساب عدد المشاركين الحاليين
  const fetchJoinedCount = async () => {
    if (!prize) return;
    const q = query(
      collection(firestore, "participants"),
      where("prizeId", "==", prize.id),
      where("verified", "==", true)
    );
    const snap = await getDocs(q);
    setJoinedCount(snap.size);
  };

  useEffect(() => {
    if (isOpen && prize) {
      fetchJoinedCount();
      // إعادة تعيين الحالة عند فتح الـ modal
      setInputValue("");
      setIsSubmitting(false);
    }
  }, [isOpen, prize]);

  // ✅ دالة محسنة لتوليد مفتاح فريد
  const generateUniqueKey = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `key_${timestamp}_${random}`;
  };

  // ✅ عند ضغط "Participate Now"
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

    // 🔹 منع الإرسال المزدوج
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      // 1️⃣ إنشاء مفتاح فريد
      const uniqueKey = generateUniqueKey();
      console.log("🔑 Generated Key:", uniqueKey);

      // 2️⃣ إعداد البيانات بشكل كامل قبل الحفظ
      const participantData = {
        [prize.participationType || "email"]: inputValue.trim(),
        prize: prize.name,
        prizeId: prize.id,
        status: "pending",
        joinDate: new Date().toISOString(),
        verified: false,
        completed: false,
        key: uniqueKey,
        timestamp: new Date().toISOString(),
        // 🔹 إضافة حقول إضافية للتأكيد
        uniqueIdentifier: uniqueKey,
        submissionTime: new Date().toLocaleString()
      };

      console.log("📤 Saving participant data:", participantData);

      // 3️⃣ حفظ البيانات في Firestore
      await setDoc(doc(firestore, "participants", uniqueKey), participantData);
      
      console.log("✅ Participant added with key:", uniqueKey);

      // 4️⃣ فتح رابط العرض + المفتاح في sub1
      if (prize.offerUrl) {
        // 🔹 بناء الرابط بشكل صحيح
        let offerUrlWithKey;
        if (prize.offerUrl.includes('kldool')) {
          // إذا كان الرابط يحتوي على kldool، أضف sub1 بشكل صحيح
          offerUrlWithKey = prize.offerUrl.replace(
            'kldool', 
            `kldool?sub1=${uniqueKey}`
          );
        } else {
          // للروابط الأخرى
          offerUrlWithKey = `${prize.offerUrl}${
            prize.offerUrl.includes("?") ? "&" : "?"
          }sub1=${uniqueKey}`;
        }
        
        console.log("🔗 Opening offer link:", offerUrlWithKey);
        window.open(offerUrlWithKey, "_blank", "noopener,noreferrer");
      } else {
        console.warn("⚠️ لا يوجد offerUrl في هذا العرض");
      }

      // 5️⃣ إغلاق الديالوج وإشعار المستخدم
      onParticipate(inputValue.trim());
      
      toast({
        title: "Participation Registered 🎉",
        description: "You have been registered successfully! Complete the offer to verify.",
      });

      // 6️⃣ إعادة تعيين وإغلاق بعد نجاح العملية
      setTimeout(() => {
        setInputValue("");
        onClose();
      }, 1500);

    } catch (error) {
      console.error("❌ Error adding participation:", error);
      
      // 🔹 محاولة حفظ بديلة
      try {
        console.log("🔄 Attempting backup save...");
        const backupKey = `backup_${generateUniqueKey()}`;
        const backupData = {
          emailOrId: inputValue.trim(),
          prize: prize.name,
          prizeId: prize.id,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
          originalKey: uniqueKey
        };
        
        await setDoc(doc(firestore, "participation_errors", backupKey), backupData);
        console.log("📦 Backup save completed");
      } catch (backupError) {
        console.error("❌ Backup save also failed:", backupError);
      }

      toast({
        title: "Error",
        description: "There was an error registering your participation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setInputValue("");
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

          {/* 🔹 تغيير مهم: استخدام form حقيقي مع button type="submit" */}
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
                    Confirm your {prize.participationType === "id" ? "ID" : "Email"} again
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
                      4
                    </span>
                    Wait for participation confirmation
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              {/* 🔹 تغيير مهم: استخدام type="submit" */}
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                disabled={isSubmitting || !inputValue.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
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
