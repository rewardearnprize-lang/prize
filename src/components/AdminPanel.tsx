
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TrendingUp, Gift, Shield, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const AdminPanel = () => {
  const { t } = useTranslation();

  const participants = [
    {
      id: 1,
      email: "ahmed****@gmail.com",
      prize: "iPhone 15 Pro",
      status: "completed",
      joinDate: "2024-06-15",
      offerCompleted: true,
      socialFollow: true
    },
    {
      id: 2,
      email: "sara****@yahoo.com",
      prize: "PlayStation 5", 
      status: "pending",
      joinDate: "2024-06-14",
      offerCompleted: true,
      socialFollow: false
    },
    {
      id: 3,
      email: "mohamed****@hotmail.com",
      prize: "Cash Prize",
      status: "failed",
      joinDate: "2024-06-13",
      offerCompleted: false,
      socialFollow: true
    }
  ];

  const offerStats = [
    { name: "تحميل التطبيق", completions: 450, conversionRate: "15.2%" },
    { name: "التسجيل في الموقع", completions: 320, conversionRate: "12.8%" },
    { name: "مشاهدة الإعلان", completions: 180, conversionRate: "8.5%" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-500/20 text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t('admin.completed')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            {t('admin.pending')}
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-500/20 text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            {t('admin.failed')}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{t('admin.title')}</h1>
          <p className="text-gray-300">{t('admin.subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{t('admin.totalParticipants')}</p>
                  <p className="text-3xl font-bold text-white">2,547</p>
                </div>
                <Users className="w-10 h-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{t('admin.completedOffers')}</p>
                  <p className="text-3xl font-bold text-white">1,832</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{t('admin.conversionRate')}</p>
                  <p className="text-3xl font-bold text-white">72%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{t('admin.totalPrizes')}</p>
                  <p className="text-3xl font-bold text-white">15</p>
                </div>
                <Gift className="w-10 h-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="participants" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger value="participants" className="data-[state=active]:bg-white/20">
              {t('admin.participants')}
            </TabsTrigger>
            <TabsTrigger value="offers" className="data-[state=active]:bg-white/20">
              {t('admin.offerStats')}
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-white/20">
              {t('admin.privacy')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('admin.participantsList')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-gray-300">{t('admin.email')}</TableHead>
                      <TableHead className="text-gray-300">{t('admin.prize')}</TableHead>
                      <TableHead className="text-gray-300">{t('admin.status')}</TableHead>
                      <TableHead className="text-gray-300">{t('admin.joinDate')}</TableHead>
                      <TableHead className="text-gray-300">{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.id} className="border-white/20">
                        <TableCell className="text-white">{participant.email}</TableCell>
                        <TableCell className="text-white">{participant.prize}</TableCell>
                        <TableCell>{getStatusBadge(participant.status)}</TableCell>
                        <TableCell className="text-gray-300">{participant.joinDate}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                            {t('admin.viewDetails')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('admin.offerPerformance')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offerStats.map((offer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">{offer.name}</h4>
                        <p className="text-gray-300 text-sm">{offer.completions} {t('admin.completions')}</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {offer.conversionRate}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  {t('admin.privacyCompliance')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Download className="w-4 h-4 mr-2" />
                    {t('admin.exportData')}
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    {t('admin.deleteUserData')}
                  </Button>
                </div>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>• {t('admin.gdprCompliant')}</p>
                  <p>• {t('admin.dataEncrypted')}</p>
                  <p>• {t('admin.regularBackups')}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
