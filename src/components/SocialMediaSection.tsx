
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const SocialMediaSection = () => {
  const { t } = useTranslation();

  const socialPlatforms = [
    {
      id: "telegram",
      name: "Telegram",
      icon: "📱",
      color: "from-blue-500 to-blue-600",
      url: "https://t.me/your_channel",
      followers: "12.5K",
      description: t('social.telegram')
    },
    {
      id: "facebook", 
      name: "Facebook",
      icon: "👥",
      color: "from-blue-600 to-blue-700",
      url: "https://facebook.com/your_page",
      followers: "8.3K",
      description: t('social.facebook')
    },
    {
      id: "instagram",
      name: "Instagram", 
      icon: "📸",
      color: "from-pink-500 to-purple-600",
      url: "https://instagram.com/your_account",
      followers: "25.1K",
      description: t('social.instagram')
    }
  ];

  const handleSocialClick = (platform: any) => {
    window.open(platform.url, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">{t('social.followUs')}</h2>
        <p className="text-xl text-gray-300">{t('social.getUpdates')}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {socialPlatforms.map((platform) => (
          <Card key={platform.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center space-y-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${platform.color} rounded-full flex items-center justify-center mx-auto text-2xl`}>
                {platform.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white">{platform.name}</h3>
              
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">{platform.followers} {t('stats.participants')}</span>
              </div>
              
              <Button 
                onClick={() => handleSocialClick(platform)}
                className={`w-full bg-gradient-to-r ${platform.color} hover:opacity-90`}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {platform.description}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaSection;
