// src/pages/Index.tsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Gift, Users, Star, Clock, Target, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import OffersSection from "@/components/OffersSection";
import SocialMediaSection from "@/components/SocialMediaSection";
import SocialMediaModal from "@/components/SocialMediaModal";
import WinnersList from "@/components/WinnersList";
import ParticipationModal from "@/components/ParticipationModal";
import ParticipationSuccessModal from "@/components/ParticipationSuccessModal";
import TransparencyModal from "@/components/TransparencyModal";
import UserParticipationStatus from "@/components/UserParticipationStatus";
import Footer from "@/components/Footer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDraws } from "@/store/slices/drawsSlice";
import type { Draw } from "@/store/slices/drawsSlice";
import { firestore } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  collection,
  onSnapshot,
} from "firebase/firestore";

// ==========================
// توليد UID لكل مستخدم
// ==========================
function generateUID() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

const Index = () => {
  const [selectedPrize, setSelectedPrize] = useState<Draw | null>(null);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showParticipationModal, setShowParticipationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTransparencyModal, setShowTransparencyModal] = useState(false);
  const [participantEmail, setParticipantEmail] = useState("");

  const [stats, setStats] = useState({
    participants: 0,
    winners: 0,
    prizeValue: 0,
    continuous: "24/7",
  });

  const [participantsCounts, setParticipantsCounts] = useState<Record<string, number>>({});
  const [totalParticipants, setTotalParticipants] = useState(0); 

  const { t, changeLanguage } = useTranslation();
  const { toast } = useToast();

  const dispatch = useAppDispatch();
  const { draws, loading } = useAppSelector((state) => state.draws);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const success = params.get("success");
  const prizeId = params.get("prizeId");
  const prizeName = params.get("prizeName");
  const email = params.get("email");
  const uidParam = params.get("uid"); // من redirect URL

  useEffect(() => {
    dispatch(fetchDraws());
  }, [dispatch]);

  // siteStats snapshot
  useEffect(() => {
    const statsRef = doc(firestore, "siteStats", "main");
    const unsub = onSnapshot(statsRef, (snap) => {
      if (snap.exists()) setStats(snap.data() as any);
    });
    return () => unsub();
  }, []);

  // participants live snapshot
  useEffect(() => {
    const participantsCol = collection(firestore, "participants");
    const unsub = onSnapshot(
      participantsCol,
      (snapshot) => {
        const counts: Record<string, number> = {};
        let total = 0;
        snapshot.docs.forEach((d) => {
          const data = d.data() as any;
          if (data.verified === true) {
            const pid = data.offerId || data.prizeId || "__no_prize__";
            counts[pid] = (counts[pid] || 0) + 1;
            total++;
          }
        });
        setParticipantsCounts(counts);
        setTotalParticipants(total); 
      },
      (err) => console.error("participants onSnapshot error:", err)
    );
    return () => unsub();
  }, []);

  // ==========================
  // معالجة نجاح المشاركة
  // ==========================
  useEffect(() => {
    const handleParticipationSuccess = async () => {
      if (success === "true" && prizeId) {
        const finalEmail = email || localStorage.getItem("currentUserEmail") || "";
        let uid = uidParam || localStorage.getItem("currentUserUID");

        // توليد UID جديد إذا لم يكن موجود
        if (!uid) {
          uid = generateUID();
          localStorage.setItem("currentUserUID", uid);
        }

        localStorage.setItem("currentUserEmail", finalEmail);

        if (finalEmail && uid) {
          try {
            const prizeRef = doc(firestore, "draws", prizeId);
            const prizeSnap = await getDoc(prizeRef);

            if (prizeSnap.exists()) {
              const prizeData = prizeSnap.data() as Draw; 
              const participants: string[] = prizeData?.participants || [];

              if (!participants.includes(uid)) {
                await updateDoc(prizeRef, {
                  participants: arrayUnion(uid),
                });
              }

              const participantRef = doc(firestore, "participants", uid);
              await setDoc(
                participantRef,
                {
                  email: finalEmail,
                  prize: prizeName || "",
                  prizeId: prizeId, 
                  offerId: prizeData.offerId || prizeId, 
                  verified: true, 
                  status: "completed",
                  timestamp: serverTimestamp(),
                },
                { merge: true }
              );
            }
          } catch (error) {
            console.error("❌ Firebase Error:", error);
          }
        }

        setParticipantEmail(finalEmail);
        setShowSuccessModal(true);

        setTimeout(() => {
          params.delete("success");
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState({}, "", newUrl);
        }, 500);
      }
    };

    handleParticipationSuccess();
  }, [success, prizeId, prizeName, email, uidParam]);

  // ==========================
  // اختيار السحب
  // ==========================
  const handlePrizeClick = (draw: Draw) => {
    const max = draw.maxParticipants || 0;
    const liveCount = participantsCounts[draw.offerId || draw.id];
    const participantsCount = typeof liveCount === "number" ? liveCount : 0;

    if (max > 0 && participantsCount >= max) {
      toast({
        title: "السحب مكتمل",
        description: "لقد اكتمل العدد المطلوب لهذا السحب",
        variant: "destructive",
      });
      return;
    }
    setSelectedPrize({ ...draw, prizeValue: Number(draw.prizeValue) || 0 });
    setShowParticipationModal(true);
  };

  // ==========================
  // المشاركة وإعادة التوجيه للعرض
  // ==========================
  const handleParticipation = (email: string) => {
  if (selectedPrize) {
    localStorage.setItem("currentUserEmail", email);

    
  }
};

  const handleSuccessModalContinue = () => {
    setShowSuccessModal(false);
    setTimeout(() => setShowSocialModal(true), 500);
  };

  // ==========================
  // بقية الكود الأصلي (UI، Hero، Cards، Modals) بدون تغيير
  // ==========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center text-white">
            <div className="inline-flex items-center bg-yellow-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-yellow-300 font-semibold">{t('site.subtitle')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {t('site.title')}
            </h1>
            {/* ... بقية Hero UI ... */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <UserParticipationStatus />

        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">{t("prizes.availableNow")}</h2>
            <p className="text-xl text-gray-300">{t("prizes.chooseToParticipate")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {loading && <p className="text-white text-center">جارِ التحميل...</p>}
            {!loading &&
              draws
                .filter((draw) => draw.status === "active")
                .map((draw) => {
                  const participantsCount =
                    typeof participantsCounts[draw.id] === "number"
                      ? participantsCounts[draw.id]
                      : 0;
                  const max = draw.maxParticipants || 0;
                  const remaining = Math.max(max - participantsCount, 0);

                  return (
                    <Card key={draw.id} className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                      <CardHeader className="text-center">
                        <div className="text-6xl mb-4">🎁</div>
                        <CardTitle className="text-white">{draw.name}</CardTitle>
                        <CardDescription className="text-green-400 text-2xl font-bold">
                          {draw.prize || "جائزة"} - ${Number(draw.prizeValue) || 0}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Remaining slots:</span>
                            <Badge variant="secondary">{remaining}</Badge>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${max > 0 ? (participantsCount / max) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <div className="text-center text-sm text-gray-400">
                            {draw.status === "active" ? `Draw ends on ${draw.endDate || ""}` : "Closed"}
                          </div>
                        </div>
                        <Button
                          onClick={() => handlePrizeClick(draw)}
                          disabled={draw.status !== "active" || remaining <= 0}
                          className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Target className="w-4 h-4 mr-2" />
                          {draw.status !== "active" ? t("button.completed") : t("button.participateInDraw")}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
        </div>
      </div>

      <SocialMediaSection />
      <OffersSection />
      <WinnersList />

      <ParticipationModal
        isOpen={showParticipationModal}
        onClose={() => setShowParticipationModal(false)}
        prize={selectedPrize ? { ...selectedPrize, prizeValue: Number(selectedPrize.prizeValue) || 0 } : null}
        onParticipate={handleParticipation}
      />

      <ParticipationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onContinueToSocial={handleSuccessModalContinue}
        email={participantEmail}
        prizeName={(prizeName as string) || selectedPrize?.name || ""}
      />

      <SocialMediaModal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
      />

      <TransparencyModal
        isOpen={showTransparencyModal}
        onClose={() => setShowTransparencyModal(false)}
      />

      <Footer />
    </div>
  );
};

export default In
