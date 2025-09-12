import { configureStore } from "@reduxjs/toolkit";
import offersReducer from "./slices/offersSlice";
import participantsReducer from "./slices/participantsSlice";
import winnersReducer from "./slices/winnersSlice";
import drawsReducer from "./slices/drawsSlice";
import settingsReducer from "./slices/settingsSlice";
import statsReducer from "./slices/statsSlice";
import proofOfDrawsReducer from "./slices/proofOfDrawsSlice";
import mainPageDataReducer from "./slices/mainPageDataSlice";

export const store = configureStore({
  reducer: {
    offers: offersReducer,
    participants: participantsReducer,
    winners: winnersReducer,
    draws: drawsReducer,
    settings: settingsReducer,
    stats: statsReducer,
    proofOfDraws: proofOfDrawsReducer,
    mainPageData: mainPageDataReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"]
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
