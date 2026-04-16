import type { Location } from "@/lib/types";

export async function fetchOpenMeteoData(location: Location) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    hourly: location.hourly.join(","),
    timezone: location.timezone || "auto",
    start_date: location.start_date,
    end_date: location.end_date,
  } as Record<keyof Location, string>);

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
  );
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}
