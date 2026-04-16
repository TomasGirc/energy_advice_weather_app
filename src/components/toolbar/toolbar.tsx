import { useEffect } from "react";
import { useLocationStore } from "@/store/location/locationStore";
import DateRangePicker from "./datePicker";
import SelectionComputedSeries from "./selectionComputedSeries";
import SelectionWeatherMetrics from "./selectionWeatherMetrics";

const Toolbar = () => {
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);

  // Sync store with URL params after hydration
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const lat = params.get("lat");
    const lng = params.get("lng");
    const start = params.get("start_date");
    const end = params.get("end_date");
    const hourly = params.get("hourly");
    const newLocation = { ...location };
    if (lat) newLocation.latitude = parseFloat(lat);
    if (lng) newLocation.longitude = parseFloat(lng);
    if (start) newLocation.start_date = start;
    if (end) newLocation.end_date = end;
    if (hourly) newLocation.hourly = hourly.split(",");
    setLocation(newLocation);
    // Only run on mount
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full p-4 bg-white shadow rounded mb-4">
      <div className="w-full mb-4">
        <DateRangePicker />
      </div>
      <div className="flex flex-col md:flex-row w-full gap-0">
        <div className="flex-1 border md:border-r-0 border-gray-300 p-4">
          <SelectionWeatherMetrics />
        </div>
        <div className="flex-1 border border-gray-300 p-4">
          <SelectionComputedSeries />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
