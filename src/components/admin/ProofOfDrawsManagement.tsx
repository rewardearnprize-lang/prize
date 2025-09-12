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
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Eye,
  CheckCircle,
  XCircle,
  Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProofOfDraws,
  addProofOfDraw,
  updateProofOfDraw,
  deleteProofOfDraw,
  verifyProofOfDraw,
  type ProofOfDraw
} from "@/store/slices/proofOfDrawsSlice";

const ProofOfDrawsManagement = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { proofOfDraws, loading, error } = useAppSelector(
    (state) => state.proofOfDraws
  );

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editingProof, setEditingProof] = useState<ProofOfDraw | null>(null);
  const [viewingProof, setViewingProof] = useState<ProofOfDraw | null>(null);
  const [newProof, setNewProof] = useState({
    drawId: "",
    drawTitle: "",
    winnerId: "",
    winnerName: "",
    winnerEmail: "",
    prize: "",
    prizeValue: "",
    proofType: "video" as "video" | "image" | "document",
    proofUrl: "",
    proofTitle: {
      ar: "",
      en: ""
    },
    proofDescription: {
      ar: "",
      en: ""
    }
  });

  useEffect(() => {
    dispatch(fetchProofOfDraws());
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

  const handleAddProof = async () => {
    if (!newProof.drawTitle || !newProof.winnerName || !newProof.proofUrl) {
      toast({
        title: "خطأ",
        description: "يرجى ملء البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const proofData = {
      drawId: newProof.drawId || `draw_${Date.now()}`,
      drawTitle: newProof.drawTitle,
      winnerId: newProof.winnerId || `winner_${Date.now()}`,
      winnerName: newProof.winnerName,
      winnerEmail: newProof.winnerEmail,
      prize: newProof.prize,
      prizeValue: newProof.prizeValue,
      drawDate: new Date().toISOString(),
      proofType: newProof.proofType,
      proofUrl: newProof.proofUrl,
      proofTitle: {
        ar: newProof.proofTitle.ar || "إثبات السحب",
        en: newProof.proofTitle.en || "Proof of Draw"
      },
      proofDescription: {
        ar: newProof.proofDescription.ar || "إثبات رسمي للسحب",
        en: newProof.proofDescription.en || "Official proof of draw"
      },
      isVerified: false,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await dispatch(addProofOfDraw(proofData));
    if (addProofOfDraw.fulfilled.match(result)) {
      setNewProof({
        drawId: "",
        drawTitle: "",
        winnerId: "",
        winnerName: "",
        winnerEmail: "",
        prize: "",
        prizeValue: "",
        proofType: "video" as "video" | "image" | "document",
        proofUrl: "",
        proofTitle: {
          ar: "",
          en: ""
        },
        proofDescription: {
          ar: "",
          en: ""
        }
      });
      setShowAddDialog(false);
      toast({
        title: "تم بنجاح",
        description: "تم إضافة إثبات السحب بنجاح"
      });
    }
  };

  const handleDeleteProof = async (id: string) => {
    const result = await dispatch(deleteProofOfDraw(id));
    if (deleteProofOfDraw.fulfilled.match(result)) {
      toast({
        title: "تم الحذف",
        description: "تم حذف إثبات السحب بنجاح"
      });
    }
  };

  const handleEditProof = (proof: ProofOfDraw) => {
    setEditingProof(proof);
    setShowEditDialog(true);
  };

  const handleViewProof = (proof: ProofOfDraw) => {
    setViewingProof(proof);
    setShowViewDialog(true);
  };

  const handleVerifyProof = async (id: string) => {
    const result = await dispatch(
      verifyProofOfDraw({
        id,
        verifiedBy: "admin@example.com",
        notes: "تم التحقق من صحة الإثبات"
      })
    );
    if (verifyProofOfDraw.fulfilled.match(result)) {
      toast({
        title: "تم التحقق",
        description: "تم التحقق من إثبات السحب بنجاح"
      });
    }
  };

  const handleUpdateProof = async () => {
    if (!editingProof) return;

    const result = await dispatch(
      updateProofOfDraw({
        id: editingProof.id,
        proofData: editingProof
      })
    );

    if (updateProofOfDraw.fulfilled.match(result)) {
      setShowEditDialog(false);
      setEditingProof(null);
      toast({
        title: "تم بنجاح",
        description: "تم تحديث إثبات السحب"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500/20 text-green-400">تم التحقق</Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400">
            في الانتظار
          </Badge>
        );
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400">مرفوض</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">غير محدد</Badge>;
    }
  };

  const getProofTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />;
      case "image":
        return <Eye className="w-4 h-4" />;
      case "document":
        return <Edit className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">إدارة إثباتات السحب</CardTitle>
            <p className="text-gray-300 text-sm mt-1">
              إجمالي الإثباتات: {proofOfDraws.length} | تم التحقق:{" "}
              {proofOfDraws.filter((p) => p.isVerified).length} | في الانتظار:{" "}
              {proofOfDraws.filter((p) => !p.isVerified).length}
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                إضافة إثبات جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  إضافة إثبات سحب جديد
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">عنوان السحب</Label>
                    <Input
                      value={newProof.drawTitle}
                      onChange={(e) =>
                        setNewProof({ ...newProof, drawTitle: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="مثال: سحب iPhone 15 Pro"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">اسم الفائز</Label>
                    <Input
                      value={newProof.winnerName}
                      onChange={(e) =>
                        setNewProof({ ...newProof, winnerName: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="اسم الفائز"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">البريد الإلكتروني</Label>
                    <Input
                      value={newProof.winnerEmail}
                      onChange={(e) =>
                        setNewProof({
                          ...newProof,
                          winnerEmail: e.target.value
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">الجائزة</Label>
                    <Input
                      value={newProof.prize}
                      onChange={(e) =>
                        setNewProof({ ...newProof, prize: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="مثال: iPhone 15 Pro"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">قيمة الجائزة</Label>
                    <Input
                      value={newProof.prizeValue}
                      onChange={(e) =>
                        setNewProof({ ...newProof, prizeValue: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="مثال: $1199"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">نوع الإثبات</Label>
                    <Select
                      value={newProof.proofType}
                      onValueChange={(value: "video" | "image" | "document") =>
                        setNewProof({ ...newProof, proofType: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="video" className="text-white">
                          فيديو
                        </SelectItem>
                        <SelectItem value="image" className="text-white">
                          صورة
                        </SelectItem>
                        <SelectItem value="document" className="text-white">
                          مستند
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">رابط الإثبات</Label>
                  <Input
                    value={newProof.proofUrl}
                    onChange={(e) =>
                      setNewProof({ ...newProof, proofUrl: e.target.value })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="https://example.com/proof.mp4"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">
                      عنوان الإثبات (عربي)
                    </Label>
                    <Input
                      value={newProof.proofTitle.ar}
                      onChange={(e) =>
                        setNewProof({
                          ...newProof,
                          proofTitle: {
                            ...newProof.proofTitle,
                            ar: e.target.value
                          }
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="عنوان الإثبات بالعربية"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">
                      عنوان الإثبات (إنجليزي)
                    </Label>
                    <Input
                      value={newProof.proofTitle.en}
                      onChange={(e) =>
                        setNewProof({
                          ...newProof,
                          proofTitle: {
                            ...newProof.proofTitle,
                            en: e.target.value
                          }
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Proof Title in English"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">وصف الإثبات (عربي)</Label>
                    <Textarea
                      value={newProof.proofDescription.ar}
                      onChange={(e) =>
                        setNewProof({
                          ...newProof,
                          proofDescription: {
                            ...newProof.proofDescription,
                            ar: e.target.value
                          }
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="وصف الإثبات بالعربية"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">
                      وصف الإثبات (إنجليزي)
                    </Label>
                    <Textarea
                      value={newProof.proofDescription.en}
                      onChange={(e) =>
                        setNewProof({
                          ...newProof,
                          proofDescription: {
                            ...newProof.proofDescription,
                            en: e.target.value
                          }
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Proof Description in English"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleAddProof}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    إضافة الإثبات
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
              <span className="ml-2 text-gray-300">
                جاري تحميل إثباتات السحب...
              </span>
            </div>
          )}

          {!loading && (
            <>
              {proofOfDraws.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                  <div className="text-6xl mb-4">📹</div>
                  <p className="text-xl">لا توجد إثباتات سحب حالياً</p>
                  <p className="text-sm text-gray-500 mt-2">
                    قم بإضافة إثبات جديد للبدء
                  </p>
                </div>
              )}

              {proofOfDraws.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {proofOfDraws.map((proof) => (
                    <Card
                      key={proof.id}
                      className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                              {getProofTypeIcon(proof.proofType)}
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg">
                                {proof.drawTitle || "سحب عام"}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {proof.proofType === "video"
                                  ? "فيديو السحب"
                                  : proof.proofType === "image"
                                  ? "صورة السحب"
                                  : "وثيقة السحب"}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewProof(proof)}
                              className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {!proof.isVerified && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerifyProof(proof.id)}
                                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProof(proof)}
                              className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteProof(proof.id)}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">الفائز:</span>
                            <span className="text-white font-medium">
                              {proof.winnerName || "غير محدد"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">
                              البريد الإلكتروني:
                            </span>
                            <span className="text-blue-400 font-medium">
                              {proof.winnerEmail || "غير محدد"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">الجائزة:</span>
                            <span className="text-green-400 font-medium">
                              {proof.prize || "غير محدد"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">القيمة:</span>
                            <span className="text-yellow-400 font-medium">
                              {proof.prizeValue || "غير محدد"}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          {getStatusBadge(proof.status)}
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">
                              عنوان الإثبات:
                            </span>
                            <span className="text-white font-medium">
                              {proof.proofTitle?.ar ||
                                proof.proofTitle?.en ||
                                "إثبات السحب"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">الوصف:</span>
                            <span className="text-gray-300">
                              {proof.proofDescription?.ar ||
                                proof.proofDescription?.en ||
                                "إثبات رسمي للسحب"}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-green-500/50 text-green-400 hover:bg-green-500/20"
                            onClick={() => handleViewProof(proof)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            عرض
                          </Button>
                          {!proof.isVerified && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                              onClick={() => handleVerifyProof(proof.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              تحقق
                            </Button>
                          )}
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

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">تفاصيل إثبات السحب</DialogTitle>
          </DialogHeader>
          {viewingProof && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">عنوان السحب</Label>
                  <p className="text-white">{viewingProof.drawTitle}</p>
                </div>
                <div>
                  <Label className="text-gray-300">اسم الفائز</Label>
                  <p className="text-white">{viewingProof.winnerName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">البريد الإلكتروني</Label>
                  <p className="text-white">{viewingProof.winnerEmail}</p>
                </div>
                <div>
                  <Label className="text-gray-300">الجائزة</Label>
                  <p className="text-white">
                    {viewingProof.prize} - {viewingProof.prizeValue}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">تاريخ السحب</Label>
                  <p className="text-white">
                    {new Date(viewingProof.drawDate).toLocaleDateString(
                      "ar-SA"
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-300">نوع الإثبات</Label>
                  <p className="text-white capitalize">
                    {viewingProof.proofType === "video"
                      ? "فيديو"
                      : viewingProof.proofType === "image"
                      ? "صورة"
                      : "مستند"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">رابط الإثبات</Label>
                <a
                  href={viewingProof.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {viewingProof.proofUrl}
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">عنوان الإثبات (عربي)</Label>
                  <p className="text-white">{viewingProof.proofTitle.ar}</p>
                </div>
                <div>
                  <Label className="text-gray-300">
                    عنوان الإثبات (إنجليزي)
                  </Label>
                  <p className="text-white">{viewingProof.proofTitle.en}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">وصف الإثبات (عربي)</Label>
                  <p className="text-white">
                    {viewingProof.proofDescription.ar}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-300">وصف الإثبات (إنجليزي)</Label>
                  <p className="text-white">
                    {viewingProof.proofDescription.en}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">الحالة</Label>
                  {getStatusBadge(viewingProof.status)}
                </div>
                <div>
                  <Label className="text-gray-300">ملاحظات</Label>
                  <p className="text-white">
                    {viewingProof.notes || "لا توجد ملاحظات"}
                  </p>
                </div>
              </div>

              {viewingProof.isVerified && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">تم التحقق بواسطة</Label>
                    <p className="text-white">{viewingProof.verifiedBy}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">تاريخ التحقق</Label>
                    <p className="text-white">
                      {viewingProof.verifiedAt
                        ? new Date(viewingProof.verifiedAt).toLocaleDateString(
                            "ar-SA"
                          )
                        : "غير محدد"}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowViewDialog(false)}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">تعديل إثبات السحب</DialogTitle>
          </DialogHeader>
          {editingProof && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">عنوان السحب</Label>
                <Input
                  value={editingProof.drawTitle}
                  onChange={(e) =>
                    setEditingProof({
                      ...editingProof,
                      drawTitle: e.target.value
                    })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">اسم الفائز</Label>
                <Input
                  value={editingProof.winnerName}
                  onChange={(e) =>
                    setEditingProof({
                      ...editingProof,
                      winnerName: e.target.value
                    })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">رابط الإثبات</Label>
                <Input
                  value={editingProof.proofUrl}
                  onChange={(e) =>
                    setEditingProof({
                      ...editingProof,
                      proofUrl: e.target.value
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
                  onClick={handleUpdateProof}
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

export default ProofOfDrawsManagement;
