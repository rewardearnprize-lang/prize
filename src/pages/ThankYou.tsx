import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Gift, Star, Users, MessageCircle, Heart, Play, ExternalLink, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface SocialLinks {
  telegram: string;
  facebook: string;
  instagram: string;
}

const ThankYou = () => {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [links, setLinks] = useState<SocialLinks>({ telegram: "", facebook: "", instagram: "" });
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const docRef = doc(firestore, "adminData", "socialLinks");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLinks(docSnap.data() as SocialLinks);
        }
      } catch (err) {
        console.error("Failed to fetch social links:", err);
      }
    };

    fetchLinks();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const socialPlatforms = [
    {
      id: "telegram",
      name: "Official Telegram Channel",
      description: "Get instant notifications when winners are announced + exclusive offers for followers only.",
      icon: MessageCircle,
      color: "from-blue-500 to-blue-600",
      url: links.telegram,
      benefit: "Extra free entry + instant notifications",
      followers: "12.5K",
      urgency: "Limited offer: Get double entry in the next draw!",
    },
    {
      id: "facebook",
      name: "Facebook Page",
      description: "Follow real winners' stories and see their photos with prizes + winning tips.",
      icon: Heart,
      color: "from-blue-600 to-blue-700",
      url: links.facebook,
      benefit: "Double chance to win + exclusive content",
      followers: "8.3K",
      urgency: "Watch the latest winner’s video and how the prize changed their life!",
    },
    {
      id: "instagram",
      name: "TikTok / Instagram",
      description: "Watch videos of winners' emotional stories and their joy when winning.",
      icon: Play,
      color: "from-pink-500 to-purple-600",
      url: links.instagram,
      benefit: "Entry in special draw + entertaining content",
      followers: "25.1K",
      urgency: "Exclusive video: Watch the reaction of the iPhone 15 Pro winner!",
    },
  ];

  const handleSocialClick = (platform: any) => {
    if (!platform.url) {
      toast({
        title: "⚠️ Link not available",
        description: "Please wait until the admin adds the link.",
        variant: "destructive",
      });
      return;
    }

    window.open(platform.url, "_blank");

    if (!completedActions.includes(platform.id)) {
      setCompletedActions([...completedActions, platform.id]);

      toast({
        title: `🎉 Great! You joined ${platform.name}`,
        description: `You earned ${platform.benefit}!`,
      });
    }
  };

  const handleContinueToOffers = () => {
    toast({
      title: "🚀 Awesome!",
      description: "Now complete one offer to become eligible to win!",
    });
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

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">🎉 Congratulations! You are registered</h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-6">
            You are now entered into the draws! Follow the next steps to boost your winning chances
          </p>
        </div>

        {/* Next Steps */}
        <Card className="mb-8 bg-transparent backdrop-blur-sm border border-white/20 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-6">Simple Steps to Win</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="text-white font-bold text-lg">Join our channels</h3>
                <p className="text-gray-300">Get extra free entries</p>
                <Badge className="bg-green-500/20 text-green-400">+3 Bonus Entries</Badge>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="text-white font-bold text-lg">Complete one offer</h3>
                <p className="text-gray-300">Choose from various easy offers</p>
                <Badge className="bg-blue-500/20 text-blue-400">Required to participate</Badge>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="text-white font-bold text-lg">Wait for results</h3>
                <p className="text-gray-300">Winners will be announced soon</p>
                <Badge className="bg-purple-500/20 text-purple-400">Instant Notification</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-2">🚀 Boost your winning chances!</h2>
          <p className="text-xl text-gray-300 text-center mb-8">
            Join our channels and get free bonus entries + instant notifications when you win
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {socialPlatforms.map((platform) => {
              const IconComponent = platform.icon;
              const isCompleted = completedActions.includes(platform.id);

              return (
                <Card
                  key={platform.id}
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    🔥 HOT
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <div
                        className={`w-20 h-20 bg-gradient-to-r ${platform.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">{platform.name}</h3>
                      <p className="text-gray-300 text-sm mb-4">{platform.description}</p>

                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">{platform.followers} Active Followers</span>
                      </div>

                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
                        <p className="text-green-400 font-bold text-sm">🎁 {platform.benefit}</p>
                      </div>

                      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
                        <p className="text-yellow-300 text-xs font-medium">{platform.urgency}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSocialClick(platform)}
                      className={`w-full ${
                        isCompleted
                          ? "bg-green-500 hover:bg-green-600"
                          : `bg-gradient-to-r ${platform.color} hover:opacity-90`
                      } text-white font-bold py-3`}
                      disabled={isCompleted}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Joined ✓
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Join Now - Free
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {completedActions.length > 0 && (
            <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 mb-8">
              <CardContent className="p-6 text-center">
                <Gift className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  🎉 Awesome! You earned {completedActions.length * 2} bonus entries!
                </h3>
                <p className="text-green-400 text-lg font-bold mb-2">
                  Joined {completedActions.length} out of {socialPlatforms.length} channels
                </p>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(completedActions.length / socialPlatforms.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-gray-300">
                  {completedActions.length === socialPlatforms.length
                    ? "Amazing! You unlocked all social rewards!"
                    : `Join ${socialPlatforms.length - completedActions.length} more channels to unlock more chances`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        <Card className="bg-transparent backdrop-blur-sm border border-white/20 shadow-lg">
          <CardContent className="p-8 text-center">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Final Step: Complete one offer</h2>
            <p className="text-xl text-gray-300 mb-6">
              Choose from easy and fun offers to become eligible to win amazing prizes
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white font-bold mb-2">📱 Free Apps</h4>
                <p className="text-gray-300 text-sm">Download & play for a few minutes</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white font-bold mb-2">📝 Quick Surveys</h4>
                <p className="text-gray-300 text-sm">Answer simple questions</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white font-bold mb-2">🆓 Free Trials</h4>
                <p className="text-gray-300 text-sm">Try free services</p>
              </div>
            </div>

            <Button
              onClick={handleContinueToOffers}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-4 text-xl"
            >
              <Star className="w-6 h-6 mr-3" />
              View Available Offers Now
            </Button>

            <p className="text-gray-400 text-sm mt-4">⏰ Limited offers - Don’t miss out!</p>
          </CardContent>
        </Card>

        {/* Telegram Bot Integration Info */}
        <Card className="mt-8 bg-blue-500/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <MessageCircle className="w-8 h-8 text-blue-400 mt-1" />
              <div>
                <h3 className="text-white font-bold text-lg mb-2">🤖 Automatic Join Confirmation</h3>
                <p className="text-gray-300 mb-3">After joining our Telegram channel, you’ll receive a welcome message from our bot including:</p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Confirmation of your bonus entries</li>
                  <li>• Direct link to available offers</li>
                  <li>• Instant notifications when results are announced</li>
                  <li>• Exclusive offers for followers only</li>
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
