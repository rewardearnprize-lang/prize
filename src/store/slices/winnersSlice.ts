import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export interface Winner {
  id: string;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
  deliveryDate?: string; // ISO string
  drawDate?: string; // ISO string
  isDelivered?: boolean;
  isVerified?: boolean;
  prizeId?: string;
  prizeName?: {
    ar: string;
    en: string;
  };
  prizeValue?: string;
  proofOfDelivery?: {
    title: {
      ar: string;
      en: string;
    };
    url: string;
  };
  proofOfDraw?: {
    title: {
      ar: string;
      en: string;
    };
    type: string;
    url: string;
  };
  winnerEmail?: string;
  // Legacy fields for backward compatibility
  participantId?: string;
  participantName?: string;
  drawId?: string;
  drawTitle?: string;
  prize?: string;
  winDate?: string;
  status?: "pending" | "claimed" | "delivered";
  claimDate?: string;
  notes?: string;
}

interface WinnersState {
  winners: Winner[];
  loading: boolean;
  error: string | null;
}

const initialState: WinnersState = {
  winners: [],
  loading: false,
  error: null
};

// Fetch winners from Firestore
export const fetchWinners = createAsyncThunk(
  "winners/fetchWinners",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching winners from Firestore...");
      const winnersCollection = collection(firestore, "winners");
      const q = query(winnersCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const winnersArray: Winner[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          // Convert Firestore Timestamp objects to ISO strings
          const createdAt = data.createdAt?.toDate?.()
            ? data.createdAt.toDate().toISOString()
            : data.createdAt;
          const updatedAt = data.updatedAt?.toDate?.()
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt;
          const deliveryDate = data.deliveryDate?.toDate?.()
            ? data.deliveryDate.toDate().toISOString()
            : data.deliveryDate;
          const drawDate = data.drawDate?.toDate?.()
            ? data.drawDate.toDate().toISOString()
            : data.drawDate;

          return {
            id: doc.id,
            ...data,
            // Convert timestamp fields to ISO strings
            createdAt,
            updatedAt,
            deliveryDate,
            drawDate,
            // Map new fields to legacy fields for display
            participantName:
              data.winnerEmail || data.participantName || "غير محدد",
            prize: data.prizeName?.ar || data.prize || "غير محدد",
            drawTitle: data.prizeId || data.drawTitle || "سحب عام",
            winDate: drawDate
              ? new Date(drawDate).toLocaleDateString("ar-SA")
              : data.winDate || "غير محدد",
            status: data.isDelivered
              ? "delivered"
              : data.isVerified
              ? "claimed"
              : "pending"
          };
        }) as Winner[];

        console.log("✅ Winners fetched successfully:", winnersArray.length);
        return winnersArray;
      } else {
        // Return default winners if no data exists
        console.log("📝 No winners found, returning default data");
        const defaultWinners: Winner[] = [
          {
            id: "default-1",
            participantId: "participant_1",
            participantName: "أحمد محمد",
            drawId: "draw_1",
            drawTitle: "سحب iPhone 15 Pro",
            prize: "iPhone 15 Pro",
            winDate: "2024-01-15",
            status: "claimed",
            claimDate: "2024-01-16",
            notes: "تم تسليم الجائزة بنجاح"
          },
          {
            id: "default-2",
            participantId: "participant_2",
            participantName: "سارة أحمد",
            drawId: "draw_2",
            drawTitle: "سحب PlayStation 5",
            prize: "PlayStation 5",
            winDate: "2024-01-10",
            status: "pending",
            notes: "في انتظار التأكيد"
          },
          {
            id: "default-3",
            participantId: "participant_3",
            participantName: "محمد علي",
            drawId: "draw_3",
            drawTitle: "سحب الجوائز النقدية",
            prize: "جائزة نقدية - 1000 ريال",
            winDate: "2024-01-05",
            status: "delivered",
            claimDate: "2024-01-06",
            deliveryDate: "2024-01-08",
            notes: "تم التحويل البنكي"
          }
        ];
        return defaultWinners;
      }
    } catch (error) {
      console.error("❌ Failed to fetch winners:", error);
      return rejectWithValue("فشل في جلب الفائزين");
    }
  }
);

// Add new winner to Firestore
export const addWinner = createAsyncThunk(
  "winners/addWinner",
  async (winnerData: Omit<Winner, "id">, { rejectWithValue }) => {
    try {
      console.log("➕ Adding new winner to Firestore...");
      const winnersCollection = collection(firestore, "winners");

      // Convert legacy data to new format
      const newWinner = {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        drawDate: new Date().toISOString(),
        isDelivered: winnerData.status === "delivered",
        isVerified:
          winnerData.status === "claimed" || winnerData.status === "delivered",
        prizeId: winnerData.drawId || `prize_${Date.now()}`,
        prizeName: {
          ar: winnerData.prize || "جائزة جديدة",
          en: winnerData.prize || "New Prize"
        },
        prizeValue: "$100",
        winnerEmail: winnerData.participantName || "test@example.com",
        proofOfDelivery: {
          title: {
            ar: "تسليم الجائزة",
            en: "Prize Delivery"
          },
          url: "https://example.com/delivery"
        },
        proofOfDraw: {
          title: {
            ar: "إثبات السحب",
            en: "Draw Proof"
          },
          type: "video",
          url: "https://example.com/draw"
        }
      };

      const docRef = await addDoc(winnersCollection, newWinner);
      const addedWinner = { ...newWinner, id: docRef.id };

      console.log("✅ Winner added successfully:", addedWinner);
      return addedWinner;
    } catch (error) {
      console.error("❌ Failed to add winner:", error);
      return rejectWithValue("فشل في إضافة الفائز");
    }
  }
);

// Update winner in Firestore
export const updateWinner = createAsyncThunk(
  "winners/updateWinner",
  async (
    { id, winnerData }: { id: string; winnerData: Partial<Winner> },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔄 Updating winner in Firestore:", id);
      const winnerDoc = doc(firestore, "winners", id);
      await updateDoc(winnerDoc, winnerData);

      console.log("✅ Winner updated successfully");
      return { id, ...winnerData };
    } catch (error) {
      console.error("❌ Failed to update winner:", error);
      return rejectWithValue("فشل في تحديث الفائز");
    }
  }
);

// Delete winner from Firestore
export const deleteWinner = createAsyncThunk(
  "winners/deleteWinner",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("🗑️ Deleting winner from Firestore:", id);
      const winnerDoc = doc(firestore, "winners", id);
      await deleteDoc(winnerDoc);

      console.log("✅ Winner deleted successfully");
      return id;
    } catch (error) {
      console.error("❌ Failed to delete winner:", error);
      return rejectWithValue("فشل في حذف الفائز");
    }
  }
);

// Update winner status in Firestore
export const updateWinnerStatus = createAsyncThunk(
  "winners/updateWinnerStatus",
  async (
    { id, status }: { id: string; status: "pending" | "claimed" | "delivered" },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔄 Updating winner status in Firestore:", id);
      const winnerDoc = doc(firestore, "winners", id);
      const updateData: any = { status };

      if (status === "claimed") {
        updateData.claimDate = new Date().toISOString().split("T")[0];
      } else if (status === "delivered") {
        updateData.deliveryDate = new Date().toISOString().split("T")[0];
      }

      await updateDoc(winnerDoc, updateData);

      console.log("✅ Winner status updated successfully");
      return { id, ...updateData };
    } catch (error) {
      console.error("❌ Failed to update winner status:", error);
      return rejectWithValue("فشل في تحديث حالة الفائز");
    }
  }
);

const winnersSlice = createSlice({
  name: "winners",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch winners
      .addCase(fetchWinners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWinners.fulfilled, (state, action) => {
        state.loading = false;
        state.winners = action.payload;
      })
      .addCase(fetchWinners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add winner
      .addCase(addWinner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWinner.fulfilled, (state, action) => {
        state.loading = false;
        state.winners.unshift(action.payload);
      })
      .addCase(addWinner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update winner
      .addCase(updateWinner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWinner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.winners.findIndex(
          (winner) => winner.id === action.payload.id
        );
        if (index !== -1) {
          state.winners[index] = { ...state.winners[index], ...action.payload };
        }
      })
      .addCase(updateWinner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete winner
      .addCase(deleteWinner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWinner.fulfilled, (state, action) => {
        state.loading = false;
        state.winners = state.winners.filter(
          (winner) => winner.id !== action.payload
        );
      })
      .addCase(deleteWinner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update winner status
      .addCase(updateWinnerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWinnerStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.winners.findIndex(
          (winner) => winner.id === action.payload.id
        );
        if (index !== -1) {
          state.winners[index] = { ...state.winners[index], ...action.payload };
        }
      })
      .addCase(updateWinnerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = winnersSlice.actions;
export default winnersSlice.reducer;
