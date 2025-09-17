import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AdminStats = () => {
  const [form, setForm] = useState({
    participants: 0,
    winners: 0,
    prizeValue: 0,
    continuous: "24/7",
    privacyUrl: "",
    termsUrl: "",
    dataProtectionUrl: "",
    supportEmail: "",
    businessEmail: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      const statsRef = doc(firestore, "siteStats", "main");
      const snap = await getDoc(statsRef);
      if (snap.exists()) {
        setForm((prev) => ({ ...prev, ...snap.data() }));
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const statsRef = doc(firestore, "siteStats", "main");
      await setDoc(statsRef, form, { merge: true });
      toast({ title: "✅ Saved", description: "Settings updated successfully" });
    } catch (err) {
      console.error(err);
      toast({ title: "❌ Error", description: "Failed to update settings" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-10 px-4">
      <Card className="max-w-2xl mx-auto bg-white/10 border border-white/20 text-white">
        <CardHeader>
          <CardTitle>Admin Panel – Update Site Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Participants */}
          <div>
            <label className="block mb-1 text-white font-medium">Participants Count</label>
            <Input
              name="participants"
              type="number"
              value={form.participants}
              onChange={handleChange}
              placeholder="Enter total participants"
              className="text-black placeholder-black"
            />
          </div>

          {/* Winners */}
          <div>
            <label className="block mb-1 text-white font-medium">Winners Count</label>
            <Input
              name="winners"
              type="number"
              value={form.winners}
              onChange={handleChange}
              placeholder="Enter total winners"
              className="text-black placeholder-black"
            />
          </div>

          {/* Prize Value */}
          <div>
            <label className="block mb-1 text-white font-medium">Prize Value ($)</label>
            <Input
              name="prizeValue"
              type="number"
              value={form.prizeValue}
              onChange={handleChange}
              placeholder="Enter prize value in USD"
              className="text-black placeholder-black"
            />
          </div>

          {/* Continuous */}
          <div>
            <label className="block mb-1 text-white font-medium">Continuous</label>
            <Input
              name="continuous"
              type="text"
              value={form.continuous}
              onChange={handleChange}
              placeholder="e.g., 24/7"
              className="text-black placeholder-black"
            />
          </div>

          {/* Footer Fields */}
          <div>
            <label className="block mb-1 text-white font-medium">Privacy Policy URL</label>
            <Input
              name="privacyUrl"
              type="text"
              value={form.privacyUrl}
              onChange={handleChange}
              placeholder="https://example.com/privacy"
              className="text-black placeholder-black"
            />
          </div>

          <div>
            <label className="block mb-1 text-white font-medium">Terms & Conditions URL</label>
            <Input
              name="termsUrl"
              type="text"
              value={form.termsUrl}
              onChange={handleChange}
              placeholder="https://example.com/terms"
              className="text-black placeholder-black"
            />
          </div>

          <div>
            <label className="block mb-1 text-white font-medium">Data Protection URL</label>
            <Input
              name="dataProtectionUrl"
              type="text"
              value={form.dataProtectionUrl}
              onChange={handleChange}
              placeholder="https://example.com/data-protection"
              className="text-black placeholder-black"
            />
          </div>

          <div>
            <label className="block mb-1 text-white font-medium">Support Email</label>
            <Input
              name="supportEmail"
              type="email"
              value={form.supportEmail}
              onChange={handleChange}
              placeholder="support@example.com"
              className="text-black placeholder-black"
            />
          </div>

          <div>
            <label className="block mb-1 text-white font-medium">Business Email</label>
            <Input
              name="businessEmail"
              type="email"
              value={form.businessEmail}
              onChange={handleChange}
              placeholder="business@example.com"
              className="text-black placeholder-black"
            />
          </div>

          <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Save
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
