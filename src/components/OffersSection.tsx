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

            return (
              <Card
                key={offer.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.03] shadow-lg rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Offer Image (Card Style) */}
                {offer.iconText || offer.imageUrl ? (
                  <div className="relative h-40 w-full">
                    <img
                      src={offer.iconText || offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                ) : (
                  <div className="h-40 w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white text-3xl font-bold">
                    Gift Card
                  </div>
                )}

                {/* Offer Content */}
                <CardHeader className="text-center p-4">
                  <CardTitle className="text-white text-xl font-semibold">
                    {offer.title}
                  </CardTitle>
                  <CardDescription className="text-green-400 text-lg font-bold">
                    ${offer.points.toFixed(2)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 px-6 pb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Status:</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                      <Icon className="w-3 h-3 mr-1" />
                      {availability.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Category</span>
                    <span className="text-white font-medium">
                      {offer.category || "General"}
                    </span>
                  </div>

                  <div className="text-center text-sm text-gray-400">
                    {offer.status === "active" 
                      ? "Available now" 
                      : "Offer completed"}
                  </div>

                  <Button
                    onClick={() => handleOfferClick(offer)}
                    disabled={offer.status !== "active"}
                    className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
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
