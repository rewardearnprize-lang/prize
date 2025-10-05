import { useState, useEffect, useCallback, useRef } from "react";
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
import { collection, setDoc, doc, getDocs, query, where, getDoc } from "firebase/firestore";
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
  
  // 🔹 استخدام useRef لتخزين البيانات بدون إعادة render
  const submissionRef = useRef({
    isSubmitting: false,
    currentPrize: null as typeof prize | null,
    currentInput: ""
  });

  // 🔹 دالة محسنة لجلب عدد المشاركين
  const fetchJoinedCount = useCallback(async () => {
    if (!prize?.id) return;
    
    try {
      const q = query(
        collection(firestore, "participants"),
        where("prizeId", "==", prize.id),
        where("verified", "==", true)
      );
      const snap = await getDocs(q);
      setJoinedCount(snap.size);
    } catch (error) {
      console.error("Error fetching joined count:", error);
    }
  }, [prize?.id]);

  useEffect(() => {
    if (isOpen && prize) {
      fetchJoinedCount();
      setInputValue("");
      setIsSubmitting(false);
      // 🔹 تحديث الـ ref مع البيانات الحالية
      submissionRef.current = {
        isSubmitting: false,
        currentPrize: prize,
        currentInput: ""
      };
    }
  }, [isOpen, prize, fetchJoinedCount]);

  // 🔹 دالة محسنة لتوليد مفتاح فريد
  const generateUniqueKey = useCallback(() => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `key_${timestamp}_${random}`;
  }, []);

  // 🔹 دالة للتحقق من الحفظ
  const verifyDocumentSave = async (key: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // انتظار بسيط
      const docRef = doc(firestore, "participants", key);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("✅ Document verification SUCCESS:", { key, data });
        return true;
      } else {
        console.log("❌ Document verification FAILED: Document not found", key);
        return false;
      }
    } catch (error) {
      console.error("❌ Document verification ERROR:", error);
      return false;
    }
  };

  // 🔹 دالة محسنة للإرسال - معزولة تماماً
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔹 استخدام الـ ref للتحقق من الحالة بدلاً من state
    if (submissionRef.current.isSubmitting) {
      console.log("⏳ Submission already in progress, skipping...");
      return;
    }

    const currentInput = inputValue.trim();
    const currentPrize = prize;

    if (!currentInput || !currentPrize) {
      toast({
        title: "Error",
        description: `Please enter your ${currentPrize?.participationType || "email"}.`,
        variant: "destructive",
      });
      return;
    }

    // 🔹 تحديث الـ ref فوراً
    submissionRef.current = {
      isSubmitting: true,
      currentPrize,
      currentInput
    };

    setIsSubmitting(true);

    try {
      // 🔹 توليد المفتاح الفريد
      const uniqueKey = generateUniqueKey();
      console.log("🔑 Generated Key:", uniqueKey);
      
      // 🔹 إعداد البيانات بشكل كامل
      const participantData = {
        participantKey: uniqueKey,
        uniqueIdentifier: uniqueKey, // 🔹 حقل إضافي للتأكيد
        [currentPrize.participationType || "email"]: currentInput,
        prize: currentPrize.name,
        prizeId: currentPrize.id,
        status: "pending",
        joinDate: new Date().toISOString(),
        verified: false,
        completed: false,
        timestamp: new Date().toISOString(),
        // 🔹 إضافة بيانات إضافية للتتبع
        submissionTime: new Date().toLocaleString(),
        attempt: "primary"
      };

      console.log("📤 Saving participant data:", participantData);

      // 🔹 الحفظ في Firestore
      const docRef = doc(firestore, "participants", uniqueKey);
      await setDoc(docRef, participantData);
      
      console.log("✅ Firestore setDoc completed");

      // 🔹 التحقق من الحفظ
      const isVerified = await verifyDocumentSave(uniqueKey);
      
      if (!isVerified) {
        throw new Error("Document verification failed");
      }

      console.log("🎉 Participation registered successfully with key:", uniqueKey);

      // 🔹 استدعاء callback المشاركة
      onParticipate(currentInput);

      // 🔹 إعادة تعيين الحقول
      setInputValue("");
      
      // 🔹 إغلاق الـ modal بعد نجاح العملية
      onClose();

      toast({
        title: "Participation Registered 🎉",
        description: "Check your entry on the verification page to confirm participation.",
      });

    } catch (error) {
      console.error("❌ Error in submission process:", error);
      
      // 🔹 محاولة حفظ بديلة في حالة الخطأ
      try {
        console.log("🔄 Attempting backup save...");
        const backupKey = `backup_${generateUniqueKey()}`;
        const backupData = {
          ...participantData,
          participantKey: backupKey,
          uniqueIdentifier: backupKey,
          attempt: "backup",
          error: error instanceof Error ? error.message : "Unknown error",
          originalKey: uniqueKey
        };
        
        const backupDocRef = doc(firestore, "participants_backup", backupKey);
        await setDoc(backupDocRef, backupData);
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
      // 🔹 إعادة تعيين الحالة في النهاية
      submissionRef.current.isSubmitting = false;
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setInputValue("");
    setIsSubmitting(false);
    submissionRef.current.isSubmitting = false;
    onClose();
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
                onChange={(e) => {
                  setInputValue(e.target.value);
                  submissionRef.current.currentInput = e.target.value;
                }}
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
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                disabled={isSubmitting || !inputValue.trim()}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isSubmitting ? "Processing..." : "Participate Now"}
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
