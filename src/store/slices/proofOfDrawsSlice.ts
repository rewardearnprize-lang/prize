import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export interface ProofOfDraw {
  id: string;
  drawId: string;
  drawTitle: string;
  winnerId: string;
  winnerName: string;
  winnerEmail: string;
  prize: string;
  prizeValue: string;
  drawDate: string;
  proofType: "video" | "image" | "document";
  proofUrl: string;
  proofTitle: {
    ar: string;
    en: string;
  };
  proofDescription: {
    ar: string;
    en: string;
  };
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "verified" | "rejected";
  notes?: string;
}

interface ProofOfDrawsState {
  proofOfDraws: ProofOfDraw[];
  loading: boolean;
  error: string | null;
}

const initialState: ProofOfDrawsState = {
  proofOfDraws: [],
  loading: false,
  error: null
};

// Fetch proof of draws from Firestore
export const fetchProofOfDraws = createAsyncThunk(
  "proofOfDraws/fetchProofOfDraws",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching proof of draws from Firestore...");
      const proofCollection = collection(firestore, "proofOfDraws");
      const q = query(proofCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const proofArray: ProofOfDraw[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          // Convert Firestore Timestamp objects to ISO strings
          const createdAt = data.createdAt?.toDate?.()
            ? data.createdAt.toDate().toISOString()
            : data.createdAt;
          const updatedAt = data.updatedAt?.toDate?.()
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt;
          const verifiedAt = data.verifiedAt?.toDate?.()
            ? data.verifiedAt.toDate().toISOString()
            : data.verifiedAt;
          const drawDate = data.drawDate?.toDate?.()
            ? data.drawDate.toDate().toISOString()
            : data.drawDate;

          return {
            id: doc.id,
            ...data,
            createdAt,
            updatedAt,
            verifiedAt,
            drawDate
          };
        }) as ProofOfDraw[];

        console.log(
          "✅ Proof of draws fetched successfully:",
          proofArray.length
        );
        return proofArray;
      } else {
        // Return default proof of draws if no data exists
        console.log("📝 No proof of draws found, returning default data");
        const defaultProofOfDraws: ProofOfDraw[] = [
          {
            id: "default-1",
            drawId: "draw_iphone_15",
            drawTitle: "سحب iPhone 15 Pro",
            winnerId: "winner_1",
            winnerName: "أحمد محمد",
            winnerEmail: "ahmed****@gmail.com",
            prize: "iPhone 15 Pro",
            prizeValue: "$1,199",
            drawDate: "2024-06-15T10:30:00.000Z",
            proofType: "video",
            proofUrl: "https://example.com/videos/draw_proof_1.mp4",
            proofTitle: {
              ar: "فيديو السحب",
              en: "Draw Video"
            },
            proofDescription: {
              ar: "فيديو يوضح عملية السحب العشوائي للفائز أحمد محمد",
              en: "Video showing the random draw process for winner Ahmed Mohamed"
            },
            isVerified: true,
            verifiedBy: "admin@example.com",
            verifiedAt: "2024-06-15T11:00:00.000Z",
            createdAt: "2024-06-15T10:30:00.000Z",
            updatedAt: "2024-06-15T11:00:00.000Z",
            status: "verified",
            notes: "تم التحقق من صحة السحب"
          },
          {
            id: "default-2",
            drawId: "draw_playstation_5",
            drawTitle: "سحب PlayStation 5",
            winnerId: "winner_2",
            winnerName: "سارة أحمد",
            winnerEmail: "sara****@yahoo.com",
            prize: "PlayStation 5",
            prizeValue: "$499",
            drawDate: "2024-06-12T14:00:00.000Z",
            proofType: "image",
            proofUrl: "https://example.com/images/draw_proof_2.jpg",
            proofTitle: {
              ar: "صورة السحب",
              en: "Draw Image"
            },
            proofDescription: {
              ar: "صورة توضح نتيجة السحب العشوائي للفائزة سارة أحمد",
              en: "Image showing the random draw result for winner Sara Ahmed"
            },
            isVerified: true,
            verifiedBy: "admin@example.com",
            verifiedAt: "2024-06-12T14:30:00.000Z",
            createdAt: "2024-06-12T14:00:00.000Z",
            updatedAt: "2024-06-12T14:30:00.000Z",
            status: "verified",
            notes: "تم التحقق من صحة السحب"
          },
          {
            id: "default-3",
            drawId: "draw_cash_prize",
            drawTitle: "سحب الجوائز النقدية",
            winnerId: "winner_3",
            winnerName: "محمد علي",
            winnerEmail: "mohamed****@hotmail.com",
            prize: "Cash Prize",
            prizeValue: "$2,000",
            drawDate: "2024-06-10T16:00:00.000Z",
            proofType: "document",
            proofUrl: "https://example.com/documents/draw_proof_3.pdf",
            proofTitle: {
              ar: "وثيقة السحب",
              en: "Draw Document"
            },
            proofDescription: {
              ar: "مستند رسمي يوضح تفاصيل السحب العشوائي للفائز محمد علي",
              en: "Official document showing the random draw details for winner Mohamed Ali"
            },
            isVerified: true,
            verifiedBy: "admin@example.com",
            verifiedAt: "2024-06-10T16:30:00.000Z",
            createdAt: "2024-06-10T16:00:00.000Z",
            updatedAt: "2024-06-10T16:30:00.000Z",
            status: "verified",
            notes: "تم التحقق من صحة السحب"
          },
          {
            id: "default-4",
            drawId: "draw_macbook",
            drawTitle: "سحب MacBook Pro",
            winnerId: "winner_4",
            winnerName: "فاطمة حسن",
            winnerEmail: "fatima****@outlook.com",
            prize: "MacBook Pro M3",
            prizeValue: "$1,999",
            drawDate: "2024-06-08T12:00:00.000Z",
            proofType: "video",
            proofUrl: "https://example.com/videos/draw_proof_4.mp4",
            proofTitle: {
              ar: "فيديو السحب المباشر",
              en: "Live Draw Video"
            },
            proofDescription: {
              ar: "فيديو مباشر يوضح عملية السحب العشوائي للفائزة فاطمة حسن",
              en: "Live video showing the random draw process for winner Fatima Hassan"
            },
            isVerified: false,
            createdAt: "2024-06-08T12:00:00.000Z",
            updatedAt: "2024-06-08T12:00:00.000Z",
            status: "pending",
            notes: "في انتظار التحقق"
          },
          {
            id: "default-5",
            drawId: "draw_airpods",
            drawTitle: "سحب AirPods Pro",
            winnerId: "winner_5",
            winnerName: "علي محمود",
            winnerEmail: "ali****@icloud.com",
            prize: "AirPods Pro",
            prizeValue: "$249",
            drawDate: "2024-06-05T09:00:00.000Z",
            proofType: "image",
            proofUrl: "https://example.com/images/draw_proof_5.jpg",
            proofTitle: {
              ar: "صورة إثبات السحب",
              en: "Draw Proof Image"
            },
            proofDescription: {
              ar: "صورة واضحة توضح نتيجة السحب العشوائي للفائز علي محمود",
              en: "Clear image showing the random draw result for winner Ali Mahmoud"
            },
            isVerified: true,
            verifiedBy: "admin@example.com",
            verifiedAt: "2024-06-05T09:30:00.000Z",
            createdAt: "2024-06-05T09:00:00.000Z",
            updatedAt: "2024-06-05T09:30:00.000Z",
            status: "verified",
            notes: "تم التحقق من صحة السحب"
          }
        ];
        return defaultProofOfDraws;
      }
    } catch (error) {
      console.error("❌ Failed to fetch proof of draws:", error);
      return rejectWithValue("فشل في جلب إثباتات السحب");
    }
  }
);

// Add new proof of draw to Firestore
export const addProofOfDraw = createAsyncThunk(
  "proofOfDraws/addProofOfDraw",
  async (proofData: Omit<ProofOfDraw, "id">, { rejectWithValue }) => {
    try {
      console.log("➕ Adding new proof of draw to Firestore...");
      const proofCollection = collection(firestore, "proofOfDraws");

      const newProof = {
        ...proofData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(proofCollection, newProof);
      const addedProof = { ...newProof, id: docRef.id };

      console.log("✅ Proof of draw added successfully:", addedProof);
      return addedProof;
    } catch (error) {
      console.error("❌ Failed to add proof of draw:", error);
      return rejectWithValue("فشل في إضافة إثبات السحب");
    }
  }
);

// Update proof of draw in Firestore
export const updateProofOfDraw = createAsyncThunk(
  "proofOfDraws/updateProofOfDraw",
  async (
    { id, proofData }: { id: string; proofData: Partial<ProofOfDraw> },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔄 Updating proof of draw in Firestore:", id);
      const proofDoc = doc(firestore, "proofOfDraws", id);
      const updateData = {
        ...proofData,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(proofDoc, updateData);

      console.log("✅ Proof of draw updated successfully");
      return { id, ...updateData };
    } catch (error) {
      console.error("❌ Failed to update proof of draw:", error);
      return rejectWithValue("فشل في تحديث إثبات السحب");
    }
  }
);

// Delete proof of draw from Firestore
export const deleteProofOfDraw = createAsyncThunk(
  "proofOfDraws/deleteProofOfDraw",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("🗑️ Deleting proof of draw from Firestore:", id);
      const proofDoc = doc(firestore, "proofOfDraws", id);
      await deleteDoc(proofDoc);

      console.log("✅ Proof of draw deleted successfully");
      return id;
    } catch (error) {
      console.error("❌ Failed to delete proof of draw:", error);
      return rejectWithValue("فشل في حذف إثبات السحب");
    }
  }
);

// Verify proof of draw
export const verifyProofOfDraw = createAsyncThunk(
  "proofOfDraws/verifyProofOfDraw",
  async (
    {
      id,
      verifiedBy,
      notes
    }: { id: string; verifiedBy: string; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("✅ Verifying proof of draw in Firestore:", id);
      const proofDoc = doc(firestore, "proofOfDraws", id);
      const updateData = {
        isVerified: true,
        verifiedBy,
        verifiedAt: new Date().toISOString(),
        status: "verified" as const,
        updatedAt: new Date().toISOString(),
        notes: notes || "تم التحقق من صحة الإثبات"
      };
      await updateDoc(proofDoc, updateData);

      console.log("✅ Proof of draw verified successfully");
      return { id, ...updateData };
    } catch (error) {
      console.error("❌ Failed to verify proof of draw:", error);
      return rejectWithValue("فشل في التحقق من إثبات السحب");
    }
  }
);

const proofOfDrawsSlice = createSlice({
  name: "proofOfDraws",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch proof of draws
      .addCase(fetchProofOfDraws.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProofOfDraws.fulfilled, (state, action) => {
        state.loading = false;
        state.proofOfDraws = action.payload;
      })
      .addCase(fetchProofOfDraws.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add proof of draw
      .addCase(addProofOfDraw.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProofOfDraw.fulfilled, (state, action) => {
        state.loading = false;
        state.proofOfDraws.unshift(action.payload);
      })
      .addCase(addProofOfDraw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update proof of draw
      .addCase(updateProofOfDraw.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProofOfDraw.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.proofOfDraws.findIndex(
          (proof) => proof.id === action.payload.id
        );
        if (index !== -1) {
          state.proofOfDraws[index] = {
            ...state.proofOfDraws[index],
            ...action.payload
          };
        }
      })
      .addCase(updateProofOfDraw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete proof of draw
      .addCase(deleteProofOfDraw.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProofOfDraw.fulfilled, (state, action) => {
        state.loading = false;
        state.proofOfDraws = state.proofOfDraws.filter(
          (proof) => proof.id !== action.payload
        );
      })
      .addCase(deleteProofOfDraw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify proof of draw
      .addCase(verifyProofOfDraw.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyProofOfDraw.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.proofOfDraws.findIndex(
          (proof) => proof.id === action.payload.id
        );
        if (index !== -1) {
          state.proofOfDraws[index] = {
            ...state.proofOfDraws[index],
            ...action.payload
          };
        }
      })
      .addCase(verifyProofOfDraw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = proofOfDrawsSlice.actions;
export default proofOfDrawsSlice.reducer;
