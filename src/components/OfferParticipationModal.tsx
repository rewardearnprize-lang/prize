الموقع مبنى على فكره دخول سحب 


import { useState } from "react";
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
import { Mail, ExternalLink, Clock } from "lucide-react";
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

      toast({
        title: "Participation submitted successfully 🎉",
        variant: "default",
      });
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
      <DialogContent className="max-w-lg bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="space-y-4">
              <div className="text-4xl">🎯</div>
              <h2 className="text-2xl font-bold text-white">Join Offer</h2>
              <p className="text-lg text-gray-300">{offerTitle}</p>
              <Badge className="bg-green-500/20 text-green-400 text-lg px-4 py-2">
                Complete to unlock rewards
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">


          <div>
            <label className="block text-white font-medium mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              {participationType === "email" ? "Email" : "ID"}
            </label>
            <Input
              type={participationType === "email" ? "email" : "text"}
              placeholder={
                participationType === "email"
                  ? "Enter your Email"
                  : "Enter your ID"
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
                  Confirm your{" "}
                  {participationType === "email" ? "Email" : "ID"} again
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
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Participate Now"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/30 text-black hover:bg-white/10"
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
