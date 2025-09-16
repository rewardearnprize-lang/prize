// src/components/ParticipationModal.tsx
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
import { Mail, ExternalLink, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
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
  } | null;
  onParticipate: (email: string) => void;
}

const ParticipationModal = ({
  isOpen,
  onClose,
  prize,
  onParticipate,
}: ParticipationModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinedCount, setJoinedCount] = useState(0);
  const { toast } = useToast();

  // 🔹 حساب عدد المشاركين المتحققين (verified = true)
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
    }
  }, [isOpen, prize]);

  // 🔹 تسجيل المشاركة
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !prize) {
      toast({
        title: "Error",
        description: "Please enter your email.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(firestore, "participants"), {
        email,
        prize: prize.name,
        prizeId: prize.id,
        status: "pending",
        joinDate: new Date().toISOString(),
        verified: false, // مش متأكد لسه
      });

      // ✅ سيب التحويل لـ Index.tsx عن طريق onParticipate
      onParticipate(email);

      setEmail("");
      onClose();

      toast({
        title: "Participation Registered 🎉",
        description:
          "Check your email in the verification page to confirm participation.",
      });
    } catch (error) {
      console.error("Error adding participation:", error);
      toast({
        title: "Error",
        description:
          "There was an error registering your participation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!prize) return null;

  const remaining = prize.maxParticipants
    ? prize.maxParticipants - joinedCount
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                    width: `${
                      prize.maxParticipants
                        ? ((prize.maxParticipants - remaining) /
                            prize.maxParticipants) *
                          100
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
            <div>
              <label className="block text-white font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                required
              />
            </div>

            <div className="flex space-x-3">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                disabled={isSubmitting}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isSubmitting ? "Processing..." : "Participate Now"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/30 text-white hover:bg-white/10"
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
