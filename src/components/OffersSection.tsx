import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Timer,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOffers, type Offer } from "@/store/slices/offersSlice";
import OfferParticipationModal from "@/components/OfferParticipationModal";

const OffersSection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { offers, loading } = useAppSelector((state) => state.offers);

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  // ✅ تحديد لون الصعوبة
  const getDifficultyColor = (points: number) => {
    if (points <= 20) return "bg-green-500";
    if (points <= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // ✅ تحديد الحالة (متاح / مكتمل)
  const getAvailabilityStatus = (offer: Offer) => {
    if (offer.status === "inactive") {
      return {
        status: t("status.completed"),
        color: "text-red-500",
        icon: AlertCircle,
      };
    }
    return {
      status: t("status.available"),
      color: "text-green-500",
      icon: CheckCircle,
    };
  };

  // ✅ التعامل مع الضغط على العرض
  const handleOfferClick = (offer: Offer) => {
    if (offer.status !== "active") {
      toast({
        title: t("toast.offerCompleted.title"),
        description: t("toast.offerCompleted.desc"),
        variant: "destructive",
      });
      return;
    }
    setSelectedOffer(offer);
    setShowModal(true);
  };

  // ✅ أثناء التحميل
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-transparent to-black/20">
      {/* العنوان */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          {t("offers.title")}
        </h2>
        <p className="text-xl text-gray-300 mb-6">{t("offers.subtitle")}</p>
        <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-6 py-3">
          <Timer className="w-5 h-5 mr-2 text-blue-400" />
          <span className="text-blue-300">{t("offers.limited")}</span>
        </div>
      </div>

      {/* ✅ في حالة عدم وجود عروض */}
      {offers.length === 0 ? (
        <p className="text-center text-gray-400">{t("offers.noOffers")}</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const availability = getAvailabilityStatus(offer);
            const Icon = availability.icon;

            return (
              <Card
                key={offer.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 flex flex-col items-center p-6"
              >
                {/* ✅ صورة العرض */}
                {offer.icon || offer.image ? (
                  <div className="mb-4 w-24 h-24 rounded-full overflow-hidden border-4 border-purple-400 shadow-lg">
                    <img
                      src={offer.icon || offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.style.display = "none")
                      }
                    />
                  </div>
                ) : offer.iconText ? (
                  <div className="mb-4 w-24 h-24 flex items-center justify-center rounded-full bg-purple-500 text-4xl text-white shadow-lg border-4 border-purple-400">
                    {offer.iconText}
                  </div>
                ) : (
                  <div className="mb-4 w-24 h-24 flex items-center justify-center rounded-full bg-purple-500 text-4xl text-white shadow-lg border-4 border-purple-400">
                    🎁
                  </div>
                )}

                {/* ✅ معلومات العرض */}
                <CardHeader className="text-center p-0 mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <Badge
                      className={`${getDifficultyColor(
                        offer.points
                      )} text-white mx-1`}
                    >
                      {offer.points <= 20
                        ? "سهل"
                        : offer.points <= 50
                        ? "متوسط"
                        : "صعب"}
                    </Badge>

                    <div
                      className={`flex items-center ${availability.color} mx-1`}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">
                        {availability.status}
                      </span>
                    </div>
                  </div>

                  <CardTitle className="text-white text-xl">
                    {offer.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-sm">
                    {offer.description}
                  </CardDescription>
                </CardHeader>

                {/* ✅ تفاصيل إضافية */}
                <CardContent className="space-y-4 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t("label.reward")}</span>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-green-400"
                    >
                      {offer.points} {t("label.points")}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      {t("label.category")}
                    </span>
                    <span className="text-white font-medium">
                      {offer.category}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleOfferClick(offer)}
                    disabled={offer.status !== "active"}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {offer.status !== "active"
                      ? t("status.completed")
                      : t("button.startOffer")}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ✅ مودال المشاركة */}
      {selectedOffer && (
        <OfferParticipationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          offerId={selectedOffer.id}
          offerTitle={selectedOffer.title}
          offerLink={selectedOffer.offerurl || ""}
          participationType={selectedOffer.participationType}
        />
      )}
    </div>
  );
};

export default OffersSection;
