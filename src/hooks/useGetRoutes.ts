import { create } from "zustand";
import { loadJson } from "../helper";
import type { Position } from "../types";

export interface IRoute {
  id: number;
  start: Position;
  end: Position;
}

interface RouteState {
  routes: IRoute[];
  isLoading: boolean;
  error: Error | null;
  loadRoutes: () => Promise<void>;
}

export const useGetRoutes = create<RouteState>((set, get) => ({
  routes: [],
  isLoading: false,
  error: null,

  loadRoutes: async () => {
    set({ isLoading: true, error: null });
    try {
      if(get().routes.length !== 0) return
      const data = await loadJson<IRoute[]>("routes");
      set({ routes: data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err : new Error("Ошибка загрузки маршрутов"),
        isLoading: false,
      });
    }
  },
}));