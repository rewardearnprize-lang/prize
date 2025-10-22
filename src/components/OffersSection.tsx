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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOffers, type Offer } from "@/store/slices/offersSlice";
import OfferParticipationModal from "@/components/OfferParticipationModal";

const OffersSection = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { offers, loading } = useAppSelector((state) => state.offers);

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  const getAvailabilityStatus = (offer: Offer) => {
    if (offer.status === "inactive") {
      return {
        status: "Completed",
        color: "text-red-500",
        icon: AlertCircle,
      };
    }
    return {
      status: "Available",
      color: "text-green-500",
      icon: CheckCircle,
    };
  };

  const handleOfferClick = (offer: Offer) => {
    if (offer.status !== "active") {
      toast({
        title: "Offer already completed",
        description: "You have already finished this offer.",
        variant: "destructive",
      });
      return;
    }
    setSelectedOffer(offer);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-transparent to-black/20">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Exclusive Offers</h2>
        <p className="text-xl text-gray-300 mb-6">
          Complete the tasks and earn instant rewards 💸
        </p>
        <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-6 py-3">
          <Timer className="w-5 h-5 mr-2 text-blue-400" />
          <span className="text-blue-300">Active offers available now</span>
        </div>
      </div>

      {/* Offers Grid */}
      {offers.length === 0 ? (
        <p className="text-center text-gray-400">
          No offers available at the moment.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer) => {
            const availability = getAvailabilityStatus(offer);
            const Icon = availability.icon;

            // التحقق من وجود صورة
            const hasImage = offer.iconText || offer.imageUrl;
            
            // استخدام cardTitle فقط مع قيمة افتراضية
            const cardTitle = offer.cardTitle || "Special Offer";

            return (
              <Card
                key={offer.id}
                className="group bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-[1.05] shadow-lg rounded-2xl overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-purple-500/20"
              >
                {/* Offer Image */}
                {hasImage ? (
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={offer.iconText || offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const cardElement = e.currentTarget.parentElement;
                        if (cardElement) {
                          const defaultCard = document.createElement('div');
                          defaultCard.className = 'h-40 w-full flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white';
                          defaultCard.innerHTML = `
                            <div class="text-center animate-pulse">
                              <div class="text-4xl mb-2 animate-bounce">🎁</div>
                              <div class="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent px-2 leading-tight">${cardTitle}</div>
                            </div>
                          `;
                          cardElement.appendChild(defaultCard);
                        }
                      }}
                    />
                    {/* Overlay effect */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
                  </div>
                ) : (
                  // البطاقة الافتراضية عندما لا توجد صورة - استخدام cardTitle فقط
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

                    {/* Content with animations - استخدام cardTitle فقط */}
                    <div className="text-center relative z-10 transform transition-all duration-500 group-hover:scale-110 w-full px-4">
                      <div className="text-4xl mb-3 animate-bounce group-hover:animate-spin duration-1000">🎁</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent animate-pulse group-hover:animate-none leading-tight break-words whitespace-normal">
                        {cardTitle}
                      </div>
                    </div>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </div>
                )}

                {/* Offer Content */}
                <CardHeader className="text-center p-4">
                  <CardTitle className="text-white text-xl font-semibold transform transition-transform duration-300 group-hover:scale-105">
                    {offer.title}
                  </CardTitle>
                  <CardDescription className="text-green-400 text-lg font-bold animate-pulse">
                    ${offer.points.toFixed(2)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 px-6 pb-6">
                  <div className="flex items-center justify-between transform transition-transform duration-300 group-hover:translate-x-1">
                    <span className="text-gray-300">Status:</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 transition-all duration-300 group-hover:scale-110">
                      <Icon className="w-3 h-3 mr-1" />
                      {availability.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between transform transition-transform duration-300 group-hover:translate-x-1">
                    <span className="text-gray-300">Category</span>
                    <span className="text-white font-medium">
                      {offer.category || "General"}
                    </span>
                  </div>

                  <div className="text-center text-sm text-gray-400 transform transition-all duration-300 group-hover:text-white">
                    {offer.status === "active" 
                      ? "✨ Available now ✨" 
                      : "✅ Offer completed"}
                  </div>

                  <Button
                    onClick={() => handleOfferClick(offer)}
                    disabled={offer.status !== "active"}
                    className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-purple-500/50"
                  >
                    <ExternalLink className="w-4 h-4 mr-2 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    {offer.status !== "active" ? "Completed" : "Start Offer"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Offer Modal */}
      {selectedOffer && (
        <OfferParticipationModal
          isOpen={showModal}
          onOpenChange={setShowModal}
          offerId={selectedOffer.id}
          offerTitle={selectedOffer.title}
          offerLink={selectedOffer.offerurl || ""}
          participationType={selectedOffer.participationType}
        />
      )}

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

export default OffersSection;
