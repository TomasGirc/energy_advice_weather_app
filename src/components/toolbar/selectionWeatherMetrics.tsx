import { useState, useEffect } from "react";
import { useLocationStore } from "@/store/location/locationStore";

const METRICS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "rain",
  "snowfall",
];

const SelectionWeatherMetrics = () => {
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);
  // Use lazy initialization to avoid setState in effect
  const [selected, setSelected] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlHourly = params.get("hourly");
      if (urlHourly) {
        return urlHourly.split(",").filter(Boolean);
      }
    }
    return [];
  });

  // Update store and URL when selected changes
  useEffect(() => {
    setLocation({ ...location, hourly: selected });
    const params = new URLSearchParams(window.location.search);
    if (selected.length > 0) {
      params.set("hourly", selected.join(","));
    } else {
      params.delete("hourly");
    }
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
    // eslint-disable-next-line
  }, [selected]);

  const handleChange = (metric: string) => {
    setSelected((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric],
    );
  };

  return (
    <div className="flex flex-col">
      <h4 className="mr-5 font-bold">Metrics :</h4>
      <div className="flex flex-col gap-4 md:flex-row">
        {METRICS.map((metric) => (
          <label key={metric} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(metric)}
              onChange={() => handleChange(metric)}
            />
            {metric.replace(/_/g, " ")}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SelectionWeatherMetrics;
