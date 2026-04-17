import { useState, useEffect } from "react";
import {
  setUrlParams,
  deleteUrlParams,
  paramsURL,
} from "@/lib/helpers/urlParamsUpdate";
import { useComputedSeriesStore } from "@/store/computedSeriesStore";
import { COMPUTED_SERIES } from "@/lib/constants";
import CheckboxGroup from "./checkboxGroup";

const SelectionComputedSeries = () => {
  const setComputedSeries = useComputedSeriesStore(
    (state) => state.setComputedSeries,
  );

  // Use lazy initialization to avoid setState in effect
  const [selected, setSelected] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const params = paramsURL;
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
    if (selected.length > 0) {
      setUrlParams({ computed_series: selected.join(",") });
    } else {
      deleteUrlParams(["computed_series"]);
    }
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
    <CheckboxGroup
      title="Computed :"
      items={COMPUTED_SERIES}
      selected={selected}
      onChange={handleChange}
    />
  );
};

export default SelectionComputedSeries;
