export type Location = {
  latitude: number;
  longitude: number;
  hourly: string[];
  timezone: string;
  start_date: string;
  end_date: string;
  active?: boolean;
};

export type LocationStore = {
  location: Location;
  locationList: Location[];
  setLocation: (location: Location) => void;
  setStartDate: (start_date: string) => void;
  setEndDate: (end_date: string) => void;
  saveLocation: () => void;
  deleteLocation: () => void;
  setActiveLocation: (latitude: number, longitude: number) => void;
};

export type ComputedSeries = string[];

export interface ComputedSeriesStore {
  computedSeries: ComputedSeries;
  setComputedSeries: (series: ComputedSeries) => void;
}

export interface MultiLineChartProps {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor?: string;
    fill?: boolean;
    borderWidth?: number;
    pointRadius?: number;
    tension?: number;
    borderDash?: number[];
  }>;
  title?: string;
}