import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Loader2, Eye, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchWinners,
  addWinner,
  updateWinner,
  deleteWinner,
  updateWinnerStatus,
  type Winner
} from "@/store/slices/winnersSlice";

const WinnersManagement = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { winners, loading, error } = useAppSelector((state) => state.winners);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingWinner, setEditingWinner] = useState<Winner | null>(null);
  const [newWinner, setNewWinner] = useState({
    participantId: "",
    participantName: "",
    drawId: "",
    prize: "",
    status: "pending" as const
  });

  useEffect(() => {
    dispatch(fetchWinners());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleAddWinner = async () => {
    if (!newWinner.participantName || !newWinner.prize) {
      toast({
        title: "خطأ",
        description: "يرجى ملء البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const winnerData = {
      participantId: newWinner.participantId || `participant_${Date.now()}`,
      participantName: newWinner.participantName,
      drawId: newWinner.drawId || `draw_${Date.now()}`,
      drawTitle: "سحب عام",
      prize: newWinner.prize,
      winDate: new Date().toISOString().split("T")[0],
      status: newWinner.status
    };

    const result = await dispatch(addWinner(winnerData));
    if (addWinner.fulfilled.match(result)) {
      setNewWinner({
        participantId: "",
        participantName: "",
        drawId: "",
        prize: "",
        status: "pending" as const
      });
      setShowAddDialog(false);
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الفائز بنجاح"
      });
    }
  };

  const handleDeleteWinner = async (id: string) => {
    const result = await dispatch(deleteWinner(id));
    if (deleteWinner.fulfilled.match(result)) {
      toast({
        title: "تم الحذف",
        description: "تم حذف الفائز بنجاح"
      });
    }
  };

  const handleEditWinner = (winner: Winner) => {
    setEditingWinner(winner);
    setShowEditDialog(true);
  };

  const handleViewWinnerDetails = (winner: Winner) => {
    const details = `
اسم الفائز: ${winner.participantName || winner.winnerEmail || "غير محدد"}
البريد الإلكتروني: ${winner.winnerEmail || "غير محدد"}
الجائزة: ${winner.prize || winner.prizeName?.ar || "غير محدد"}
قيمة الجائزة: ${winner.prizeValue || "غير محدد"}
تاريخ الفوز: ${
      winner.winDate ||
      (winner.drawDate
        ? new Date(winner.drawDate).toLocaleDateString("ar-SA")
        : "غير محدد")
    }
تاريخ التسليم: ${
      winner.deliveryDate
        ? new Date(winner.deliveryDate).toLocaleDateString("ar-SA")
        : "غير محدد"
    }
الحالة: ${
      winner.isDelivered
        ? "تم التسليم"
        : winner.isVerified
        ? "تم التأكيد"
        : "في الانتظار"
    }
    `;

    toast({
      title: "تفاصيل الفائز",
      description: details,
      duration: 5000
    });
  };

  const handleUpdateWinner = async () => {
    if (!editingWinner) return;

    const result = await dispatch(
      updateWinner({
        id: editingWinner.id,
        winnerData: editingWinner
      })
    );

    if (updateWinner.fulfilled.match(result)) {
      setShowEditDialog(false);
      setEditingWinner(null);
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات الفائز"
      });
    }
  };

  const handleStatusChange = async (
    id: string,
    status: "pending" | "claimed" | "delivered"
  ) => {
    await dispatch(updateWinnerStatus({ id, status }));
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400">
            في الانتظار
          </Badge>
        );
      case "claimed":
        return (
          <Badge className="bg-blue-500/20 text-blue-400">تم المطالبة</Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-green-500/20 text-green-400">تم التسليم</Badge>
        );
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">غير محدد</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">إدارة الفائزين</CardTitle>
            <p className="text-gray-300 text-sm mt-1">
              إجمالي الفائزين: {winners.length} | تم التسليم:{" "}
              {
                winners.filter((w) => w.isDelivered || w.status === "delivered")
                  .length
              }{" "}
              | في الانتظار:{" "}
              {
                winners.filter(
                  (w) =>
                    !w.isDelivered && !w.isVerified && w.status !== "delivered"
                ).length
              }
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                إضافة فائز جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  إضافة فائز جديد
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">اسم الفائز</Label>
                  <Input
                    value={newWinner.participantName}
                    onChange={(e) =>
                      setNewWinner({
                        ...newWinner,
                        participantName: e.target.value
                      })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="اسم الفائز"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">الجائزة</Label>
                  <Input
                    value={newWinner.prize}
                    onChange={(e) =>
                      setNewWinner({ ...newWinner, prize: e.target.value })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="مثال: iPhone 15 Pro"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleAddWinner}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    إضافة الفائز
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-300">جاري تحميل الفائزين...</span>
            </div>
          )}

          {!loading && (
            <>
              {winners.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-xl">لا توجد فائزين حالياً</p>
                  <p className="text-sm text-gray-500 mt-2">
                    قم بإضافة فائز جديد للبدء
                  </p>
                </div>
              )}

              {winners.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {winners.map((winner) => (
                    <Card
                      key={winner.id}
                      className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                              <Trophy className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg">
                                {winner.participantName ||
                                  winner.winnerEmail ||
                                  "غير محدد"}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {winner.drawTitle ||
                                  winner.prizeId ||
                                  "سحب عام"}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewWinnerDetails(winner)}
                              className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditWinner(winner)}
                              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteWinner(winner.id)}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">الجائزة:</span>
                            <span className="text-green-400 font-medium">
                              {winner.prize ||
                                winner.prizeName?.ar ||
                                "غير محدد"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">القيمة:</span>
                            <span className="text-blue-400 font-medium">
                              {winner.prizeValue || "غير محدد"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">تاريخ الفوز:</span>
                            <span className="text-yellow-400 font-medium">
                              {winner.winDate ||
                                (winner.drawDate
                                  ? new Date(
                                      winner.drawDate
                                    ).toLocaleDateString("ar-SA")
                                  : "غير محدد")}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <Select
                            value={
                              winner.status ||
                              (winner.isDelivered
                                ? "delivered"
                                : winner.isVerified
                                ? "claimed"
                                : "pending")
                            }
                            onValueChange={(
                              value: "pending" | "claimed" | "delivered"
                            ) => handleStatusChange(winner.id, value)}
                          >
                            <SelectTrigger className="w-full bg-transparent border-gray-600 text-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem
                                value="pending"
                                className="text-white"
                              >
                                في الانتظار
                              </SelectItem>
                              <SelectItem
                                value="claimed"
                                className="text-white"
                              >
                                تم المطالبة
                              </SelectItem>
                              <SelectItem
                                value="delivered"
                                className="text-white"
                              >
                                تم التسليم
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-green-500/50 text-green-400 hover:bg-green-500/20"
                            onClick={() => handleViewWinnerDetails(winner)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            عرض
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                            onClick={() => handleEditWinner(winner)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            تعديل
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              تعديل بيانات الفائز
            </DialogTitle>
          </DialogHeader>
          {editingWinner && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">اسم الفائز</Label>
                <Input
                  value={editingWinner.participantName}
                  onChange={(e) =>
                    setEditingWinner({
                      ...editingWinner,
                      participantName: e.target.value
                    })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">الجائزة</Label>
                <Input
                  value={editingWinner.prize}
                  onChange={(e) =>
                    setEditingWinner({
                      ...editingWinner,
                      prize: e.target.value
                    })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">قيمة الجائزة</Label>
                <Input
                  value={editingWinner.prizeValue}
                  onChange={(e) =>
                    setEditingWinner({
                      ...editingWinner,
                      prizeValue: e.target.value
                    })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleUpdateWinner}
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

export default WinnersManagement;
