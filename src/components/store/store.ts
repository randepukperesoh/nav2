import { create } from "zustand";
import type { Position } from "../../types";

interface IRouteStore {
  startId: string | null;
  setStartId: (id: string | null) => void;

  endId: string | null;
  setEndId: (id: string | null) => void;

  route: Position[];
  setRoute: (route: Position[]) => void;
}

export const useRouteStore = create<IRouteStore>((set) => ({
  startId: null,
  setStartId: (id: string | null) => set({ startId: id }),

  endId: null,
  setEndId: (id: string | null) => set({ endId: id }),

  route: [],
  setRoute: (route: Position[]) => set({ route }),
}));
