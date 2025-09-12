
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Gift, Star, Users, MessageCircle, Heart, Play, ExternalLink, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ThankYou = () => {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const socialPlatforms = [
    {
      id: "telegram",
      name: "قناة Telegram الرسمية",
      description: "احصل على إشعارات فورية عند إعلان الفائزين + عروض حصرية للمتابعين فقط",
      icon: MessageCircle,
      color: "from-blue-500 to-blue-600",
      url: "https://t.me/your_channel",
      benefit: "سحب إضافي مجاني + إشعارات فورية",
      followers: "12.5K",
      urgency: "عرض محدود: احصل على دخول مضاعف في السحب القادم!"
    },
    {
      id: "facebook",
      name: "صفحة Facebook",
      description: "تابع قصص الفائزين الحقيقية وشاهد صورهم مع الجوائز + نصائح للفوز",
      icon: Heart,
      color: "from-blue-600 to-blue-700",
      url: "https://facebook.com/your_page",
      benefit: "فرصة مضاعفة للفوز + محتوى حصري",
      followers: "8.3K",
      urgency: "شاهد فيديو الفائز الأخير وكيف غيرت الجائزة حياته!"
    },
    {
      id: "tiktok",
      name: "TikTok / Instagram",
      description: "شاهد فيديوهات قصص الفائزين المؤثرة ولحظات فرحتهم عند الفوز",
      icon: Play,
      color: "from-pink-500 to-purple-600",
      url: "https://tiktok.com/@your_account",
      benefit: "دخول في السحب الخاص + محتوى ترفيهي",
      followers: "25.1K",
      urgency: "فيديو حصري: شاهد ردة فعل الفائز بـ iPhone 15 Pro!"
    }
  ];

  const handleSocialClick = (platform: any) => {
    console.log(`User clicked ${platform.name}`);
    window.open(platform.url, '_blank');
    
    if (!completedActions.includes(platform.id)) {
      setCompletedActions([...completedActions, platform.id]);
      
      toast({
        title: `🎉 رائع! انضممت إلى ${platform.name}`,
        description: `تم إضافة ${platform.benefit} إلى حسابك!`,
      });
    }
  };

  const handleContinueToOffers = () => {
    toast({
      title: "🚀 ممتاز!",
      description: "الآن أكمل عرضًا واحدًا لتصبح مؤهلاً للفوز!",
    });
    // Navigate to offers section
    window.location.href = "/#offers";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🎉 تهانينا! تم تسجيلك بنجاح
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-6">
            أنت الآن مسجل في السحوبات! اتبع الخطوات التالية لزيادة فرصك في الفوز
          </p>


        </div>

        {/* Next Steps */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-6">خطوات بسيطة للفوز</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="text-white font-bold text-lg">انضم لقنواتنا</h3>
                <p className="text-gray-300">احصل على سحوبات إضافية مجانية</p>
                <Badge className="bg-green-500/20 text-green-400">+3 فرص إضافية</Badge>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="text-white font-bold text-lg">أكمل عرضًا واحدًا</h3>
                <p className="text-gray-300">اختر من العروض المتنوعة والسهلة</p>
                <Badge className="bg-blue-500/20 text-blue-400">مطلوب للمشاركة</Badge>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="text-white font-bold text-lg">انتظر النتائج</h3>
                <p className="text-gray-300">سيتم الإعلان عن الفائزين قريبًا</p>
                <Badge className="bg-purple-500/20 text-purple-400">إشعار فوري</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            🚀 ضاعف فرصك في الفوز!
          </h2>
          <p className="text-xl text-gray-300 text-center mb-8">
            انضم إلى قنواتنا واحصل على سحوبات إضافية مجانية + إشعارات فورية عند الفوز
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {socialPlatforms.map((platform) => {
              const IconComponent = platform.icon;
              const isCompleted = completedActions.includes(platform.id);
              
              return (
                <Card key={platform.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 relative overflow-hidden">
                  {/* Urgency Badge */}
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    🔥 HOT
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <div className={`w-20 h-20 bg-gradient-to-r ${platform.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{platform.name}</h3>
                      <p className="text-gray-300 text-sm mb-4">{platform.description}</p>
                      
                      {/* Followers Count */}
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">{platform.followers} متابع نشط</span>
                      </div>
                      
                      {/* Benefits */}
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
                        <p className="text-green-400 font-bold text-sm">🎁 {platform.benefit}</p>
                      </div>
                      
                      {/* Urgency Message */}
                      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
                        <p className="text-yellow-300 text-xs font-medium">{platform.urgency}</p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleSocialClick(platform)}
                      className={`w-full ${isCompleted 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : `bg-gradient-to-r ${platform.color} hover:opacity-90`
                      } text-white font-bold py-3`}
                      disabled={isCompleted}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          تم الانضمام ✓
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-5 h-5 mr-2" />
                          انضم الآن - مجاني
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bonus Summary */}
          {completedActions.length > 0 && (
            <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 mb-8">
              <CardContent className="p-6 text-center">
                <Gift className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  🎉 رائع! حصلت على {completedActions.length * 2} سحب إضافي!
                </h3>
                <p className="text-green-400 text-lg font-bold mb-2">
                  انضممت إلى {completedActions.length} من أصل {socialPlatforms.length} قناة
                </p>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(completedActions.length / socialPlatforms.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-gray-300">
                  {completedActions.length === socialPlatforms.length 
                    ? "مذهل! حصلت على جميع المكافآت الاجتماعية!" 
                    : `انضم إلى ${socialPlatforms.length - completedActions.length} قناة أخرى للحصول على المزيد من الفرص`
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardContent className="p-8 text-center">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              الخطوة الأخيرة: أكمل عرضًا واحدًا
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              اختر من العروض السهلة والممتعة لتصبح مؤهلاً للفوز بالجوائز المذهلة
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white font-bold mb-2">📱 تطبيقات مجانية</h4>
                <p className="text-gray-300 text-sm">حمل والعب لدقائق قليلة</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white font-bold mb-2">📝 استطلاعات سريعة</h4>
                <p className="text-gray-300 text-sm">أجب على أسئلة بسيطة</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white font-bold mb-2">🆓 اشتراكات مجانية</h4>
                <p className="text-gray-300 text-sm">جرب خدمات مجانية</p>
              </div>
            </div>
            
            <Button 
              onClick={handleContinueToOffers}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-4 text-xl"
            >
              <Star className="w-6 h-6 mr-3" />
              شاهد العروض المتاحة الآن
            </Button>

            <p className="text-gray-400 text-sm mt-4">
              ⏰ العروض محدودة الكمية - لا تفوت الفرصة!
            </p>
          </CardContent>
        </Card>

        {/* Telegram Bot Integration Info */}
        <Card className="mt-8 bg-blue-500/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <MessageCircle className="w-8 h-8 text-blue-400 mt-1" />
              <div>
                <h3 className="text-white font-bold text-lg mb-2">🤖 تأكيد تلقائي للانضمام</h3>
                <p className="text-gray-300 mb-3">
                  بعد انضمامك لقناة Telegram، ستتلقى رسالة ترحيب من البوت الخاص بنا تتضمن:
                </p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• تأكيد حصولك على السحوبات الإضافية</li>
                  <li>• رابط مباشر للعروض المتاحة</li>
                  <li>• إشعارات فورية عند إعلان النتائج</li>
                  <li>• عروض حصرية للمتابعين فقط</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYou;
