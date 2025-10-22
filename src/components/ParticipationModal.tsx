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
import { Mail, ExternalLink, Clock, IdCard, Users, Gift, Sparkles } from "lucide-react";
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
      <DialogContent className="max-w-md bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-white/20 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-0">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        
        <div className="relative z-10">
          {/* Image Section - Full Width like Main Page */}
          <div className="w-full h-40 relative overflow-hidden group">
            {imageUrl ? (
              <>
                <img 
                  src={imageUrl} 
                  alt={prize.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 flex items-center justify-center">
                          <div class="text-center text-white">
                            <div class="text-4xl mb-2 animate-bounce">🎁</div>
                            <div class="text-xl font-bold">${prize.name}</div>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
                {/* Overlay effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
              </>
            ) : (
              // Default card design like main page
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 relative overflow-hidden group">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                
                {/* Floating particles */}
                <div className="absolute inset-0">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + Math.random() * 2}s`
                      }}
                    ></div>
                  ))}
                </div>

                {/* Content */}
                <div className="text-center relative z-10 transform transition-all duration-500 group-hover:scale-110">
                  <div className="text-4xl mb-2 animate-bounce">🎁</div>
                  <div className="text-xl font-bold text-white">
                    {prize.name}
                  </div>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
            )}
          </div>

          <DialogHeader className="px-6 pt-4 pb-2">
            <DialogTitle className="text-center">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Enter the Draw
                </h2>
                
                {/* Prize Value Badge */}
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                  <Gift className="w-3 h-3 mr-1" />
                  Prize: ${prize.prizeValue || prize.value}
                </Badge>

                {/* Participants Counter */}
                {prize.maxParticipants && (
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center text-blue-300">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{joinedCount} joined</span>
                    </div>
                    <div className="flex items-center text-green-300">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{remaining} spots left</span>
                    </div>
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="space-y-5 relative z-10 px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-bottom-5 duration-500 delay-200">
            {/* Input Field with Enhanced Design */}
            <div className="space-y-2">
              <label className="block text-white font-medium text-sm flex items-center">
                {prize.participationType === "id" ? (
                  <IdCard className="w-4 h-4 mr-2" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
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
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 rounded-xl text-sm transition-all duration-300 focus:bg-white/15 focus:border-white/40 focus:scale-[1.02] group-hover:border-white/30"
                  required
                />
                {/* Input glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/10 to-pink-500/0 blur-sm group-hover:from-blue-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
              </div>
            </div>

            {/* Enhanced Steps Card */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm rounded-xl overflow-hidden group hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold text-sm mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 text-yellow-400 mr-2 animate-pulse" />
                  Quick Steps to Win
                </h4>
                <div className="space-y-3">
                  {[
                    { step: 1, text: `Enter your ${prize.participationType === "id" ? "ID" : "email"}` },
                    { step: 2, text: "Complete the required offer" },
                    { step: 3, text: "Wait for the draw results" }
                  ].map((item, index) => (
                    <div 
                      key={item.step}
                      className="flex items-center text-gray-200 group-hover:text-white transition-colors duration-300"
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 shadow-lg animate-bounce"
                           style={{ animationDelay: `${index * 0.2}s` }}>
                        {item.step}
                      </div>
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Buttons with Animations */}
            <div className="flex space-x-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold h-12 rounded-xl transition-all duration-500 transform hover:scale-[1.03] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {isSubmitting ? (
                  <div className="flex items-center relative z-10">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center relative z-10">
                    <ExternalLink className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    Participate Now
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/30 text-white hover:bg-white/10 hover:text-white h-12 rounded-xl transition-all duration-500 transform hover:scale-[1.03] hover:shadow-xl min-w-[90px] relative overflow-hidden group"
              >
                {/* Shine effect for cancel button */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10">Cancel</span>
              </Button>
            </div>
          </form>

          {/* Security Badge */}
          <div className="text-center">
            <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs py-1 px-3 animate-pulse">
              🔒 Secure & Encrypted
            </Badge>
          </div>
        </div>

        {/* Custom Animations */}
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(100%) rotate(45deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(180deg); }
          }
          .animate-shimmer {
            animation: shimmer 3s ease-in-out infinite;
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipationModal;
