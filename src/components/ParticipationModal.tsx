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
import { Mail, ExternalLink, Clock, IdCard, Users, Gift } from "lucide-react";
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
    imageUrl?: string;
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
    } catch (err) {
      console.error("Error fetching joined count:", err);
    }
  };

  useEffect(() => {
    if (isOpen && prize) {
      fetchJoinedCount();
      setInputValue(""); // Reset input when modal opens
    }
  }, [isOpen, prize]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue || !prize) {
      toast({
        title: "Error",
        description: `Please enter your ${prize?.participationType || "email"}.`,
        variant: "destructive",
      });
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const uniqueKey =
        "key_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

      await setDoc(doc(firestore, "participants", uniqueKey), {
        [prize?.participationType || "email"]: inputValue,
        prize: prize.name,
        prizeId: prize.id,
        status: "pending",
        joinDate: new Date().toISOString(),
        verified: false,
        key: uniqueKey,
      });

      console.log("✅ Participant added with key:", uniqueKey);

      if (prize.offerUrl) {
        let offerUrlWithParams = `${prize.offerUrl}${
          prize.offerUrl.includes("?") ? "&" : "?"
        }aff_sub4=${encodeURIComponent(uniqueKey)}&aff_sub5=${encodeURIComponent(inputValue)}`;

        const ua = navigator.userAgent || (navigator as any).vendor || (window as any).opera;
        const isMobile = /iphone|ipod|ipad|android|blackberry|mobile|windows phone|opera mini/i.test(ua);

        if (isMobile) {
          offerUrlWithParams = offerUrlWithParams.replace("/cl/i/", "/cl/v/");
        }

        const newTab = window.open("about:blank", "_blank");

        if (newTab) {
          setTimeout(() => {
            try {
              newTab.location.href = offerUrlWithParams;
            } catch (err) {
              console.warn("Could not set newTab.location.href:", err);
              window.location.href = offerUrlWithParams;
            }
          }, 100);
        } else {
          window.location.href = offerUrlWithParams;
        }
      } else {
        console.warn("⚠️ No offerUrl in this prize");
      }

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

  if (!prize) return null;

  const remaining = prize.maxParticipants
    ? prize.maxParticipants - joinedCount
    : 0;

  const imageUrl = prize.imageUrl || prize.image;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-white/20 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-0">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        
        <DialogHeader className="relative z-10 pt-6 px-6 pb-4">
          <DialogTitle className="text-center">
            <div className="space-y-4">
              {/* Enhanced Image Display - Larger Size */}
              {imageUrl ? (
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white/30 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:border-white/50">
                      <img 
                        src={imageUrl} 
                        alt={prize.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center rounded-xl">
                                <Gift className="w-8 h-8 text-white" />
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    {/* Floating particles around image */}
                    <div className="absolute -inset-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"
                          style={{
                            left: `${15 + i * 35}%`,
                            top: `${15 + i * 35}%`,
                            animationDelay: `${i * 0.3}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    {/* Animated rings */}
                    <div className="absolute inset-0 rounded-xl border-2 border-purple-400/30 animate-ping"></div>
                  </div>
                </div>
              )}
              
              {/* Prize Info with Animations */}
              <div className="space-y-3 animate-in slide-in-from-top-5 duration-500">
                <h2 className="text-xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Enter the Draw
                </h2>
                <p className="text-base text-gray-200 font-medium leading-tight">{prize.name}</p>
                
                {/* Prize Value Badge */}
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
                  <Gift className="w-3 h-3 mr-1" />
                  Prize: ${prize.prizeValue || prize.value}
                </Badge>

                {/* Participants Counter */}
                {prize.maxParticipants && (
                  <div className="flex items-center justify-center space-x-3 text-xs">
                    <div className="flex items-center text-blue-300">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{joinedCount} joined</span>
                    </div>
                    <div className="flex items-center text-green-300">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{remaining} left</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 relative z-10 px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-bottom-5 duration-500 delay-200">
            {/* Input Field with Enhanced Design */}
            <div className="space-y-2">
              <label className="block text-white font-medium text-sm flex items-center">
                {prize.participationType === "id" ? (
                  <IdCard className="w-3 h-3 mr-2" />
                ) : (
                  <Mail className="w-3 h-3 mr-2" />
                )}
                {prize.participationType === "id" ? "Enter Your ID" : "Enter Your Email"}
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative group">
                <Input
                  type={prize.participationType === "id" ? "text" : "email"}
                  placeholder={
                    prize.participationType === "id"
                      ? "Your unique ID..."
                      : "your.email@example.com"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-10 rounded-lg text-sm transition-all duration-300 focus:bg-white/15 focus:border-white/40 focus:scale-[1.02] group-hover:border-white/30"
                  required
                />
                {/* Input glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-purple-500/10 to-pink-500/0 blur-sm group-hover:from-blue-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
              </div>
            </div>

            {/* Enhanced Steps Card */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-lg overflow-hidden group hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-3">
                <h4 className="text-white font-semibold text-sm mb-3 flex items-center">
                  <span className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                    ⚡
                  </span>
                  Quick Steps
                </h4>
                <div className="space-y-2">
                  {[
                    { step: 1, text: `Enter your ${prize.participationType === "id" ? "ID" : "email"}` },
                    { step: 2, text: "Complete the offer" },
                    { step: 3, text: "Wait for results" }
                  ].map((item, index) => (
                    <div 
                      key={item.step}
                      className="flex items-center text-gray-200 text-xs group-hover:text-white transition-colors duration-300"
                    >
                      <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 shadow-lg">
                        {item.step}
                      </div>
                      <span className="leading-tight">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Buttons */}
            <div className="flex space-x-2 pt-1">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold h-10 rounded-lg text-sm transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <ExternalLink className="w-3 h-3 mr-1.5 transition-transform duration-300 group-hover:scale-110" />
                    Participate Now
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-400 text-gray-700 bg-white/90 hover:bg-white hover:text-gray-900 h-10 rounded-lg text-sm transition-all duration-300 transform hover:scale-[1.02] min-w-[80px]"
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Security Badge */}
          <div className="text-center">
            <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs py-1 px-2">
              🔒 Secure
            </Badge>
          </div>
        </div>

        {/* Custom Animations */}
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(100%) rotate(45deg); }
          }
          .animate-shimmer {
            animation: shimmer 3s ease-in-out infinite;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipationModal;
