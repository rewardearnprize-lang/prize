// utils/participationManager.ts
import { setDoc, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export interface ParticipationData {
  prize: {
    id: string;
    name: string;
    participationType?: "email" | "id";
  };
  inputValue: string;
}

export class ParticipationManager {
  private static instance: ParticipationManager;
  private isSubmitting = false;
  private submissions = new Set<string>();
  private submissionCallbacks: Array<{
    resolve: (value: string) => void;
    reject: (error: Error) => void;
  }> = [];

  private constructor() {}

  static getInstance(): ParticipationManager {
    if (!ParticipationManager.instance) {
      ParticipationManager.instance = new ParticipationManager();
    }
    return ParticipationManager.instance;
  }

  // 🔹 دالة لتوليد مفتاح فريد
  private generateUniqueKey(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `key_${timestamp}_${random}`;
  }

  // 🔹 دالة للتحقق من الحفظ
  private async verifyDocumentSave(key: string): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const docRef = doc(firestore, "participants", key);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("✅ Document verification SUCCESS:", { key, data });
        return true;
      } else {
        console.log("❌ Document verification FAILED: Document not found", key);
        return false;
      }
    } catch (error) {
      console.error("❌ Document verification ERROR:", error);
      return false;
    }
  }

  // 🔹 الدالة الرئيسية للإرسال
  async submitParticipation(data: ParticipationData): Promise<string> {
    const { prize, inputValue } = data;
    const trimmedInput = inputValue.trim();

    // 🔹 التحقق من البيانات
    if (!trimmedInput || !prize) {
      throw new Error(`Please enter your ${prize?.participationType || "email"}`);
    }

    // 🔹 التحقق من صحة الإيميل
    if (prize.participationType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedInput)) {
        throw new Error("Please enter a valid email address");
      }
    }

    // 🔹 منع الإرسال المزدوج
    if (this.isSubmitting) {
      throw new Error('Submission already in progress. Please wait...');
    }

    const submissionId = `${prize.id}_${trimmedInput}_${Date.now()}`;
    if (this.submissions.has(submissionId)) {
      throw new Error('Duplicate submission detected');
    }

    // 🔹 تعيين حالة الإرسال
    this.isSubmitting = true;
    this.submissions.add(submissionId);

    try {
      // 🔹 توليد المفتاح الفريد
      const uniqueKey = this.generateUniqueKey();
      console.log("🔑 Generated Key:", uniqueKey);

      // 🔹 إعداد البيانات
      const participantData = {
        participantKey: uniqueKey,
        uniqueIdentifier: uniqueKey,
        [prize.participationType || "email"]: trimmedInput,
        prize: prize.name,
        prizeId: prize.id,
        status: "pending",
        joinDate: new Date().toISOString(),
        verified: false,
        completed: false,
        timestamp: new Date().toISOString(),
        submissionTime: new Date().toLocaleString(),
        manager: "ParticipationManager_v1"
      };

      console.log("📤 Saving participant data:", participantData);

      // 🔹 الحفظ في Firestore
      const docRef = doc(firestore, "participants", uniqueKey);
      await setDoc(docRef, participantData);
      
      console.log("✅ Firestore setDoc completed");

      // 🔹 التحقق من الحفظ
      const isVerified = await this.verifyDocumentSave(uniqueKey);
      
      if (!isVerified) {
        // 🔹 محاولة إعادة الحفظ
        console.log("🔄 Retrying save...");
        const retryKey = `retry_${this.generateUniqueKey()}`;
        const retryData = {
          ...participantData,
          participantKey: retryKey,
          uniqueIdentifier: retryKey,
          retry: true,
          originalKey: uniqueKey
        };
        
        const retryDocRef = doc(firestore, "participants", retryKey);
        await setDoc(retryDocRef, retryData);
        
        const retryVerified = await this.verifyDocumentSave(retryKey);
        if (!retryVerified) {
          throw new Error("Document verification failed after retry");
        }
        
        console.log("🎉 Participation registered successfully with retry key:", retryKey);
        return retryKey;
      }

      console.log("🎉 Participation registered successfully with key:", uniqueKey);
      return uniqueKey;

    } catch (error) {
      console.error("❌ Error in submission process:", error);
      
      // 🔹 حفظ نسخة احتياطية
      try {
        console.log("📦 Attempting backup save...");
        const backupKey = `backup_${this.generateUniqueKey()}`;
        const backupData = {
          prizeId: prize.id,
          inputValue: trimmedInput,
          participationType: prize.participationType,
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
          backup: true
        };
        
        const backupDocRef = doc(firestore, "participation_backups", backupKey);
        await setDoc(backupDocRef, backupData);
        console.log("✅ Backup save completed");
      } catch (backupError) {
        console.error("❌ Backup save also failed:", backupError);
      }

      throw error;
    } finally {
      // 🔹 تنظيف الموارد
      this.isSubmitting = false;
      setTimeout(() => {
        this.submissions.delete(submissionId);
      }, 10000); // تنظيف بعد 10 ثواني
    }
  }

  // 🔹 دالة للتحقق من حالة المدير
  getStatus() {
    return {
      isSubmitting: this.isSubmitting,
      activeSubmissions: this.submissions.size,
      instance: this === ParticipationManager.instance
    };
  }

  // 🔹 دالة لإعادة التعيين (للاستخدام في التطوير)
  reset() {
    this.isSubmitting = false;
    this.submissions.clear();
    this.submissionCallbacks = [];
  }
}

// 🔹 تصدير instance افتراضي
export const participationManager = ParticipationManager.getInstance();
