import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Settings,
  BarChart3,
  Users,
  Gift,
  Cog,
  Trophy,
  Wifi,
  Database,
  TestTube,
  FileText
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

const Admin = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("dashboard");

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
          <div className="mt-6 flex justify-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-white font-medium">نظام متكامل</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-white font-medium">إدارة ديناميكية</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-white font-medium">شفافية كاملة</span>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-white/10 backdrop-blur-sm border-white/20 flex flex-wrap w-full gap-2 p-2 rounded-xl">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              الإحصائيات
            </TabsTrigger>
            <TabsTrigger
              value="offers"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <Gift className="w-4 h-4 mr-2" />
              إدارة العروض
            </TabsTrigger>
            <TabsTrigger
              value="participants"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <Users className="w-4 h-4 mr-2" />
              المشتركون
            </TabsTrigger>
            <TabsTrigger
              value="draws"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <Trophy className="w-4 h-4 mr-2" />
              إدارة السحب
            </TabsTrigger>
            <TabsTrigger
              value="winners"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <Users className="w-4 h-4 mr-2" />
              الفائزون
            </TabsTrigger>
            <TabsTrigger
              value="proof-of-draws"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <FileText className="w-4 h-4 mr-2" />
              إثباتات السحب
            </TabsTrigger>
            <TabsTrigger
              value="main-page-data"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <Database className="w-4 h-4 mr-2" />
              بيانات الصفحة الرئيسية
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <Cog className="w-4 h-4 mr-2" />
              الإعدادات
            </TabsTrigger>
            <TabsTrigger
              value="firebase-test"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <Wifi className="w-4 h-4 mr-2" />
              اختبار Firebase
            </TabsTrigger>
            <TabsTrigger
              value="firestore-test"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <Database className="w-4 h-4 mr-2" />
              اختبار Firestore
            </TabsTrigger>
            <TabsTrigger
              value="queries-test"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <Database className="w-4 h-4 mr-2" />
              اختبار Queries
            </TabsTrigger>
            <TabsTrigger
              value="comprehensive-test"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <TestTube className="w-4 h-4 mr-2" />
              اختبار شامل
            </TabsTrigger>
            <TabsTrigger
              value="timestamp-test"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <TestTube className="w-4 h-4 mr-2" />
              اختبار الطوابع الزمنية
            </TabsTrigger>
            <TabsTrigger
              value="test"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <TestTube className="w-4 h-4 mr-2" />
              اختبار التطبيق
            </TabsTrigger>
            <TabsTrigger
              value="proof-of-draws-test"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <TestTube className="w-4 h-4 mr-2" />
              اختبار إثباتات السحب
            </TabsTrigger>
            <TabsTrigger
              value="main-page-data-test"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <TestTube className="w-4 h-4 mr-2" />
              اختبار البيانات الأساسية
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            <OffersManagement />
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <ParticipantsManagement />
          </TabsContent>

          <TabsContent value="draws" className="space-y-6">
            <DrawControl />
          </TabsContent>

          <TabsContent value="winners" className="space-y-6">
            <WinnersManagement />
          </TabsContent>

          <TabsContent value="proof-of-draws" className="space-y-6">
            <ProofOfDrawsManagement />
          </TabsContent>

          <TabsContent value="main-page-data" className="space-y-6">
            <MainPageDataManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="firebase-test" className="space-y-6">
            <FirebaseTest />
          </TabsContent>

          <TabsContent value="firestore-test" className="space-y-6">
            <FirestoreTest />
          </TabsContent>

          <TabsContent value="queries-test" className="space-y-6">
            <QueriesTest />
          </TabsContent>

          <TabsContent value="comprehensive-test" className="space-y-6">
            <ComprehensiveTest />
          </TabsContent>

          <TabsContent value="timestamp-test" className="space-y-6">
            <TimestampTest />
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <TestComponent />
          </TabsContent>

          <TabsContent value="proof-of-draws-test" className="space-y-6">
            <ProofOfDrawsTest />
          </TabsContent>

          <TabsContent value="main-page-data-test" className="space-y-6">
            <MainPageDataTest />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
