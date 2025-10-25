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
import { Mail, ExternalLink, Clock, IdCard, Users, Gift, Sparkles, Target } from "lucide-react";
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
  prizeValue,
  maxParticipants,
  offerImage,
}: OfferParticipationModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinedCount, setJoinedCount] = useState(0);
  const { toast } = useToast();

  // إغلاق النافذة بشكل آمن
  const handleCloseModal = () => {
    if (!isSubmitting) {
      setInputValue("");
      onClose();
    }
  };

  // عند فتح النافذة، نعيد تعيين الحالة
  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setIsSubmitting(false);
      if (offerId) {
        fetchJoinedCount();
      }
    }
  }, [isOpen, offerId]);

  const fetchJoinedCount = async () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      toast({
        title: "Error",
        description: `Please enter your ${participationType === "email" ? "Email" : "ID"}.`,
        variant: "destructive",
      });
      return;
    }

    if (!offerLink) {
      toast({
        title: "Error",
        description: "This offer has no valid link",
        variant: "destructive",
      });
      return;
    }

    if (maxParticipants && joinedCount >= maxParticipants) {
      toast({
        title: "This offer is full",
        description: "All participation slots have been filled.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const uniqueKey = "key_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

      await setDoc(doc(firestore, "participants", uniqueKey), {
        [participationType]: inputValue.trim(),
        offerId,
        offerTitle,
        offerurl: offerLink.startsWith('http') ? offerLink : 'https://' + offerLink,
        status: "pending",
        timestamp: serverTimestamp(),
        verified: false,
        key: uniqueKey,
        joinDate: new Date().toISOString(),
        prizeValue: prizeValue || null,
      });

      // فتح الرابط في نافذة جديدة
      const finalUrl = offerLink.startsWith('http') ? offerLink : 'https://' + offerLink;
      let offerUrl = `${finalUrl}${finalUrl.includes('?') ? '&' : '?'}aff_sub4=${uniqueKey}&aff_sub5=${inputValue}`;
      
      window.open(offerUrl, '_blank');

      toast({
        title: "Success!",
        description: "Participation registered successfully.",
      });

      handleCloseModal();
      
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const remaining = maxParticipants ? maxParticipants - joinedCount : 0;
  const hasValidImage = offerImage && offerImage.startsWith('http');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleCloseModal();
    }}>
      <DialogContent className="max-w-md bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-white/20 rounded-2xl overflow-hidden p-0">
        
        {/* الصورة */}
        <div className="w-full h-40 relative overflow-hidden">
          {hasValidImage ? (
            <img 
              src={offerImage} 
              alt={offerTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Target className="w-12 h-12 text-white" />
            </div>
          )}
        </div>

        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="text-center text-white">
            {offerTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* معلومات الجائزة */}
          {prizeValue && (
            <Badge className="w-full bg-green-500 text-white justify-center py-2">
              <Gift className="w-4 h-4 mr-2" />
              Prize: {typeof prizeValue === 'number' ? `$${prizeValue}` : prizeValue}
            </Badge>
          )}

          {/* عدد المشاركين */}
          {maxParticipants && (
            <div className="flex justify-between text-sm text-white">
              <span>{joinedCount} joined</span>
              <span>{remaining} spots left</span>
            </div>
          )}

          {/* النموذج */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* حقل الإدخال */}
            <div>
              <label className="text-white text-sm block mb-2">
                {participationType === "id" ? "Enter Your ID" : "Enter Your Email"}
              </label>
              <Input
                type={participationType === "id" ? "text" : "email"}
                placeholder={participationType === "id" ? "Your ID..." : "email@example.com"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* الأزرار */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                {isSubmitting ? "Processing..." : "Participate"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="text-white border-white/30 hover:bg-white/10"
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
