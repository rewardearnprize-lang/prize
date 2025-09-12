import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Database,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

interface TestData {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  testNumber: number;
}

const FirestoreTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState<TestData[]>([]);
  const [newData, setNewData] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [results, setResults] = useState<{
    create: { success: boolean; message: string };
    read: { success: boolean; message: string };
    update: { success: boolean; message: string };
    delete: { success: boolean; message: string };
  }>({
    create: { success: false, message: "" },
    read: { success: false, message: "" },
    update: { success: false, message: "" },
    delete: { success: false, message: "" }
  });

  // Create test data
  const handleCreate = async () => {
    if (!newData.title || !newData.description) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    setIsLoading(true);
    try {
      console.log("➕ Creating test data in Firestore...");
      const testCollection = collection(firestore, "test_data");

      const testDoc = {
        title: newData.title,
        description: newData.description,
        timestamp: new Date().toISOString(),
        testNumber: Math.floor(Math.random() * 1000)
      };

      const docRef = await addDoc(testCollection, testDoc);
      const createdData = { ...testDoc, id: docRef.id };

      setTestData((prev) => [createdData, ...prev]);
      setNewData({ title: "", description: "" });
      setResults((prev) => ({
        ...prev,
        create: { success: true, message: "تم إنشاء البيانات بنجاح" }
      }));

      console.log("✅ Test data created successfully:", createdData);
    } catch (error) {
      console.error("❌ Failed to create test data:", error);
      setResults((prev) => ({
        ...prev,
        create: { success: false, message: `فشل في إنشاء البيانات: ${error}` }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Read test data
  const handleRead = async () => {
    setIsLoading(true);
    try {
      console.log("🔍 Reading test data from Firestore...");
      const testCollection = collection(firestore, "test_data");
      const querySnapshot = await getDocs(testCollection);

      if (!querySnapshot.empty) {
        const data: TestData[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as TestData[];

        setTestData(data);
        setResults((prev) => ({
          ...prev,
          read: { success: true, message: `تم جلب ${data.length} عنصر بنجاح` }
        }));

        console.log("✅ Test data read successfully:", data.length, "items");
      } else {
        setTestData([]);
        setResults((prev) => ({
          ...prev,
          read: { success: true, message: "لا توجد بيانات للعرض" }
        }));
        console.log("📝 No test data found");
      }
    } catch (error) {
      console.error("❌ Failed to read test data:", error);
      setResults((prev) => ({
        ...prev,
        read: { success: false, message: `فشل في جلب البيانات: ${error}` }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Update test data
  const handleUpdate = async (id: string) => {
    if (!editData.title || !editData.description) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔄 Updating test data in Firestore:", id);
      const testDoc = doc(firestore, "test_data", id);

      await updateDoc(testDoc, {
        title: editData.title,
        description: editData.description,
        timestamp: new Date().toISOString()
      });

      setTestData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                title: editData.title,
                description: editData.description,
                timestamp: new Date().toISOString()
              }
            : item
        )
      );

      setEditingId(null);
      setEditData({ title: "", description: "" });
      setResults((prev) => ({
        ...prev,
        update: { success: true, message: "تم تحديث البيانات بنجاح" }
      }));

      console.log("✅ Test data updated successfully");
    } catch (error) {
      console.error("❌ Failed to update test data:", error);
      setResults((prev) => ({
        ...prev,
        update: { success: false, message: `فشل في تحديث البيانات: ${error}` }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Delete test data
  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه البيانات؟")) return;

    setIsLoading(true);
    try {
      console.log("🗑️ Deleting test data from Firestore:", id);
      const testDoc = doc(firestore, "test_data", id);

      await deleteDoc(testDoc);

      setTestData((prev) => prev.filter((item) => item.id !== id));
      setResults((prev) => ({
        ...prev,
        delete: { success: true, message: "تم حذف البيانات بنجاح" }
      }));

      console.log("✅ Test data deleted successfully");
    } catch (error) {
      console.error("❌ Failed to delete test data:", error);
      setResults((prev) => ({
        ...prev,
        delete: { success: false, message: `فشل في حذف البيانات: ${error}` }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing
  const startEdit = (item: TestData) => {
    setEditingId(item.id);
    setEditData({ title: item.title, description: item.description });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ title: "", description: "" });
  };

  // Clear all test data
  const clearAllData = async () => {
    if (!confirm("هل أنت متأكد من حذف جميع البيانات التجريبية؟")) return;

    setIsLoading(true);
    try {
      console.log("🗑️ Clearing all test data...");
      const testCollection = collection(firestore, "test_data");
      const querySnapshot = await getDocs(testCollection);

      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      setTestData([]);
      setResults((prev) => ({
        ...prev,
        delete: { success: true, message: "تم حذف جميع البيانات بنجاح" }
      }));

      console.log("✅ All test data cleared successfully");
    } catch (error) {
      console.error("❌ Failed to clear test data:", error);
      setResults((prev) => ({
        ...prev,
        delete: {
          success: false,
          message: `فشل في حذف جميع البيانات: ${error}`
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Database className="w-5 h-5 mr-2" />
          اختبار Firestore - CRUD Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Results */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(results).map(([operation, result]) => (
            <div key={operation} className="flex items-center space-x-2">
              {result.success ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm text-white capitalize">
                {operation}:
              </span>
              <span
                className={`text-xs ${
                  result.success ? "text-green-400" : "text-red-400"
                }`}
              >
                {result.message || "لم يتم الاختبار بعد"}
              </span>
            </div>
          ))}
        </div>

        {/* Create New Data */}
        <div className="space-y-4 p-4 bg-white/5 rounded-lg">
          <h3 className="text-white font-medium">إنشاء بيانات جديدة</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title" className="text-white">
                العنوان
              </Label>
              <Input
                id="title"
                value={newData.title}
                onChange={(e) =>
                  setNewData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="أدخل العنوان"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-white">
                الوصف
              </Label>
              <Textarea
                id="description"
                value={newData.description}
                onChange={(e) =>
                  setNewData((prev) => ({
                    ...prev,
                    description: e.target.value
                  }))
                }
                placeholder="أدخل الوصف"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <Button
              onClick={handleCreate}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  إنشاء بيانات
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            onClick={handleRead}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري القراءة...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                قراءة البيانات
              </>
            )}
          </Button>

          <Button
            onClick={clearAllData}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                حذف الكل
              </>
            )}
          </Button>
        </div>

        {/* Display Data */}
        {testData.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-white font-medium">
              البيانات المخزنة ({testData.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testData.map((item) => (
                <div key={item.id} className="p-3 bg-white/5 rounded-lg">
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editData.title}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            title: e.target.value
                          }))
                        }
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <Textarea
                        value={editData.description}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            description: e.target.value
                          }))
                        }
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleUpdate(item.id)}
                          disabled={isLoading}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          حفظ
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white"
                        >
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">
                            {item.title}
                          </h4>
                          <p className="text-gray-300 text-sm">
                            {item.description}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(item.timestamp).toLocaleString("ar-SA")} |
                            رقم: {item.testNumber}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            onClick={() => startEdit(item)}
                            size="sm"
                            variant="outline"
                            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(item.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <Alert className="border-blue-500/50 bg-blue-500/10">
          <AlertTriangle className="w-4 h-4 text-blue-400" />
          <AlertDescription className="text-blue-300">
            <strong>تعليمات الاختبار:</strong>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>اضغط "إنشاء بيانات" لإضافة بيانات جديدة إلى Firestore</li>
              <li>اضغط "قراءة البيانات" لجلب جميع البيانات المخزنة</li>
              <li>استخدم أزرار التعديل والحذف لاختبار العمليات</li>
              <li>تحقق من Console المتصفح لرؤية التفاصيل</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default FirestoreTest;
