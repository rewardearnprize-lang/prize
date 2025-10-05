import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerOfferInFirestore } from "@/lib/registerOffer";
import { generateUserKey } from "./utils";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

// ---------------- Types ----------------
export interface Draw {
  id: string;
  name: string; 
  description?: string;
  prize?: string;
  prizeValue?: number;
  maxWinners?: number;
  maxParticipants?: number;
  currentWinners?: number;
  startDate?: string;
  endDate?: string;
  status: "upcoming" | "active" | "completed" | "cancelled";
  participants: string[];
  winners: string[];
  createdAt: string;
  updatedAt: string;
  offerUrl?: string;
  offerId?: string;
  participationType: "email" | "id";
  currentParticipants?: number;
}

interface DrawsState {
  draws: Draw[];
  loading: boolean;
  error: string | null;
}

const initialState: DrawsState = {
  draws: [],
  loading: false,
  error: null,
};

// ---------------- Fetch draws ----------------
export const fetchDraws = createAsyncThunk(
  "draws/fetchDraws",
  async (_, { rejectWithValue }) => {
    try {
      const drawsCollection = collection(firestore, "draws");
      const q = query(drawsCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const drawsArray: Draw[] = querySnapshot.docs.map((d) => {
          const data = d.data() as Omit<Draw, "id">;
         return {
  id: d.id,
  name: data.name || "سحب بدون اسم",
  description: data.description || "",
  prize: data.prize || "جائزة",
  prizeValue: data.prizeValue || 0,
  maxWinners: data.maxWinners || 1,
  maxParticipants: data.maxParticipants || 0,
  currentWinners: data.currentWinners || 0,
  startDate: data.startDate || "",
  endDate: data.endDate || "",
  status: data.status || "active",
  participants: data.participants || [],
  winners: data.winners || [],
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
  offerUrl: data.offerUrl || "",  
  participationType: data.participationType || "email",
};

        });

        return drawsArray;
      } else {
        const defaultDraws: Draw[] = [
          {
            id: "default-1",
            name: "سحب iPhone 15 Pro",
            description: "سحب على هاتف iPhone 15 Pro الجديد",
            prize: "iPhone 15 Pro",
            prizeValue: 1199,
            maxWinners: 1,
            maxParticipants: 100,
            currentWinners: 1,
            startDate: "2024-01-01",
            endDate: "2024-01-31",
            status: "active",
            participants: ["participant_1", "participant_2", "participant_3"],
            winners: ["participant_1"],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-15",
            participationType: "email",
          },
        ];
        return defaultDraws;
      }
    } catch (error) {
      console.error("❌ Failed to fetch draws:", error);
      return rejectWithValue("فشل في جلب السحوبات");
    }
  }
);

// ---------------- Add draw ----------------
export const addDraw = createAsyncThunk(
  "draws/addDraw",
  async (
    drawData: Partial<Draw>,
    { rejectWithValue }
  ) => {
    try {
      const drawsCollection = collection(firestore, "draws");
      const now = new Date().toISOString();

      // 1️⃣ توليد مفتاح فريد
      const key = generateUserKey();

      const newDraw: Omit<Draw, "id"> = {
        name: drawData.name || "سحب جديد",
        description: drawData.description || "",
        prize: drawData.prize || "جائزة",
        prizeValue: drawData.prizeValue || 0,
        maxWinners: drawData.maxWinners || 1,
        maxParticipants: drawData.maxParticipants || 0,
        currentWinners: 0,
        startDate: drawData.startDate || "",
        endDate: drawData.endDate || "",
        status: drawData.status || "active",
        participants: [],
        winners: [],
        createdAt: now,
        updatedAt: now,
        offerUrl: drawData.offerUrl || "",  
        participationType: drawData.participationType || "email",

        // 🔑 إضافة المفتاح الفريد
        key: key,
      };

      // 2️⃣ حفظ السحب في Firestore
      const docRef = await addDoc(drawsCollection, newDraw);

      // 3️⃣ تسجيل العرض في Firestore/Backend مع المفتاح
      await registerOfferInFirestore(docRef.id, key);

      return { ...newDraw, id: docRef.id };
    } catch (error) {
      console.error("❌ Failed to add draw:", error);
      return rejectWithValue("فشل في إضافة السحب");
    }
  }
);

// ---------------- Update draw ----------------
export const updateDraw = createAsyncThunk(
  "draws/updateDraw",
  async (
    { id, drawData }: { id: string; drawData: Partial<Draw> },
    { rejectWithValue }
  ) => {
    try {
      const drawDoc = doc(firestore, "draws", id);
      const updateData = {
        ...drawData,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(drawDoc, updateData);
      return { id, ...updateData };
    } catch (error) {
      console.error("❌ Failed to update draw:", error);
      return rejectWithValue("فشل في تحديث السحب");
    }
  }
);

// ---------------- Delete draw ----------------
export const deleteDraw = createAsyncThunk(
  "draws/deleteDraw",
  async (id: string, { rejectWithValue }) => {
    try {
      const drawDoc = doc(firestore, "draws", id);
      await deleteDoc(drawDoc);
      return id;
    } catch (error) {
      console.error("❌ Failed to delete draw:", error);
      return rejectWithValue("فشل في حذف السحب");
    }
  }
);

// ---------------- Update status ----------------
export const updateDrawStatus = createAsyncThunk(
  "draws/updateDrawStatus",
  async (
    { id, status }: { id: string; status: "upcoming" | "active" | "completed" | "cancelled" },
    { rejectWithValue }
  ) => {
    try {
      const drawDoc = doc(firestore, "draws", id);
      await updateDoc(drawDoc, {
        status,
        updatedAt: new Date().toISOString(),
      });

      return { id, status };
    } catch (error) {
      console.error("❌ Failed to update draw status:", error);
      return rejectWithValue("فشل في تحديث حالة السحب");
    }
  }
);

// ---------------- Select winners ----------------
export const selectWinners = createAsyncThunk(
  "draws/selectWinners",
  async (
    { drawId, winnerIds }: { drawId: string; winnerIds: string[] },
    { rejectWithValue }
  ) => {
    try {
      const drawDoc = doc(firestore, "draws", drawId);

      await updateDoc(drawDoc, {
        winners: winnerIds,
        currentWinners: winnerIds.length,
        updatedAt: new Date().toISOString(),
      });

      return { drawId, winners: winnerIds, currentWinners: winnerIds.length };
    } catch (error) {
      console.error("❌ Failed to select winners:", error);
      return rejectWithValue("فشل في اختيار الفائزين");
    }
  }
);

// ---------------- Slice ----------------
const drawsSlice = createSlice({
  name: "draws",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDraws.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraws.fulfilled, (state, action) => {
        state.loading = false;
        state.draws = action.payload;
      })
      .addCase(fetchDraws.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addDraw.fulfilled, (state, action) => {
        state.draws.unshift(action.payload);
      })
      .addCase(updateDraw.fulfilled, (state, action) => {
        const index = state.draws.findIndex(
          (draw) => draw.id === action.payload.id
        );
        if (index !== -1) {
          state.draws[index] = { ...state.draws[index], ...action.payload };
        }
      })
      .addCase(deleteDraw.fulfilled, (state, action) => {
        state.draws = state.draws.filter((draw) => draw.id !== action.payload);
      })
      .addCase(updateDrawStatus.fulfilled, (state, action) => {
        const index = state.draws.findIndex(
          (draw) => draw.id === action.payload.id
        );
        if (index !== -1) {
          state.draws[index].status = action.payload.status;
        }
      })
      .addCase(selectWinners.fulfilled, (state, action) => {
        const index = state.draws.findIndex(
          (draw) => draw.id === action.payload.drawId
        );
        if (index !== -1) {
          state.draws[index].winners = action.payload.winners;
          state.draws[index].currentWinners = action.payload.currentWinners;
        }
      });
  },
});

export const { clearError } = drawsSlice.actions;
export default drawsSlice.reducer;
