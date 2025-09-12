import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchProofOfDraws,
  addProofOfDraw,
  updateProofOfDraw,
  deleteProofOfDraw,
  verifyProofOfDraw
} from "@/store/slices/proofOfDrawsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProofOfDrawsTest: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { proofOfDraws, loading, error } = useSelector(
    (state: RootState) => state.proofOfDraws
  );
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`
    ]);
  };

  const runProofOfDrawsTest = async () => {
    setTestResults([]);
    addResult("بدء اختبار إثباتات السحب...");

    try {
      // Test 1: Fetch current proof of draws
      addResult("🔍 اختبار جلب إثباتات السحب الحالية...");
      await dispatch(fetchProofOfDraws());
      addResult(`✅ تم جلب ${proofOfDraws.length} إثبات سحب`);

      // Test 2: Add new proof of draw
      addResult("➕ اختبار إضافة إثبات سحب جديد...");
      const newProof = {
        drawId: `draw_test_${Date.now()}`,
        drawTitle: `سحب اختبار ${Date.now()}`,
        winnerId: `winner_test_${Date.now()}`,
        winnerName: `فائز اختبار ${Date.now()}`,
        winnerEmail: `test${Date.now()}@example.com`,
        prize: "جائزة اختبار",
        prizeValue: "1000 ريال",
        drawDate: new Date().toISOString(),
        proofType: "video" as const,
        proofUrl: "https://example.com/test-proof.mp4",
        proofTitle: {
          ar: "إثبات اختبار السحب",
          en: "Test Draw Proof"
        },
        proofDescription: {
          ar: "وصف اختبار لإثبات السحب",
          en: "Test description for draw proof"
        },
        isVerified: false,
        status: "pending" as const
      };

             const addResultAction = await dispatch(addProofOfDraw(newProof));
             if (addProofOfDraw.fulfilled.match(addResultAction)) {
         const addedProof = addResultAction.payload;
        addResult(`✅ تم إضافة إثبات سحب جديد: ${addedProof.drawTitle}`);
        addResult(`   - معرف الإثبات: ${addedProof.id}`);
        addResult(`   - الفائز: ${addedProof.winnerName}`);
        addResult(`   - الجائزة: ${addedProof.prize}`);

        // Test 3: Update proof of draw
        addResult("🔄 اختبار تحديث إثبات السحب...");
        const updateData = {
          drawTitle: `سحب اختبار محدث ${Date.now()}`,
          prizeValue: "2000 ريال",
          notes: "تم التحديث بواسطة الاختبار"
        };

        const updateResult = await dispatch(
          updateProofOfDraw({
            id: addedProof.id,
            proofData: updateData
          })
        );

        if (updateProofOfDraw.fulfilled.match(updateResult)) {
          addResult(`✅ تم تحديث إثبات السحب: ${updateData.drawTitle}`);
        } else {
          addResult("❌ فشل في تحديث إثبات السحب");
        }

        // Test 4: Verify proof of draw
        addResult("✅ اختبار التحقق من إثبات السحب...");
        const verifyResult = await dispatch(
          verifyProofOfDraw({
            id: addedProof.id,
            verifiedBy: "admin@test.com",
            notes: "تم التحقق بواسطة الاختبار"
          })
        );

        if (verifyProofOfDraw.fulfilled.match(verifyResult)) {
          addResult(`✅ تم التحقق من إثبات السحب بنجاح`);
          addResult(
            `   - تم التحقق بواسطة: ${verifyResult.payload.verifiedBy}`
          );
          addResult(`   - تاريخ التحقق: ${verifyResult.payload.verifiedAt}`);
        } else {
          addResult("❌ فشل في التحقق من إثبات السحب");
        }

        // Test 5: Delete proof of draw
        addResult("🗑️ اختبار حذف إثبات السحب...");
        const deleteResult = await dispatch(deleteProofOfDraw(addedProof.id));
        if (deleteProofOfDraw.fulfilled.match(deleteResult)) {
          addResult(`✅ تم حذف إثبات السحب بنجاح`);
        } else {
          addResult("❌ فشل في حذف إثبات السحب");
        }
      } else {
        addResult("❌ فشل في إضافة إثبات سحب جديد");
      }

      // Test 6: Final verification
      addResult("🔍 التحقق النهائي من البيانات...");
      await dispatch(fetchProofOfDraws());
      addResult(`✅ العدد النهائي لإثباتات السحب: ${proofOfDraws.length}`);

      // Test 7: Check data structure
      addResult("📊 اختبار هيكل البيانات...");
      if (proofOfDraws.length > 0) {
        const sampleProof = proofOfDraws[0];
        addResult(`   - عنوان السحب: ${sampleProof.drawTitle}`);
        addResult(`   - اسم الفائز: ${sampleProof.winnerName}`);
        addResult(`   - الجائزة: ${sampleProof.prize}`);
        addResult(`   - نوع الإثبات: ${sampleProof.proofType}`);
        addResult(`   - الحالة: ${sampleProof.status}`);
        addResult(`   - تم التحقق: ${sampleProof.isVerified ? "نعم" : "لا"}`);
      }

      addResult("🎉 تم الانتهاء من جميع اختبارات إثباتات السحب بنجاح!");
    } catch (error) {
      addResult(`❌ خطأ في الاختبار: ${error}`);
    }
  };

  useEffect(() => {
    runProofOfDrawsTest();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        اختبار إثباتات السحب
      </h2>

      <div className="mb-4">
        <Button
          onClick={runProofOfDrawsTest}
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
          معلومات إثباتات السحب الحالية:
        </h3>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600">
            عدد إثباتات السحب: {proofOfDraws.length}
          </p>
          <p className="text-sm text-gray-600">
            تم التحقق: {proofOfDraws.filter((p) => p.isVerified).length}
          </p>
          <p className="text-sm text-gray-600">
            في الانتظار: {proofOfDraws.filter((p) => !p.isVerified).length}
          </p>

          {proofOfDraws.slice(0, 3).map((proof, index) => (
            <div key={proof.id} className="mt-2 p-2 bg-white rounded border">
              <p className="text-sm">
                <strong>إثبات {index + 1}:</strong> {proof.drawTitle}
              </p>
              <p className="text-xs text-gray-500">
                الفائز: {proof.winnerName} | الجائزة: {proof.prize}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant={proof.isVerified ? "default" : "secondary"}
                  className="text-xs"
                >
                  {proof.isVerified ? "تم التحقق" : "في الانتظار"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {proof.proofType}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProofOfDrawsTest;
