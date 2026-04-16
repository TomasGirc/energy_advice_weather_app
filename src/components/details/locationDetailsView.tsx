import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
import { useLocationStore } from "@/store/location/locationStore";
import { movingAverage } from "@/lib/helpers/movingAverage";
import { minLine } from "@/lib/helpers/minLine";
import { maxLine } from "@/lib/helpers/maxLine";
import { trendLine } from "@/lib/helpers/trendLine";
import { useComputedSeriesStore } from "@/store/computedSeriesStore";
import { fetchOpenMeteoData } from "@/hooks/openMeteo";
import MultiLineChart from "./multiLineChart";

type HourlyWeatherData = {
  time: string[];
  [key: string]: string[] | number[];
};

const LocationDetailsView = () => {
  const location = useLocationStore((state) => state.location);
  const [hourly, setHourly] = useState<HourlyWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location.latitude || !location.longitude) return;
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOpenMeteoData(location);
        if (!cancelled) setHourly(data.hourly);
      } catch (err: unknown) {
        if (!cancelled) {
          if (err instanceof Error) setError(err.message);
          else setError("Unknown error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [location]);

  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const computedSeriesStore = useComputedSeriesStore(
    (state) => state.computedSeries,
  );

  useEffect(() => {
    let urlSeries: string[] = [];
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlVal = params.get("computed_series");
      if (urlVal) urlSeries = urlVal.split(",").filter(Boolean);
    }
    if (urlSeries.length > 0) {
      setSelectedSeries(urlSeries);
    } else if (computedSeriesStore && computedSeriesStore.length > 0) {
      setSelectedSeries(computedSeriesStore);
    } else {
      setSelectedSeries([]);
    }
  }, [computedSeriesStore]);

  const METRICS = [
    { key: "temperature_2m", label: "Temperature (°C)" },
    { key: "relative_humidity_2m", label: "Relative Humidity (%)" },
    { key: "apparent_temperature", label: "Apparent Temperature (°C)" },
    { key: "rain", label: "Rain (mm)" },
    { key: "snowfall", label: "Snowfall (cm)" },
  ];

  // Guard: don't render chart if data is missing or no metrics selected
  const selectedMetrics =
    location.hourly?.filter((m: string) =>
      METRICS.some((def) => def.key === m),
    ) || [];

  const availableMetrics = METRICS.filter(
    (m) =>
      selectedMetrics.includes(m.key) &&
      hourly &&
      Array.isArray(hourly[m.key]) &&
      (hourly[m.key] as number[]).length > 0,
  );

  // Prepare datasets for multi-line chart
  let lineDatasets = availableMetrics.map((metric, idx) => ({
    label: metric.label,
    data: (hourly?.[metric.key] as number[]) ?? [],
    borderColor: ["#3b82f6", "#f59e42", "#22c55e", "#ef4444", "#6366f1"][
      idx % 5
    ],
    backgroundColor: "rgba(0,0,0,0)",
    fill: false,
    borderWidth: 2,
    pointRadius: 0,
    tension: 0.3,
  }));

  // Add computed series as additional lines for all selected metrics
  if (availableMetrics.length > 0 && selectedSeries.length > 0) {
    const computedColors: Record<string, string> = {
      moving_average: "#fbbf24",
      min_line: "#10b981",
      max_line: "#ef4444",
      trend_line: "#6366f1",
    };
    const computedLabels: Record<string, string> = {
      moving_average: "Moving Average",
      min_line: "Min Value",
      max_line: "Max Value",
      trend_line: "Trend Line",
    };
    const computedDataFns: Record<string, (data: number[]) => number[]> = {
      moving_average: (data) => movingAverage(data, 6),
      min_line: minLine,
      max_line: maxLine,
      trend_line: trendLine,
    };
    lineDatasets = [
      ...lineDatasets,
      ...availableMetrics.flatMap((metric) =>
        selectedSeries.map((seriesKey, sIdx) => ({
          label: `${metric.label} - ${computedLabels[seriesKey] || seriesKey}`,
          data: Array.isArray(hourly?.[metric.key])
            ? computedDataFns[seriesKey](hourly?.[metric.key] as number[])
            : [],
          borderColor:
            computedColors[seriesKey] ||
            ["#888888", "#222222", "#cccccc", "#aaaaaa"][sIdx % 4],
          backgroundColor: "rgba(0,0,0,0)",
          fill: false,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          borderDash:
            seriesKey === "min_line" || seriesKey === "max_line"
              ? [8, 4]
              : seriesKey === "trend_line"
                ? [2, 2]
                : undefined,
        })),
      ),
    ];
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row mb-2">
        <div className="mr-0 md:mr-4 mb-2 md:mb-0">
          <strong>Latitude:</strong> {location.latitude}
        </div>
        <div>
          <strong>Longitude:</strong> {location.longitude}
        </div>
      </div>
      {loading && <div>Loading temperature data...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {availableMetrics.length > 0 ? (
        <MultiLineChart
          labels={hourly!.time}
          datasets={lineDatasets}
          title="Weather Metrics"
        />
      ) : (
        <div>No metrics selected</div>
      )}
    </div>
  );
};

export default LocationDetailsView;
