import type { LocationStore, Location } from "@/lib/types";
import { create } from "zustand";
import { paramsURL, setUrlParams } from "@/lib/helpers/urlParamsUpdate";

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
    const params = paramsURL;
    const urlHourlyParam = params.get("hourly");
    if (urlHourlyParam) {
      urlHourly = urlHourlyParam.split(",").filter(Boolean);
    }
    // Optionally, sync store to URL here if needed
    // setUrlParams({ hourly: urlHourly.length > 0 ? urlHourly.join(",") : undefined });
  }
  const defaultLocation: Location = {
    latitude: 54.89793393064141,
    longitude: 23.90281677246094,
    hourly: urlHourly.length > 0 ? urlHourly : [],
    timezone: "auto",
    start_date: defaults.start_date,
    end_date: defaults.end_date,
  };
  // Initialize locationList from localStorage if present
  let initialLocationList: (Location & { active?: boolean })[] = [];
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("locationList");
    if (stored) {
      try {
        initialLocationList = JSON.parse(stored);
      } catch (e) {
        initialLocationList = [];
      }
    }
  }
  return {
    location: defaultLocation,
    locationList: initialLocationList,
    setLocation: (location: Location) => set({ location }),
    setStartDate: (start_date: string) =>
      set((state) => ({ location: { ...state.location, start_date } })),
    setEndDate: (end_date: string) =>
      set((state) => ({ location: { ...state.location, end_date } })),
    saveLocation: () => {
      const { location, locationList } = get();
      // Check if location is present by lat/lng
      const index = locationList.findIndex(
        (l) =>
          l.latitude === location.latitude &&
          l.longitude === location.longitude,
      );
      let updatedList;
      if (index !== -1) {
        // Update the existing location
        updatedList = locationList.map((l, i) =>
          i === index ? { ...l, ...location } : l,
        );
      } else {
        // Add new location
        updatedList =
          locationList.length === 0
            ? [{ ...location, active: true }]
            : [...locationList, { ...location, active: false }];
      }
      set({ locationList: updatedList });
      if (typeof window !== "undefined") {
        localStorage.setItem("locationList", JSON.stringify(updatedList));
      }
    },
    deleteLocation: () => {
      const { location, locationList } = get();
      let filtered = locationList.filter(
        (l) =>
          !(
            l.latitude === location.latitude &&
            l.longitude === location.longitude
          ),
      );
      // If the deleted location was active, set the first as active
      if (!filtered.some((l) => l.active) && filtered.length > 0) {
        filtered = filtered.map((l, i) => ({ ...l, active: i === 0 }));
      }
      set({
        locationList: filtered,
        location: { ...defaultLocation, hourly: location.hourly },
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("locationList", JSON.stringify(filtered));
      }
    },

    setActiveLocation: (latitude: number, longitude: number) => {
      const { locationList } = get();
      const updatedList = locationList.map((loc) => ({
        ...loc,
        active: loc.latitude === latitude && loc.longitude === longitude,
      }));
      set({ locationList: updatedList });
      if (typeof window !== "undefined") {
        localStorage.setItem("locationList", JSON.stringify(updatedList));
      }
    },
  };
});
