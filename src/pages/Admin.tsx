import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  Gift,
  Cog,
  Trophy,
  Wifi,
  Database,
  TestTube,
  FileText,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import OffersManagement from "@/components/admin/OffersManagement";
import ParticipantsManagement from "@/components/admin/ParticipantsManagement";
import WinnersManagement from "@/components/admin/WinnersManagement";
import DrawControl from "@/components/admin/DrawControl";
import DashboardStats from "@/components/admin/DashboardStats";
import GeneralSettings from "@/components/admin/GeneralSettings";
import FirebaseTest from "@/components/admin/FirebaseTest";
import FirestoreTest from "@/components/admin/FirestoreTest";
import QueriesTest from "@/components/admin/QueriesTest";
import ComprehensiveTest from "@/components/admin/ComprehensiveTest";
import TimestampTest from "@/components/admin/TimestampTest";
import TestComponent from "@/components/admin/TestComponent";
import ProofOfDrawsManagement from "@/components/admin/ProofOfDrawsManagement";
import ProofOfDrawsTest from "@/components/admin/ProofOfDrawsTest";
import MainPageDataManagement from "@/components/admin/MainPageDataManagement";
import MainPageDataTest from "@/components/admin/MainPageDataTest";
import AdminParticipationList from "@/components/admin/AdminParticipationList";
import AdminParticipateOffer from "@/components/admin/AdminParticipateOfer";
import SocialMediaAdmin from "@/components/admin/SocialMedia";
import AdminStats from "@/components/admin/header";

const Admin = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");
    const correctKey = import.meta.env.VITE_ADMIN_KEY;

    if (key === correctKey) {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <h1 className="text-3xl font-bold text-white">⛔ Access Denied</h1>
        <p className="mt-4 text-gray-300">
          You are not authorized to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            لوحة الإدارة
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            إدارة شاملة لجميع جوانب التطبيق - العروض، المشاركين، الفائزين،
            وإثباتات السحب
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-white/10 backdrop-blur-sm border-white/20 flex flex-wrap w-full gap-2 p-2 rounded-xl">
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              الإحصائيات
            </TabsTrigger>
            <TabsTrigger value="header">
              <Users className="w-4 h-4 mr-2" />
              Header
            </TabsTrigger>
            <TabsTrigger value="hamas">
              <Users className="w-4 h-4 mr-2" />
              المشتركون
            </TabsTrigger>
            <TabsTrigger value="ofer">
              <Users className="w-4 h-4 mr-2" />
              المشتركون في العروض
            </TabsTrigger>
            <TabsTrigger value="social">
              <Users className="w-4 h-4 mr-2" />
              Social Media
            </TabsTrigger>
            <TabsTrigger value="offers">
              <Gift className="w-4 h-4 mr-2" />
              إدارة العروض
            </TabsTrigger>
            <TabsTrigger value="draws">
              <Trophy className="w-4 h-4 mr-2" />
              إدارة السحب
            </TabsTrigger>
            <TabsTrigger value="winners">
              <Users className="w-4 h-4 mr-2" />
              الفائزون
            </TabsTrigger>
            <TabsTrigger value="proof-of-draws">
              <FileText className="w-4 h-4 mr-2" />
              إثباتات السحب
            </TabsTrigger>
            <TabsTrigger value="main-page-data">
              <Database className="w-4 h-4 mr-2" />
              بيانات الصفحة الرئيسية
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Cog className="w-4 h-4 mr-2" />
              الإعدادات
            </TabsTrigger>
            <TabsTrigger value="firebase-test">
              <Wifi className="w-4 h-4 mr-2" />
              اختبار Firebase
            </TabsTrigger>
            <TabsTrigger value="firestore-test">
              <Database className="w-4 h-4 mr-2" />
              اختبار Firestore
            </TabsTrigger>
            <TabsTrigger value="queries-test">
              <Database className="w-4 h-4 mr-2" />
              اختبار Queries
            </TabsTrigger>
            <TabsTrigger value="comprehensive-test">
              <TestTube className="w-4 h-4 mr-2" />
              اختبار شامل
            </TabsTrigger>
            <TabsTrigger value="timestamp-test">
              <TestTube className="w-4 h-4 mr-2" />
              اختبار الطوابع الزمنية
            </TabsTrigger>
            <TabsTrigger value="test">
              <TestTube className="w-4 h-4 mr-2" />
              اختبار التطبيق
            </TabsTrigger>
            <TabsTrigger value="proof-of-draws-test">
              <TestTube className="w-4 h-4 mr-2" />
              اختبار إثباتات السحب
            </TabsTrigger>
            <TabsTrigger value="main-page-data-test">
              <TestTube className="w-4 h-4 mr-2" />
              اختبار البيانات الأساسية
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard"><DashboardStats /></TabsContent>
          <TabsContent value="offers"><OffersManagement /></TabsContent>
          <TabsContent value="participants"><ParticipantsManagement /></TabsContent>
          <TabsContent value="draws"><DrawControl /></TabsContent>
          <TabsContent value="winners"><WinnersManagement /></TabsContent>
          <TabsContent value="proof-of-draws"><ProofOfDrawsManagement /></TabsContent>
          <TabsContent value="main-page-data"><MainPageDataManagement /></TabsContent>
          <TabsContent value="settings"><GeneralSettings /></TabsContent>
          <TabsContent value="firebase-test"><FirebaseTest /></TabsContent>
          <TabsContent value="firestore-test"><FirestoreTest /></TabsContent>
          <TabsContent value="queries-test"><QueriesTest /></TabsContent>
          <TabsContent value="comprehensive-test"><ComprehensiveTest /></TabsContent>
          <TabsContent value="timestamp-test"><TimestampTest /></TabsContent>
          <TabsContent value="test"><TestComponent /></TabsContent>
          <TabsContent value="proof-of-draws-test"><ProofOfDrawsTest /></TabsContent>
          <TabsContent value="main-page-data-test"><MainPageDataTest /></TabsContent>
          <TabsContent value="hamas"><AdminParticipationList /></TabsContent>
          <TabsContent value="ofer"><AdminParticipateOffer /></TabsContent>
          <TabsContent value="social"><SocialMediaAdmin /></TabsContent>
          <TabsContent value="header"><AdminStats /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
