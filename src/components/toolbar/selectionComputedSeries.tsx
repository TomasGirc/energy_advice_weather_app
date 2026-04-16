import { useState, useEffect } from "react";
import { useComputedSeriesStore } from "@/store/computedSeriesStore";

const SERIES = ["moving_average", "min_line", "max_line", "trend_line"];

const SelectionComputedSeries = () => {
  const setComputedSeries = useComputedSeriesStore(
    (state) => state.setComputedSeries,
  );

  // Use lazy initialization to avoid setState in effect
  const [selected, setSelected] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlSeries = params.get("computed_series");
      if (urlSeries) {
        return urlSeries.split(",").filter(Boolean);
      }
    }
    return [];
  });

  // Update store and URL when selected changes
  useEffect(() => {
    setComputedSeries(selected);
    const params = new URLSearchParams(window.location.search);
    if (selected.length > 0) {
      params.set("computed_series", selected.join(","));
    } else {
      params.delete("computed_series");
    }
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
    // eslint-disable-next-line
  }, [selected]);

  const handleChange = (series: string) => {
    setSelected((prev) =>
      prev.includes(series)
        ? prev.filter((s) => s !== series)
        : [...prev, series],
    );
  };

  return (
    <div className="flex flex-col">
      <h4 className="mr-5 font-bold">Computed :</h4>
      <div className="flex flex-col gap-4 md:flex-row">
        {SERIES.map((series) => (
          <label key={series} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(series)}
              onChange={() => handleChange(series)}
            />
            {series.replace(/_/g, " ")}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SelectionComputedSeries;
