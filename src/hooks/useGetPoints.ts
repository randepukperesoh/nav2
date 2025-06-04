import { create } from "zustand";
import { loadJson } from "../helper";
import type { IDot } from "../components/Room/Room";

interface PointsState {
  namedPoints: { names: IDot[][] } | null;
  isLoading: boolean;
  error: Error | null;
  loadPoints: () => Promise<void>;
}

export const useGetPoints = create<PointsState>((set, get) => ({
  namedPoints: null,
  isLoading: false,
  error: null,

  loadPoints: async () => {
    set({ isLoading: true, error: null });
    try {
      if (get().namedPoints !== null) return;
      const data = await loadJson<{ names: IDot[][] }>("names");
      set({ namedPoints: data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err : new Error("Unknown error"),
        isLoading: false,
      });
    }
  },
}));
