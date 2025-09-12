import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  RefreshCw
} from "lucide-react";
import { runAllQueryTests, INDEX_URLS } from "@/lib/firestore-queries-test";

interface QueryTestResult {
  collection: string;
  queryName: string;
  success: boolean;
  error?: string;
  count?: number;
  missingIndex?: boolean;
  indexUrl?: string;
}

interface TestSummary {
  total: number;
  success: number;
  failure: number;
  missingIndexes: number;
}

const QueriesTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<QueryTestResult[]>([]);
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [missingIndexes, setMissingIndexes] = useState<
    { collection: string; queryName: string; url: string }[]
  >([]);

  const handleRunTests = async () => {
    setIsLoading(true);
    try {
      console.log("🚀 بدء اختبار جميع الـ Queries...");
      const testResult = await runAllQueryTests();

      setResults(testResult.results);
      setSummary(testResult.summary);
      setMissingIndexes(testResult.missingIndexes);

      console.log("✅ تم الانتهاء من الاختبار");
    } catch (error) {
      console.error("❌ خطأ في الاختبار:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openIndexUrl = (url: string) => {
    window.open(url, "_blank");
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge className="bg-green-500 hover:bg-green-600">
        <CheckCircle className="w-3 h-3 mr-1" />
        نجح
      </Badge>
    ) : (
      <Badge className="bg-red-500 hover:bg-red-600">
        <XCircle className="w-3 h-3 mr-1" />
        فشل
      </Badge>
    );
  };

  const getCollectionColor = (collection: string) => {
    const colors = {
      offers: "text-blue-400",
      participants: "text-green-400",
      winners: "text-yellow-400",
      draws: "text-purple-400"
    };
    return colors[collection as keyof typeof colors] || "text-gray-400";
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Database className="w-5 h-5 mr-2" />
          اختبار Firestore Queries
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleRunTests}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 px-8"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                جاري الاختبار...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                تشغيل جميع الاختبارات
              </>
            )}
          </Button>
        </div>

        {/* Summary */}
        {summary && (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">
                {summary.total}
              </div>
              <div className="text-gray-300 text-sm">إجمالي الاختبارات</div>
            </div>
            <div className="bg-green-500/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">
                {summary.success}
              </div>
              <div className="text-green-300 text-sm">نجح</div>
            </div>
            <div className="bg-red-500/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-400">
                {summary.failure}
              </div>
              <div className="text-red-300 text-sm">فشل</div>
            </div>
            <div className="bg-yellow-500/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {summary.missingIndexes}
              </div>
              <div className="text-yellow-300 text-sm">Indexes مطلوبة</div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-white font-medium text-lg">نتائج الاختبارات</h3>

            {/* Group by collection */}
            {["offers", "participants", "winners", "draws"].map(
              (collectionName) => {
                const collectionResults = results.filter(
                  (r) => r.collection === collectionName
                );
                if (collectionResults.length === 0) return null;

                return (
                  <div key={collectionName} className="space-y-2">
                    <h4
                      className={`font-medium ${getCollectionColor(
                        collectionName
                      )}`}
                    >
                      {collectionName === "offers" && "العروض"}
                      {collectionName === "participants" && "المشاركون"}
                      {collectionName === "winners" && "الفائزون"}
                      {collectionName === "draws" && "السحوبات"}
                    </h4>

                    <div className="space-y-2">
                      {collectionResults.map((result, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(result.success)}
                                <span className="text-white text-sm">
                                  {result.queryName}
                                </span>
                              </div>
                              {result.success && result.count !== undefined && (
                                <div className="text-gray-300 text-xs mt-1">
                                  عدد العناصر: {result.count}
                                </div>
                              )}
                              {!result.success && result.error && (
                                <div className="text-red-300 text-xs mt-1">
                                  خطأ: {result.error}
                                </div>
                              )}
                            </div>

                            {!result.success &&
                              result.missingIndex &&
                              result.indexUrl && (
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      openIndexUrl(result.indexUrl!)
                                    }
                                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                                  >
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    إنشاء Index
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      copyToClipboard(result.indexUrl!)
                                    }
                                    className="border-gray-500/50 text-gray-400 hover:bg-gray-500/20"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

        {/* Missing Indexes Section */}
        {missingIndexes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-white font-medium text-lg">
              الروابط المباشرة للـ Indexes المطلوبة
            </h3>

            <div className="space-y-3">
              {missingIndexes.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-yellow-400 font-medium">
                        {index + 1}. {item.collection}: {item.queryName}
                      </div>
                      <div className="text-yellow-300 text-xs mt-1">
                        انسخ الرابط أو اضغط "إنشاء Index"
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openIndexUrl(item.url)}
                        className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        إنشاء Index
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(item.url)}
                        className="border-gray-500/50 text-gray-400 hover:bg-gray-500/20"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
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
              <li>اضغط "تشغيل جميع الاختبارات" لاختبار جميع الـ Queries</li>
              <li>سيتم اختبار 12 query مختلف لجميع Collections</li>
              <li>
                إذا فشل أي query، سيظهر رابط مباشر لإنشاء الـ Index المطلوب
              </li>
              <li>يمكنك نسخ الرابط أو فتحه مباشرة في Firebase Console</li>
              <li>تحقق من Console المتصفح لرؤية التفاصيل الكاملة</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* All Index URLs */}
        <div className="space-y-4">
          <h3 className="text-white font-medium text-lg">
            جميع روابط الـ Indexes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(INDEX_URLS).map(([collection, indexes]) => (
              <div key={collection} className="space-y-2">
                <h4 className={`font-medium ${getCollectionColor(collection)}`}>
                  {collection === "offers" && "العروض"}
                  {collection === "participants" && "المشاركون"}
                  {collection === "winners" && "الفائزون"}
                  {collection === "draws" && "السحوبات"}
                </h4>

                <div className="space-y-2">
                  {Object.entries(indexes).map(([indexName, url]) => (
                    <div
                      key={indexName}
                      className="flex items-center space-x-2"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openIndexUrl(url)}
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        {indexName}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(url)}
                        className="border-gray-500/50 text-gray-400 hover:bg-gray-500/20"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueriesTest;
