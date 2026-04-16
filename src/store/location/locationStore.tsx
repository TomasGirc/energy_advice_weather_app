import type { LocationStore, Location } from "@/lib/types";
import { create } from "zustand";

function getDefaultDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const format = (d: Date) => d.toISOString().slice(0, 10);
  return {
    start_date: format(today),
    end_date: format(tomorrow),
  };
}

export const useLocationStore = create<
  LocationStore & {
    saveLocation: () => void;
    deleteLocation: () => void;
  }
>((set, get) => {
  const defaults = getDefaultDates();
  // Read from URL params if present, else default to empty for hourly
  let urlHourly: string[] = [];
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const urlHourlyParam = params.get("hourly");
    if (urlHourlyParam) {
      urlHourly = urlHourlyParam.split(",").filter(Boolean);
    }
  }
  const defaultLocation: Location = {
    latitude: 54.89793393064141,
    longitude: 23.90281677246094,
    hourly: urlHourly.length > 0 ? urlHourly : [],
    timezone: "auto",
    start_date: defaults.start_date,
    end_date: defaults.end_date,
  };
  return {
    location: defaultLocation,
    locationList: [],
    setLocation: (location: Location) => set({ location }),
    setStartDate: (start_date: string) =>
      set((state) => ({ location: { ...state.location, start_date } })),
    setEndDate: (end_date: string) =>
      set((state) => ({ location: { ...state.location, end_date } })),
    saveLocation: () => {
      const { location, locationList } = get();
      // Only add if not already present (by lat/lng)
      if (
        !locationList.some(
          (l) =>
            l.latitude === location.latitude &&
            l.longitude === location.longitude,
        )
      ) {
        set({ locationList: [...locationList, { ...location }] });
      }
    },
    deleteLocation: () => {
      const { location, locationList } = get();
      const filtered = locationList.filter(
        (l) =>
          !(
            l.latitude === location.latitude &&
            l.longitude === location.longitude
          ),
      );
      set({
        locationList: filtered,
        location: { ...defaultLocation, hourly: location.hourly },
      });
    },
  };
});
