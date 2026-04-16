import type { ComputedSeriesStore } from "@/lib/types";
import { create } from "zustand";

export const useComputedSeriesStore = create<ComputedSeriesStore>((set) => ({
  computedSeries: [],
  setComputedSeries: (series) => set({ computedSeries: series }),
}));
