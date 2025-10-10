import { useState, useEffect, useRef } from "react";
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
import { collection, getDocs, query, where, setDoc, doc, getDoc } from "firebase/firestore";
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

// 🔹 نظام إدارة المشاركات المنفصل
class ParticipationService {
  private static instance: ParticipationService;
  private isProcessing = false;
  private pendingSubmissions = new Set<string>();

  static getInstance(): ParticipationService {
    if (!ParticipationService.instance) {
      ParticipationService.instance = new ParticipationService();
    }
    return ParticipationService.instance;
  }

  // 🔹 توليد مفتاح فريد
  generateKey(): string {
    return `key_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  // 🔹 التحقق من عدم وجود عملية سابقة
  canSubmit(emailOrId: string, prizeId: string): boolean {
    const submissionId = `${emailOrId}_${prizeId}`;
    return !this.pendingSubmissions.has(submissionId) && !this.isProcessing;
  }

  // 🔹 بدء عملية الإرسال
  startSubmission(emailOrId: string, prizeId: string): string {
    const submissionId = `${emailOrId}_${prizeId}`;
    this.pendingSubmissions.add(submissionId);
    this.isProcessing = true;
    return submissionId;
  }

  // 🔹 إنهاء عملية الإرسال
  endSubmission(submissionId: string) {
    this.pendingSubmissions.delete(submissionId);
    this.isProcessing = false;
  }

  // 🔹 التحقق من حفظ البيانات في Firebase
  async verifySave(key: string): Promise<boolean> {
    try {
      const docRef = doc(firestore, "participants", key);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error("Verification error:", error);
      return false;
    }
  }
}

const participationService = ParticipationService.getInstance();

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
  const submissionRef = useRef<string | null>(null);

  // 🔹 لحساب عدد المشاركين الحاليين
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
      submissionRef.current = null;
    }
  }, [isOpen, prize]);

  // 🔹 دالة منفصلة ومضمونة للحفظ
  const saveParticipation = async (key: string, data: any): Promise<boolean> => {
    try {
      console.log("💾 Attempting to save with key:", key);
      
      // المحاولة الأولى
      await setDoc(doc(firestore, "participants", key), data);
      console.log("✅ First save attempt completed");

      // التحقق من الحفظ
      const isSaved = await participationService.verifySave(key);
      
      if (!isSaved) {
        // المحاولة الثانية
        console.log("🔄 First save failed, attempting second save...");
        await setDoc(doc(firestore, "participants", key), {
          ...data,
          retry: true,
          retryTime: new Date().toISOString()
        });
        
        const secondVerify = await participationService.verifySave(key);
        if (!secondVerify) {
          console.error("❌ Both save attempts failed");
          return false;
        }
      }

      console.log("🎉 Save verified successfully");
      return true;
    } catch (error) {
      console.error("❌ Save error:", error);
      return false;
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

    // 🔹 منع الإرسال المزدوج
    if (isSubmitting || !participationService.canSubmit(inputValue.trim(), prize.id)) {
      console.log("⏳ Submission already in progress, skipping...");
      return;
    }

    const submissionId = participationService.startSubmission(inputValue.trim(), prize.id);
    setIsSubmitting(true);
    submissionRef.current = submissionId;

    try {
      // 1️⃣ إنشاء مفتاح فريد
      const uniqueKey = participationService.generateKey();
      console.log("🔑 Generated Key:", uniqueKey);

      // 2️⃣ إعداد البيانات
      const participantData = {
        // الحقول الأساسية
        [prize.participationType || "email"]: inputValue.trim(),
        prize: prize.name,
        prizeId: prize.id,
        status: "pending",
        joinDate: new Date().toISOString(),
        verified: false,
        completed: false,
        
        // 🔹 تأكيد حفظ الـ key بعدة طرق
        key: uniqueKey,
        participantKey: uniqueKey,
        uniqueIdentifier: uniqueKey,
        documentId: uniqueKey,
        
        // معلومات إضافية
        timestamp: new Date().toISOString(),
        submissionTime: new Date().toLocaleString(),
        version: "2.0"
      };

      console.log("📤 Prepared data with key:", uniqueKey);

      // 3️⃣ حفظ البيانات مع التحقق
      const saveSuccess = await saveParticipation(uniqueKey, participantData);
      
      if (!saveSuccess) {
        throw new Error("Failed to save participation data after multiple attempts");
      }

      console.log("✅ FINAL SUCCESS - Key saved:", uniqueKey);

      // 4️⃣ فتح رابط العرض
      if (prize.offerUrl) {
        const offerUrlWithKey = prize.offerUrl.includes('kldool') 
          ? prize.offerUrl.replace('kldool', `kldool?sub1=${uniqueKey}`)
          : `${prize.offerUrl}${prize.offerUrl.includes("?") ? "&" : "?"}sub1=${uniqueKey}`;
        
        console.log("🔗 Opening URL:", offerUrlWithKey);
        window.open(offerUrlWithKey, "_blank", "noopener,noreferrer");
      }

      // 5️⃣ إخطار Parent component
      onParticipate(inputValue.trim());
      
      toast({
        title: "Successfully Registered 🎉",
        description: "Your participation has been recorded! Complete the offer to verify.",
      });

      // 6️⃣ تنظيف وإغلاق
      setTimeout(() => {
        setInputValue("");
        onClose();
      }, 1000);

    } catch (error) {
      console.error("❌ FINAL ERROR in submission:", error);
      
      toast({
        title: "Registration Failed",
        description: "Please try again. If problem persists, contact support.",
        variant: "destructive",
      });
    } finally {
      // 🔹 تنظيف الموارد
      if (submissionRef.current === submissionId) {
        participationService.endSubmission(submissionId);
        setIsSubmitting(false);
        submissionRef.current = null;
      }
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
                    Enter your {prize.participationType === "id" ? "ID" : "Email"}
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
                    Confirm your participation
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
                      4
                    </span>
                    Wait for verification
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
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
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
