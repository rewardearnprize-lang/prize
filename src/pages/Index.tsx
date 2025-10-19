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
import TransparencyModal from "@/components/TransparencyModal";
import UserParticipationStatus from "@/components/UserParticipationStatus";
import Footer from "@/components/Footer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDraws } from "@/store/slices/drawsSlice";
import type { Draw } from "@/store/slices/drawsSlice";

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
  const [showTransparencyModal, setShowTransparencyModal] = useState(false);

  const [participantsCounts, setParticipantsCounts] = useState<Record<string, number>>({});
  const [totalParticipants, setTotalParticipants] = useState(0);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { draws, loading } = useAppSelector((state) => state.draws);

  const location = useLocation();

  useEffect(() => {
    dispatch(fetchDraws());
  }, [dispatch]);

  // ==========================
  // snapshot للعد محليًا (يمكن حذفه إذا تريد عد محلي فقط بدون Firestore)
  // ==========================
  // يمكنك حذف هذا الجزء إذا كنت لا تريد استخدام Firestore على الإطلاق
  // ==========================

  const handlePrizeClick = (draw: Draw) => {
    const max = draw.maxParticipants || 0;
    const participantsCount = typeof participantsCounts[draw.offerId || draw.id] === "number"
      ? participantsCounts[draw.offerId || draw.id]
      : 0;
    const remaining = Math.max(max - participantsCount, 0);

    if (max > 0 && remaining <= 0) {
      return; // السحب مكتمل، لن يحدث شيء
    }

    setSelectedPrize({ ...draw, prizeValue: Number(draw.prizeValue) || 0 });
    setShowParticipationModal(true);
  };

  // ==========================
  // handleParticipation بدون إرسال بيانات
  // ==========================
  const handleParticipation = (email: string) => {
    if (!selectedPrize) return;

    // تحديث العدد محليًا فقط
    setSelectedPrize((prev) => {
      if (!prev) return null;
      const updatedMax = (prev.maxParticipants || 0) - 1;
      return { ...prev, maxParticipants: updatedMax };
    });

    // إغلاق المودال بدون رسالة نجاح
    setShowParticipationModal(false);
  };

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
            {loading && <p className="text-white text-center">جارِ التحميل...</p>}
            {!loading &&
              draws
                .filter((draw) => draw.status === "active")
                .map((draw) => {
                  const participantsCount = typeof participantsCounts[draw.id] === "number"
                    ? participantsCounts[draw.id]
                    : 0;
                  const max = draw.maxParticipants || 0;
                  const remaining = Math.max(max - participantsCount, 0);

                  return (
                    <Card key={draw.id} className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                      <CardHeader className="text-center">
                        <div className="flex justify-center">
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
                            {draw.image || draw.imageUrl ? (
                              <img
                                src={draw.image || draw.imageUrl}
                                alt={draw.name}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-4xl bg-black/20 text-white">
                                🎁
                              </div>
                            )}
                          </div>
                        </div>

                        <CardTitle className="text-white">{draw.name}</CardTitle>
                        <CardDescription className="text-green-400 text-2xl font-bold">
                          {(draw.prize || draw.name || "Prize")} - ${Number(draw.prizeValue || 0)}
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

export default Index;
