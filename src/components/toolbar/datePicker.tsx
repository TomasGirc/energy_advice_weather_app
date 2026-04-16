import { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import type { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";
import "flatpickr/dist/flatpickr.css";
import { useLocationStore } from "@/store/location/locationStore";
import { setUrlParams } from "@/lib/helpers/urlParamsUpdate";

type DateRangePickerProps = {
  startDate: string;
  endDate: string;
};

const DateRangePicker = ({ startDate, endDate }: DateRangePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrRef = useRef<FlatpickrInstance | null>(null);
  const { setStartDate, setEndDate, location, locationList, saveLocation } =
    useLocationStore();
  const [dates, setDates] = useState(() => `${startDate} to ${endDate}`);

  // Update local state if active location changes
  // Extract active location for static dependency checking
  const activeLocation = locationList.find((loc) => loc.active) || location;
  const activeLat = activeLocation.latitude;
  const activeLng = activeLocation.longitude;
  useEffect(() => {
    const newDates = `${activeLocation.start_date} to ${activeLocation.end_date}`;
    if (dates !== newDates) {
      setDates(newDates);
      // Safely update flatpickr date if instance exists
      if (flatpickrRef.current) {
        flatpickrRef.current.setDate(
          [activeLocation.start_date, activeLocation.end_date],
          false,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLat, activeLng]);

  useEffect(() => {
    if (inputRef.current) {
      flatpickrRef.current = flatpickr(inputRef.current, {
        mode: "range",
        defaultDate: [location.start_date, location.end_date],
        closeOnSelect: false,
        onChange: (selectedDates: Date[], dateStr: string) => {
          setDates(dateStr.replace(", ", " to "));
          // Use local date to avoid off-by-one UTC bug
          const formatLocal = (d: Date) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          };
          let start: string, end: string;
          if (Array.isArray(selectedDates) && selectedDates.length > 0) {
            if (selectedDates.length === 1) {
              start = formatLocal(selectedDates[0]);
              end = formatLocal(selectedDates[0]);
              setStartDate(start);
              setEndDate(end);
            } else {
              start = formatLocal(selectedDates[0]);
              end = formatLocal(selectedDates[1]);
              setStartDate(start);
              setEndDate(end);
            }
            // Update URL params
            setUrlParams({ start_date: start, end_date: end });

            if (locationList.find((loc) => loc.active)) {
              saveLocation();
            }
          }
        },
      });
    }
    return () => {
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
        flatpickrRef.current = null;
      }
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-md w-full flex flex-col">
      <input
        ref={inputRef}
        id="flatpickr-range"
        type="text"
        className="input max-w-sm block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
        placeholder="YYYY-MM-DD to YYYY-MM-DD"
        value={dates}
        onChange={(e) => setDates(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
};
export default DateRangePicker;
