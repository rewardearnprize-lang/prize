import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Calendar,
  Gift,
  Shield,
  Video,
  FileText,
  CheckCircle,
  Eye,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProofOfDraws, type ProofOfDraw } from "@/store/slices/proofOfDrawsSlice";

const WinnersList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { proofOfDraws, loading } = useAppSelector((state) => state.proofOfDraws);

  useEffect(() => {
    dispatch(fetchProofOfDraws());
  }, [dispatch]);

  const getProofIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4 text-blue-400" />;
      case "image":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "document":
        return <FileText className="w-4 h-4 text-purple-400" />;
      default:
        return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  const getProofTypeText = (type: string) => {
    switch (type) {
      case "video":
        return t("proof.video");
      case "image":
        return t("proof.image");
      case "document":
        return t("proof.document");
      default:
        return t("proof.unknown");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen">
      <div className="text-center mb-12">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-white mb-4">
          🏆 {t("winners.title")}
        </h2>
        <p className="text-xl text-gray-300">{t("winners.subtitle")}</p>
      </div>

      {/* Winners Grid */}
      {loading ? (
        <p className="text-center text-white">{t("loading")}</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proofOfDraws.map((winner: ProofOfDraw) => (
            <Card
              key={winner.id}
              className="bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-3">🎉</div>
                <CardTitle className="text-white text-lg">
                  {winner.prize}
                </CardTitle>
                <Badge className="bg-green-600/20 text-green-400 text-lg">
                  {winner.prizeValue}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <p className="text-gray-300 text-sm">{t("winners.winner")}</p>
                  <p className="text-white font-bold">{winner.winnerEmail}</p>
                </div>

                <div className="flex items-center justify-center space-x-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(winner.drawDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Proof Section */}
                <div className="bg-white/10 border border-blue-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getProofIcon(winner.proofType)}
                      <span className="text-blue-400 text-sm font-medium">
                        {t("proof.drawProof")}
                      </span>
                    </div>
                    {winner.isVerified && (
                      <Badge className="bg-green-600/20 text-green-400 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {t("proof.verified")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-300 text-xs mb-2">
                    {getProofTypeText(winner.proofType)}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 border-blue-500/30 text-white hover:bg-blue-600/20"
                      onClick={() => window.open(winner.proofUrl, "_blank")}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      {t("proof.viewDraw")}
                    </Button>
                  </div>
                </div>

                <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-3 text-center">
                  <Gift className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <p className="text-green-400 text-sm font-medium">
                    {t("winners.delivered")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WinnersList;
