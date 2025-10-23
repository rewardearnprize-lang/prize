import { useEffect, useState } from "react";
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

export default function OfferParticipationModal({
  isOpen,
  onClose,
  offerId,
  offerTitle,
  offerLink,
  participationType,
  prizeValue,
  maxParticipants,
}: {
  isOpen: boolean;
  onClose: () => void;
  offerId: string;
  offerTitle: string;
  offerLink: string;
  participationType: "email" | "id";
  prizeValue: number;
  maxParticipants: number;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setError("");
    }
  }, [isOpen]);

  const handleParticipate = async () => {
    if (!inputValue.trim()) {
      setError(`Please enter your ${participationType === "email" ? "email" : "ID"} before proceeding.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const affSubKey = `key_${Math.random().toString(36).substring(2, 15)}`;
      const userValue = encodeURIComponent(inputValue.trim());
      const targetUrl = `${offerLink}?aff_sub4=${affSubKey}&aff_sub5=${userValue}`;

      console.log("🔗 Redirecting to:", targetUrl);
      window.open(targetUrl, "_blank");
      onClose();
    } catch (e) {
      console.error("Error during participation:", e);
      setError("An error occurred while processing your participation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔧 التعديل هنا فقط:
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose(); // ✅ يغلق المودال عند الضغط خارج الإطار أو عند الإلغاء
      }}
    >
      <DialogContent className="max-w-lg bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-white/20 m-6">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="space-y-4">
              <div className="text-4xl">{offerTitle}</div>
              <Card className="bg-white/10 border border-white/10 text-white rounded-2xl shadow-lg">
                <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-300" /> Max Participants:
                    </span>
                    <Badge variant="secondary">{maxParticipants}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      🎁 Prize Value:
                    </span>
                    <Badge variant="secondary">${prizeValue}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <Input
              type={participationType === "email" ? "email" : "text"}
              placeholder={participationType === "email" ? "Enter your email" : "Enter your ID"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl h-12 pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
              {participationType === "email" ? <Mail size={20} /> : <IdCard size={20} />}
            </div>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose} // 🔧 هذا السطر فقط يغلق المودال مباشرة
              disabled={isSubmitting}
              className="border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white h-12 rounded-xl transition-all duration-500 transform hover:scale-[1.03] hover:shadow-xl min-w-[90px] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">Cancel</span>
            </Button>

            <Button
              type="button"
              onClick={handleParticipate}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white h-12 rounded-xl px-6 font-semibold shadow-lg hover:shadow-purple-500/30 transition-all duration-500 transform hover:scale-[1.05]"
            >
              {isSubmitting ? "Processing..." : (
                <>
                  Participate <ExternalLink className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
