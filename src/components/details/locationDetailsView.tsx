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
import DateRangePicker from "../toolbar/datePicker";
import { METRICS } from "@/lib/constants";

type HourlyWeatherData = {
  time: string[];
  [key: string]: string[] | number[];
};

const LocationDetailsView = () => {
  const location = useLocationStore((state) => state.location);
  const {
    latitude,
    longitude,
    start_date,
    end_date,
    hourly: locationHourly,
    timezone,
  } = location;
  const [hourly, setHourly] = useState<HourlyWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!latitude || !longitude) return;
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchLocation = {
          latitude,
          longitude,
          start_date,
          end_date,
          hourly: locationHourly,
          timezone,
        };
        const data = await fetchOpenMeteoData(fetchLocation);
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
  }, [latitude, longitude, start_date, end_date, locationHourly, timezone]);

  const selectedSeries = useComputedSeriesStore(
    (state) => state.computedSeries,
  );

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

  return (
    <div>
      <DateRangePicker
        startDate={location.start_date}
        endDate={location.end_date}
      />
      <div className="flex flex-col md:flex-row mb-2">
        <div className="mr-0 md:mr-4 mb-2 md:mb-0">
          <strong>Latitude:</strong> {location.latitude}
        </div>
        <div>
          <strong>Longitude:</strong> {location.longitude}
        </div>
      </div>
      {loading && <div>Loading weather data...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {availableMetrics.length > 0 ? (
        <div className="flex flex-row flex-wrap gap-6">
          {availableMetrics.map((metric, idx) => {
            // Prepare main metric dataset
            const metricDataset = {
              label: metric.label,
              data: (hourly?.[metric.key] as number[]) ?? [],
              borderColor: [
                "#3b82f6",
                "#f59e42",
                "#22c55e",
                "#ef4444",
                "#6366f1",
              ][idx % 5],
              backgroundColor: "rgba(0,0,0,0)",
              fill: false,
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.3,
            };

            // Add computed series for this metric
            const computedColors = {
              moving_average: "#fbbf24",
              min_line: "#10b981",
              max_line: "#ef4444",
              trend_line: "#6366f1",
            };
            const computedLabels = {
              moving_average: "Moving Average",
              min_line: "Min Value",
              max_line: "Max Value",
              trend_line: "Trend Line",
            };
            const computedDataFns = {
              moving_average: (data: number[]) => movingAverage(data, 6),
              min_line: minLine,
              max_line: maxLine,
              trend_line: trendLine,
            };
            const computedDatasets = selectedSeries.map((seriesKey, sIdx) => ({
              label: `${metric.label} - ${computedLabels[seriesKey as keyof typeof computedLabels] || seriesKey}`,
              data: Array.isArray(hourly?.[metric.key])
                ? computedDataFns[seriesKey as keyof typeof computedDataFns](
                    hourly?.[metric.key] as number[],
                  )
                : [],
              borderColor:
                computedColors[seriesKey as keyof typeof computedColors] ||
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
            }));

            return (
              <div key={metric.key} className="w-[49%]">
                <MultiLineChart
                  labels={hourly!.time}
                  datasets={[metricDataset, ...computedDatasets]}
                  title={metric.label}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div>No metrics selected</div>
      )}
    </div>
  );
};

export default LocationDetailsView;
