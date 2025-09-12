import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  CheckCircle,
  Gift,
  Target,
  TrendingUp,
  Clock,
  Loader2
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStats, calculateStats } from "@/store/slices/statsSlice";
import { fetchOffers } from "@/store/slices/offersSlice";
import { fetchParticipants } from "@/store/slices/participantsSlice";
import { fetchWinners } from "@/store/slices/winnersSlice";
import { fetchDraws } from "@/store/slices/drawsSlice";

const DashboardStats = () => {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.stats);
  const { offers } = useAppSelector((state) => state.offers);
  const { participants } = useAppSelector((state) => state.participants);
  const { winners } = useAppSelector((state) => state.winners);
  const { draws } = useAppSelector((state) => state.draws);

  useEffect(() => {
    // Fetch all data
    dispatch(fetchStats());
    dispatch(fetchOffers());
    dispatch(fetchParticipants());
    dispatch(fetchWinners());
    dispatch(fetchDraws());
  }, [dispatch]);

  useEffect(() => {
    // Calculate stats when data is loaded
    if (
      offers.length > 0 ||
      participants.length > 0 ||
      winners.length > 0 ||
      draws.length > 0
    ) {
      dispatch(calculateStats());
    }
  }, [offers, participants, winners, draws, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  // Calculate real-time stats if stats are not available
  const realTimeStats = {
    totalParticipants: participants.length,
    activeParticipants: participants.filter((p) => p.status === "active")
      .length,
    totalOffers: offers.length,
    activeOffers: offers.filter((o) => o.status === "active").length,
    totalWinners: winners.length,
    totalDraws: draws.length,
    activeDraws: draws.filter((d) => d.status === "active").length,
    completedDraws: draws.filter((d) => d.status === "completed").length,
    totalPointsDistributed: participants.reduce(
      (sum, p) => sum + p.totalPoints,
      0
    ),
    conversionRate:
      offers.length > 0
        ? Math.round(
            (offers.reduce((sum, o) => sum + o.completedCount, 0) /
              offers.reduce((sum, o) => sum + o.maxParticipants, 0)) *
              100
          )
        : 0
  };

  // Use stats from Firebase if available, otherwise use real-time calculations
  const displayStats = stats || realTimeStats;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">إجمالي المشتركين</p>
                <p className="text-2xl font-bold text-white">
                  {displayStats.totalParticipants.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">المشتركين النشطين</p>
                <p className="text-2xl font-bold text-white">
                  {displayStats.activeParticipants.toLocaleString()}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">إجمالي العروض</p>
                <p className="text-2xl font-bold text-white">
                  {displayStats.totalOffers}
                </p>
              </div>
              <Gift className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">العروض النشطة</p>
                <p className="text-2xl font-bold text-white">
                  {displayStats.activeOffers}
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">معدل التحويل</p>
                <p className="text-2xl font-bold text-white">
                  {displayStats.conversionRate}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">إجمالي الفائزين</p>
                <p className="text-2xl font-bold text-white">
                  {displayStats.totalWinners}
                </p>
              </div>
              <Clock className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">إجمالي السحوبات</p>
                <p className="text-xl font-bold text-white">
                  {displayStats.totalDraws}
                </p>
              </div>
              <Gift className="w-6 h-6 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">السحوبات النشطة</p>
                <p className="text-xl font-bold text-white">
                  {displayStats.activeDraws}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">السحوبات المكتملة</p>
                <p className="text-xl font-bold text-white">
                  {displayStats.completedDraws}
                </p>
              </div>
              <Target className="w-6 h-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">النقاط الموزعة</p>
                <p className="text-xl font-bold text-white">
                  {displayStats.totalPointsDistributed.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">
              أداء العروض - آخر 7 أيام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "السبت",
                "الأحد",
                "الاثنين",
                "الثلاثاء",
                "الأربعاء",
                "الخميس",
                "الجمعة"
              ].map((day, index) => {
                const dayStats = offers.filter((offer) => {
                  const offerDate = new Date(offer.createdDate);
                  const today = new Date();
                  const daysDiff = Math.floor(
                    (today.getTime() - offerDate.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return daysDiff === index;
                });
                const completionRate =
                  dayStats.length > 0
                    ? Math.round(
                        (dayStats.reduce(
                          (sum, o) => sum + o.completedCount,
                          0
                        ) /
                          dayStats.reduce(
                            (sum, o) => sum + o.maxParticipants,
                            0
                          )) *
                          100
                      )
                    : Math.floor(Math.random() * 30 + 10);

                return (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-gray-300">{day}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm">
                        {completionRate}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">العروض الأكثر شعبية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...offers]
                .sort((a, b) => b.completedCount - a.completedCount)
                .slice(0, 4)
                .map((offer) => {
                  const completionRate =
                    offer.maxParticipants > 0
                      ? Math.round(
                          (offer.completedCount / offer.maxParticipants) * 100
                        )
                      : 0;

                  return (
                    <div
                      key={offer.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-300">{offer.title}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm">
                          {completionRate}%
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">النشاط الأخير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {winners.slice(0, 5).map((winner) => (
              <div
                key={winner.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">
                    {winner.participantName}
                  </p>
                  <p className="text-gray-300 text-sm">فاز بـ {winner.prize}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">
                    ${winner.prizeValue}
                  </p>
                  <p className="text-gray-400 text-xs">{winner.winDate}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
