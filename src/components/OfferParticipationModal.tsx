// src/components/OfferParticipationModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { firestore } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface OfferParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerId: string;
  offerTitle: string;
  offerLink: string;
}

const OfferParticipationModal = ({
  isOpen,
  onClose,
  offerId,
  offerTitle,
  offerLink
}: OfferParticipationModalProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  console.log("Offer link received:", offerLink);

  const normalizeUrl = (url: string) => {
    if (!/^https?:\/\//i.test(url)) {
      return "https://" + url;
    }
    return url;
  };

  const handleSubmit = async () => {
    if (!email) {
      return toast({ title: "ادخل البريد الإلكتروني", variant: "destructive" });
    }

    if (!offerLink) {
      return toast({ title: "لا يوجد رابط متاح لهذا العرض", variant: "destructive" });
    }

    const finalLink = normalizeUrl(offerLink);

    window.open(finalLink, "_blank");

    setLoading(true);
    try {
      const participantRef = doc(firestore, "participants", email + "_" + offerId);
      await setDoc(participantRef, {
        email,
        offerId,
        offerTitle,
        offerurl: finalLink,
        status: "completed",
        timestamp: serverTimestamp(),
      });

      toast({ title: "تم التسجيل بنجاح", variant: "default" });

      onClose();
      setEmail("");
    } catch (error) {
      console.error(error);
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        setEmail("");
      }}
    >
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle>شارك في العرض: {offerTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            type="email"
            placeholder="ادخل بريدك الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white"
          />
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            {loading ? "جارٍ الحفظ..." : "إرسال"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferParticipationModal;
