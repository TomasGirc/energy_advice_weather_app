import { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import type { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";
import "flatpickr/dist/flatpickr.css";
import { useLocationStore } from "@/store/location/locationStore";
import { setUrlParams } from "@/lib/helpers/urlParamsUpdate";
import { formatLocalDate } from "@/lib/helpers/formatDate";

type DateRangePickerProps = {
  startDate?: string;
  endDate?: string;
};

const isIsoDate = (value?: string) =>
  Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));

const DateRangePicker = ({ startDate, endDate }: DateRangePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrRef = useRef<FlatpickrInstance | null>(null);
  const hasUserInteractedRef = useRef(false);
  const { setStartDate, setEndDate, location, locationList, saveLocation } =
    useLocationStore();
  const [dates, setDates] = useState(() => {
    const initialStart = startDate ?? location.start_date;
    const initialEnd = endDate ?? location.end_date;
    return `${initialStart} to ${initialEnd}`;
  });

  // Update local state if active location changes
  // Extract active location for static dependency checking
  const activeLocation = locationList.find((loc) => loc.active) || location;
  const activeLat = activeLocation.latitude;
  const activeLng = activeLocation.longitude;
  const [initialStartFromInput, initialEndFromInput] = dates.split(" to ");
  const initialDefaultDate =
    isIsoDate(initialStartFromInput) && isIsoDate(initialEndFromInput)
      ? [initialStartFromInput, initialEndFromInput]
      : [location.start_date, location.end_date];

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
        defaultDate: initialDefaultDate,
        closeOnSelect: false,
        onChange: (selectedDates: Date[], dateStr: string) => {
          hasUserInteractedRef.current = true;
          setDates(dateStr.replace(", ", " to "));
          let start: string, end: string;
          if (Array.isArray(selectedDates) && selectedDates.length > 0) {
            if (selectedDates.length === 1) {
              start = formatLocalDate(selectedDates[0]);
              end = formatLocalDate(selectedDates[0]);
              setStartDate(start);
              setEndDate(end);
            } else {
              start = formatLocalDate(selectedDates[0]);
              end = formatLocalDate(selectedDates[1]);
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

  useEffect(() => {
    if (!flatpickrRef.current) return;
    if (hasUserInteractedRef.current) return;
    if (flatpickrRef.current.isOpen) return;

    const [start, end] = dates.split(" to ");
    if (isIsoDate(start) && isIsoDate(end)) {
      flatpickrRef.current.setDate([start, end], false);
    }
  }, [dates]);

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
