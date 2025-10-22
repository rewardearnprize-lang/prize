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
import { Trophy, Target } from "lucide-react";
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
  getDocs,
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
  const [drawsWithCardTitle, setDrawsWithCardTitle] = useState<Draw[]>([]);

  const { t } = useTranslation();
  const { toast } = useToast();

  const dispatch = useAppDispatch();
  const { draws, loading } = useAppSelector((state) => state.draws);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const success = params.get("success");
  const prizeId = params.get("prizeId");
  const prizeName = params.get("prizeName");
  const email = params.get("email");
  const uidParam = params.get("uid");

  useEffect(() => {
    dispatch(fetchDraws());
  }, [dispatch]);

  // تحميل بيانات cardTitle مباشرة من Firebase
  useEffect(() => {
    const loadCardTitlesDirectly = async () => {
      if (draws.length > 0) {
        try {
          console.log('🔄 جاري تحميل cardTitle مباشرة من Firebase...');
          
          const drawsCollection = collection(firestore, "draws");
          const drawsSnapshot = await getDocs(drawsCollection);
          const drawsData = drawsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          console.log('📊 بيانات السحوبات من Firebase:', drawsData);

          // دمج البيانات مع cardTitle
          const enhancedDraws = draws.map(draw => {
            const firebaseDraw = drawsData.find(d => d.id === draw.id);
            const cardTitle = firebaseDraw?.cardTitle || 
                             firebaseDraw?.cardtitle || 
                             (draw as any).cardTitle ||
                             draw.name + " GIFT CARD";
            
            console.log(`🎯 السحب: ${draw.name}`, {
              cardTitle: cardTitle,
              fromFirebase: firebaseDraw?.cardTitle
            });

            return {
              ...draw,
              cardTitle: cardTitle
            };
          });

          setDrawsWithCardTitle(enhancedDraws);
        } catch (error) {
          console.error('❌ خطأ في تحميل cardTitle:', error);
          // استخدام البيانات الأصلية كبديل
          const fallbackDraws = draws.map(draw => ({
            ...draw,
            cardTitle: (draw as any).cardTitle || draw.name + " GIFT CARD"
          }));
          setDrawsWithCardTitle(fallbackDraws);
        }
      }
    };

    loadCardTitlesDirectly();
  }, [draws]);

  // siteStats snapshot
  useEffect(() => {
    const statsRef = doc(firestore, "siteStats", "main");
    const unsub = onSnapshot(statsRef, (snap) => {
      if (snap.exists()) setStats(snap.data() as any);
    });
    return () => unsub();
  }, []);

  // participants snapshot
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

  // معالجة نجاح المشاركة
  useEffect(() => {
    const handleParticipationSuccess = async () => {
      if (success === "true" && prizeId) {
        const finalEmail = email || localStorage.getItem("currentUserEmail") || "";
        let uid = uidParam || localStorage.getItem("currentUserUID");

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
               
              }

              const participantRef = doc(firestore, "participants", uid);
             
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

  const handleParticipation = async (email: string) => {
  if (!selectedPrize) return;

  try {
    localStorage.setItem("currentUserEmail", email);

    const prizeId = selectedPrize.id;
    const prizeRef = doc(firestore, "draws", prizeId);
    const prizeSnap = await getDoc(prizeRef);

    if (!prizeSnap.exists()) {
      console.error("Prize not found in Firestore");
      return;
    }

    const prizeData = prizeSnap.data() as Draw;

    // التحقق من توفر أماكن المشاركة
    if (prizeData.maxParticipants && prizeData.maxParticipants > 0) {
      // حفظ مشاركة المستخدم
      const uid = localStorage.getItem("currentUserUID") || generateUID();
      localStorage.setItem("currentUserUID", uid);

     

      // إنقاص العدد المتبقي من المشاركين
     

      // تحديث العدد في الواجهة مباشرة بدون انتظار Firestore
    

  
    } else {
      toast({
        title: "السحب مكتمل ❌",
        description: "لقد اكتمل العدد المطلوب لهذا السحب.",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("❌ Error while participating:", error);
    toast({
      title: "حدث خطأ أثناء الاشتراك",
      description: String(error),
      variant: "destructive",
    });
  }
};


  const handleSuccessModalContinue = () => {
    setShowSuccessModal(false);
    setTimeout(() => setShowSocialModal(true), 500);
  };

  // استخدام البيانات المحسنة
  const displayDraws = drawsWithCardTitle.length > 0 ? drawsWithCardTitle : draws;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <div className="text-center text-white">
            <div className="inline-flex items-center bg-yellow-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-yellow-300 font-semibold">{t('site.subtitle')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-12 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {t('site.title')}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <UserParticipationStatus />

        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">{t("prizes.availableNow")}</h2>
            <p className="text-xl text-gray-300">{t("prizes.chooseToParticipate")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {loading && <p className="text-white text-center">Loading...</p>}

            {!loading && displayDraws
              .filter((draw) => draw.status === "active")
              .map((draw) => {
                const participantsCount =
                  typeof participantsCounts[draw.id] === "number"
                    ? participantsCounts[draw.id]
                    : 0;
                const max = draw.maxParticipants || 0;
                const remaining = Math.max(max - participantsCount, 0);
                
                // استخدام cardTitle من البيانات المحسنة
                const cardTitle = (draw as any).cardTitle || draw.name + " GIFT CARD";

                console.log('🎁 عرض البطاقة:', {
                  name: draw.name,
                  cardTitle: cardTitle,
                  id: draw.id
                });

                return (
                  <Card
                    key={draw.id}
                    className="group bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-[1.05] shadow-lg rounded-2xl overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    {/* صورة الجائزة مع استخدام cardTitle */}
                    {draw.image || draw.imageUrl ? (
                      <div className="relative h-40 w-full overflow-hidden">
                        <img
                          src={draw.image || draw.imageUrl}
                          alt={draw.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const cardElement = e.currentTarget.parentElement;
                            if (cardElement) {
                              const defaultCard = document.createElement('div');
                              defaultCard.className = 'h-40 w-full flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white';
                              defaultCard.innerHTML = `
                                <div class="text-center">
                                  <div class="text-4xl mb-2 animate-bounce">🎁</div>
                                  <div class="text-xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent px-2 leading-tight break-words whitespace-normal">${cardTitle}</div>
                                </div>
                              `;
                              cardElement.appendChild(defaultCard);
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
                      </div>
                    ) : (
                      // البطاقة الافتراضية باستخدام cardTitle
                      <div className="h-40 w-full flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 relative overflow-hidden group">
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

                        {/* Content with animations - استخدام cardTitle هنا */}
                        <div className="text-center relative z-10 transform transition-all duration-500 group-hover:scale-110 w-full px-4">
                          <div className="text-4xl mb-3 animate-bounce group-hover:animate-spin duration-1000">🎁</div>
                          <div className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent leading-tight break-words whitespace-normal px-2">
                            {cardTitle}
                          </div>
                        </div>

                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      </div>
                    )}

                    {/* محتوى البطاقة */}
                    <CardHeader className="text-center p-4">
                      <CardTitle className="text-white text-xl font-semibold transform transition-transform duration-300 group-hover:scale-105">
                        {draw.name}
                      </CardTitle>
                      <CardDescription className="text-green-400 text-lg font-bold">
                        ${Number(draw.prizeValue || 0).toFixed(2)}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3 px-6 pb-6">
                      <div className="flex items-center justify-between transform transition-transform duration-300 group-hover:translate-x-1">
                        <span className="text-gray-300">Remaining slots:</span>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 transition-all duration-300 group-hover:scale-110">
                          {remaining}
                        </Badge>
                      </div>

                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${max > 0 ? (participantsCount / max) * 100 : 0}%` }}
                        ></div>
                      </div>

                      <div className="text-center text-sm text-gray-400 transform transition-all duration-300 group-hover:text-white">
                        {draw.status === "active"
                          ? `✨ Draw ends on ${draw.endDate || "Soon"} ✨`
                          : "✅ Closed"}
                      </div>

                      <Button
                        onClick={() => handlePrizeClick(draw)}
                        disabled={draw.status !== "active" || remaining <= 0}
                        className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-purple-500/50"
                      >
                        <Target className="w-4 h-4 mr-2 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                        {draw.status !== "active"
                          ? "Completed"
                          : "Participate Now"}
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

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Index;
