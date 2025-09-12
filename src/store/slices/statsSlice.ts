import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ref, get, set, update } from "firebase/database";
import { database } from "@/lib/firebase";

export interface DashboardStats {
  totalParticipants: number;
  activeParticipants: number;
  totalOffers: number;
  activeOffers: number;
  totalWinners: number;
  totalDraws: number;
  activeDraws: number;
  completedDraws: number;
  totalPointsDistributed: number;
  totalReferrals: number;
  monthlyStats: {
    newParticipants: number;
    completedOffers: number;
    newWinners: number;
    pointsEarned: number;
  };
  dailyStats: {
    newParticipants: number;
    completedOffers: number;
    activeUsers: number;
    pointsEarned: number;
  };
  topParticipants: Array<{
    id: string;
    name: string;
    points: number;
    completedOffers: number;
  }>;
  topOffers: Array<{
    id: string;
    name: string;
    completionRate: number;
    totalCompletions: number;
  }>;
  lastUpdated: string;
}

interface StatsState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  stats: null,
  loading: false,
  error: null
};

// Default stats
const defaultStats: DashboardStats = {
  totalParticipants: 0,
  activeParticipants: 0,
  totalOffers: 0,
  activeOffers: 0,
  totalWinners: 0,
  totalDraws: 0,
  activeDraws: 0,
  completedDraws: 0,
  totalPointsDistributed: 0,
  totalReferrals: 0,
  monthlyStats: {
    newParticipants: 0,
    completedOffers: 0,
    newWinners: 0,
    pointsEarned: 0
  },
  dailyStats: {
    newParticipants: 0,
    completedOffers: 0,
    activeUsers: 0,
    pointsEarned: 0
  },
  topParticipants: [],
  topOffers: [],
  lastUpdated: new Date().toISOString()
};

// Async thunks for Firebase operations
export const fetchStats = createAsyncThunk(
  "stats/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const statsRef = ref(database, "stats");
      const snapshot = await get(statsRef);

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        // Initialize with default stats if none exist
        await set(statsRef, defaultStats);
        return defaultStats;
      }
    } catch (error) {
      return rejectWithValue("فشل في جلب الإحصائيات");
    }
  }
);

export const updateStats = createAsyncThunk(
  "stats/updateStats",
  async (statsData: Partial<DashboardStats>, { rejectWithValue }) => {
    try {
      const statsRef = ref(database, "stats");
      const updateData = {
        ...statsData,
        lastUpdated: new Date().toISOString()
      };
      await update(statsRef, updateData);
      return updateData;
    } catch (error) {
      return rejectWithValue("فشل في تحديث الإحصائيات");
    }
  }
);

export const incrementStat = createAsyncThunk(
  "stats/incrementStat",
  async (
    { statPath, increment = 1 }: { statPath: string; increment?: number },
    { rejectWithValue }
  ) => {
    try {
      const statsRef = ref(database, `stats/${statPath}`);
      const snapshot = await get(statsRef);
      const currentValue = snapshot.exists() ? snapshot.val() : 0;
      const newValue = currentValue + increment;

      await set(statsRef, newValue);
      return { statPath, newValue };
    } catch (error) {
      return rejectWithValue("فشل في تحديث الإحصائية");
    }
  }
);

export const calculateStats = createAsyncThunk(
  "stats/calculateStats",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch all data to calculate stats
      const [
        participantsSnapshot,
        offersSnapshot,
        winnersSnapshot,
        drawsSnapshot
      ] = await Promise.all([
        get(ref(database, "participants")),
        get(ref(database, "offers")),
        get(ref(database, "winners")),
        get(ref(database, "draws"))
      ]);

      const participants = participantsSnapshot.exists()
        ? participantsSnapshot.val()
        : {};
      const offers = offersSnapshot.exists() ? offersSnapshot.val() : {};
      const winners = winnersSnapshot.exists() ? winnersSnapshot.val() : {};
      const draws = drawsSnapshot.exists() ? drawsSnapshot.val() : {};

      // Calculate stats
      const totalParticipants = Object.keys(participants).length;
      const activeParticipants = Object.values(participants).filter(
        (p: any) => p.status === "active"
      ).length;
      const totalOffers = Object.keys(offers).length;
      const activeOffers = Object.values(offers).filter(
        (o: any) => o.status === "active"
      ).length;
      const totalWinners = Object.keys(winners).length;
      const totalDraws = Object.keys(draws).length;
      const activeDraws = Object.values(draws).filter(
        (d: any) => d.status === "active"
      ).length;
      const completedDraws = Object.values(draws).filter(
        (d: any) => d.status === "completed"
      ).length;

      // Calculate total points
      const totalPointsDistributed = Object.values(participants).reduce(
        (sum: number, p: any) => sum + (p.totalPoints || 0),
        0
      );

      // Calculate top participants
      const participantsArray = Object.entries(participants).map(
        ([id, p]: [string, any]) => ({
          id,
          name: p.name,
          points: p.totalPoints || 0,
          completedOffers: p.completedOffers?.length || 0
        })
      );
      const topParticipants = participantsArray
        .sort((a, b) => b.points - a.points)
        .slice(0, 10);

      // Calculate top offers
      const offersArray = Object.entries(offers).map(
        ([id, o]: [string, any]) => ({
          id,
          name: o.name,
          completionRate:
            o.maxParticipants > 0
              ? (o.completedCount / o.maxParticipants) * 100
              : 0,
          totalCompletions: o.completedCount || 0
        })
      );
      const topOffers = offersArray
        .sort((a, b) => b.completionRate - a.completionRate)
        .slice(0, 10);

      const newStats: DashboardStats = {
        totalParticipants,
        activeParticipants,
        totalOffers,
        activeOffers,
        totalWinners,
        totalDraws,
        activeDraws,
        completedDraws,
        totalPointsDistributed,
        totalReferrals: 0, // This would need to be calculated from referral data
        monthlyStats: {
          newParticipants: 0, // This would need date filtering
          completedOffers: 0,
          newWinners: 0,
          pointsEarned: 0
        },
        dailyStats: {
          newParticipants: 0,
          completedOffers: 0,
          activeUsers: 0,
          pointsEarned: 0
        },
        topParticipants,
        topOffers,
        lastUpdated: new Date().toISOString()
      };

      // Update stats in Firebase
      await set(ref(database, "stats"), newStats);
      return newStats;
    } catch (error) {
      return rejectWithValue("فشل في حساب الإحصائيات");
    }
  }
);

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch stats
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update stats
      .addCase(updateStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStats.fulfilled, (state, action) => {
        state.loading = false;
        if (state.stats) {
          state.stats = { ...state.stats, ...action.payload };
        }
      })
      .addCase(updateStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Increment stat
      .addCase(incrementStat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(incrementStat.fulfilled, (state, action) => {
        state.loading = false;
        if (state.stats) {
          // Update the specific stat path
          const pathParts = action.payload.statPath.split(".");
          let current: any = state.stats;
          for (let i = 0; i < pathParts.length - 1; i++) {
            current = current[pathParts[i]];
          }
          current[pathParts[pathParts.length - 1]] = action.payload.newValue;
        }
      })
      .addCase(incrementStat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Calculate stats
      .addCase(calculateStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(calculateStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = statsSlice.actions;
export default statsSlice.reducer;
