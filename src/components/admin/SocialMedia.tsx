import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { firestore } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface SocialLinks {
  telegram: string;
  facebook: string;
  instagram: string; 
}

const defaultLinks: SocialLinks = {
  telegram: "",
  facebook: "",
  instagram: "",
};

const SocialMediaAdmin = () => {
  const [links, setLinks] = useState<SocialLinks>(defaultLinks);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
        toast({
          title: "خطأ",
          description: "فشل في جلب الروابط الاجتماعية",
          variant: "destructive",
        });
      }
    };

    fetchLinks();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinks({ ...links, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(firestore, "adminData", "socialLinks");
      await setDoc(docRef, links);
      toast({
        title: "تم الحفظ",
        description: "تم تحديث روابط القنوات الاجتماعية بنجاح",
      });
    } catch (err) {
      console.error("Failed to save social links:", err);
      toast({
        title: "خطأ",
        description: "فشل في حفظ الروابط الاجتماعية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إدارة الروابط الاجتماعية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">رابط قناة Telegram</label>
            <Input
              name="telegram"
              value={links.telegram}
              onChange={handleChange}
              placeholder="https://t.me/your_channel"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">رابط صفحة Facebook</label>
            <Input
              name="facebook"
              value={links.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/your_page"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">رابط Instagram / TikTok</label>
            <Input
              name="instagram"
              value={links.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/your_account"
            />
          </div>

          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white mt-4"
            disabled={loading}
          >
            حفظ الروابط
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaAdmin;
