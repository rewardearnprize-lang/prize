import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchMainPageData,
  addMainPageData,
  updateMainPageData,
  deleteMainPageData,
  toggleActiveStatus
} from "@/store/slices/mainPageDataSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MainPageDataTest: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mainPageData, loading, error } = useSelector(
    (state: RootState) => state.mainPageData
  );
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`
    ]);
  };

  const runMainPageDataTest = async () => {
    setTestResults([]);
    addResult("بدء اختبار بيانات الصفحة الرئيسية...");

    try {
      // Test 1: Fetch current main page data
      addResult("🔍 اختبار جلب بيانات الصفحة الرئيسية الحالية...");
      await dispatch(fetchMainPageData());
      addResult(`✅ تم جلب ${mainPageData.length} عنصر`);

      // Test 2: Add new main page data
      addResult("➕ اختبار إضافة عنصر جديد...");
      const newData = {
        title: `عنصر اختبار ${Date.now()}`,
        description: "وصف اختبار للعنصر الجديد",
        category: "Test",
        value: "$999",
        icon: "🧪",
        isActive: true,
        currentParticipations: 0,
        maxParticipations: 50,
        requirements: [
          "التسجيل في الموقع",
          "مشاهدة الفيديو التعريفي",
          "مشاركة على وسائل التواصل"
        ],
        reward: 5,
        estimatedTime: 15,
        difficulty: "medium" as const
      };

             const addResultAction = await dispatch(addMainPageData(newData));
             if (addMainPageData.fulfilled.match(addResultAction)) {
         const addedData = addResultAction.payload;
        addResult(`✅ تم إضافة عنصر جديد: ${addedData.title}`);
        addResult(`   - معرف العنصر: ${addedData.id}`);
        addResult(`   - الفئة: ${addedData.category}`);
        addResult(`   - القيمة: ${addedData.value}`);

        // Test 3: Update main page data
        addResult("🔄 اختبار تحديث العنصر...");
        const updateData = {
          title: `عنصر اختبار محدث ${Date.now()}`,
          value: "$1,299",
          reward: 10,
          description: "وصف محدث للعنصر"
        };

        const updateResult = await dispatch(
          updateMainPageData({
            id: addedData.id,
            data: updateData
          })
        );

        if (updateMainPageData.fulfilled.match(updateResult)) {
          addResult(`✅ تم تحديث العنصر: ${updateData.title}`);
          addResult(`   - القيمة الجديدة: ${updateData.value}`);
          addResult(`   - المكافأة الجديدة: ${updateData.reward} نقاط`);
        } else {
          addResult("❌ فشل في تحديث العنصر");
        }

        // Test 4: Toggle active status
        addResult("🔄 اختبار تغيير حالة النشاط...");
        const toggleResult = await dispatch(toggleActiveStatus(addedData.id));
        if (toggleActiveStatus.fulfilled.match(toggleResult)) {
          addResult(
            `✅ تم تغيير حالة النشاط إلى: ${
              toggleResult.payload.isActive ? "نشط" : "غير نشط"
            }`
          );
        } else {
          addResult("❌ فشل في تغيير حالة النشاط");
        }

        // Test 5: Delete main page data
        addResult("🗑️ اختبار حذف العنصر...");
        const deleteResult = await dispatch(deleteMainPageData(addedData.id));
        if (deleteMainPageData.fulfilled.match(deleteResult)) {
          addResult(`✅ تم حذف العنصر بنجاح`);
        } else {
          addResult("❌ فشل في حذف العنصر");
        }
      } else {
        addResult("❌ فشل في إضافة عنصر جديد");
      }

      // Test 6: Final verification
      addResult("🔍 التحقق النهائي من البيانات...");
      await dispatch(fetchMainPageData());
      addResult(`✅ العدد النهائي للعناصر: ${mainPageData.length}`);

      // Test 7: Check data structure
      addResult("📊 اختبار هيكل البيانات...");
      if (mainPageData.length > 0) {
        const sampleData = mainPageData[0];
        addResult(`   - العنوان: ${sampleData.title}`);
        addResult(`   - الفئة: ${sampleData.category}`);
        addResult(`   - القيمة: ${sampleData.value}`);
        addResult(`   - الأيقونة: ${sampleData.icon}`);
        addResult(`   - مستوى الصعوبة: ${sampleData.difficulty}`);
        addResult(`   - الحالة: ${sampleData.isActive ? "نشط" : "غير نشط"}`);
        addResult(
          `   - المشاركات: ${sampleData.currentParticipations}/${sampleData.maxParticipations}`
        );
        addResult(`   - المكافأة: ${sampleData.reward} نقاط`);
        addResult(`   - المتطلبات: ${sampleData.requirements.length} متطلب`);
      }

      addResult(
        "🎉 تم الانتهاء من جميع اختبارات بيانات الصفحة الرئيسية بنجاح!"
      );
    } catch (error) {
      addResult(`❌ خطأ في الاختبار: ${error}`);
    }
  };

  useEffect(() => {
    runMainPageDataTest();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        اختبار بيانات الصفحة الرئيسية
      </h2>

      <div className="mb-4">
        <Button
          onClick={runMainPageDataTest}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "جاري الاختبار..." : "إعادة تشغيل الاختبار"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          خطأ: {error}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">نتائج الاختبار:</h3>
        <div className="bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">لا توجد نتائج بعد...</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          معلومات البيانات الحالية:
        </h3>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600">
            عدد العناصر: {mainPageData.length}
          </p>
          <p className="text-sm text-gray-600">
            نشط: {mainPageData.filter((item) => item.isActive).length}
          </p>
          <p className="text-sm text-gray-600">
            غير نشط: {mainPageData.filter((item) => !item.isActive).length}
          </p>

          {mainPageData.slice(0, 3).map((item, index) => (
            <div key={item.id} className="mt-2 p-2 bg-white rounded border">
              <p className="text-sm">
                <strong>عنصر {index + 1}:</strong> {item.title}
              </p>
              <p className="text-xs text-gray-500">
                الفئة: {item.category} | القيمة: {item.value} | المكافأة:{" "}
                {item.reward} نقاط
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant={item.isActive ? "default" : "secondary"}
                  className="text-xs"
                >
                  {item.isActive ? "نشط" : "غير نشط"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {item.difficulty}
                </Badge>
                <span className="text-xs text-gray-500">
                  {item.currentParticipations}/{item.maxParticipations}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPageDataTest;
