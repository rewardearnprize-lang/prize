import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Shuffle, Gift, Plus, Loader2, Edit, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { firestore } from "@/lib/firebase";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

import {
  fetchDraws,
  addDraw,
  updateDraw,
  deleteDraw,
  updateDrawStatus,
  type Draw,
} from "@/store/slices/drawsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Textarea } from "../ui/textarea";

const DrawControl = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { draws, loading: drawsLoading, error: drawsError } = useAppSelector(
    (state) => state.draws
  );

  const [participants, setParticipants] = useState<any[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const [selectedWinner, setSelectedWinner] = useState("");
  const [selectedDraw, setSelectedDraw] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofDescription, setProofDescription] = useState("");

  const [showAddDrawDialog, setShowAddDrawDialog] = useState(false);
  const [showEditDrawDialog, setShowEditDrawDialog] = useState(false);
  const [editingDraw, setEditingDraw] = useState<Draw | null>(null);

  const [newDraw, setNewDraw] = useState({
    id: "",
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    drawDate: "",
    maxParticipants: 100,
    prize: "",
    prizeValue: 0,
    minPoints: 0,
    minOffers: 0,
    socialMediaRequired: false,
    offerUrl: "",
    offerId: "",
    participationType: "email" as "email" | "id",
  });

  useEffect(() => {
    dispatch(fetchDraws());
  }, [dispatch]);

  useEffect(() => {
    const fetchVerifiedParticipants = async () => {
      try {
        setLoadingParticipants(true);
        const q = query(
          collection(firestore, "participants"),
          where("verified", "==", true)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setParticipants(data);
      } catch (err) {
        console.error("Error fetching participants:", err);
      } finally {
        setLoadingParticipants(false);
      }
    };

    fetchVerifiedParticipants();
  }, []);

  useEffect(() => {
    if (drawsError) {
      toast({
        title: "خطأ",
        description: drawsError,
        variant: "destructive",
      });
    }
  }, [drawsError, toast]);

const handleRandomDraw = async () => {
  const selected = draws.find((d) => d.id === selectedDraw);
  if (!selected) return;

  const eligible = participants.filter((p) => p.prize === selected.prize);
  if (eligible.length === 0) {
    return;
  }

  const randomWinner = eligible[Math.floor(Math.random() * eligible.length)];

  await updateDoc(doc(firestore, "participants", randomWinner.id), {
    status: "accepted",
  });

  alert(`الفائز هو: ${randomWinner.email}`);
};


  const handleConfirmWinner = async () => {
    if (!selectedWinner || !selectedDraw || !proofFile) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "تم بنجاح!",
      description: "تم تأكيد الفائز وحفظ البيانات",
    });

    setSelectedWinner("");
    setSelectedDraw("");
    setProofFile(null);
    setProofDescription("");
  };

  const handleAddDraw = async () => {
    if (!newDraw.name || !newDraw.startDate || !newDraw.endDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const drawData = {
      name: newDraw.name,
      description: newDraw.description,
      startDate: newDraw.startDate,
      endDate: newDraw.endDate,
      drawDate: newDraw.drawDate,
      status: "upcoming" as const,
      maxParticipants: newDraw.maxParticipants,
      prize: newDraw.prize,
      prizeValue: newDraw.prizeValue,
      offerUrl: newDraw.offerUrl,
      offerId: newDraw.offerId,
      participationType: newDraw.participationType,
    };

    const result = await dispatch(addDraw(drawData));
    if (addDraw.fulfilled.match(result)) {
      setNewDraw({
        id: "",
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        drawDate: "",
        maxParticipants: 100,
        prize: "",
        prizeValue: 0,
        minPoints: 0,
        minOffers: 0,
        socialMediaRequired: false,
        offerUrl: "",
        offerId: "",
        participationType: "email",
      });
      setShowAddDrawDialog(false);
      toast({
        title: "تم إضافة السحب",
        description: "تمت إضافة السحب الجديد بنجاح",
      });
    }
  };

  const handleEditDraw = (draw: Draw) => {
    setEditingDraw(draw);
    setShowEditDrawDialog(true);
  };

  const handleUpdateDraw = async () => {
    if (!editingDraw) return;

    const result = await dispatch(
      updateDraw({
        id: editingDraw.id,
        drawData: editingDraw,
      })
    );

    if (updateDraw.fulfilled.match(result)) {
      setShowEditDrawDialog(false);
      setEditingDraw(null);
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات السحب",
      });
    }
  };

  const handleDeleteDraw = async (id: string) => {
    const result = await dispatch(deleteDraw(id));
    if (deleteDraw.fulfilled.match(result)) {
      toast({
        title: "تم الحذف",
        description: "تم حذف السحب بنجاح",
      });
    }
  };

  const handleStatusChange = async (
    id: string,
    status: "upcoming" | "active" | "completed" | "cancelled"
  ) => {
    await dispatch(updateDrawStatus({ id, status }));
  };

   if (drawsLoading || loadingParticipants) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            إدارة السحوبات
          </CardTitle>
          <Dialog open={showAddDrawDialog} onOpenChange={setShowAddDrawDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                إضافة سحب جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  إضافة سحب جديد
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">اسم السحب</Label>
                    <Input
                      value={newDraw.name}
                      onChange={(e) =>
                        setNewDraw({ ...newDraw, name: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="اسم السحب"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">الوصف</Label>
                    <Input
                      value={newDraw.description}
                      onChange={(e) =>
                        setNewDraw({ ...newDraw, description: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="وصف السحب"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">لينك العرض</Label>
                  <Input
                    type="url"
                    value={newDraw.offerUrl || ""}
                    onChange={(e) =>
                      setNewDraw({ ...newDraw, offerUrl: e.target.value })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="https://example.com/offer"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-300">تاريخ البداية</Label>
                    <Input
                      type="date"
                      value={newDraw.startDate}
                      onChange={(e) =>
                        setNewDraw({ ...newDraw, startDate: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">تاريخ النهاية</Label>
                    <Input
                      type="date"
                      value={newDraw.endDate}
                      onChange={(e) =>
                        setNewDraw({ ...newDraw, endDate: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">تاريخ السحب</Label>
                    <Input
                      type="date"
                      value={newDraw.drawDate}
                      onChange={(e) =>
                        setNewDraw({ ...newDraw, drawDate: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">
                      الحد الأقصى للمشتركين
                    </Label>
                    <Input
                      type="number"
                      value={newDraw.maxParticipants}
                      onChange={(e) =>
                        setNewDraw({
                          ...newDraw,
                          maxParticipants: parseInt(e.target.value)
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">الجائزة</Label>
                    <Input
                      value={newDraw.prize}
                      onChange={(e) =>
                        setNewDraw({
                          ...newDraw,
                          prize: e.target.value
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="اسم الجائزة"
                    />
                    <Input
                      type="number"
                      value={newDraw.prizeValue}
                      onChange={(e) =>
                        setNewDraw({
                          ...newDraw,
                          prizeValue: parseInt(e.target.value)
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white mt-2"
                      placeholder="القيمة"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">نوع المشاركة</Label>
                    <Select
                      value={newDraw.participationType}
                      onValueChange={(val: "email" | "id") =>
                        setNewDraw({ ...newDraw, participationType: val })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="email" className="text-white">
                          Email
                        </SelectItem>
                        <SelectItem value="id" className="text-white">
                          ID
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDrawDialog(false)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleAddDraw}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    إضافة السحب
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {draws.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <div className="text-6xl mb-4">🎁</div>
              <p className="text-xl">لا توجد سحوبات حالياً</p>
              <p className="text-sm text-gray-500 mt-2">
                قم بإضافة سحب جديد للبدء
              </p>
            </div>
          )}

          {draws.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draws.map((draw) => (
                <Card
                  key={draw.id}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Gift className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">
                            {draw.name}
                          </h3>
                          <p className="text-gray-400 text-sm">{draw.status}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditDraw(draw)}
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteDraw(draw.id)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {draw.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">الجائزة:</span>
                        <span className="text-green-400 font-medium">
                          {draw.prize || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">القيمة:</span>
                        <span className="text-blue-400 font-medium">
                          {draw.prizeValue || "غير محدد"}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <Select
                        value={draw.status}
                        onValueChange={(
                          value:
                            | "upcoming"
                            | "active"
                            | "completed"
                            | "cancelled"
                        ) => handleStatusChange(draw.id, value)}
                      >
                        <SelectTrigger className="w-full bg-transparent border-gray-600 text-white text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="upcoming" className="text-white">
                            قادم
                          </SelectItem>
                          <SelectItem value="active" className="text-white">
                            نشط
                          </SelectItem>
                          <SelectItem value="completed" className="text-white">
                            مكتمل
                          </SelectItem>
                          <SelectItem value="cancelled" className="text-white">
                            ملغي
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-green-500/50 text-green-400 hover:bg-green-500/20"
                        onClick={() => {
                          setSelectedDraw(draw.id);
                        }}
                      >
                        <Shuffle className="w-4 h-4 mr-1" />
                        سحب
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          
        </CardContent>
      </Card>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">إجراء السحب</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* اختيار السحب */}
            <div className="space-y-4">
              <Label className="text-gray-300">اختر السحب للسحب عليه</Label>
              <Select value={selectedDraw} onValueChange={setSelectedDraw}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="اختر السحب" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {draws
                    .filter((draw) => draw.status === "active")
                    .map((draw) => (
                      <SelectItem
                        key={draw.id}
                        value={draw.id}
                        className="text-white"
                      >
                        {draw.name} (الجائزة: {draw.prize})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleRandomDraw}
                className="bg-blue-500 hover:bg-blue-600 w-full"
                disabled={!selectedDraw}
              >
                <Shuffle className="w-4 h-4 mr-2" />
                سحب عشوائي
              </Button>
            </div>

            <div className="space-y-4">
              <Label className="text-gray-300">أو اختر الفائز يدوياً</Label>
              <Select value={selectedWinner} onValueChange={setSelectedWinner}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="اختر الفائز" />
                </SelectTrigger>
<SelectContent className="bg-gray-800 border-gray-600">
  {participants
    .filter((p) => p.prizeId === selectedDraw) // 👈 بدل الفلترة على prize.name
    .map((participant) => (
      <SelectItem
        key={participant.id}
        value={participant.id}
        className="text-white"
      >
        {participant.email || participant.id} - {participant.prize}
      </SelectItem>
    ))}
</SelectContent>

              </Select>
            </div>
          </div>

          {/* إثبات الفوز */}
          {selectedWinner && (
            <div className="space-y-4 p-4 bg-white/5 rounded-lg">
              <h4 className="text-white font-medium">
                إثبات الفوز للفائز:{" "}
                {participants.find((p) => p.id === selectedWinner)?.email}
              </h4>

              <div>
                <Label htmlFor="proofFile" className="text-gray-300">
                  رفع إثبات السحب (صورة أو فيديو)
                </Label>
                <Input
                  id="proofFile"
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="proofDescription" className="text-gray-300">
                  وصف إثبات السحب
                </Label>
                <Textarea
                  id="proofDescription"
                  value={proofDescription}
                  onChange={(e) => setProofDescription(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleConfirmWinner}
                className="bg-green-500 hover:bg-green-600 w-full"
                disabled={!proofFile}
              >
                <User className="w-4 h-4 mr-2" />
                تأكيد الفائز وحفظ الإثبات
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showEditDrawDialog} onOpenChange={setShowEditDrawDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">تعديل بيانات السحب</DialogTitle>
          </DialogHeader>
          {editingDraw && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">اسم السحب</Label>
                  <Input
                    value={editingDraw.name || ""}
                    onChange={(e) =>
                      setEditingDraw({ ...editingDraw, name: e.target.value })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">الوصف</Label>
                  <Input
                    value={editingDraw.description || ""}
                    onChange={(e) =>
                      setEditingDraw({
                        ...editingDraw,
                        description: e.target.value
                      })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-300">لينك العرض</Label>
                <Input
                  type="url"
                  value={editingDraw.offerUrl || ""}
                  onChange={(e) =>
                    setEditingDraw({
                      ...editingDraw,
                      offerUrl: e.target.value
                    })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">الجائزة</Label>
                  <Input
                    value={editingDraw.prize || ""}
                    onChange={(e) =>
                      setEditingDraw({ ...editingDraw, prize: e.target.value })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">قيمة الجائزة</Label>
                  <Input
                    type="number"
                    value={editingDraw.prizeValue || 0}
                    onChange={(e) =>
                      setEditingDraw({
                        ...editingDraw,
                        prizeValue: Number(e.target.value)
                      })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">تاريخ البداية</Label>
                  <Input
                    type="date"
                    value={editingDraw.startDate || ""}
                    onChange={(e) =>
                      setEditingDraw({
                        ...editingDraw,
                        startDate: e.target.value
                      })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">تاريخ النهاية</Label>
                  <Input
                    type="date"
                    value={editingDraw.endDate || ""}
                    onChange={(e) =>
                      setEditingDraw({
                        ...editingDraw,
                        endDate: e.target.value
                      })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-300">نوع المشاركة</Label>
                <Select
                  value={editingDraw.participationType || "email"}
                  onValueChange={(val: "email" | "id") =>
                    setEditingDraw({ ...editingDraw, participationType: val })
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="email" className="text-white">
                      Email
                    </SelectItem>
                    <SelectItem value="id" className="text-white">
                      ID
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDrawDialog(false)}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleUpdateDraw}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  تحديث البيانات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
    </div>
  );
};

export default DrawControl;
