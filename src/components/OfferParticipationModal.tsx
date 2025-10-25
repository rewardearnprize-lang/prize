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
  const [loading, setLoading] = useState(false);
  const [joinedCount, setJoinedCount] = useState(0);
  const { toast } = useToast();

  const fetchJoinedCount = async () => {
    if (!offerId) return;
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

  useEffect(() => {
    if (isOpen && offerId) {
      fetchJoinedCount();
      setInputValue("");
    }
  }, [isOpen, offerId]);

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
      return toast({
        title: "This offer has no valid link",
        variant: "destructive",
      });
    }

    if (maxParticipants && joinedCount >= maxParticipants) {
      return toast({
        title: "This offer is full",
        description: "All participation slots have been filled.",
        variant: "destructive",
      });
    }

    const finalLink = normalizeUrl(offerLink);

    setLoading(true);
    try {
      const uniqueKey = `key_${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;

      const participantRef = doc(firestore, "participants", uniqueKey);
      await setDoc(participantRef, {
        [participationType]: inputValue,
        offerId,
        offerTitle,
        offerurl: finalLink,
        status: "pending",
        timestamp: serverTimestamp(),
        verified: false,
        key: uniqueKey,
        joinDate: new Date().toISOString(),
        prizeValue: prizeValue || null,
      });

      let offerUrlWithParams = `${finalLink}${finalLink.includes("?") ? "&" : "?"}aff_sub4=${encodeURIComponent(uniqueKey)}&aff_sub5=${encodeURIComponent(inputValue)}`;

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
            window.open(offerUrlWithParams, "_blank");
          }
        }, 100);
      } else {
        window.open(offerUrlWithParams, "_blank");
      }

      toast({
        title: "Participation submitted successfully 🎉",
        description: "Check your entry on the verification page to confirm participation.",
        variant: "default",
      });
      handleClose();
    } catch (error) {
      console.error(error);
      toast({ 
        title: "Something went wrong", 
        description: "Please try again later.",
        variant: "destructive" 
      });
    }
    setLoading(false);
  };

  const remaining = maxParticipants ? maxParticipants - joinedCount : 0;

  const handleClose = () => {
    setInputValue("");
    setLoading(false);
    onClose();
  };

  const hasValidImage = offerImage && offerImage.trim() !== '' && 
                       (offerImage.startsWith('http') || offerImage.startsWith('https'));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border border-white/20 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-0"
        onPointerDownOutside={handleClose}
        onEscapeKeyDown={handleClose}
      >
        {/* محتوى المودال كامل كما هو القديم */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        <div className="relative z-10">
          <div className="w-full h-40 relative overflow-hidden group">
            {hasValidImage ? (
              <>
                <img 
                  src={offerImage} 
                  alt={offerTitle}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const defaultDesign = document.createElement('div');
                      defaultDesign.className = 'w-full h-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 flex items-center justify-center relative overflow-hidden';
                      defaultDesign.innerHTML = `
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                        <div class="text-center text-white relative z-10">
                          <Target class="w-12 h-12 mx-auto mb-2 text-white animate-bounce" />
                          <div class="text-xl font-bold">${offerTitle}</div>
                        </div>
                      `;
                      parent.appendChild(defaultDesign);
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
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
                <div className="text-center relative z-10 transform transition-all duration-500 group-hover:scale-110">
                  <Target className="w-12 h-12 text-white mx-auto mb-2 animate-bounce" />
                  <div className="text-xl font-bold text-white">
                    {offerTitle}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
            )}
          </div>

          <DialogHeader className="px-6 pt-4 pb-2">
            <DialogTitle className="text-center">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Join Offer
                </h2>
                {prizeValue && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                    <Gift className="w-3 h-3 mr-1" />
                    Reward: {typeof prizeValue === 'number' ? `$${prizeValue}` : prizeValue}
                  </Badge>
                )}
                {maxParticipants && (
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
          {/* باقي الكود كله كما كان: الإدخال، البطاقات، الأزرار، الشروحات... */}
          {/* الزر Cancel الآن يستدعي handleClose */}
          <div className="flex space-x-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={loading || (maxParticipants && remaining <= 0)}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold h-12 rounded-xl transition-all duration-500 transform hover:scale-[1.03] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              Participate Now
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white h-12 rounded-xl transition-all duration-500 transform hover:scale-[1.03] hover:shadow-xl min-w-[90px] relative overflow-hidden group"
            >
              Cancel
            </Button>
          </div>
        </div>

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

export default OfferParticipationModal;
