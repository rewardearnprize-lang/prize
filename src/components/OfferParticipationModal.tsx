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
  participationType: "email" | "id";
}

const OfferParticipationModal = ({
  isOpen,
  onClose,
  offerId,
  offerTitle,
  offerLink,
  participationType,
}: OfferParticipationModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const normalizeUrl = (url: string) => {
    if (!/^https?:\/\//i.test(url)) {
      return "https://" + url;
    }
    return url;
  };

  const handleSubmit = async () => {
    if (!inputValue) {
      return toast({
        title: `Please enter your ${participationType === "email" ? "Email" : "ID"}`,
        variant: "destructive",
      });
    }

    if (!offerLink) {
      return toast({ title: "This offer has no valid link", variant: "destructive" });
    }

    const finalLink = normalizeUrl(offerLink);
    window.open(finalLink, "_blank");

    setLoading(true);
    try {
      const participantRef = doc(
        firestore,
        "participants",
        inputValue + "_" + offerId
      );
      await setDoc(participantRef, {
        [participationType]: inputValue,
        offerId,
        offerTitle,
        offerurl: finalLink,
        status: "completed",
        timestamp: serverTimestamp(),
      });

      toast({ title: "Participation submitted successfully 🎉", variant: "default" });
      onClose();
      setInputValue("");
    } catch (error) {
      console.error(error);
      toast({ title: "Something went wrong", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        setInputValue("");
      }}
    >
      <DialogContent className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 shadow-2xl rounded-2xl text-white transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Join Offer: {offerTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <Input
            type={participationType === "email" ? "email" : "text"}
            placeholder={participationType === "email" ? "Enter your Email" : "Enter your ID"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 rounded-lg transition-all"
          />

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:opacity-90 transition-all transform hover:scale-105"
          >
            {loading ? "Saving..." : "Submit"}
          </Button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4 animate-pulse">
          Complete the step and wait for the results 
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default OfferParticipationModal;
