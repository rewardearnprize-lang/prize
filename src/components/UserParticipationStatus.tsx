import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { firestore } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface UserParticipation {
  id: string;
  email: string;
  prize: string;
  status: "accepted" | "pending" | "rejected";
  joinDate: string;
}

const UserParticipationStatus = () => {
  const [participations, setParticipations] = useState<UserParticipation[]>([]);

  useEffect(() => {
    const fetchParticipations = async () => {
      const currentUserEmail = localStorage.getItem("currentUserEmail");
      if (!currentUserEmail) return;

      const q = query(
        collection(firestore, "participants"),
        where("email", "==", currentUserEmail)
      );
      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as UserParticipation),
      }));

      setParticipations(data);
    };

    fetchParticipations();
  }, []);

  if (participations.length === 0) {
    return null; 
  }

  return (
    <Card className="bg-white/10 border-white/20 mb-8">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Your Participation Status</h3>
        <div className="space-y-3">
          {participations.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
              <div>
                <p className="text-white font-medium">{p.prize}</p>
                <p className="text-gray-400 text-sm">{p.email}</p>
                <p className="text-gray-500 text-xs">{p.joinDate}</p>
              </div>
              <Badge
                className={
                  p.status === "accepted"
                    ? "bg-green-500/20 text-green-400"
                    : p.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }
              >
                {p.status === "accepted"
                  ? "✅ Accepted"
                  : p.status === "pending"
                  ? "⏳ Pending"
                  : "❌ Rejected"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserParticipationStatus;
