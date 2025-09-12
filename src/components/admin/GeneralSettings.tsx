import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Clock,
  MessageCircle,
  Globe,
  Save,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSettings,
  updateSettings,
  resetSettings,
  toggleMaintenanceMode,
  type AppSettings
} from "@/store/slices/settingsSlice";

const GeneralSettings = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { settings, loading, error } = useAppSelector(
    (state) => state.settings
  );

  const [localSettings, setLocalSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleSaveSettings = async () => {
    if (!localSettings) return;

    const result = await dispatch(updateSettings(localSettings));
    if (updateSettings.fulfilled.match(result)) {
      toast({
        title: "تم الحفظ",
        description: "تم حفظ الإعدادات بنجاح"
      });
    }
  };

  const handleResetSettings = async () => {
    const result = await dispatch(resetSettings());
    if (resetSettings.fulfilled.match(result)) {
      toast({
        title: "تم إعادة التعيين",
        description: "تم إعادة تعيين الإعدادات إلى القيم الافتراضية"
      });
    }
  };

  const handleToggleMaintenance = async (isMaintenanceMode: boolean) => {
    const result = await dispatch(toggleMaintenanceMode({ isMaintenanceMode }));
    if (toggleMaintenanceMode.fulfilled.match(result)) {
      toast({
        title: isMaintenanceMode
          ? "تم تفعيل وضع الصيانة"
          : "تم إلغاء وضع الصيانة",
        description: isMaintenanceMode
          ? "الموقع الآن في وضع الصيانة"
          : "الموقع متاح الآن"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!localSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white">جاري تحميل الإعدادات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* إعدادات السحب */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            إعدادات السحب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nextDrawDate" className="text-gray-300">
                تاريخ السحب القادم
              </Label>
              <Input
                id="nextDrawDate"
                type="date"
                value={localSettings.nextDrawDate || ""}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    nextDrawDate: e.target.value
                  })
                }
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="nextDrawTime" className="text-gray-300">
                وقت السحب
              </Label>
              <Input
                id="nextDrawTime"
                type="time"
                value={localSettings.nextDrawTime || ""}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    nextDrawTime: e.target.value
                  })
                }
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={localSettings.autoDrawEnabled || false}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, autoDrawEnabled: checked })
              }
            />
            <Label className="text-gray-300">تفعيل السحب التلقائي</Label>
          </div>
        </CardContent>
      </Card>

      {/* روابط وسائل التواصل */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            روابط وسائل التواصل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="telegram" className="text-gray-300">
              رابط قناة تليجرام
            </Label>
            <Input
              id="telegram"
              value={localSettings.socialMedia?.telegram || ""}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  socialMedia: {
                    ...localSettings.socialMedia,
                    telegram: e.target.value
                  }
                })
              }
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="https://t.me/yourchannel"
            />
          </div>
          <div>
            <Label htmlFor="facebook" className="text-gray-300">
              رابط صفحة فيسبوك
            </Label>
            <Input
              id="facebook"
              value={localSettings.socialMedia?.facebook || ""}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  socialMedia: {
                    ...localSettings.socialMedia,
                    facebook: e.target.value
                  }
                })
              }
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <Label htmlFor="instagram" className="text-gray-300">
              رابط صفحة إنستاجرام
            </Label>
            <Input
              id="instagram"
              value={localSettings.socialMedia?.instagram || ""}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  socialMedia: {
                    ...localSettings.socialMedia,
                    instagram: e.target.value
                  }
                })
              }
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="https://instagram.com/yourpage"
            />
          </div>
          <div>
            <Label htmlFor="twitter" className="text-gray-300">
              رابط حساب تويتر
            </Label>
            <Input
              id="twitter"
              value={localSettings.socialMedia?.twitter || ""}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  socialMedia: {
                    ...localSettings.socialMedia,
                    twitter: e.target.value
                  }
                })
              }
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="https://twitter.com/yourpage"
            />
          </div>
        </CardContent>
      </Card>

      {/* رسائل التنبيه */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            رسائل التنبيه
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="welcomeMessage" className="text-gray-300">
              رسالة الترحيب (عند الاشتراك)
            </Label>
            <Textarea
              id="welcomeMessage"
              value={localSettings.welcomeMessage || ""}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  welcomeMessage: e.target.value
                })
              }
              className="bg-gray-800 border-gray-600 text-white"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="winnerMessage" className="text-gray-300">
              رسالة الفوز
            </Label>
            <Textarea
              id="winnerMessage"
              value={localSettings.winnerMessage || ""}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  winnerMessage: e.target.value
                })
              }
              className="bg-gray-800 border-gray-600 text-white"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={localSettings.enableNotifications || false}
              onCheckedChange={(checked) =>
                setLocalSettings({
                  ...localSettings,
                  enableNotifications: checked
                })
              }
            />
            <Label className="text-gray-300">تفعيل الإشعارات</Label>
          </div>
        </CardContent>
      </Card>

      {/* محتوى الموقع */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            محتوى الموقع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="siteTitle" className="text-gray-300">
              عنوان الموقع
            </Label>
            <Input
              id="siteTitle"
              value={localSettings.siteTitle || ""}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  siteTitle: e.target.value
                })
              }
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="siteDescription" className="text-gray-300">
              وصف الموقع
            </Label>
            <Textarea
              id="siteDescription"
              value={localSettings.siteDescription || ""}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  siteDescription: e.target.value
                })
              }
              className="bg-gray-800 border-gray-600 text-white"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="contactEmail" className="text-gray-300">
              البريد الإلكتروني للتواصل
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={localSettings.contactEmail || ""}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  contactEmail: e.target.value
                })
              }
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="contactPhone" className="text-gray-300">
              رقم الهاتف للتواصل
            </Label>
            <Input
              id="contactPhone"
              value={localSettings.contactPhone || ""}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  contactPhone: e.target.value
                })
              }
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* إعدادات النقاط */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            إعدادات النقاط والمكافآت
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="offerCompletionPoints" className="text-gray-300">
                نقاط إكمال العرض
              </Label>
              <Input
                id="offerCompletionPoints"
                type="number"
                value={localSettings.points?.offerCompletion || 0}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    points: {
                      ...localSettings.points,
                      offerCompletion: parseInt(e.target.value)
                    }
                  })
                }
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="referralBonus" className="text-gray-300">
                مكافأة الإحالة
              </Label>
              <Input
                id="referralBonus"
                type="number"
                value={localSettings.points?.referralBonus || 0}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    points: {
                      ...localSettings.points,
                      referralBonus: parseInt(e.target.value)
                    }
                  })
                }
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="socialMediaShare" className="text-gray-300">
                نقاط مشاركة وسائل التواصل
              </Label>
              <Input
                id="socialMediaShare"
                type="number"
                value={localSettings.points?.socialMediaShare || 0}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    points: {
                      ...localSettings.points,
                      socialMediaShare: parseInt(e.target.value)
                    }
                  })
                }
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="dailyLogin" className="text-gray-300">
                نقاط تسجيل الدخول اليومي
              </Label>
              <Input
                id="dailyLogin"
                type="number"
                value={localSettings.points?.dailyLogin || 0}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    points: {
                      ...localSettings.points,
                      dailyLogin: parseInt(e.target.value)
                    }
                  })
                }
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إعدادات الصيانة */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            إعدادات الصيانة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={localSettings.maintenance?.isMaintenanceMode || false}
              onCheckedChange={(checked) => handleToggleMaintenance(checked)}
            />
            <Label className="text-gray-300">تفعيل وضع الصيانة</Label>
          </div>
          <div>
            <Label htmlFor="maintenanceMessage" className="text-gray-300">
              رسالة الصيانة
            </Label>
            <Textarea
              id="maintenanceMessage"
              value={localSettings.maintenance?.maintenanceMessage || ""}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  maintenance: {
                    ...localSettings.maintenance,
                    maintenanceMessage: e.target.value
                  }
                })
              }
              className="bg-gray-800 border-gray-600 text-white"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* حفظ الإعدادات */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <Button
              onClick={handleSaveSettings}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              <Save className="w-4 h-4 mr-2" />
              حفظ جميع الإعدادات
            </Button>
            <Button
              onClick={handleResetSettings}
              variant="outline"
              className="flex-1"
            >
              إعادة تعيين الإعدادات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
