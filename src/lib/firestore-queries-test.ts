import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer
} from "firebase/firestore";
import { firestore } from "./firebase";

// Direct URLs for creating indexes
const INDEX_URLS = {
  offers: {
    status_createdDate:
      "https://console.firebase.google.com/v1/r/project/fir-project-b3e4e/firestore/indexes?create_composite=Cllwcm9qZWN0cy9maXItcHJvamVjdC1iM2U0ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvb2ZmZXJzL2luZGV4ZXNfXxABGgwKBnN0YXR1cxABGg0KCWNyZWF0ZWREYXRlEAIaDAoIX19uYW1lX18QAg",
    status_category:
      "https://console.firebase.google.com/v1/r/project/fir-project-b3e4e/firestore/indexes?create_composite=Cllwcm9qZWN0cy9maXItcHJvamVjdC1iM2U0ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvb2ZmZXJzL2luZGV4ZXNfXxABGgwKBnN0YXR1cxABGgwKB2NhdGVnb3J5EAIaDAoIX19uYW1lX18QAg",
    category_createdDate:
      "https://console.firebase.google.com/v1/r/project/fir-project-b3e4e/firestore/indexes?create_composite=Cllwcm9qZWN0cy9maXItcHJvamVjdC1iM2U0ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvb2ZmZXJzL2luZGV4ZXNfXxABGgwKB2NhdGVnb3J5EAEaDQoJY3JlYXRlZERhdGUQAhgB"
  },
  participants: {
    status_joinDate:
      "https://console.firebase.google.com/v1/r/project/fir-project-b3e4e/firestore/indexes?create_composite=Cllwcm9qZWN0cy9maXItcHJvamVjdC1iM2U0ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcGFydGljaXBhbnRzL2luZGV4ZXNfXxABGgwKBnN0YXR1cxABGgwKB2pvaW5EYXRlEAIaDAoIX19uYW1lX18QAg",
    status_totalPoints:
      "https://console.firebase.google.com/v1/r/project/fir-project-b3e4e/firestore/indexes?create_composite=Cllwcm9qZWN0cy9maXItcHJvamVjdC1iM2U0ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcGFydGljaXBhbnRzL2luZGV4ZXNfXxABGgwKBnN0YXR1cxABGg0KCXRvdGFsUG9pbnRzEAIaDAoIX19uYW1lX18QAg",
    totalPoints_joinDate:
      "https://console.firebase.google.com/v1/r/project/fir-project-b3e4e/firestore/indexes?create_composite=Cllwcm9qZWN0cy9maXItcHJvamVjdC1iM2U0ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcGFydGljaXBhbnRzL2luZGV4ZXNfXxABGg0KCXRvdGFsUG9pbnRzEAEaDAoHam9pbkRhdGUQAhgB"
  },
  winners: {
    status_winDate:
      "https://console.firebase.google.com/v1/r/project/fir-project-b3e4e/firestore/indexes?create_composite=Cllwcm9qZWN0cy9maXItcHJvamVjdC1iM2U0ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvd2lubmVycy9pbmRleGVzX18QARoMCgZzdGF0dXMQARoMCgd3aW5EYXRlEAIaDAoIX19uYW1lX18QAg",
    drawId_status:
      "https://console.firebase.google.com/v1/r/project/fir-project-b3e4e/firestore/indexes?create_composite=Cllwcm9qZWN0cy9maXItcHJvamVjdC1iM2U0ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvd2lubmVycy9pbmRleGVzX18QARoLCgVkcmF3SWQQARoMCgZzdGF0dXMQAhgB",
    participantId_status:
      "https://console.firebase.google.com/v1/r/project/fir-project-b3e4e/firestore/indexes?create_composite=Cllwcm9qZWN0cy9maXItcHJvamVjdC1iM2U0ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvd2lubmVycy9pbmRleGVzX18QARoPCg1wYXJ0aWNpcGFudElkEAEaDAoGc3RhdHVzEAIYAQ"
  },
  draws: {
    status_startDate:
      "https://console.firebase.google.com/v1/r/project/fir-project-b3e4e/firestore/indexes?create_composite=Cllwcm9qZWN0cy9maXItcHJvamVjdC1iM2U0ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvZHJhd3MvaW5kZXhlc19fEAEaDAoGc3RhdHVzEAEaDQoJc3RhcnREYXRlEAIaDAoIX19uYW1lX18QAg",
    status_endDate:
      "https://console.firebase.google.com/v1/r/project/fir-project-b3e4e/firestore/indexes?create_composite=Cllwcm9qZWN0cy9maXItcHJvamVjdC1iM2U0ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvZHJhd3MvaW5kZXhlc19fEAEaDAoGc3RhdHVzEAEaDAoHZW5kRGF0ZRACGgwKCF9fbmFtZV9fEAE",
    startDate_endDate:
      "https://console.firebase.google.com/v1/r/project/fir-project-b3e4e/firestore/indexes?create_composite=Cllwcm9qZWN0cy9maXItcHJvamVjdC1iM2U0ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvZHJhd3MvaW5kZXhlc19fEAEaDQoJc3RhcnREYXRlEAEaDAoHZW5kRGF0ZRACGg0KCWNyZWF0ZWRBdBAD"
  }
};

interface QueryTestResult {
  collection: string;
  queryName: string;
  success: boolean;
  error?: string;
  count?: number;
  missingIndex?: boolean;
  indexUrl?: string;
}

// Test queries for Offers collection
const testOffersQueries = async (): Promise<QueryTestResult[]> => {
  const results: QueryTestResult[] = [];
  const offersCollection = collection(firestore, "offers");

  // Test 1: Active offers ordered by createdDate
  try {
    const q1 = query(
      offersCollection,
      where("status", "==", "active"),
      orderBy("createdDate", "desc")
    );
    const snapshot1 = await getDocs(q1);
    results.push({
      collection: "offers",
      queryName: "Active offers ordered by createdDate",
      success: true,
      count: snapshot1.size
    });
  } catch (error: any) {
    results.push({
      collection: "offers",
      queryName: "Active offers ordered by createdDate",
      success: false,
      error: error.message,
      missingIndex: error.message.includes("index"),
      indexUrl: INDEX_URLS.offers.status_createdDate
    });
  }

  // Test 2: Offers by category and status
  try {
    const q2 = query(
      offersCollection,
      where("status", "==", "active"),
      where("category", "==", "social"),
      orderBy("createdDate", "desc")
    );
    const snapshot2 = await getDocs(q2);
    results.push({
      collection: "offers",
      queryName: "Active social offers ordered by createdDate",
      success: true,
      count: snapshot2.size
    });
  } catch (error: any) {
    results.push({
      collection: "offers",
      queryName: "Active social offers ordered by createdDate",
      success: false,
      error: error.message,
      missingIndex: error.message.includes("index"),
      indexUrl: INDEX_URLS.offers.status_category
    });
  }

  // Test 3: Social offers ordered by createdDate
  try {
    const q3 = query(
      offersCollection,
      where("category", "==", "social"),
      orderBy("createdDate", "desc")
    );
    const snapshot3 = await getDocs(q3);
    results.push({
      collection: "offers",
      queryName: "Social offers ordered by createdDate",
      success: true,
      count: snapshot3.size
    });
  } catch (error: any) {
    results.push({
      collection: "offers",
      queryName: "Social offers ordered by createdDate",
      success: false,
      error: error.message,
      missingIndex: error.message.includes("index"),
      indexUrl: INDEX_URLS.offers.category_createdDate
    });
  }

  return results;
};

// Test queries for Participants collection
const testParticipantsQueries = async (): Promise<QueryTestResult[]> => {
  const results: QueryTestResult[] = [];
  const participantsCollection = collection(firestore, "participants");

  // Test 1: Active participants ordered by joinDate
  try {
    const q1 = query(
      participantsCollection,
      where("status", "==", "active"),
      orderBy("joinDate", "desc")
    );
    const snapshot1 = await getDocs(q1);
    results.push({
      collection: "participants",
      queryName: "Active participants ordered by joinDate",
      success: true,
      count: snapshot1.size
    });
  } catch (error: any) {
    results.push({
      collection: "participants",
      queryName: "Active participants ordered by joinDate",
      success: false,
      error: error.message,
      missingIndex: error.message.includes("index"),
      indexUrl: INDEX_URLS.participants.status_joinDate
    });
  }

  // Test 2: Active participants ordered by totalPoints
  try {
    const q2 = query(
      participantsCollection,
      where("status", "==", "active"),
      orderBy("totalPoints", "desc")
    );
    const snapshot2 = await getDocs(q2);
    results.push({
      collection: "participants",
      queryName: "Active participants ordered by totalPoints",
      success: true,
      count: snapshot2.size
    });
  } catch (error: any) {
    results.push({
      collection: "participants",
      queryName: "Active participants ordered by totalPoints",
      success: false,
      error: error.message,
      missingIndex: error.message.includes("index"),
      indexUrl: INDEX_URLS.participants.status_totalPoints
    });
  }

  // Test 3: Participants ordered by totalPoints and joinDate
  try {
    const q3 = query(
      participantsCollection,
      orderBy("totalPoints", "desc"),
      orderBy("joinDate", "desc")
    );
    const snapshot3 = await getDocs(q3);
    results.push({
      collection: "participants",
      queryName: "Participants ordered by totalPoints and joinDate",
      success: true,
      count: snapshot3.size
    });
  } catch (error: any) {
    results.push({
      collection: "participants",
      queryName: "Participants ordered by totalPoints and joinDate",
      success: false,
      error: error.message,
      missingIndex: error.message.includes("index"),
      indexUrl: INDEX_URLS.participants.totalPoints_joinDate
    });
  }

  return results;
};

// Test queries for Winners collection
const testWinnersQueries = async (): Promise<QueryTestResult[]> => {
  const results: QueryTestResult[] = [];
  const winnersCollection = collection(firestore, "winners");

  // Test 1: Pending winners ordered by winDate
  try {
    const q1 = query(
      winnersCollection,
      where("status", "==", "pending"),
      orderBy("winDate", "desc")
    );
    const snapshot1 = await getDocs(q1);
    results.push({
      collection: "winners",
      queryName: "Pending winners ordered by winDate",
      success: true,
      count: snapshot1.size
    });
  } catch (error: any) {
    results.push({
      collection: "winners",
      queryName: "Pending winners ordered by winDate",
      success: false,
      error: error.message,
      missingIndex: error.message.includes("index"),
      indexUrl: INDEX_URLS.winners.status_winDate
    });
  }

  // Test 2: Winners by drawId and status
  try {
    const q2 = query(
      winnersCollection,
      where("drawId", "==", "draw_1"),
      where("status", "==", "claimed")
    );
    const snapshot2 = await getDocs(q2);
    results.push({
      collection: "winners",
      queryName: "Winners by drawId and status",
      success: true,
      count: snapshot2.size
    });
  } catch (error: any) {
    results.push({
      collection: "winners",
      queryName: "Winners by drawId and status",
      success: false,
      error: error.message,
      missingIndex: error.message.includes("index"),
      indexUrl: INDEX_URLS.winners.drawId_status
    });
  }

  // Test 3: Winners by participantId and status
  try {
    const q3 = query(
      winnersCollection,
      where("participantId", "==", "participant_1"),
      where("status", "==", "delivered")
    );
    const snapshot3 = await getDocs(q3);
    results.push({
      collection: "winners",
      queryName: "Winners by participantId and status",
      success: true,
      count: snapshot3.size
    });
  } catch (error: any) {
    results.push({
      collection: "winners",
      queryName: "Winners by participantId and status",
      success: false,
      error: error.message,
      missingIndex: error.message.includes("index"),
      indexUrl: INDEX_URLS.winners.participantId_status
    });
  }

  return results;
};

// Test queries for Draws collection
const testDrawsQueries = async (): Promise<QueryTestResult[]> => {
  const results: QueryTestResult[] = [];
  const drawsCollection = collection(firestore, "draws");

  // Test 1: Active draws ordered by startDate
  try {
    const q1 = query(
      drawsCollection,
      where("status", "==", "active"),
      orderBy("startDate", "desc")
    );
    const snapshot1 = await getDocs(q1);
    results.push({
      collection: "draws",
      queryName: "Active draws ordered by startDate",
      success: true,
      count: snapshot1.size
    });
  } catch (error: any) {
    results.push({
      collection: "draws",
      queryName: "Active draws ordered by startDate",
      success: false,
      error: error.message,
      missingIndex: error.message.includes("index"),
      indexUrl: INDEX_URLS.draws.status_startDate
    });
  }

  // Test 2: Completed draws ordered by endDate
  try {
    const q2 = query(
      drawsCollection,
      where("status", "==", "completed"),
      orderBy("endDate", "desc")
    );
    const snapshot2 = await getDocs(q2);
    results.push({
      collection: "draws",
      queryName: "Completed draws ordered by endDate",
      success: true,
      count: snapshot2.size
    });
  } catch (error: any) {
    results.push({
      collection: "draws",
      queryName: "Completed draws ordered by endDate",
      success: false,
      error: error.message,
      missingIndex: error.message.includes("index"),
      indexUrl: INDEX_URLS.draws.status_endDate
    });
  }

  // Test 3: Draws ordered by startDate and endDate
  try {
    const q3 = query(
      drawsCollection,
      orderBy("startDate", "desc"),
      orderBy("endDate", "desc")
    );
    const snapshot3 = await getDocs(q3);
    results.push({
      collection: "draws",
      queryName: "Draws ordered by startDate and endDate",
      success: true,
      count: snapshot3.size
    });
  } catch (error: any) {
    results.push({
      collection: "draws",
      queryName: "Draws ordered by startDate and endDate",
      success: false,
      error: error.message,
      missingIndex: error.message.includes("index"),
      indexUrl: INDEX_URLS.draws.startDate_endDate
    });
  }

  return results;
};

// Main test function
export const runAllQueryTests = async () => {
  console.log("🚀 بدء اختبار جميع الـ Queries...");

  const allResults = [
    ...(await testOffersQueries()),
    ...(await testParticipantsQueries()),
    ...(await testWinnersQueries()),
    ...(await testDrawsQueries())
  ];

  console.log("\n📊 نتائج الاختبار:");
  console.log("=".repeat(80));

  let successCount = 0;
  let failureCount = 0;
  const missingIndexes: {
    collection: string;
    queryName: string;
    url: string;
  }[] = [];

  allResults.forEach((result) => {
    if (result.success) {
      successCount++;
      console.log(
        `✅ ${result.collection}: ${result.queryName} - ${result.count} عنصر`
      );
    } else {
      failureCount++;
      console.log(`❌ ${result.collection}: ${result.queryName}`);
      console.log(`   خطأ: ${result.error}`);

      if (result.missingIndex && result.indexUrl) {
        missingIndexes.push({
          collection: result.collection,
          queryName: result.queryName,
          url: result.indexUrl
        });
      }
    }
  });

  console.log("\n" + "=".repeat(80));
  console.log(`📈 الإحصائيات: ${successCount} نجح، ${failureCount} فشل`);

  if (missingIndexes.length > 0) {
    console.log("\n🔗 الروابط المباشرة للـ Indexes المطلوبة:");
    console.log("=".repeat(80));

    missingIndexes.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.collection}: ${item.queryName}`);
      console.log(`   ${item.url}`);
    });

    console.log("\n📋 تعليمات إنشاء الـ Indexes:");
    console.log("1. انسخ الرابط");
    console.log("2. اضغط عليه في المتصفح");
    console.log("3. سيتم فتح Firebase Console مباشرة");
    console.log("4. اضغط 'Create Index'");
  } else {
    console.log("\n🎉 جميع الـ Indexes موجودة! لا توجد مشاكل.");
  }

  return {
    results: allResults,
    summary: {
      total: allResults.length,
      success: successCount,
      failure: failureCount,
      missingIndexes: missingIndexes.length
    },
    missingIndexes
  };
};

// Export individual test functions
export {
  testOffersQueries,
  testParticipantsQueries,
  testWinnersQueries,
  testDrawsQueries,
  INDEX_URLS
};
